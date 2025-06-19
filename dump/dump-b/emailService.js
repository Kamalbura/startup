// CampusKarma Email Service
// Purpose: Multi-provider email service with professional templates

import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import sgMail from '@sendgrid/mail'

class EmailService {
  constructor() {
    this.service = process.env.EMAIL_SERVICE || 'console'
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@campuskarma.burakamal.site'
    this.fromName = process.env.EMAIL_FROM_NAME || 'CampusKarma Team'
    this.authEmail = process.env.EMAIL_AUTH || 'auth@campuskarma.burakamal.site'
    this.supportEmail = process.env.EMAIL_SUPPORT || 'support@campuskarma.burakamal.site'
    
    this.initializeService()
  }

  initializeService() {
    switch (this.service) {
      case 'smtp':
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
        break
        
      case 'resend':
        this.resend = new Resend(process.env.RESEND_API_KEY)
        break
        
      case 'sendgrid':
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        break
        
      default:
        console.log('📧 Email service set to console mode (development)')
    }
  }

  // Generate beautiful OTP email template
  generateOTPTemplate(otp, institution, email) {
    return {
      subject: `Your CampusKarma Verification Code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>CampusKarma OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">CampusKarma</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Turn Your Skills Into Karma</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">Welcome to CampusKarma!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello <strong>${institution}</strong> student,
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your verification code for accessing CampusKarma is:
              </p>

              <!-- OTP Box -->
              <div style="background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <div style="color: #1f2937; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Valid for 10 minutes</p>
              </div>

              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0; border-radius: 4px;">
                <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                  🔐 Security Notice: Never share this code with anyone. CampusKarma will never ask for your OTP via phone or email.
                </p>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                If you didn't request this verification code, please ignore this email and consider changing your password.
              </p>              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://campuskarma.burakamal.site/" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Continue to CampusKarma →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                Best regards,<br>
                <strong>The CampusKarma Team</strong><br>
                <a href="mailto:${this.supportEmail}" style="color: #667eea; text-decoration: none;">${this.supportEmail}</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This email was sent to ${email} | 
                <a href="https://campuskarma.burakamal.site/unsubscribe" style="color: #9ca3af;">Unsubscribe</a> | 
                <a href="mailto:${this.supportEmail}" style="color: #9ca3af;">Support</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                CampusKarma • Building India's Student Skill Economy<br>
                <a href="https://campuskarma.burakamal.site" style="color: #9ca3af;">campuskarma.burakamal.site</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
CampusKarma - Email Verification

Hello ${institution} student,

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
The CampusKarma Team

---
CampusKarma • Turn Your Skills Into Karma
      `.trim()
    }
  }

  // Send OTP email
  async sendOTP(email, otp, institution) {
    const template = this.generateOTPTemplate(otp, institution, email)
    
    const emailData = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    }

    try {
      switch (this.service) {
        case 'smtp':
          await this.transporter.sendMail(emailData)
          break
          
        case 'resend':
          await this.resend.emails.send({
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html
          })
          break
          
        case 'sendgrid':
          await sgMail.send(emailData)
          break
          
        default:
          // Console mode (development)
          console.log('📧 Email would be sent:')
          console.log('From:', emailData.from)
          console.log('To:', emailData.to)
          console.log('Subject:', emailData.subject)
          console.log('OTP:', otp)
          console.log('Institution:', institution)
          return Promise.resolve()
      }
      
      console.log(`✅ OTP email sent successfully to ${email} (${institution})`)
      return true
      
    } catch (error) {
      console.error('❌ Email sending failed:', error.message)
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }

  // Test email configuration
  async testEmailService() {
    try {
      await this.sendOTP(
        'test@example.com', 
        '123456', 
        'Test Institution'
      )
      return { success: true, message: 'Email service is working correctly' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new EmailService()
