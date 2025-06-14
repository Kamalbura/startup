// CampusKarma OTP Authentication Routes
// Purpose: Secure OTP-based authentication endpoints with MongoDB

import express from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import otpAuthService from '../utils/otpAuthService_new.js'

const router = express.Router()

// Rate limiting
const otpSendRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again in 1 hour.',
    retryAfter: '1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.email || req.ip,
})

const otpVerifyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Validation Middleware
const validateOTPRequest = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .custom((email) => {
      if (!otpAuthService.isSupportedDomain(email)) {
        throw new Error('Please use a college email from a supported institution (.ac.in, .edu.in, or .edu domains)')
      }
      return true
    }),
]

const validateOTPVerification = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
]

// Send OTP
router.post('/send-otp', otpSendRateLimit, validateOTPRequest, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((err) => err.msg),
      })
    }

    const { email } = req.body
    const ipAddress = req.ip || req.connection.remoteAddress
    const userAgent = req.get('User-Agent')

    const result = await otpAuthService.sendOTP(email, ipAddress, userAgent)

    res.status(200).json({
      success: true,
      message: result.message,
      institution: result.institution,
      expiresIn: result.expiresIn,
      supportedDomains: otpAuthService.getSupportedDomains().slice(0, 10),
    })
  } catch (error) {
    console.error('Send OTP error:', error)

    if (error.message.includes('Rate limit exceeded')) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfter: '1 hour',
      })
    }

    if (error.message.includes('supported institution')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        supportedDomains: otpAuthService.getSupportedDomains().slice(0, 15),
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
})

// Verify OTP
router.post('/verify-otp', otpVerifyRateLimit, validateOTPVerification, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((err) => err.msg),
      })
    }

    const { email, otp } = req.body
    const result = await otpAuthService.verifyOTP(email, otp)

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        token: result.token,
        user: result.user,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)

    if (error.message.includes('Rate limit exceeded')) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfter: '1 hour',
      })
    }

    if (error.message.includes('Maximum verification attempts')) {
      return res.status(429).json({
        success: false,
        message: error.message,
        action: 'request_new_otp',
      })
    }

    if (error.message.includes('expired')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        action: 'request_new_otp',
      })
    }

    if (error.message.includes('Invalid OTP')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        action: 'retry_verification',
      })
    }

    res.status(400).json({
      success: false,
      message: 'OTP verification failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
})

// Verify token
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const result = otpAuthService.verifyToken(token)

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: result.user,
    })
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

    const tokenResult = otpAuthService.verifyToken(token)
    const user = otpAuthService.getUserByEmail(tokenResult.user.email)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
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
          isVerified: user.isVerified,
        },
      },
    })
  } catch {
    res.status(401).json({ success: false, message: 'Authentication failed' })
  }
})

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' })

    const result = otpAuthService.refreshToken(token)

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token: result.token },
    })
  } catch {
    res.status(401).json({ success: false, message: 'Token refresh failed' })
  }
})

// Logout
router.post('/logout', async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' })
})

export default router
