#!/usr/bin/env node

// 🧪 Zoho SMTP Authentication Test Script
// Purpose: Test Zoho Mail SMTP connection and send test emails

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

console.log('🔧 Zoho SMTP Authentication Test')
console.log('=' .repeat(50))

// Display current configuration
console.log('📋 Current SMTP Configuration:')
console.log(`Host: ${process.env.SMTP_HOST}`)
console.log(`Port: ${process.env.SMTP_PORT}`)
console.log(`User: ${process.env.SMTP_USER}`)
console.log(`Password: ${process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'}`)
console.log('')

// Test function
async function testZohoSMTP() {
  try {
    console.log('🔄 Creating SMTP transporter...')
    
    // Create transporter with Zoho settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Additional security options
      requireTLS: true,
      tls: {
        ciphers: 'SSLv3'
      }
    })

    console.log('✅ Transporter created successfully')
    console.log('')

    // Test 1: Verify SMTP connection
    console.log('🧪 Test 1: Verifying SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully!')
    console.log('')

    // Test 2: Send test email to Gmail
    console.log('🧪 Test 2: Sending test email to Gmail...')
    const gmailResult = await transporter.sendMail({
      from: {
        name: 'CampusKarma Team',
        address: process.env.SMTP_USER
      },
      to: 'burakamal13@gmail.com',
      subject: '🎉 CampusKarma SMTP Test - Gmail',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎉 Zoho SMTP Working!</h2>
          <p>Hi there!</p>
          <p>This is a test email from CampusKarma to verify that our Zoho Mail SMTP configuration is working correctly.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📧 Email Details:</h3>
            <ul>
              <li><strong>From:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p style="color: #10B981; font-weight: bold;">✅ SMTP Authentication Successful!</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This email was sent as part of CampusKarma's email service testing.
          </p>
        </div>
      `,
      text: `
🎉 CampusKarma SMTP Test - Gmail

Hi there!

This is a test email from CampusKarma to verify that our Zoho Mail SMTP configuration is working correctly.

Email Details:
- From: ${process.env.SMTP_USER}
- SMTP Host: ${process.env.SMTP_HOST}
- Test Time: ${new Date().toLocaleString()}

✅ SMTP Authentication Successful!

This email was sent as part of CampusKarma's email service testing.
      `
    })

    console.log('✅ Gmail test email sent successfully!')
    console.log(`📧 Message ID: ${gmailResult.messageId}`)
    console.log('')

    // Test 3: Send test email to college email
    console.log('🧪 Test 3: Sending test email to college email...')
    const collegeResult = await transporter.sendMail({
      from: {
        name: 'CampusKarma Team',
        address: process.env.SMTP_USER
      },
      to: '1602-22-748-011@vce.ac.in',
      subject: '🚀 CampusKarma SMTP Test - College Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">🚀 Hello from CampusKarma!</h2>
          <p>Dear Student,</p>
          <p>This is a test email from CampusKarma to verify that our email delivery system works with college email addresses (.edu.in domains).</p>
          <div style="background: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3>📚 About CampusKarma:</h3>
            <p>CampusKarma is India's trust-first student skill economy platform where college students can:</p>
            <ul>
              <li>🎯 Earn money through peer-to-peer gigs</li>
              <li>⭐ Build verified reputation and karma scores</li>
              <li>🤝 Collaborate with fellow students</li>
              <li>🏆 Showcase and validate their skills</li>
            </ul>
          </div>
          <p style="color: #10B981; font-weight: bold;">✅ Email Delivery to College Domains Working!</p>
          <div style="background: #F9FAFB; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">
              <strong>Test Details:</strong><br>
              From: ${process.env.SMTP_USER}<br>
              To: 1602-22-748-011@vce.ac.in<br>
              Time: ${new Date().toLocaleString()}
            </p>
          </div>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is a test email. If you received this, our email system is working correctly for college domains.
          </p>
        </div>
      `,
      text: `
🚀 CampusKarma SMTP Test - College Email

Dear Student,

This is a test email from CampusKarma to verify that our email delivery system works with college email addresses (.edu.in domains).

About CampusKarma:
CampusKarma is India's trust-first student skill economy platform where college students can:
- Earn money through peer-to-peer gigs
- Build verified reputation and karma scores  
- Collaborate with fellow students
- Showcase and validate their skills

✅ Email Delivery to College Domains Working!

Test Details:
From: ${process.env.SMTP_USER}
To: 1602-22-748-011@vce.ac.in
Time: ${new Date().toLocaleString()}

This is a test email. If you received this, our email system is working correctly for college domains.
      `
    })

    console.log('✅ College email test sent successfully!')
    console.log(`📧 Message ID: ${collegeResult.messageId}`)
    console.log('')

    // Summary
    console.log('🎉 ALL TESTS PASSED!')
    console.log('=' .repeat(50))
    console.log('✅ SMTP Connection: Working')
    console.log('✅ Gmail Delivery: Working')
    console.log('✅ College Email Delivery: Working')
    console.log('')
    console.log('🚀 Your Zoho SMTP is ready for production!')
    console.log('💡 You can now set EMAIL_SERVICE=smtp in your .env')

  } catch (error) {
    console.error('❌ SMTP Test Failed!')
    console.error('Error:', error.message)
    console.log('')
    
    // Provide specific error guidance
    if (error.message.includes('535')) {
      console.log('🔧 SOLUTION: Authentication failed (535 error)')
      console.log('1. Generate App-Specific Password in Zoho Mail')
      console.log('2. Go to: https://mail.zoho.com → Settings → Security → App Passwords')
      console.log('3. Create new password for "CampusKarma SMTP"')
      console.log('4. Update SMTP_PASS in .env with the 16-character password')
    } else if (error.message.includes('connection')) {
      console.log('🔧 SOLUTION: Connection issue')
      console.log('1. Check your internet connection')
      console.log('2. Verify SMTP_HOST and SMTP_PORT in .env')
      console.log('3. Try alternative port 465 with secure=true')
    } else if (error.message.includes('timeout')) {
      console.log('🔧 SOLUTION: Timeout issue')
      console.log('1. Check firewall settings')
      console.log('2. Try different network connection')
      console.log('3. Verify Zoho Mail domain settings')
    }
    
    console.log('')
    console.log('📋 Current Config Check:')
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST || 'NOT SET'}`)
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT || 'NOT SET'}`)
    console.log(`SMTP_USER: ${process.env.SMTP_USER || 'NOT SET'}`)
    console.log(`SMTP_PASS: ${process.env.SMTP_PASS ? 'SET' : 'NOT SET'}`)
  }
}

// Run the test
testZohoSMTP()
