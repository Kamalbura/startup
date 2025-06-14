// Quick Zoho Admin Email Test
// Test with your admin email first to verify SMTP works
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const quickTest = async () => {
  console.log('🔧 Quick Zoho SMTP Test with Admin Email...')
  
  // Check if credentials are set
  if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('YOUR_ADMIN_EMAIL')) {
    console.log('❌ Please update SMTP_USER in .env with your admin email')
    console.log('Example: SMTP_USER=youremail@zoho.com')
    return
  }
  
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS.includes('YOUR_APP_SPECIFIC')) {
    console.log('❌ Please update SMTP_PASS in .env with your app-specific password')
    console.log('Get it from: Zoho Mail → Settings → Security → App Passwords')
    return
  }
  
  console.log('📧 Testing with:', process.env.SMTP_USER)
  
  const transporter = nodemailer.createTransporter({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    // Test authentication
    console.log('🔍 Testing authentication...')
    await transporter.verify()
    console.log('✅ Authentication successful!')
    
    // Send test emails
    console.log('📤 Sending test emails...')
    
    const testEmails = [
      {
        to: 'burakamal13@gmail.com',
        subject: '✅ Zoho SMTP Working - Gmail Test',
        name: 'Gmail Test'
      },
      {
        to: '1602-22-748-011@vce.ac.in',
        subject: '🎓 Zoho SMTP Working - College Test',
        name: 'College Email Test'
      }
    ]
    
    for (const email of testEmails) {
      try {
        const info = await transporter.sendMail({
          from: `"CampusKarma Test" <${process.env.SMTP_USER}>`,
          to: email.to,
          subject: email.subject,
          html: `
            <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #10b981;">🎉 Zoho SMTP Test Successful!</h2>
              <p>Hello! This is a test email from CampusKarma.</p>
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>✅ What this means:</strong></p>
                <ul>
                  <li>Your Zoho Mail SMTP is configured correctly</li>
                  <li>CampusKarma can send emails to ${email.to.includes('gmail') ? 'Gmail accounts' : 'college email addresses'}</li>
                  <li>OTP delivery will work in production</li>
                </ul>
              </div>
              <p>🚀 Ready for deployment!</p>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 14px;">
                Sent from CampusKarma backend at ${new Date().toLocaleString()}
              </p>
            </div>
          `
        })
        console.log(`✅ ${email.name} sent successfully! Message ID: ${info.messageId}`)
      } catch (err) {
        console.error(`❌ Failed to send ${email.name}:`, err.message)
      }
    }
    
    console.log('\n🎯 NEXT STEPS:')
    console.log('1. Check your email inboxes for the test messages')
    console.log('2. If emails arrived, change EMAIL_SERVICE=smtp in .env')
    console.log('3. Create noreply@campuskarma.burakamal.site user in Zoho Admin')
    console.log('4. Switch SMTP_USER to noreply email for production')
    
  } catch (error) {
    console.error('❌ SMTP Test Failed:', error.message)
    
    if (error.responseCode === 535) {
      console.log('\n🔧 AUTHENTICATION ERROR - Solutions:')
      console.log('1. Make sure you\'re using an APP-SPECIFIC password, not your regular password')
      console.log('2. Generate it from: Zoho Mail → Settings → Security → App Passwords')
      console.log('3. Copy the 16-character password exactly')
    }
  }
}

quickTest()
