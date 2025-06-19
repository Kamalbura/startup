// Zoho Mail Integration Test Script
// Purpose: Test Zoho SMTP configuration and email delivery

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

class ZohoMailTester {
  constructor() {
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
      auth: {
        user: process.env.SMTP_USER || 'noreply@campuskarma.burakamal.site',
        pass: process.env.SMTP_PASS || 'your-zoho-app-password'
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates for testing
      }
    }
  }

  // Test SMTP connection
  async testConnection() {
    console.log('🔍 Testing Zoho SMTP Connection...')
    console.log('Host:', this.config.host)
    console.log('Port:', this.config.port)
    console.log('User:', this.config.auth.user)
    console.log('Secure:', this.config.secure)
    
    try {
      const transporter = nodemailer.createTransporter(this.config)
      
      // Verify connection
      await transporter.verify()
      console.log('✅ SMTP Connection successful!')
      return { success: true, message: 'Connection verified' }
      
    } catch (error) {
      console.error('❌ SMTP Connection failed:', error.message)
      
      // Provide specific error guidance
      if (error.code === 'EAUTH') {
        console.log('\n🔧 Fix: Check your Zoho app password')
        console.log('   1. Go to Zoho Mail Admin Console')
        console.log('   2. Security > App Passwords')
        console.log('   3. Generate new app password for CampusKarma')
      }
      
      if (error.code === 'ENOTFOUND') {
        console.log('\n🔧 Fix: Check SMTP host configuration')
        console.log('   Zoho SMTP: smtp.zoho.com')
      }
      
      return { success: false, error: error.message }
    }
  }

  // Send test OTP email
  async sendTestOTP(testEmail = 'test@example.com') {
    console.log(`\n📧 Sending test OTP email to: ${testEmail}`)
    
    try {
      const transporter = nodemailer.createTransporter(this.config)
      const testOTP = '123456'
      
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: testEmail,
        subject: 'CampusKarma Test - Your Verification Code: ' + testOTP,
        html: this.generateTestEmailHTML(testOTP),
        text: this.generateTestEmailText(testOTP)
      }
      
      const result = await transporter.sendMail(mailOptions)
      console.log('✅ Test email sent successfully!')
      console.log('Message ID:', result.messageId)
      console.log('Response:', result.response)
      
      return { success: true, messageId: result.messageId }
      
    } catch (error) {
      console.error('❌ Failed to send test email:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Generate test email HTML
  generateTestEmailHTML(otp) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CampusKarma Test Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">CampusKarma</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Turn Your Skills Into Karma</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">🧪 Test Email from Zoho Mail</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            This is a test email to verify your professional email setup with:
            <strong>campuskarma.burakamal.site</strong>
          </p>
          
          <div style="background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="color: #1f2937; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${otp}</div>
            <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Test OTP Code</p>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="color: #1e40af; font-size: 14px; margin: 0;">
              ✅ If you received this email, your Zoho Mail integration is working perfectly!
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            Sent from: <strong>noreply@campuskarma.burakamal.site</strong><br>
            Test Date: ${new Date().toLocaleString()}
          </p>
        </div>
      </body>
      </html>
    `
  }

  // Generate test email text
  generateTestEmailText(otp) {
    return `
CampusKarma - Email Test

This is a test email to verify your professional email setup.

Test OTP Code: ${otp}

If you received this email, your Zoho Mail integration is working!

Sent from: noreply@campuskarma.burakamal.site
Test Date: ${new Date().toLocaleString()}

---
CampusKarma Team
Turn Your Skills Into Karma
    `.trim()
  }

  // Complete setup verification
  async runCompleteTest(testEmail) {
    console.log('🚀 Starting Zoho Mail Complete Test...')
    console.log('='.repeat(50))
    
    // Test 1: Connection
    const connectionTest = await this.testConnection()
    
    if (!connectionTest.success) {
      console.log('\n❌ Setup incomplete. Please configure Zoho Mail first.')
      return false
    }
    
    // Test 2: Email sending (if test email provided)
    if (testEmail) {
      console.log('\n' + '='.repeat(50))
      const emailTest = await this.sendTestOTP(testEmail)
      
      if (emailTest.success) {
        console.log('\n🎉 All tests passed! Zoho Mail is ready for production.')
        console.log('\n📋 Next steps:')
        console.log('   1. Update EMAIL_SERVICE=smtp in .env')
        console.log('   2. Deploy to production')
        console.log('   3. Test with real student emails')
        return true
      }
    }
    
    console.log('\n✅ Connection test passed! Email sending test skipped.')
    console.log('\n📋 To test email sending:')
    console.log('   node test-zoho.js your-test-email@domain.com')
    
    return true
  }
}

// CLI usage
async function main() {
  const tester = new ZohoMailTester()
  const testEmail = process.argv[2] // Optional test email from command line
  
  await tester.runCompleteTest(testEmail)
  process.exit(0)
}

// Export for use in other scripts
export default ZohoMailTester

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
