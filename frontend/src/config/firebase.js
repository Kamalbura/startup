// Firebase Configuration for SkillLance
// Purpose: Initialize Firebase services for authentication and analytics

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWZR9Y2jUunCk1XNbkapquOcuAebd2NUE",
  authDomain: "skilllance-3551a.firebaseapp.com",
  projectId: "skilllance-3551a",
  storageBucket: "skilllance-3551a.firebasestorage.app",
  messagingSenderId: "774974630905",
  appId: "1:774974630905:web:ecb15b5de807d152ec2b28",
  measurementId: "G-DTM67KFL2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analyticsInstance = null;
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  analyticsInstance = getAnalytics(app);
}
export const analytics = analyticsInstance;

// Development mode: Connect to emulators if running locally
if (import.meta.env.DEV) {
  console.log('🔥 Firebase initialized in development mode');
} else {
  console.log('🔥 Firebase initialized in production mode');
}

export default app;
