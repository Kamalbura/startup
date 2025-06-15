// CampusKarma OTP Authentication Service
// Purpose: Secure OTP-based authentication with MongoDB persistence

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import OTP from '../models/OTP.js'
import emailService from './emailService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load college domains whitelist
let collegeDomains = {}
try {
  const domainsFile = fs.readFileSync(path.join(__dirname, 'collegeDomains.json'), 'utf8')
  collegeDomains = JSON.parse(domainsFile)
} catch (error) {
  console.error('Failed to load college domains:', error)
  collegeDomains = { allowedDomains: [], institutionMapping: {} }
}

class OTPAuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'campuskarma-secret-key'
    this.otpExpiry = 10 * 60 * 1000 // 10 minutes
    this.maxAttempts = 3
    this.rateLimitWindow = 60 * 60 * 1000 // 1 hour
    this.maxOTPsPerHour = 3
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Validate college email domains using whitelist
  validateCollegeEmail(email) {
    if (!email?.includes('@')) {
      return { isValid: false, reason: 'Invalid email format' }
    }
    
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const isValidDomain = collegeDomains.allowedDomains.some(domain => 
      emailDomain === domain || emailDomain.endsWith('.' + domain)
    )
    
    if (!isValidDomain) {
      return { 
        isValid: false, 
        reason: 'Please use your college email from a supported institution (.ac.in, .edu.in, or .edu domains)' 
      }
    }

    const institution = collegeDomains.institutionMapping[emailDomain] || 
                       emailDomain.split('.').slice(-2).join('.').toUpperCase()
    
    return { isValid: true, domain: emailDomain, institution }
  }

  // Check rate limiting
  async checkRateLimit(email) {
    const oneHourAgo = new Date(Date.now() - this.rateLimitWindow)
    const recentOTPs = await OTP.countDocuments({
      email,
      createdAt: { $gte: oneHourAgo }
    })

    if (recentOTPs >= this.maxOTPsPerHour) {
      throw new Error(`Rate limit exceeded. Maximum ${this.maxOTPsPerHour} OTP requests per hour.`)
    }
    
    return true
  }

  // Send OTP with MongoDB persistence
  async sendOTP(email, ipAddress = null, userAgent = null) {
    try {
      // Validate email
      const validation = this.validateCollegeEmail(email)
      if (!validation.isValid) {
        throw new Error(validation.reason)
      }

      // Check rate limiting
      await this.checkRateLimit(email)

      // Generate OTP
      const otp = this.generateOTP()
      const expiresAt = new Date(Date.now() + this.otpExpiry)

      // Delete any existing OTP for this email
      await OTP.deleteMany({ email })

      // Store OTP in MongoDB
      const otpDoc = new OTP({
        email,
        otp,
        expiresAt,
        institution: validation.institution,
        domain: validation.domain,
        ipAddress,
        userAgent
      })

      await otpDoc.save()      // For development: Log OTP to console (replace with email service in production)
      console.log(`🔐 OTP for ${email} (${validation.institution}): ${otp} (expires in 10 minutes)`)
        // Send OTP via professional email service
      try {
        await emailService.sendOTP(email, otp, validation.institution)
        console.log(`📧 OTP email sent successfully to ${email}`)
      } catch (emailError) {
        console.warn('Email service warning:', emailError.message)
        // Continue execution even if email fails (for development)
      }

      return {
        success: true,
        message: 'OTP sent successfully to your college email',
        institution: validation.institution,
        expiresIn: this.otpExpiry / 1000 // seconds
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    }
  }

  // Verify OTP with MongoDB persistence
  async verifyOTP(email, otp) {
    try {
      // Find the most recent OTP for this email
      const otpDoc = await OTP.findOne({ 
        email,
        isVerified: false
      }).sort({ createdAt: -1 })
      
      if (!otpDoc) {
        throw new Error('OTP not found or already used. Please request a new one.')
      }

      // Check if OTP is expired
      if (otpDoc.isExpired()) {
        await OTP.deleteOne({ _id: otpDoc._id })
        throw new Error('OTP has expired. Please request a new one.')
      }

      // Check attempts
      if (otpDoc.attempts >= this.maxAttempts) {
        await OTP.deleteOne({ _id: otpDoc._id })
        throw new Error('Maximum verification attempts exceeded. Please request a new OTP.')
      }

      // Verify OTP
      if (otpDoc.otp !== otp) {
        await otpDoc.incrementAttempts()
        const remainingAttempts = this.maxAttempts - otpDoc.attempts - 1
        throw new Error(`Invalid OTP. ${remainingAttempts} attempts remaining.`)
      }

      // Mark as verified
      await otpDoc.markAsVerified()

      // Generate JWT token
      const user = {
        email,
        institution: otpDoc.institution,
        domain: otpDoc.domain,
        verified: true,
        verifiedAt: new Date()
      }

      const token = jwt.sign(user, this.jwtSecret, { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
      })

      // Create user data
      const userData = {
        ...user,
        id: crypto.randomUUID(),
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: '',
        karma: 50, // Initial karma score
        stats: { totalEarned: 0, completedTasks: 0, createdTasks: 0 },
        skills: [],
        joinedAt: new Date(),
        lastActive: new Date()
      }

      console.log(`✅ User verified: ${email} from ${otpDoc.institution}`)

      return {
        success: true,
        message: 'OTP verified successfully',
        token,
        user: userData
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret)
    } catch (error) {
      console.error('Token verification error:', error)
      throw new Error('Invalid or expired token')
    }
  }

  // Refresh JWT token
  refreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret)
      const newToken = jwt.sign(
        { 
          email: decoded.email, 
          institution: decoded.institution,
          domain: decoded.domain,
          verified: decoded.verified 
        },
        this.jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )
      return { success: true, token: newToken }
    } catch (error) {
      console.error('Token refresh error:', error)
      throw new Error('Invalid token for refresh')
    }
  }

  // Get college name from domain
  getCollegeName(domain) {
    return collegeDomains.institutionMapping[domain] || 
           domain.split('.').slice(-2).join('.').toUpperCase()
  }

  // Check if email domain is supported
  isSupportedDomain(email) {
    const validation = this.validateCollegeEmail(email)
    return validation.isValid
  }

  // Get supported domains list
  getSupportedDomains() {
    return collegeDomains.allowedDomains
  }
  // Get institution mapping
  getInstitutionMapping() {
    return collegeDomains.institutionMapping
  }
}

export default new OTPAuthService()
