// Firebase Authentication Middleware for CampusKarma Backend
// Purpose: Verify Firebase JWT tokens and authenticate requests

import { verifyFirebaseToken } from '../utils/firebaseAdmin.js';

export const authenticateFirebaseUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify Firebase token
    const verificationResult = await verifyFirebaseToken(token);
    
    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
        error: verificationResult.error
      });
    }

    // Check if email is verified
    if (!verificationResult.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        requiresEmailVerification: true
      });
    }

    // Validate college email
    const email = verificationResult.user.email;
    const collegeEmailPatterns = [
      /\.edu$/i,
      /\.edu\.in$/i,
      /\.ac\.in$/i,
      /\.vce\.ac\.in$/i
    ];
    
    const isCollegeEmail = collegeEmailPatterns.some(pattern => pattern.test(email));
    
    if (!isCollegeEmail) {
      return res.status(403).json({
        success: false,
        message: 'College email required',
        requiresCollegeEmail: true
      });
    }

    // Add user info to request object
    req.user = verificationResult.user;
    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

export const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const verificationResult = await verifyFirebaseToken(token);
      
      if (verificationResult.success) {
        req.user = verificationResult.user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

export default { authenticateFirebaseUser, optionalFirebaseAuth };
