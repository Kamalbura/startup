// Quick Zoho SMTP Test - Fixed Syntax
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

console.log('🔧 Testing Zoho SMTP Authentication...')
console.log('📧 User:', process.env.SMTP_USER)
console.log('🏠 Host:', process.env.SMTP_HOST)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  debug: true,
  logger: true
})

try {
  console.log('🔍 Verifying SMTP connection...')
  await transporter.verify()
  console.log('✅ SMTP connection verified!')
  
  // Send test emails
  console.log('📤 Sending test email to Gmail...')
  const gmailInfo = await transporter.sendMail({
    from: `"CampusKarma" <${process.env.SMTP_USER}>`,
    to: 'burakamal13@gmail.com',
    subject: '👋 Hi from CampusKarma!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">👋 Hi Burak!</h2>
        <p>This is a test email from CampusKarma using Zoho SMTP.</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>✅ SMTP Working!</h3>
          <p>Your Zoho Mail SMTP configuration is working perfectly!</p>
        </div>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
    `
  })
  
  console.log('✅ Gmail email sent! Message ID:', gmailInfo.messageId)
  
  // Send to college email
  console.log('📤 Sending test email to college...')
  const collegeInfo = await transporter.sendMail({
    from: `"CampusKarma" <${process.env.SMTP_USER}>`,
    to: '1602-22-748-011@vce.ac.in',
    subject: '👋 Hello from CampusKarma!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">👋 Hello from CampusKarma!</h2>
        <p>This is a test email to verify our platform can reach college email addresses.</p>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🎓 About CampusKarma:</h3>
          <p>India's trust-first student skill economy platform for college students.</p>
        </div>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
    `
  })
  
  console.log('✅ College email sent! Message ID:', collegeInfo.messageId)
  console.log('\n🎉 SUCCESS! Both emails sent successfully!')
  
} catch (error) {
  console.error('❌ SMTP Test Failed:', error.message)
  console.error('Error Code:', error.code)
  
  if (error.code === 'EAUTH') {
    console.log('\n🔧 AUTHENTICATION ERROR:')
    console.log('❌ Current password is NOT an app-specific password')
    console.log('✅ You need to generate an app-specific password:')
    console.log('1. Login to https://mail.zoho.com')
    console.log('2. Settings → Security → App Passwords')
    console.log('3. Generate new password for "CampusKarma"')
    console.log('4. Replace pycPX8TSFm7a with the new 16-character password')
  }
}
