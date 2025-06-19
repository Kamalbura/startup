// Zoho Mail Authentication Test
// Run this after updating your app-specific password
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const testZohoAuth = async () => {
  console.log('🔧 Testing Zoho Mail SMTP Authentication...')
  console.log('📧 User:', process.env.SMTP_USER)
  console.log('🏠 Host:', process.env.SMTP_HOST)
  console.log('📡 Port:', process.env.SMTP_PORT)
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug logging
    logger: true // Enable logging
  })

  try {
    // Test connection and authentication
    console.log('🔍 Verifying SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully!')
    
    // Test sending email
    console.log('📤 Sending test email...')
    const info = await transporter.sendMail({
      from: `"CampusKarma" <${process.env.SMTP_USER}>`,
      to: 'burakamal13@gmail.com',
      subject: '✅ Zoho SMTP Test - Authentication Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🎉 Zoho Mail SMTP Working!</h2>
          <p>Congratulations! Your Zoho Mail SMTP configuration is working perfectly.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Authentication Details:</h3>
            <ul>
              <li><strong>Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
              <li><strong>User:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>Secure:</strong> ${process.env.SMTP_SECURE}</li>
            </ul>
          </div>
          <p>You can now switch EMAIL_SERVICE to 'smtp' in your .env file.</p>
          <hr>
          <p style="color: #6b7280; font-size: 14px;">
            This email was sent from CampusKarma backend to test SMTP configuration.
            <br>Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })
    
    console.log('✅ Test email sent successfully!')
    console.log('📧 Message ID:', info.messageId)
    console.log('📨 Response:', info.response)
    
    // Test to college email
    console.log('📤 Sending test to college email...')
    const collegeInfo = await transporter.sendMail({
      from: `"CampusKarma" <${process.env.SMTP_USER}>`,
      to: '1602-22-748-011@vce.ac.in',
      subject: '🎓 CampusKarma College Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">🎓 Hello from CampusKarma!</h2>
          <p>This is a test email to verify our platform can reach college email addresses.</p>
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📚 About CampusKarma:</h3>
            <p>India's trust-first student skill economy platform where college students can earn, collaborate, and build verified reputation through peer-to-peer gig marketplace.</p>
          </div>
          <p>If you received this email, our system is working correctly!</p>
          <hr>
          <p style="color: #6b7280; font-size: 14px;">
            Test email from CampusKarma development team.
            <br>Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })
    
    console.log('✅ College email sent successfully!')
    console.log('📧 College Message ID:', collegeInfo.messageId)
    
    console.log('\n🎉 ALL TESTS PASSED! Your Zoho Mail is configured correctly.')
    console.log('💡 Next step: Change EMAIL_SERVICE=smtp in your .env file')
    
  } catch (error) {
    console.error('❌ Zoho SMTP Test Failed:')
    console.error('Error Code:', error.code)
    console.error('Error Message:', error.message)
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.log('\n🔧 AUTHENTICATION ERROR - Try these solutions:')
      console.log('1. Generate app-specific password in Zoho Settings')
      console.log('2. Enable 2-factor authentication first')
      console.log('3. Use app password, not regular password')
      console.log('4. Verify domain in Zoho admin console')
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 CONNECTION ERROR - Try these solutions:')
      console.log('1. Check your internet connection')
      console.log('2. Try alternative SMTP settings in ZOHO_SMTP_ALTERNATIVES.md')
      console.log('3. Check if port 587 is blocked by firewall')
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n🔧 TIMEOUT ERROR - Try these solutions:')
      console.log('1. Use smtp.zoho.in instead of smtp.zoho.com')
      console.log('2. Try port 465 with SMTP_SECURE=true')
      console.log('3. Check your network firewall settings')
    }
  }
}

testZohoAuth()
