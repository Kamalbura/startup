// CampusKarma Authentication Utilities
// Purpose: JWT token management, magic link generation, college email validation

import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpiration = process.env.JWT_EXPIRES_IN || '7d'
    this.magicLinkExpiration = process.env.MAGIC_LINK_EXPIRES_IN || '10m'
    
    // Initialize email transporter
    this.emailTransporter = this.initializeEmailService()
  }

  // JWT Token Management
  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
      issuer: 'campuskarma',
      audience: 'campuskarma-users'
    })
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'campuskarma',
        audience: 'campuskarma-users'
      })
      return { isValid: true, payload: decoded }
    } catch (error) {
      logger.error('Token verification failed:', error.message)
      return { isValid: false, error: error.message }
    }
  }

  // Magic Link Generation & Validation
  generateMagicLink(email) {
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + this.parseDuration(this.magicLinkExpiration))
    
    return {
      token,
      expires,
      link: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`
    }
  }

  // College Email Validation (Indian + International)
  validateCollegeEmail(email) {
    // Supported college domains
    const allowedDomains = [
      // Indian Engineering Colleges
      "vnrvjiet.ac.in",
      "cbit.ac.in", 
      "mgit.ac.in",
      "mgit.com",
      "vce.ac.in",
      "kmit.in",
      "vit.ac.in",
      "iiit.ac.in",
      "students.iiit.ac.in",
      "iith.ac.in",
      "nitw.ac.in",
      "cvr.ac.in",
      "bvrit.ac.in",
      "ellenkicet.ac.in",
      "villamariecollege.ac.in"
    ]
    
    // General patterns for college emails
    const collegePatterns = [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/,           // International .edu
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.in$/,       // Indian .edu.in
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.in$/,        // Indian .ac.in
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.au$/,       // Australian .edu.au
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.ac\.uk$/,        // UK .ac.uk
    ]
    
    if (!email || !email.includes('@')) {
      return { isValid: false, reason: 'Invalid email format' }
    }
    
    const emailDomain = email.split('@')[1]?.toLowerCase()
    
    // Check against allowed specific domains
    if (allowedDomains.includes(emailDomain)) {
      return { isValid: true, domain: emailDomain, type: 'allowed_domain' }
    }
    
    // Check against general patterns
    const matchesPattern = collegePatterns.some(pattern => pattern.test(email))
    if (!matchesPattern) {
      return { 
        isValid: false, 
        reason: 'Please use your college email address (.edu, .ac.in, .edu.in domains)' 
      }
    }

    // Extract college domain and name
    const collegeDomain = email.split('@')[1]
    const collegeName = this.extractCollegeName(collegeDomain)
    
    return {
      isValid: true,
      domain: collegeDomain,
      collegeName
    }
  }

  extractCollegeName(domain) {
    // Simple college name extraction (can be enhanced with a college database)
    const domainParts = domain.split('.')
    
    // Remove common suffixes and subdomains
    const filteredParts = domainParts.filter(part => 
      !['edu', 'ac', 'in', 'com', 'www', 'mail', 'student', 'students', 'alumni'].includes(part.toLowerCase())
    )
    
    // Capitalize and join
    return filteredParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  // Extract institution/college from email
  extractInstitution(email) {
    if (!email || !email.includes('@')) {
      return 'Unknown Institution'
    }
    
    const domain = email.split('@')[1]
    return this.extractCollegeName(domain)
  }

  // Generate magic link token
  generateMagicLinkToken(userId, email) {
    const payload = {
      userId,
      email,
      type: 'magic_link'
    }
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.magicLinkExpiration,
      issuer: 'campuskarma',
      audience: 'campuskarma-magic-link'
    })
  }

  // Verify magic link token
  verifyMagicLinkToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'campuskarma',
        audience: 'campuskarma-magic-link'
      })
      return decoded
    } catch (error) {
      logger.error('Magic link token verification failed:', error.message)
      return null
    }
  }

  // Generate access token for user authentication
  generateAccessToken(userId, email) {
    const payload = {
      id: userId,
      email,
      type: 'access_token'
    }
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h',
      issuer: 'campuskarma',
      audience: 'campuskarma-users'
    })
  }

  // Email Service Initialization
  initializeEmailService() {
    if (process.env.NODE_ENV === 'development' || process.env.EMAIL_SERVICE === 'console') {
      return {
        sendMail: (options) => {
          console.log('📧 Magic Link Email (Development Mode)')
          console.log('To:', options.to)
          console.log('Subject:', options.subject)
          console.log('Magic Link:', options.html.match(/href="([^"]*)/)?.[1])
          return Promise.resolve({ messageId: 'dev-' + Date.now() })
        }
      }
    }
      // Production email service
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  // Send Magic Link Email
  async sendMagicLinkEmail(email, magicLink, collegeName) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CampusKarma <noreply@campuskarma.in>',
      to: email,
      subject: '🎯 Your CampusKarma Magic Link - Let\'s Build Your Karma!',
      html: this.generateMagicLinkEmailTemplate(email, magicLink, collegeName)
    }

    try {
      const result = await this.emailTransporter.sendMail(mailOptions)
      logger.info(`Magic link sent to ${email}`)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      logger.error('Failed to send magic link email:', error)
      throw new Error('Failed to send email. Please try again.')
    }
  }

  // Email Template for Magic Link
  generateMagicLinkEmailTemplate(email, magicLink, collegeName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your CampusKarma Magic Link</title>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">CampusKarma</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your Gateway to Campus Success</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi from ${collegeName}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
              Welcome to India's trust-first student skill economy! Click the magic link below to access your account and start building your karma.
            </p>
            
            <!-- Magic Link Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${magicLink}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                🚀 Access CampusKarma
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0 0;">
              This link will expire in 10 minutes for security. If you didn't request this email, you can safely ignore it.
            </p>
            
            <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 32px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © 2024 CampusKarma. Made with ❤️ for India's student community.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Send magic link via email
  async sendMagicLink(email, token, institution) {
    const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?token=${token}&email=${encodeURIComponent(email)}`
    
    await this.sendMagicLinkEmail(email, magicLink, institution)
    logger.info(`Magic link sent to ${email}`)
  }

  // Utility Functions
  parseDuration(duration) {
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
    const match = duration.match(/(\d+)([smhd])/)
    if (match) {
      return parseInt(match[1]) * units[match[2]]
    }
    return 600000 // Default 10 minutes
  }

  // Password-less verification for production readiness
  generateSecureHash(data) {
    return crypto.createHmac('sha256', this.jwtSecret).update(data).digest('hex')
  }

  verifySecureHash(data, hash) {
    const expectedHash = this.generateSecureHash(data)
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))
  }

  // OTP Authentication (fallback method)
  generateOTP() {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async sendOTP(email, otp, institution) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || 'noreply@campuskarma.com',
        to: email,
        subject: 'Your CampusKarma Login Code',
        html: this.generateOTPEmailTemplate(otp, institution),
        text: `Your CampusKarma login code is: ${otp}. This code expires in 5 minutes. If you didn't request this code, please ignore this email.`
      }

      if (process.env.NODE_ENV === 'development') {
        logger.info('OTP Email (Development Mode):')
        logger.info(`To: ${email}`)
        logger.info(`OTP: ${otp}`)
        logger.info(`Institution: ${institution}`)
        return { success: true, message: 'OTP logged to console (development mode)' }
      }

      const result = await this.emailTransporter.sendMail(mailOptions)
      logger.info(`OTP sent successfully to ${email}`)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      logger.error('Failed to send OTP:', error)
      throw new Error('Failed to send OTP email')
    }
  }

  generateOTPEmailTemplate(otp, institution) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your CampusKarma Login Code</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp-number { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎓 CampusKarma</h1>
        <p>Your trusted student gig platform</p>
      </div>
      <div class="content">
        <h2>Login Code for ${institution}</h2>
        <p>Here's your login code to access CampusKarma:</p>
        
        <div class="otp-code">
          <div class="otp-number">${otp}</div>
          <p><strong>Enter this code in the app to continue</strong></p>
        </div>
        
        <div class="warning">
          <strong>Security Notice:</strong>
          <ul>
            <li>This code expires in <strong>5 minutes</strong></li>
            <li>Never share this code with anyone</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>
        </div>
        
        <p>Welcome to CampusKarma - where college students connect, collaborate, and earn karma through trust-based gigs!</p>
      </div>
      <div class="footer">
        <p>CampusKarma - Building Trust in Campus Communities</p>
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </body>
    </html>
    `
  }

  verifyOTP(userOTP, storedOTP, otpExpires) {
    // Check if OTP has expired
    if (!otpExpires || new Date() > otpExpires) {
      return { isValid: false, error: 'OTP has expired' }
    }

    // Check if OTP matches
    if (userOTP !== storedOTP) {
      return { isValid: false, error: 'Invalid OTP' }
    }

    return { isValid: true }
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService
