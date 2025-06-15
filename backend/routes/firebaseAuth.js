// Firebase Authentication Routes for CampusKarma Backend
// Purpose: Handle Firebase auth integration and user profile sync

import express from 'express';
import { authenticateFirebaseUser, optionalFirebaseAuth } from '../middleware/firebaseAuth.js';
import User from '../models/User.js';

const router = express.Router();

// Sync Firebase user with MongoDB profile
router.post('/sync-profile', authenticateFirebaseUser, async (req, res) => {
  try {
    const firebaseUser = req.user;
    const { displayName, college, course, year, skills = [] } = req.body;

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (user) {
      // Update existing user
      user.email = firebaseUser.email;
      user.displayName = displayName || firebaseUser.name || user.displayName;
      user.college = college || user.college;
      user.course = course || user.course;
      user.year = year || user.year;
      user.skills = skills.length > 0 ? skills : user.skills;
      user.emailVerified = firebaseUser.emailVerified;
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();

      await user.save();
    } else {
      // Create new user
      user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.name || '',
        college: college || '',
        course: course || '',
        year: year || 1,
        skills: skills,
        emailVerified: firebaseUser.emailVerified,
        trustScore: process.env.KARMA_INITIAL_SCORE || 50,
        karmaPoints: 0,
        profileComplete: !!(displayName && college && course && year),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      });

      await user.save();
    }

    res.json({
      success: true,
      message: 'Profile synchronized successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        trustScore: user.trustScore,
        karmaPoints: user.karmaPoints,
        profileComplete: user.profileComplete,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Profile sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync profile',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateFirebaseUser, async (req, res) => {
  try {
    const firebaseUser = req.user;
    
    const user = await User.findOne({ firebaseUid: firebaseUser.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        requiresProfileSync: true
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        trustScore: user.trustScore,
        karmaPoints: user.karmaPoints,
        profileComplete: user.profileComplete,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateFirebaseUser, async (req, res) => {
  try {
    const firebaseUser = req.user;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated
    delete updates.firebaseUid;
    delete updates.email;
    delete updates.trustScore;
    delete updates.karmaPoints;
    delete updates.createdAt;

    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUser.uid },
      { 
        ...updates, 
        updatedAt: new Date(),
        profileComplete: !!(updates.displayName && updates.college && updates.course && updates.year)
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        trustScore: user.trustScore,
        karmaPoints: user.karmaPoints,
        profileComplete: user.profileComplete,
        emailVerified: user.emailVerified
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Verify authentication status
router.get('/verify', authenticateFirebaseUser, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication verified',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.emailVerified,
      name: req.user.name
    }
  });
});

// Health check (no auth required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Firebase auth routes are healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
