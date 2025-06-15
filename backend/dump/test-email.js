// CampusKarma Email Testing Script
// Test your professional email configuration

import chalk from 'chalk'
import dotenv from 'dotenv'
import { EmailService } from './utils/emailService.js'
import inquirer from 'inquirer'

// Load environment variables
dotenv.config()

const emailService = new EmailService()

console.log(chalk.bold.blue('📧 CampusKarma Email Testing Suite'))
console.log(chalk.gray('Testing your professional email configuration\n'))

async function testEmailService() {
  try {
    // Show current configuration
    console.log(chalk.yellow('📋 Current Email Configuration:'))
    console.log(`Service: ${chalk.green(process.env.EMAIL_SERVICE)}`)
    console.log(`From Email: ${chalk.green(process.env.EMAIL_FROM)}`)
    console.log(`From Name: ${chalk.green(process.env.EMAIL_FROM_NAME)}`)
    console.log(`Domain: ${chalk.green('campuskarma.burakamal.site')}`)
    console.log()

    const { testType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'What would you like to test?',
        choices: [
          { name: '🔐 OTP Email (Authentication)', value: 'otp' },
          { name: '👋 Welcome Email', value: 'welcome' },
          { name: '🎉 Success Email', value: 'success' },
          { name: '📋 All Email Types', value: 'all' }
        ]
      }
    ])

    const { testEmail } = await inquirer.prompt([
      {
        type: 'input',
        name: 'testEmail',
        message: 'Enter test email address:',
        validate: (input) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(input) || 'Please enter a valid email address'
        }
      }
    ])

    console.log(chalk.blue('\n🧪 Running email tests...\n'))

    if (testType === 'otp' || testType === 'all') {
      await testOTPEmail(testEmail)
    }

    if (testType === 'welcome' || testType === 'all') {
      await testWelcomeEmail(testEmail)
    }

    if (testType === 'success' || testType === 'all') {
      await testSuccessEmail(testEmail)
    }

    console.log(chalk.bold.green('\n✅ Email testing complete!'))
    console.log(chalk.yellow('\n💡 Tips:'))
    console.log('• Check your spam/junk folder if emails don\'t arrive')
    console.log('• Verify DNS records are properly configured')
    console.log('• Check email provider dashboard for delivery status')
    
  } catch (error) {
    console.error(chalk.red('❌ Email test failed:'), error.message)
    
    // Provide troubleshooting steps
    console.log(chalk.yellow('\n🔧 Troubleshooting:'))
    console.log('1. Check your API keys in .env file')
    console.log('2. Verify domain is authenticated with your email provider')
    console.log('3. Check DNS records (SPF, DKIM, DMARC)')
    console.log('4. Review email provider logs/dashboard')
  }
}

async function testOTPEmail(email) {
  console.log(chalk.blue('Testing OTP email...'))
  
  try {
    const testOTP = '123456'
    const result = await emailService.sendOTP(email, testOTP, 'Test University')
    
    if (result.success) {
      console.log(chalk.green('✅ OTP email sent successfully'))
      console.log(`   To: ${email}`)
      console.log(`   OTP: ${testOTP}`)
      console.log(`   From: ${process.env.EMAIL_AUTH}`)
    } else {
      console.log(chalk.red('❌ OTP email failed:'), result.error)
    }
  } catch (error) {
    console.log(chalk.red('❌ OTP email error:'), error.message)
  }
  
  console.log()
}

async function testWelcomeEmail(email) {
  console.log(chalk.blue('Testing welcome email...'))
  
  try {
    const welcomeTemplate = {
      to: email,
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      subject: 'Welcome to CampusKarma! 🎉',
      html: generateWelcomeTemplate(email)
    }

    const result = await emailService.sendEmail(welcomeTemplate)
    
    if (result.success) {
      console.log(chalk.green('✅ Welcome email sent successfully'))
      console.log(`   To: ${email}`)
      console.log(`   From: ${process.env.EMAIL_FROM}`)
    } else {
      console.log(chalk.red('❌ Welcome email failed:'), result.error)
    }
  } catch (error) {
    console.log(chalk.red('❌ Welcome email error:'), error.message)
  }
  
  console.log()
}

async function testSuccessEmail(email) {
  console.log(chalk.blue('Testing success notification email...'))
  
  try {
    const successTemplate = {
      to: email,
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_NOREPLY}>`,
      subject: 'Account Verified Successfully ✅',
      html: generateSuccessTemplate(email)
    }

    const result = await emailService.sendEmail(successTemplate)
    
    if (result.success) {
      console.log(chalk.green('✅ Success email sent successfully'))
      console.log(`   To: ${email}`)
      console.log(`   From: ${process.env.EMAIL_NOREPLY}`)
    } else {
      console.log(chalk.red('❌ Success email failed:'), result.error)
    }
  } catch (error) {
    console.log(chalk.red('❌ Success email error:'), error.message)
  }
  
  console.log()
}

function generateWelcomeTemplate(email) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Welcome to CampusKarma</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">CampusKarma</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Turn Your Skills Into Karma</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">Welcome to CampusKarma! 🎉</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hello and welcome to the CampusKarma community!
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            You're now part of a platform where students help students, earn karma, and build lasting connections.
          </p>

          <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <h3 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 18px;">What's next?</h3>
            <ul style="color: #075985; margin: 0; padding-left: 20px;">
              <li>Complete your profile</li>
              <li>Explore available tasks</li>
              <li>Start earning karma by helping others</li>
              <li>Post your own tasks when you need help</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://campuskarma.burakamal.site/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Go to Dashboard →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Need help? Contact us at <a href="mailto:support@campuskarma.burakamal.site" style="color: #667eea;">support@campuskarma.burakamal.site</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateSuccessTemplate(email) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Account Verified - CampusKarma</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Account Verified!</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">You're all set!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Your CampusKarma account has been successfully verified. You now have full access to all platform features.
          </p>

          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 18px;">Your account details:</h3>
            <p style="color: #047857; margin: 0; font-size: 14px;">
              Email: <strong>${email}</strong><br>
              Status: <strong>Verified ✅</strong><br>
              Karma Score: <strong>50 points</strong>
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://campuskarma.burakamal.site/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Start Using CampusKarma →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Questions? We're here to help at <a href="mailto:support@campuskarma.burakamal.site" style="color: #10b981;">support@campuskarma.burakamal.site</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Run the test
testEmailService()
