import nodemailer from 'nodemailer';

console.log('🔍 Testing SMTP Connection...\n');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply@campuskarma.burakamal.site',
        pass: 'hQNVbYxNeTR1'
    },
    debug: true,
    logger: true
});

// Test connection
transporter.verify()
    .then(() => {
        console.log('✅ SMTP connection successful!');
        console.log('🚀 Email service is ready for use!');
    })
    .catch((error) => {
        console.error('❌ SMTP connection failed:', error.message);
        console.log('\n🔧 Possible issues:');
        console.log('   - Check internet connection');
        console.log('   - Verify Zoho Mail credentials');
        console.log('   - Check if 2FA requires app password');
        console.log('   - Verify domain setup');
    });
