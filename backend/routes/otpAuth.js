// CampusKarma OTP Authentication Routes
// Purpose: OTP-based authentication endpoints

import express from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import otpAuthService from '../utils/otpAuthService.js'

const router = express.Router()

// Rate limiting for OTP requests
const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 OTP requests per 15 minutes
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Validation middleware
const validateOTPRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
]

const validateOTPVerification = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
]

// Send OTP
router.post('/send-otp', otpRateLimit, validateOTPRequest, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email } = req.body

    // Send OTP
    const result = await otpAuthService.sendOTP(email)

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresIn: result.expiresIn,
      email: email
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    })
  }
})

// Verify OTP
router.post('/verify-otp', validateOTPVerification, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, otp } = req.body

    // Verify OTP
    const result = await otpAuthService.verifyOTP(email, otp)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'OTP verification failed'
    })
  }
})

// Verify token (for checking if user is still logged in)
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const result = otpAuthService.verifyToken(token)
    
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: result.user
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
})

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const tokenResult = otpAuthService.verifyToken(token)
    const user = otpAuthService.getUserByEmail(tokenResult.user.email)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          college: user.college,
          karma: user.karma,
          stats: user.stats,
          isVerified: user.isVerified
        }
      }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    })
  }
})

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const result = otpAuthService.refreshToken(token)
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: result.token
      }
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token refresh failed'
    })
  }
})

// Logout (client-side token removal)
router.post('/logout', async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
})

export default router
