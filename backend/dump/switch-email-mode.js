#!/usr/bin/env node
// CampusKarma Email Service Switcher
// Usage: node switch-email-mode.js [console|resend|smtp]

import fs from 'fs'
import path from 'path'

const mode = process.argv[2] || 'console'
const envPath = '.env'

const emailConfigs = {
  console: {
    EMAIL_SERVICE: 'console',
    description: 'Development mode - OTPs logged to console'
  },
  resend: {
    EMAIL_SERVICE: 'resend',
    description: 'Production mode - Real emails via Resend.com'
  },
  smtp: {
    EMAIL_SERVICE: 'smtp', 
    description: 'Production mode - Real emails via Gmail SMTP'
  }
}

function updateEnvFile(newService) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Update EMAIL_SERVICE line
    envContent = envContent.replace(
      /EMAIL_SERVICE=.*/,
      `EMAIL_SERVICE=${newService}`
    )
    
    fs.writeFileSync(envPath, envContent)
    
    console.log('✅ Email service updated successfully!')
    console.log(`📧 Mode: ${newService}`)
    console.log(`📝 Description: ${emailConfigs[newService].description}`)
    
    if (newService === 'resend') {
      console.log('\n🔧 Next steps for Resend:')
      console.log('1. Sign up at resend.com')
      console.log('2. Add domain: campuskarma.burakamal.site')
      console.log('3. Update RESEND_API_KEY in .env')
      console.log('4. Configure DNS records')
    }
    
    if (newService === 'smtp') {
      console.log('\n🔧 Next steps for SMTP:')
      console.log('1. Enable 2FA on Gmail')
      console.log('2. Generate app password')
      console.log('3. Update SMTP_USER and SMTP_PASS in .env')
    }
    
    console.log('\n🚀 Restart the server to apply changes')
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message)
  }
}

if (!emailConfigs[mode]) {
  console.log('❌ Invalid mode. Available modes:')
  Object.entries(emailConfigs).forEach(([key, config]) => {
    console.log(`   ${key}: ${config.description}`)
  })
  process.exit(1)
}

updateEnvFile(mode)
