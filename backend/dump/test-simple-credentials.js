// Simple Email Test - Help diagnose the issue
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

console.log('🔧 Current .env Configuration:')
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE)
console.log('SMTP_HOST:', process.env.SMTP_HOST)
console.log('SMTP_PORT:', process.env.SMTP_PORT)
console.log('SMTP_USER:', process.env.SMTP_USER)
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***hidden***' : 'NOT SET')

console.log('\n🎯 Since you mentioned noreply email is working manually,')
console.log('we need to find the correct credentials.')
console.log('\n🔑 Can you please:')
console.log('1. Login to Zoho Mail with: noreply@campuskarma.burakamal.site')
console.log('2. Go to Settings → Security → App Passwords')
console.log('3. Generate new password for "CampusKarma SMTP"')
console.log('4. Copy the 16-character password')
console.log('5. Tell me the password so I can update .env')

console.log('\n🧪 Alternative: If you have the working credentials,')
console.log('tell me and I\'ll update the .env file immediately.')

// Test with current credentials anyway
const testQuick = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })

  try {
    await transporter.verify()
    console.log('✅ Current credentials work!')
  } catch (error) {
    console.log('❌ Current credentials failed:', error.message)
  }
}

testQuick()
