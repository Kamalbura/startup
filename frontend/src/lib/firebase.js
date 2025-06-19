// Firebase Configuration and Client
import { initializeApp, getApps, getApp } from 'firebase/app'
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

// Initialize Firebase - Check if app already exists to prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

if (getApps().length === 1) {
  console.log('✅ Firebase initialized successfully')
} else {
  console.log('✅ Firebase app already initialized, using existing instance')
}

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
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    // Only connect emulators if explicitly enabled and not already connected
    const isEmulatorConnected = {
      auth: false,
      firestore: false,
      storage: false
    }

    // Auth Emulator
    try {
      if (!isEmulatorConnected.auth && !auth._delegate?._config?.emulator) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
        isEmulatorConnected.auth = true
        console.log('🔧 Connected to Auth Emulator')
      }
    } catch (authEmulatorError) {
      console.log('🔧 Auth Emulator already connected or unavailable:', authEmulatorError.message)
    }

    // Firestore Emulator
    try {
      if (!isEmulatorConnected.firestore && !db._delegate?._databaseId?.host?.includes('127.0.0.1')) {
        connectFirestoreEmulator(db, '127.0.0.1', 8080)
        isEmulatorConnected.firestore = true
        console.log('🔧 Connected to Firestore Emulator')
      }
    } catch (firestoreEmulatorError) {
      console.log('🔧 Firestore Emulator already connected or unavailable:', firestoreEmulatorError.message)
    }

    // Storage Emulator
    try {
      if (!isEmulatorConnected.storage && !storage._delegate?._host?.includes('127.0.0.1')) {
        connectStorageEmulator(storage, '127.0.0.1', 9199)
        isEmulatorConnected.storage = true
        console.log('🔧 Connected to Storage Emulator')
      }
    } catch (storageEmulatorError) {
      console.log('🔧 Storage Emulator already connected or unavailable:', storageEmulatorError.message)
    }
  } catch (error) {
    console.warn('⚠️ Firebase Emulator connection failed:', error.message)
  }
} else {
  console.log('🔥 Firebase initialized in production mode or emulators disabled')
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
