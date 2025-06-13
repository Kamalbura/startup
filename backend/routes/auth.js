import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import authService from '../utils/authService_new.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const magicLinkLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // Only 1 magic link request per minute
  message: {
    error: 'Magic link already sent. Please check your email or wait 1 minute.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateEduEmail = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')    .custom((email) => {
      const validation = authService.validateCollegeEmail(email);
      if (!validation.isValid) {
        throw new Error(validation.reason || 'Please use a valid college email address (.edu, .ac.in, .edu.in domains)');
      }
      return true;
    })
    .normalizeEmail({ gmail_remove_dots: false })
];

const validateMagicToken = [
  body('token')
    .notEmpty()
    .withMessage('Magic link token is required')
    .isLength({ min: 10 })
    .withMessage('Invalid token format')
];

/**
 * @route   POST /api/v1/auth/magic-link
 * @desc    Request magic link authentication
 * @access  Public
 */
router.post('/magic-link', 
  magicLinkLimiter,
  validateEduEmail,
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      
      // Extract institution from email
      const institution = authService.extractInstitution(email);
      
      // Check if user exists, create if not
      let user = await User.findOne({ email });
      
      if (!user) {
        // Create new user with basic info
        user = new User({
          email,
          institution,
          profile: {
            isVerified: false,
            verificationLevel: 'unverified'
          },
          trust: {
            karmaScore: 0,
            completedTasks: 0,
            successRate: 0
          }
        });
        await user.save();
        console.log(`New user created: ${email}`);
      }

      // Generate and send magic link
      const magicToken = authService.generateMagicLinkToken(user._id, email);
      await authService.sendMagicLink(email, magicToken, institution);

      // Update user's last magic link request
      user.lastMagicLinkRequest = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Magic link sent successfully! Check your email.',
        data: {
          email,
          institution,
          expiresIn: '15 minutes'
        }
      });

    } catch (error) {
      console.error('Magic link error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send magic link. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/v1/auth/verify-magic-link
 * @desc    Verify magic link token and authenticate user
 * @access  Public
 */
router.post('/verify-magic-link',
  authLimiter,
  validateMagicToken,
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { token } = req.body;

      // Verify magic link token
      const decoded = authService.verifyMagicLinkToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired magic link. Please request a new one.'
        });
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please sign up again.'
        });
      }

      // Verify email matches
      if (user.email !== decoded.email) {
        return res.status(401).json({
          success: false,
          message: 'Token email mismatch. Please request a new magic link.'
        });
      }

      // Mark user as verified if first time
      if (!user.profile.isVerified) {
        user.profile.isVerified = true;
        user.profile.verificationLevel = 'edu_verified';
        user.profile.emailVerifiedAt = new Date();
      }

      // Update last login
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();

      // Generate JWT access token
      const accessToken = authService.generateAccessToken(user._id, user.email);

      // Prepare user data for response (excluding sensitive fields)
      const userData = {
        id: user._id,
        email: user.email,
        institution: user.institution,
        profile: {
          firstName: user.profile.firstName,
          lastName: user.profile.lastName,
          isVerified: user.profile.isVerified,
          verificationLevel: user.profile.verificationLevel,
          avatarUrl: user.profile.avatarUrl
        },
        trust: {
          karmaScore: user.trust.karmaScore,
          completedTasks: user.trust.completedTasks,
          successRate: user.trust.successRate
        },
        role: user.role,
        joinedAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      };

      res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        data: {
          user: userData,
          accessToken,
          tokenType: 'Bearer',
          expiresIn: '24 hours'
        }
      });

    } catch (error) {
      console.error('Magic link verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh JWT access token
 * @access  Private
 */
router.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new access token
    const accessToken = authService.generateAccessToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: '24 hours'
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Update user's last logout time
    await User.findByIdAndUpdate(req.user.id, {
      lastLogoutAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-__v')
      .populate('skills.skill', 'name category icon')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/v1/auth/verify-token
 * @desc    Verify if current JWT token is valid
 * @access  Private
 */
router.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.user.id,
      email: req.user.email,
      issuedAt: new Date(req.user.iat * 1000),
      expiresAt: new Date(req.user.exp * 1000)
    }
  });
});

/**
 * @route   POST /api/v1/auth/send-otp
 * @desc    Send OTP for email verification (fallback authentication)
 * @access  Public
 */
router.post('/send-otp',
  authLimiter,
  magicLinkLimiter, // Reuse the same rate limiter for OTP
  validateEduEmail,
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      
      // Check if user exists, if not create a new one
      let user = await User.findOne({ email });
      const emailValidation = authService.validateCollegeEmail(email);
      const institution = emailValidation.institution;

      if (!user) {
        // Create new user
        user = new User({
          email,
          college: {
            name: institution,
            domain: emailValidation.domain
          },
          // Set temporary values - user will complete profile after OTP verification
          name: 'New User',
          year: '1st Year',
          course: 'Pending'
        });
        await user.save();
      }

      // Generate OTP (6-digit number)
      const otp = authService.generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save OTP to user
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.otpAttempts = 0;
      user.lastMagicLinkRequest = new Date(); // Track for rate limiting
      await user.save();

      // Send OTP via email
      await authService.sendOTP(email, otp, institution);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully! Check your email.',
        data: {
          email,
          institution,
          expiresIn: '5 minutes',
          authMethod: 'OTP'
        }
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP and authenticate user
 * @access  Public
 */
router.post('/verify-otp',
  authLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail({ gmail_remove_dots: false }),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('OTP must be a 6-digit number')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, otp } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found. Please request a new OTP.'
        });
      }

      // Check OTP attempts
      if (user.otpAttempts >= 3) {
        return res.status(429).json({
          success: false,
          message: 'Too many OTP attempts. Please request a new OTP.'
        });
      }

      // Verify OTP
      const otpVerification = authService.verifyOTP(otp, user.otp, user.otpExpires);
      
      if (!otpVerification.isValid) {
        // Increment attempts
        user.otpAttempts += 1;
        await user.save();

        return res.status(400).json({
          success: false,
          message: otpVerification.error,
          attemptsRemaining: 3 - user.otpAttempts
        });
      }

      // OTP is valid - clear OTP fields and authenticate user
      user.otp = undefined;
      user.otpExpires = undefined;
      user.otpAttempts = 0;
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = authService.generateToken({
        id: user._id,
        email: user.email,
        college: user.college.name
      });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully! Welcome to CampusKarma.',
        data: {
          token,
          user: user.toCleanJSON(),
          authMethod: 'OTP'
        }
      });

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;
