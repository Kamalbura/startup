// Firebase Authentication Service for SkillLance
// Purpose: Handle all authentication operations with Firebase Auth

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    this.db = db;
    // Enhanced caching with longer timeout and size limit
    this.profileCache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    this.maxCacheSize = 100; // Limit cache size
    // Batch operations queue
    this.batchQueue = [];
    this.batchTimeout = null;
  }

  // Batch multiple Firestore operations for better performance
  queueBatchOperation(operation) {
    this.batchQueue.push(operation);
    
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.processBatchQueue();
        this.batchTimeout = null;
      }, 50); // Process batch after 50ms
    }
  }

  async processBatchQueue() {
    if (this.batchQueue.length === 0) return;
    
    // Process queued operations
    const operations = [...this.batchQueue];
    this.batchQueue = [];
    
    try {
      await Promise.all(operations);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Batch operation error:', error);
      }
    }
  }
  // College email validation
  validateCollegeEmail(email) {
    // Supported college domains (from legacy implementation)
    const allowedDomains = [
      // Indian Engineering Colleges
      "vnrvjiet.ac.in", "cbit.ac.in", "mgit.ac.in", "mgit.com", "vce.ac.in",
      "kmit.in", "vit.ac.in", "iiit.ac.in", "students.iiit.ac.in", "iith.ac.in",
      "nitw.ac.in", "cvr.ac.in", "bvrit.ac.in", "ellenkicet.ac.in", "villamariecollege.ac.in"
    ];
    
    const collegeEmailPatterns = [
      /^[^\s@]+@[^\s@]+\.edu$/i,           // International .edu
      /^[^\s@]+@[^\s@]+\.edu\.in$/i,       // Indian .edu.in
      /^[^\s@]+@[^\s@]+\.ac\.in$/i,        // Indian .ac.in
      /^[^\s@]+@[^\s@]+\.edu\.au$/i,       // Australian .edu.au
      /^[^\s@]+@[^\s@]+\.ac\.uk$/i,        // UK .ac.uk
    ];
    
    if (!email || !email.includes('@')) {
      return false;
    }
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    // Check against allowed specific domains first
    if (allowedDomains.includes(emailDomain)) {
      return true;
    }
    
    // Check against general college email patterns
    return collegeEmailPatterns.some(pattern => pattern.test(email));
  }

  // Create new user account with college email validation
  async signUpWithEmail(email, password, userData = {}) {
    try {
      // Validate college email
      if (!this.validateCollegeEmail(email)) {
        throw new Error('Please use a valid college email address (.edu, .ac.in, .edu.in)');
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: userData.displayName || '',
        college: userData.college || '',
        course: userData.course || '',
        year: userData.year || '',
        skills: userData.skills || [],
        trustScore: 100, // Starting trust score
        karmaPoints: 0,          profileComplete: !!(userData.displayName && userData.college),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          ...userData
      };

      await setDoc(doc(this.db, 'users', user.uid), userProfile);

      return {
        user,
        profile: userProfile,
        needsEmailVerification: !user.emailVerified
      };
    } catch (error) {
      console.error('Firebase signup error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await updateDoc(doc(this.db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      });

      // Get user profile from Firestore
      const userProfile = await this.getUserProfile(user.uid);

      return {
        user,
        profile: userProfile
      };
    } catch (error) {
      console.error('Firebase signin error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google (for verified college accounts)
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;

      // Check if it's a college email
      if (!this.validateCollegeEmail(user.email)) {
        await this.signOut();
        throw new Error('Please use your college Google account to sign in');
      }

      // Check if user profile exists, create if not
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        userProfile = {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          college: '',
          course: '',
          year: '',
          skills: [],
          trustScore: 100,
          karmaPoints: 0,          profileComplete: !!(user.displayName), // Google users have display name
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        };

        await setDoc(doc(this.db, 'users', user.uid), userProfile);
      } else {
        // Update last login
        await updateDoc(doc(this.db, 'users', user.uid), {
          lastLoginAt: serverTimestamp()
        });
      }

      return {
        user,
        profile: userProfile
      };
    } catch (error) {
      console.error('Google signin error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get user profile from Firestore (with enhanced caching)
  async getUserProfile(uid) {
    try {
      // Check cache first
      const cached = this.profileCache.get(uid);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Clean cache if it gets too large
      if (this.profileCache.size > this.maxCacheSize) {
        this.profileCache.clear();
      }

      const docRef = doc(this.db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Cache the result with timestamp
        this.profileCache.set(uid, {
          data,
          timestamp: Date.now()
        });
        return data;
      } else {
        return null;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching user profile:', error);
      }
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      await updateDoc(doc(this.db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      // Clear cache for this user
      this.profileCache.delete(uid);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Listen to authentication state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Handle Firebase auth errors with user-friendly messages
  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
      'auth/cancelled-popup-request': 'Another popup is already open.',
    };

    const message = errorMessages[error.code] || error.message || 'An unexpected error occurred.';
    
    return new Error(message);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.auth.currentUser;
  }
}

// Create and export singleton instance
const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
