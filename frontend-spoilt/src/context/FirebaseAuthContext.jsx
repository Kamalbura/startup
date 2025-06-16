// Firebase Authentication Context for SkillLance
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Create context
const AuthContext = createContext({});

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Validate college email
  const isValidCollegeEmail = (email) => {
    const collegePatterns = [
      /^[^\s@]+@[^\s@]+\.edu$/i,
      /^[^\s@]+@[^\s@]+\.edu\.in$/i,
      /^[^\s@]+@[^\s@]+\.ac\.in$/i,
    ];
    return collegePatterns.some(pattern => pattern.test(email));
  };

  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setError(null);

      if (!isValidCollegeEmail(email)) {
        throw new Error('Please use your college email (.edu, .ac.in, .edu.in)');
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with additional data
      if (userData.displayName) {
        await updateProfile(result.user, {
          displayName: userData.displayName
        });
      }

      console.log('✅ User registered successfully:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Sign up error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ User signed in successfully:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Validate college email for Google sign-in
      if (!isValidCollegeEmail(result.user.email)) {
        await signOut(auth);
        throw new Error('Please use your college email for registration');
      }

      console.log('✅ Google sign in successful:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('❌ Google sign in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔄 Auth state changed:', user ? user.email : 'No user');
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth actions
  const authActions = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutUser,
    clearError
  };

  // Auth state
  const authState = {
    user,
    loading,
    error
  };

  const value = {
    ...authState,
    ...authActions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hooks
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    user: context.user,
    loading: context.loading,
    error: context.error
  };
}

export function useAuthActions() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  
  return {
    signUp: context.signUp,
    signIn: context.signIn,
    signInWithGoogle: context.signInWithGoogle,
    signOut: context.signOut,
    clearError: context.clearError
  };
}

export default AuthContext;
