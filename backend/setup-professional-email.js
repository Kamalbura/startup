// CampusKarma Professional Email Setup Script
// This script helps configure your custom domain email service

import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(chalk.bold.blue('🚀 CampusKarma Professional Email Setup'))
console.log(chalk.gray('Setting up campuskarma.burakamal.site email service\n'))

const emailProviders = {
  resend: {
    name: 'Resend (Recommended)',
    description: 'Modern transactional email service with excellent deliverability',
    setup: 'https://resend.com/domains',
    apiKey: 'RESEND_API_KEY',
    features: ['✅ Easy domain verification', '✅ Great deliverability', '✅ Simple API', '✅ Free tier available']
  },
  sendgrid: {
    name: 'SendGrid',
    description: 'Enterprise-grade email delivery service by Twilio',
    setup: 'https://app.sendgrid.com/settings/sender_auth/domain/create',
    apiKey: 'SENDGRID_API_KEY',
    features: ['✅ High volume support', '✅ Advanced analytics', '✅ Established reputation', '✅ Template engine']
  },
  smtp: {
    name: 'Custom SMTP',
    description: 'Use your own SMTP server or provider',
    setup: 'Configure DNS records and SMTP credentials',
    apiKey: 'SMTP credentials',
    features: ['✅ Full control', '✅ Any provider', '✅ Custom configuration', '⚠️ More setup required']
  }
}

const dnsRecords = {
  spf: 'v=spf1 include:_spf.resend.com ~all',
  dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@campuskarma.burakamal.site',
  dkim: 'Will be provided by your email service provider'
}

async function main() {
  try {
    console.log(chalk.yellow('📋 Current Configuration Status:'))
    console.log(`Domain: ${chalk.green('campuskarma.burakamal.site')}`)
    console.log(`Email addresses configured:`)
    console.log(`  • ${chalk.cyan('noreply@campuskarma.burakamal.site')} - System notifications`)
    console.log(`  • ${chalk.cyan('auth@campuskarma.burakamal.site')} - Authentication emails`)
    console.log(`  • ${chalk.cyan('support@campuskarma.burakamal.site')} - Customer support`)
    console.log()

    const { provider } = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Choose your email service provider:',
        choices: Object.keys(emailProviders).map(key => ({
          name: `${emailProviders[key].name} - ${emailProviders[key].description}`,
          value: key
        }))
      }
    ])

    const selectedProvider = emailProviders[provider]
    
    console.log(chalk.bold.green(`\n✨ Great choice! Setting up ${selectedProvider.name}\n`))
    
    // Show features
    console.log(chalk.blue('📦 Features:'))
    selectedProvider.features.forEach(feature => console.log(`  ${feature}`))
    console.log()

    // DNS Setup Instructions
    console.log(chalk.bold.yellow('🌐 DNS Records Setup (Required)'))
    console.log(chalk.gray('Add these DNS records to your domain registrar:\n'))
    
    console.log(chalk.blue('1. SPF Record (TXT):'))
    console.log(chalk.gray('   Name: @ or campuskarma.burakamal.site'))
    console.log(chalk.green(`   Value: ${dnsRecords.spf}\n`))
    
    console.log(chalk.blue('2. DMARC Record (TXT):'))
    console.log(chalk.gray('   Name: _dmarc.campuskarma.burakamal.site'))
    console.log(chalk.green(`   Value: ${dnsRecords.dmarc}\n`))
    
    console.log(chalk.blue('3. DKIM Record:'))
    console.log(chalk.gray('   Will be provided after domain verification\n'))

    // Provider-specific setup
    if (provider === 'resend') {
      await setupResend()
    } else if (provider === 'sendgrid') {
      await setupSendGrid()
    } else if (provider === 'smtp') {
      await setupSMTP()
    }

    // Update environment
    await updateEnvironment(provider)
    
    console.log(chalk.bold.green('\n🎉 Email service setup complete!'))
    console.log(chalk.yellow('\n📝 Next steps:'))
    console.log('1. Add the DNS records to your domain registrar')
    console.log('2. Verify your domain in your email provider dashboard')
    console.log('3. Test email delivery with: npm run test-email')
    console.log('4. Deploy your application to production')
    
  } catch (error) {
    console.error(chalk.red('❌ Setup failed:'), error.message)
    process.exit(1)
  }
}

async function setupResend() {
  console.log(chalk.bold.blue('🔧 Resend Setup Instructions:'))
  console.log('1. Go to https://resend.com/domains')
  console.log('2. Add domain: campuskarma.burakamal.site')
  console.log('3. Follow DNS verification steps')
  console.log('4. Generate API key from https://resend.com/api-keys')
  console.log()
  
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Resend API key (starts with re_):',
      mask: '*',
      validate: (input) => {
        if (!input.startsWith('re_')) {
          return 'Resend API keys start with "re_"'
        }
        return true
      }
    }
  ])
  
  return { RESEND_API_KEY: apiKey }
}

async function setupSendGrid() {
  console.log(chalk.bold.blue('🔧 SendGrid Setup Instructions:'))
  console.log('1. Go to https://app.sendgrid.com/settings/sender_auth/domain/create')
  console.log('2. Add domain: campuskarma.burakamal.site')
  console.log('3. Complete DNS verification')
  console.log('4. Generate API key from Settings > API Keys')
  console.log()
  
  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your SendGrid API key (starts with SG.):',
      mask: '*',
      validate: (input) => {
        if (!input.startsWith('SG.')) {
          return 'SendGrid API keys start with "SG."'
        }
        return true
      }
    }
  ])
  
  return { SENDGRID_API_KEY: apiKey }
}

async function setupSMTP() {
  console.log(chalk.bold.blue('🔧 SMTP Setup Instructions:'))
  console.log('Configure your SMTP provider settings')
  console.log()
  
  const smtpConfig = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'SMTP Host:',
      default: 'smtp.resend.com'
    },
    {
      type: 'input',
      name: 'port',
      message: 'SMTP Port:',
      default: '587'
    },
    {
      type: 'input',
      name: 'user',
      message: 'SMTP Username:'
    },
    {
      type: 'password',
      name: 'pass',
      message: 'SMTP Password:',
      mask: '*'
    }
  ])
  
  return {
    SMTP_HOST: smtpConfig.host,
    SMTP_PORT: smtpConfig.port,
    SMTP_USER: smtpConfig.user,
    SMTP_PASS: smtpConfig.pass
  }
}

async function updateEnvironment(provider) {
  const envPath = path.join(__dirname, '.env')
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Update EMAIL_SERVICE
  envContent = envContent.replace(
    /EMAIL_SERVICE=.*/,
    `EMAIL_SERVICE=${provider}`
  )
  
  fs.writeFileSync(envPath, envContent)
  console.log(chalk.green('✅ Environment updated'))
}

// Helper function to test email configuration
async function testEmailSetup() {
  try {
    const { EmailService } = await import('./utils/emailService.js')
    const emailService = new EmailService()
    
    console.log(chalk.blue('🧪 Testing email configuration...'))
    
    const testResult = await emailService.sendOTP('test@example.com', '123456', 'Test University')
    
    if (testResult.success) {
      console.log(chalk.green('✅ Email service configured correctly!'))
    } else {
      console.log(chalk.red('❌ Email test failed:'), testResult.error)
    }
  } catch (error) {
    console.log(chalk.red('❌ Test failed:'), error.message)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { testEmailSetup }
