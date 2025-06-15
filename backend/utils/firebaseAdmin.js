// Firebase Admin SDK Configuration for CampusKarma Backend
// Purpose: Verify Firebase JWT tokens and integrate with backend

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    // For development, you can use a service account key file
    // For production, use environment variables
    
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('🔥 Firebase Admin SDK initialized successfully');
  }

  return admin;
};

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name,
        picture: decodedToken.picture
      }
    };
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user by UID
export const getFirebaseUser = async (uid) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const userRecord = await firebaseAdmin.auth().getUser(uid);
    return {
      success: true,
      user: userRecord
    };
  } catch (error) {
    console.error('Error fetching Firebase user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create custom token for user
export const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const customToken = await firebaseAdmin.auth().createCustomToken(uid, additionalClaims);
    return {
      success: true,
      token: customToken
    };
  } catch (error) {
    console.error('Error creating custom token:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default { verifyFirebaseToken, getFirebaseUser, createCustomToken };
