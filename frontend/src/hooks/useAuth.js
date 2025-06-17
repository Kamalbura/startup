import { useState, useEffect, useContext } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { AuthContext } from '../context/AuthContext'

/**
 * Custom hook for Firebase Authentication
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

/**
 * Firebase Auth hook with methods - can be used independently
 */
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email, password, displayName = null) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      return result.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGithub = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const provider = new GithubAuthProvider()
      provider.addScope('user:email')
      
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithMicrosoft = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const provider = new OAuthProvider('microsoft.com')
      provider.addScope('mail.read')
      
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      setError(null)
      await updateProfile(auth.currentUser, updates)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    logout,
    resetPassword,
    updateUserProfile
  }
}
