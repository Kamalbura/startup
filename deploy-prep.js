#!/usr/bin/env node

// CampusKarma Deployment Automation Script
// Purpose: Automate deployment preparation and validation

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath)
  log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`, exists ? 'green' : 'red')
  return exists
}

function checkEnvVariable(varName, description) {
  const value = process.env[varName]
  const exists = !!value && value !== 'your_value_here' && value !== 'your-value-here'
  log(`${exists ? '✅' : '❌'} ${description}: ${varName}`, exists ? 'green' : 'yellow')
  return exists
}

async function runCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue')
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    log(`✅ ${description} completed`, 'green')
    return { success: true, output }
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red')
    return { success: false, error: error.message }
  }
}

async function preDeploymentChecks() {
  log('\n🚀 CampusKarma Pre-Deployment Checks', 'cyan')
  log('=====================================', 'cyan')
  
  let allChecksPass = true

  // Check required files
  log('\n📁 File Structure Check:', 'yellow')
  const requiredFiles = [
    ['vercel.json', 'Root Vercel configuration'],
    ['frontend/vercel.json', 'Frontend Vercel configuration'],
    ['backend/api/index.js', 'Serverless API entry point'],
    ['.env.production', 'Production environment template'],
    ['frontend/.env.production', 'Frontend production environment'],
    ['backend/package.json', 'Backend package.json'],
    ['frontend/package.json', 'Frontend package.json']
  ]

  for (const [file, desc] of requiredFiles) {
    if (!checkFile(path.join(__dirname, file), desc)) {
      allChecksPass = false
    }
  }

  // Check environment variables (if .env.production exists)
  log('\n🔐 Environment Variables Check:', 'yellow')
  const envFile = path.join(__dirname, '.env.production')
  if (fs.existsSync(envFile)) {
    // Load production env for checking
    const envContent = fs.readFileSync(envFile, 'utf8')
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim()
      }
    })

    const requiredEnvVars = [
      ['MONGODB_URI', 'MongoDB Atlas connection string'],
      ['JWT_SECRET', 'JWT secret key'],
      ['EMAIL_SERVICE', 'Email service configuration'],
      ['SMTP_HOST', 'SMTP host'],
      ['SMTP_USER', 'SMTP username'],
      ['SMTP_PASS', 'SMTP password']
    ]

    for (const [varName, desc] of requiredEnvVars) {
      const value = envVars[varName]
      const isValid = value && value !== 'your_value_here' && value !== 'your-value-here'
      log(`${isValid ? '✅' : '❌'} ${desc}: ${varName}`, isValid ? 'green' : 'yellow')
      if (!isValid) allChecksPass = false
    }
  } else {
    log('❌ .env.production file not found', 'red')
    allChecksPass = false
  }

  return allChecksPass
}

async function buildAndTest() {
  log('\n🔨 Build and Test Phase:', 'yellow')
  
  // Test backend build
  const backendTest = await runCommand(
    'cd backend && npm install --production=false',
    'Installing backend dependencies'
  )
  
  if (!backendTest.success) return false

  // Test frontend build
  const frontendInstall = await runCommand(
    'cd frontend && npm install',
    'Installing frontend dependencies'
  )
  
  if (!frontendInstall.success) return false

  const frontendBuild = await runCommand(
    'cd frontend && npm run build',
    'Building frontend for production'
  )
  
  if (!frontendBuild.success) return false

  return true
}

async function generateDeploymentSummary() {
  log('\n📋 Deployment Summary:', 'cyan')
  log('====================', 'cyan')
  
  const summary = {
    timestamp: new Date().toISOString(),
    backend: {
      entryPoint: 'backend/api/index.js',
      framework: 'Node.js + Express',
      runtime: '@vercel/node'
    },
    frontend: {
      framework: 'React + Vite',
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    },
    database: 'MongoDB Atlas',
    email: 'Zoho Mail SMTP',
    deployment: 'Vercel Serverless'
  }

  // Save summary to file
  fs.writeFileSync(
    path.join(__dirname, 'deployment-summary.json'),
    JSON.stringify(summary, null, 2)
  )

  log('\n📊 Deployment Configuration:', 'green')
  log(`• Backend: ${summary.backend.framework}`, 'green')
  log(`• Frontend: ${summary.frontend.framework}`, 'green')
  log(`• Database: ${summary.database}`, 'green')
  log(`• Email: ${summary.email}`, 'green')
  log(`• Platform: ${summary.deployment}`, 'green')
  
  return summary
}

async function main() {
  try {
    log('🎯 CampusKarma Deployment Preparation', 'bright')
    log('====================================\n', 'bright')

    // Run pre-deployment checks
    const checksPass = await preDeploymentChecks()
    
    if (!checksPass) {
      log('\n❌ Pre-deployment checks failed. Please fix the issues above.', 'red')
      log('📖 See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions.', 'yellow')
      process.exit(1)
    }

    // Build and test
    const buildSuccess = await buildAndTest()
    
    if (!buildSuccess) {
      log('\n❌ Build and test phase failed.', 'red')
      process.exit(1)
    }

    // Generate deployment summary
    await generateDeploymentSummary()

    log('\n🎉 Deployment preparation completed successfully!', 'green')
    log('\n📋 Next Steps:', 'cyan')
    log('1. Install Vercel CLI: npm install -g vercel', 'blue')
    log('2. Login to Vercel: vercel login', 'blue')
    log('3. Deploy backend: vercel --prod', 'blue')
    log('4. Deploy frontend: cd frontend && vercel --prod', 'blue')
    log('5. Configure environment variables in Vercel dashboard', 'blue')
    log('6. Test deployed endpoints', 'blue')
    
    log('\n📖 For detailed instructions, see:', 'yellow')
    log('• VERCEL_DEPLOYMENT_GUIDE.md', 'yellow')
    log('• ZOHO_MAIL_FREE_SETUP.md (for email)', 'yellow')

  } catch (error) {
    log(`\n💥 Deployment preparation failed: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Run the script
main()
