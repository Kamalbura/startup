import dotenv from 'dotenv';
dotenv.config();

console.log('🔄 Testing CampusKarma Email Configuration...\n');

// Display current configuration
console.log('📧 Email Settings:');
console.log(`SERVICE: ${process.env.EMAIL_SERVICE}`);
console.log(`FROM: ${process.env.FROM_EMAIL}`);
console.log(`SMTP HOST: ${process.env.SMTP_HOST}`);
console.log(`SMTP PORT: ${process.env.SMTP_PORT}`);
console.log(`SMTP USER: ${process.env.SMTP_USER}`);
console.log(`SUPPORT EMAIL: ${process.env.SUPPORT_EMAIL}\n`);

if (process.env.EMAIL_SERVICE === 'console') {
    console.log('📋 Currently in CONSOLE mode for development');
    console.log('   Switch to EMAIL_SERVICE=smtp for production');
    console.log('   Update SMTP_PASS with your Zoho email password\n');
    console.log('✅ Configuration looks good for development!');
    console.log('🚀 Ready to switch to production SMTP when needed!');
} else if (process.env.EMAIL_SERVICE === 'smtp') {
    console.log('🔧 SMTP mode detected - Production configuration');
    if (process.env.SMTP_PASS === 'your-zoho-email-password') {
        console.log('⚠️  Please update SMTP_PASS with your actual Zoho password');
    } else {
        console.log('✅ SMTP credentials configured');
    }
    console.log('🚀 Ready for production email delivery!');
}

console.log('\n📋 Professional Email Addresses Configured:');
console.log(`   📧 No-Reply: ${process.env.NOREPLY_EMAIL}`);
console.log(`   🎧 Support: ${process.env.SUPPORT_EMAIL}`);

console.log('\n🔄 Next Steps for Production:');
console.log('   1. Update SMTP_PASS in .env with your Zoho password');
console.log('   2. Set EMAIL_SERVICE=smtp for production');
console.log('   3. Deploy to Vercel');
console.log('   4. Test OTP emails with real students');
