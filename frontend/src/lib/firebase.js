// Firebase Configuration and Client
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validate required Firebase configuration
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key])

if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig)
  throw new Error(`Missing Firebase configuration: ${missingConfig.join(', ')}`)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log('✅ Firebase initialized successfully')

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics only in production and in browser
const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && import.meta.env.PROD && firebaseConfig.measurementId) {
    try {
      return getAnalytics(app)
    } catch (error) {
      console.warn('⚠️ Firebase Analytics initialization failed:', error)
      return null
    }
  }
  return null
}

export const analytics = initializeAnalytics()
if (analytics) {
  console.log('✅ Firebase Analytics initialized')
}

// Connect to Firebase Emulators in development
if (import.meta.env.DEV) {
  try {
    // Auth Emulator
    if (!auth._delegate._config?.emulator) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
      console.log('🔧 Connected to Auth Emulator')
    }

    // Firestore Emulator
    if (!db._delegate._databaseId?.host?.includes('127.0.0.1')) {
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
      console.log('🔧 Connected to Firestore Emulator')
    }

    // Storage Emulator
    if (!storage._delegate._host?.includes('127.0.0.1')) {
      connectStorageEmulator(storage, '127.0.0.1', 9199)
      console.log('🔧 Connected to Storage Emulator')
    }
  } catch (error) {
    console.warn('⚠️ Firebase Emulator connection failed:', error)
  }
}

// Auth persistence configuration
auth.useDeviceLanguage()

// Export the Firebase app instance
export default app

// Helper functions for common Firebase operations
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

export const getIdToken = async (forceRefresh = false) => {
  const user = auth.currentUser
  if (!user) throw new Error('No authenticated user')
  return user.getIdToken(forceRefresh)
}

export const getAuthHeaders = async () => {
  const token = await getIdToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
