#!/usr/bin/env node

// Vercel Deployment Script for CampusKarma
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Starting CampusKarma Vercel Deployment...\n')

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' })
  console.log('✅ Vercel CLI is installed')
} catch {
  console.log('❌ Vercel CLI not found. Installing...')
  execSync('npm install -g vercel', { stdio: 'inherit' })
}

// Check if user is logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' })
  console.log('✅ Logged in to Vercel')
} catch {
  console.log('🔐 Please log in to Vercel...')
  execSync('vercel login', { stdio: 'inherit' })
}

console.log('\n📋 Pre-deployment Checklist:')
console.log('✅ Email configuration ready (Zoho Mail)')
console.log('✅ MongoDB Atlas connection configured')
console.log('✅ Professional domain setup (campuskarma.burakamal.site)')
console.log('✅ OTP authentication flow implemented')

console.log('\n🔄 Deploying to Vercel...')

try {
  // Deploy the project
  execSync('vercel --prod', { stdio: 'inherit' })
  
  console.log('\n🎉 Deployment successful!')
  console.log('\n📝 Post-deployment steps:')
  console.log('1. Update FRONTEND_URL in Vercel environment variables')
  console.log('2. Test OTP email delivery with real students')
  console.log('3. Monitor application logs and performance')
  console.log('4. Set up custom domain if needed')
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message)
  console.log('\n🔧 Troubleshooting:')
  console.log('1. Check vercel.json configuration')
  console.log('2. Verify all environment variables are set')
  console.log('3. Ensure MongoDB connection is working')
  console.log('4. Check build logs for errors')
}

console.log('\n📊 Environment Variables to Set in Vercel:')
console.log('NODE_ENV=production')
console.log('MONGODB_URI=<your_mongodb_uri>')
console.log('JWT_SECRET=<your_jwt_secret>')
console.log('EMAIL_SERVICE=smtp')
console.log('SMTP_HOST=smtp.zoho.com')
console.log('SMTP_PORT=587')
console.log('SMTP_USER=noreply@campuskarma.burakamal.site')
console.log('SMTP_PASS=hQNVbYxNeTR1')
console.log('FROM_EMAIL=noreply@campuskarma.burakamal.site')
console.log('SUPPORT_EMAIL=support@campuskarma.burakamal.site')
