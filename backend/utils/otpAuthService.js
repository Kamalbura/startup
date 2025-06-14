// CampusKarma OTP Authentication Service
// Purpose: Secure OTP-based authentication with MongoDB persistence

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
import OTP from '../models/OTP.js'

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

      await otpDoc.save()

      // For development: Log OTP to console (replace with email service in production)
      console.log(`🔐 OTP for ${email} (${validation.institution}): ${otp} (expires in 10 minutes)`)
      
      // TODO: In production, send via email service
      // await this.sendOTPViaEmail(email, otp, validation.institution)

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

      // Store user session (for development - in production use Redis or database)
      const userData = {
        ...user,
        id: crypto.randomUUID(),
        karma: 50, // Initial karma score
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
        throw new Error('OTP has expired. Please request a new one.')
      }

      // Check attempts (max 3)
      if (storedData.attempts >= 3) {
        otpStore.delete(email)
        throw new Error('Too many failed attempts. Please request a new OTP.')
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        storedData.attempts += 1
        throw new Error('Invalid OTP. Please try again.')
      }

      // OTP verified successfully
      otpStore.delete(email)

      // Create or get user
      let user = userStore.get(email)
      if (!user) {
        // Create new user
        const [username, domain] = email.split('@')
        user = {
          id: crypto.randomUUID(),
          email,
          firstName: username.charAt(0).toUpperCase() + username.slice(1),
          lastName: '',
          college: this.getCollegeName(domain),
          karma: { trust: 100, skill: 0, reliability: 100 },
          stats: { totalEarned: 0, completedTasks: 0, createdTasks: 0 },
          skills: [],
          createdAt: new Date().toISOString(),
          isVerified: true
        }
        userStore.set(email, user)
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          college: user.college 
        },
        this.jwtSecret,
        { expiresIn: '7d' }
      )

      return {
        success: true,
        token,
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
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  }

  // Get college name from domain
  getCollegeName(domain) {
    const collegeMap = {
      'vce.ac.in': 'Vardhaman College of Engineering',
      'cbit.ac.in': 'Chaitanya Bharathi Institute of Technology',
      'mgit.ac.in': 'Mahatma Gandhi Institute of Technology',
      'kmit.in': 'Keshav Memorial Institute of Technology',
      'vit.ac.in': 'VIT University',
      'iiit.ac.in': 'International Institute of Information Technology',
      'iith.ac.in': 'Indian Institute of Technology Hyderabad',
      'nitw.ac.in': 'National Institute of Technology Warangal',
      'cvr.ac.in': 'CVR College of Engineering',
      'bvrit.ac.in': 'BV Raju Institute of Technology'
    }
    
    return collegeMap[domain] || domain.split('.')[0].toUpperCase()
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret)
      const user = userStore.get(decoded.email)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      return { success: true, user: decoded }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  // Get user by email
  getUserByEmail(email) {
    return userStore.get(email)
  }

  // Refresh token
  refreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret)
      const newToken = jwt.sign(
        { 
          userId: decoded.userId, 
          email: decoded.email,
          college: decoded.college 
        },
        this.jwtSecret,
        { expiresIn: '7d' }
      )
      
      return { success: true, token: newToken }
    } catch (error) {
      throw new Error('Invalid token for refresh')
    }
  }
}

export default new OTPAuthService()
