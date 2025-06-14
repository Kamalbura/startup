// OTP Debug Tool - Check current OTPs in database
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import OTP from './models/OTP.js'

dotenv.config()

async function checkOTPs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔍 Checking current OTPs in database...')
    
    const otps = await OTP.find({}).sort({ createdAt: -1 }).limit(5)
    
    if (otps.length === 0) {
      console.log('❌ No OTPs found in database')
    } else {
      console.log('📋 Recent OTPs:')
      otps.forEach((otp, index) => {
        console.log(`${index + 1}. Email: ${otp.email}`)
        console.log(`   OTP: ${otp.otp}`)
        console.log(`   Expires: ${otp.expiresAt}`)
        console.log(`   Verified: ${otp.isVerified}`)
        console.log(`   Attempts: ${otp.attempts}`)
        console.log(`   Institution: ${otp.institution}`)
        console.log(`   Created: ${otp.createdAt}`)
        console.log('   ---')
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

checkOTPs()
