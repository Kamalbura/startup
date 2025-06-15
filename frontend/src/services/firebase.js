// Firebase Configuration for CampusKarma
// Purpose: Initialize Firebase Auth for college email verification

import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  signOut
} from 'firebase/auth'

// Firebase configuration - Add your actual config here
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "campuskarma-auth.firebaseapp.com", 
  projectId: "campuskarma-auth",
  storageBucket: "campuskarma-auth.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Email link authentication settings
export const actionCodeSettings = {
  // URL to redirect to after email verification
  url: window.location.origin + '/auth/verify',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.campuskarma.app'
  },
  android: {
    packageName: 'com.campuskarma.app',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'campuskarma.page.link' // Optional: Custom domain
}

// College email validation
export const validateCollegeEmail = (email) => {
  const collegeDomains = [
    '.edu', '.ac.in', '.edu.in', '.vce.ac.in', // Add more as needed
    '.iit.ac.in', '.nit.ac.in', '.iiit.ac.in'
  ]
  
  const isCollegeEmail = collegeDomains.some(domain => 
    email.toLowerCase().endsWith(domain)
  )
  
  if (!isCollegeEmail) {
    return {
      isValid: false,
      error: 'Please use your college email address (.edu, .ac.in, .edu.in)'
    }
  }
  
  return { isValid: true }
}

// Send email verification link
export const sendCollegeEmailVerification = async (email) => {
  try {
    // Validate college email
    const validation = validateCollegeEmail(email)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }
    
    // Store email in localStorage for verification
    localStorage.setItem('emailForSignIn', email)
    
    // Send email link
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    
    return {
      success: true,
      message: 'Verification link sent to your college email!'
    }
  } catch (error) {
    console.error('Error sending email verification:', error)
    throw error
  }
}

// Verify email link and sign in
export const verifyEmailLink = async (emailLink) => {
  try {
    if (!isSignInWithEmailLink(auth, emailLink)) {
      throw new Error('Invalid verification link')
    }
    
    // Get email from localStorage
    let email = localStorage.getItem('emailForSignIn')
    if (!email) {
      // If email not in localStorage, prompt user
      email = window.prompt('Please provide your email for confirmation')
    }
    
    // Sign in with email link
    const result = await signInWithEmailLink(auth, email, emailLink)
    
    // Clear stored email
    localStorage.removeItem('emailForSignIn')
    
    return {
      success: true,
      user: result.user,
      message: 'Email verified successfully!'
    }
  } catch (error) {
    console.error('Error verifying email link:', error)
    throw error
  }
}

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export default app
