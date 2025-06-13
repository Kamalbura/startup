// CampusKarma OTP Authentication Service
// Purpose: OTP-based authentication for development and production

import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// In-memory OTP storage (replace with Redis/Database in production)
const otpStore = new Map()
const userStore = new Map() // Temporary user storage

class OTPAuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'campuskarma-secret-key'
    this.otpExpiry = 10 * 60 * 1000 // 10 minutes
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Validate college email domains
  validateCollegeEmail(email) {
    const allowedDomains = [
      "vnrvjiet.ac.in", "cbit.ac.in", "mgit.ac.in", "mgit.com", "vce.ac.in",
      "kmit.in", "vit.ac.in", "iiit.ac.in", "students.iiit.ac.in", "iith.ac.in",
      "nitw.ac.in", "cvr.ac.in", "bvrit.ac.in", "ellenkicet.ac.in", "villamariecollege.ac.in",
      "edu", "edu.in", "ac.in"
    ]
    
    if (!email || !email.includes('@')) {
      return { isValid: false, reason: 'Invalid email format' }
    }
    
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const isValidDomain = allowedDomains.some(domain => 
      emailDomain === domain || emailDomain.endsWith('.' + domain)
    )
    
    if (!isValidDomain) {
      return { 
        isValid: false, 
        reason: 'Please use your college email from a supported institution' 
      }
    }
    
    return { isValid: true, domain: emailDomain }
  }

  // Send OTP (for development, we'll just log it)
  async sendOTP(email) {
    try {
      // Validate email
      const validation = this.validateCollegeEmail(email)
      if (!validation.isValid) {
        throw new Error(validation.reason)
      }

      // Generate OTP
      const otp = this.generateOTP()
      const expiresAt = Date.now() + this.otpExpiry

      // Store OTP
      otpStore.set(email, { 
        otp, 
        expiresAt, 
        attempts: 0,
        createdAt: Date.now()
      })

      // For development: Log OTP to console (replace with SMS/Email service)
      console.log(`🔐 OTP for ${email}: ${otp} (expires in 10 minutes)`)
      
      // In production, send via SMS/Email service
      // await this.sendOTPViaEmail(email, otp)
      // await this.sendOTPViaSMS(email, otp)

      return {
        success: true,
        message: 'OTP sent successfully',
        expiresIn: this.otpExpiry / 1000 // seconds
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    }
  }

  // Verify OTP and create user session
  async verifyOTP(email, otp) {
    try {
      const storedData = otpStore.get(email)
      
      if (!storedData) {
        throw new Error('OTP not found or expired. Please request a new one.')
      }

      // Check expiry
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email)
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
