// CampusKarma Email Service Test - Production Ready
// Testing emails to Gmail and College email addresses
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const testEmailService = async () => {
  console.log('🚀 CampusKarma Email Service - Production Test')
  console.log('=' .repeat(50))
  console.log('📧 Service Mode:', process.env.EMAIL_SERVICE)
  console.log('📤 From Email:', process.env.EMAIL_FROM)
  console.log('🏠 SMTP Host:', process.env.SMTP_HOST)
  console.log('📡 SMTP Port:', process.env.SMTP_PORT)
  console.log('👤 SMTP User:', process.env.SMTP_USER)
  console.log('=' .repeat(50))

  if (process.env.EMAIL_SERVICE !== 'smtp') {
    console.log('⚠️  EMAIL_SERVICE is not set to "smtp". Current mode:', process.env.EMAIL_SERVICE)
    console.log('💡 To test real email delivery, set EMAIL_SERVICE=smtp in .env')
    return
  }
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: false,
    logger: false
  })

  try {
    // Verify connection
    console.log('🔍 Verifying SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully!')

    // Test 1: Email to Gmail
    console.log('\n📤 Test 1: Sending email to Gmail...')
    const gmailResult = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: 'burakamal13@gmail.com',
      subject: '👋 Hi from CampusKarma - Email Test Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">👋 Hi from CampusKarma!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your email service is working perfectly!</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #4a5568;">🎉 Email Test Results</h2>
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <p><strong>✅ SMTP Connection:</strong> Successful</p>
              <p><strong>📧 From Address:</strong> ${process.env.EMAIL_FROM}</p>
              <p><strong>🏠 SMTP Provider:</strong> Zoho Mail</p>
              <p><strong>⏰ Sent At:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <h3 style="color: #4a5568; margin-top: 30px;">🚀 What's Next?</h3>
            <ul style="color: #718096; line-height: 1.6;">
              <li>Your Zoho Mail SMTP is configured correctly</li>
              <li>Email delivery to Gmail addresses works</li>
              <li>Ready for OTP authentication system</li>
              <li>Ready for production deployment</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #a0aec0; font-size: 14px;">
            <p>This email was sent from CampusKarma backend email service test.</p>
            <p>🎯 Building India's trust-first student skill economy platform</p>
          </div>
        </div>
      `
    })
    
    console.log('✅ Gmail email sent successfully!')
    console.log('📧 Message ID:', gmailResult.messageId)

    // Test 2: Email to College Address
    console.log('\n📤 Test 2: Sending email to College (.edu.in)...')
    const collegeResult = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: '1602-22-748-011@vce.ac.in',
      subject: '🎓 Hello from CampusKarma - College Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎓 Hello from CampusKarma!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Connecting college students across India</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #4a5568;">🎯 About CampusKarma</h2>
            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">India's Trust-First Student Skill Economy Platform</p>
            </div>
            
            <div style="margin: 25px 0;">
              <h3 style="color: #4a5568;">🚀 What We Offer:</h3>
              <ul style="color: #718096; line-height: 1.8;">
                <li><strong>💰 Earn Money:</strong> Get paid for your skills and knowledge</li>
                <li><strong>🤝 Build Trust:</strong> Verified .edu email and karma scoring</li>
                <li><strong>📚 Share Skills:</strong> Tutor, code, design, write - anything you're good at</li>
                <li><strong>🎓 College Focus:</strong> Platform designed specifically for students</li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h4 style="color: #065f46; margin-top: 0;">✅ Email Delivery Test</h4>
              <p style="color: #047857; margin-bottom: 0;">
                If you're reading this, our platform can successfully reach college email addresses! 
                This is crucial for our .edu verification system.
              </p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #a0aec0; font-size: 14px;">
            <p>Test email from CampusKarma development team</p>
            <p>⏰ Sent: ${new Date().toLocaleString()}</p>
            <p>🔗 noreply@campuskarma.burakamal.site</p>
          </div>
        </div>
      `
    })
    
    console.log('✅ College email sent successfully!')
    console.log('📧 Message ID:', collegeResult.messageId)

    // Test 3: OTP-style email
    console.log('\n📤 Test 3: Sending OTP-style authentication email...')
    const testOTP = '123456'
    const otpResult = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: 'burakamal13@gmail.com',
      subject: `Your CampusKarma Verification Code: ${testOTP}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Verify Your Email</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">CampusKarma Login Verification</p>
          </div>
          
          <div style="padding: 30px 0; text-align: center;">
            <h2 style="color: #4a5568;">Your Verification Code</h2>
            <div style="background: #f7fafc; border: 2px dashed #4299e1; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #2d3748; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${testOTP}
              </div>
            </div>
            
            <p style="color: #718096; margin: 20px 0;">
              Enter this code to complete your login to CampusKarma
            </p>
            
            <div style="background: #fff5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #f56565; margin: 25px 0;">
              <p style="color: #c53030; margin: 0; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> This code expires in 10 minutes. 
                Never share this code with anyone.
              </p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #a0aec0; font-size: 14px;">
            <p>CampusKarma Authentication System</p>
            <p>⏰ Sent: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    })
    
    console.log('✅ OTP email sent successfully!')
    console.log('📧 Message ID:', otpResult.messageId)

    // Summary
    console.log('\n🎉 ALL EMAIL TESTS COMPLETED SUCCESSFULLY!')
    console.log('=' .repeat(50))
    console.log('✅ Gmail delivery: Working')
    console.log('✅ College email delivery: Working')  
    console.log('✅ OTP authentication email: Working')
    console.log('✅ Zoho SMTP configuration: Perfect')
    console.log('=' .repeat(50))
    console.log('🚀 READY FOR PRODUCTION DEPLOYMENT!')
    console.log('💡 Your CampusKarma email service is fully operational.')
    
  } catch (error) {
    console.error('\n❌ Email Test Failed:')
    console.error('Error:', error.message)
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error Solutions:')
      console.log('1. Verify app-specific password is correct')
      console.log('2. Check if 2FA is enabled in Zoho')
      console.log('3. Ensure noreply@campuskarma.burakamal.site account exists')
    }
  }
}

testEmailService()
