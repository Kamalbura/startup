// CampusKarma Authentication Utilities
// Purpose: JWT token management, magic link generation, .edu validation

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
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'campuskarma',
        audience: 'campuskarma-users'
      })
    } catch (error) {
      throw new Error('Invalid or expired token')
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

  // .edu Email Validation
  validateEduEmail(email) {
    const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/
    
    if (!eduRegex.test(email)) {
      return {
        isValid: false,
        error: 'Only .edu email addresses are allowed'
      }
    }

    // Extract college domain
    const domain = email.split('@')[1]
    const collegeName = this.extractCollegeName(domain)
    
    return {
      isValid: true,
      domain,
      collegeName
    }
  }

  extractCollegeName(domain) {
    // Simple college name extraction (can be enhanced with a college database)
    const domainParts = domain.split('.')
    
    // Remove 'edu' and common subdomains
    const filteredParts = domainParts.filter(part => 
      !['edu', 'www', 'mail', 'student', 'alumni'].includes(part.toLowerCase())
    )
    
    // Capitalize and join
    return filteredParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  // Email Service Initialization
  initializeEmailService() {
    if (process.env.NODE_ENV === 'development' || process.env.EMAIL_SERVICE === 'console') {
      // Console logging for development
      return {
        sendMail: async (mailOptions) => {          logger.info('📧 Magic Link Email (Development Mode):')
          logger.info(`To: ${mailOptions.to}`)
          logger.info(`Subject: ${mailOptions.subject}`)
          logger.info(`Magic Link: ${mailOptions.html.match(/href="([^"]*)/)?.[1]}`)
          return { messageId: 'console-' + Date.now() }
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
      logger.info(`Magic link sent to ${email}`, { messageId: result.messageId })
      return { success: true, messageId: result.messageId }
    } catch (error) {
      logger.error('Failed to send magic link email:', error)
      throw new Error('Failed to send verification email')
    }
  }

  // Email Template for Magic Link
  generateMagicLinkEmailTemplate(email, magicLink, collegeName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CampusKarma Magic Link</title>
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #0ea5e9; }
            .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #0ea5e9, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { padding: 30px 0; }
            .magic-button { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #22c55e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3); }
            .magic-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4); }
            .trust-badge { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">CampusKarma</div>
            <p>Turn Your Skills Into Karma ✨</p>
        </div>
        
        <div class="content">
            <h2>Welcome to the Student Skill Economy! 🚀</h2>
            
            <p>Hey there, future entrepreneur from <strong>${collegeName}</strong>!</p>
            
            <p>You're about to join India's most trusted student gig platform. Click the magic button below to complete your journey into the CampusKarma ecosystem:</p>
            
            <div style="text-align: center;">
                <a href="${magicLink}" class="magic-button">🎯 Enter CampusKarma</a>
            </div>
            
            <div class="trust-badge">
                <h3>🛡️ Trust-First Platform</h3>
                <p>✅ .edu Email Verified<br>
                ✅ UPI Escrow Protection<br>
                ✅ Peer Review System<br>
                ✅ Anti-Fraud Security</p>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>🎨 Set up your profile & showcase skills</li>
                <li>📚 Take skill quizzes to get verified</li>
                <li>💼 Start earning or post your first task</li>
                <li>⭐ Build your campus reputation</li>
            </ul>
            
            <p><em>This link expires in 10 minutes for your security.</em></p>
        </div>
        
        <div class="footer">
            <p>Made with ❤️ for India's student community<br>
            <a href="https://campuskarma.in">CampusKarma.in</a> | Trust • Skills • Opportunity</p>
            
            <p style="font-size: 12px; color: #9ca3af;">
                If you didn't request this email, please ignore it.<br>
                This link was requested for: ${email}
            </p>
        </div>
    </body>
    </html>
    `
  }

  // Utility Functions
  parseDuration(duration) {
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
    const match = duration.match(/^(\d+)([smhd])$/)
    
    if (!match) {
      throw new Error('Invalid duration format')
    }
    
    const [, amount, unit] = match
    return parseInt(amount) * units[unit]
  }

  // Password-less verification for production readiness
  generateSecureHash(data) {
    return crypto
      .createHmac('sha256', this.jwtSecret)
      .update(data)
      .digest('hex')
  }

  verifySecureHash(data, hash) {
    const computedHash = this.generateSecureHash(data)
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash))
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService
