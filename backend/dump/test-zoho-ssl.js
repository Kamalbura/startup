// Alternative Zoho SMTP Test - SSL Configuration
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const testZohoAlternative = async () => {
  console.log('🔧 Testing Alternative Zoho SMTP (SSL Port 465)...')
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true
  })

  try {
    console.log('🔍 Verifying SSL SMTP connection...')
    await transporter.verify()
    console.log('✅ SSL SMTP connection verified!')
    
    // Send test emails
    console.log('📤 Sending test emails...')
    
    // Test 1: Gmail
    const gmailInfo = await transporter.sendMail({
      from: `"CampusKarma" <${process.env.SMTP_USER}>`,
      to: 'burakamal13@gmail.com',
      subject: '👋 Hi from CampusKarma!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">👋 Hi Burak!</h2>
          <p>This is a test email from CampusKarma using Zoho SMTP (SSL configuration).</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ SMTP Details:</h3>
            <ul>
              <li><strong>Host:</strong> smtp.zoho.com</li>
              <li><strong>Port:</strong> 465 (SSL)</li>
              <li><strong>User:</strong> ${process.env.SMTP_USER}</li>
            </ul>
          </div>
          <p>If you received this, our Zoho SMTP is working perfectly! 🎉</p>
          <hr>
          <p style="color: #6b7280; font-size: 14px;">
            Sent from CampusKarma platform | ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })
    
    console.log('✅ Gmail test email sent!')
    console.log('📧 Message ID:', gmailInfo.messageId)
    
    // Test 2: College Email
    const collegeInfo = await transporter.sendMail({
      from: `"CampusKarma" <${process.env.SMTP_USER}>`,
      to: '1602-22-748-011@vce.ac.in',
      subject: '👋 Hello from CampusKarma Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">👋 Hello from CampusKarma!</h2>
          <p>This is a test email to verify our platform can reach college email addresses.</p>
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🎓 About CampusKarma:</h3>
            <p>India's trust-first student skill economy platform where college students can earn, collaborate, and build verified reputation through peer-to-peer gig marketplace.</p>
            <ul>
              <li>📚 Skill-based gig marketplace for students</li>
              <li>🏆 Verified reputation system</li>
              <li>💰 Secure escrow payments</li>
              <li>🎯 Campus-focused community</li>
            </ul>
          </div>
          <p>If you received this email, our email delivery system is working correctly!</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>🚀 Coming Soon:</strong> CampusKarma will launch at your college soon. Get ready to earn through your skills!</p>
          </div>
          <hr>
          <p style="color: #6b7280; font-size: 14px;">
            Test email from CampusKarma development team<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })
    
    console.log('✅ College email sent!')
    console.log('📧 College Message ID:', collegeInfo.messageId)
    
    console.log('\n🎉 SUCCESS! Both emails sent successfully!')
    console.log('💡 Zoho SMTP is working with SSL configuration')
    console.log('📧 Check both email addresses for delivery confirmation')
    
  } catch (error) {
    console.error('❌ Alternative SMTP Test Failed:', error.message)
    console.error('Error Code:', error.code)
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 STILL AUTHENTICATION ERROR:')
      console.log('1. The password is still not correct')
      console.log('2. You MUST use App-Specific Password (not regular password)')
      console.log('3. Enable 2FA first, then generate app password')
      console.log('4. Login to Zoho Mail → Settings → Security → App Passwords')
    }
  }
}

testZohoAlternative()
