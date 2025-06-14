import nodemailer from 'nodemailer';

console.log('🔍 Testing SMTP with different authentication methods...\n');

// Test 1: With App Password
console.log('📧 Test 1: Using App Password...');
const transporterApp = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply@campuskarma.burakamal.site',
        pass: 'hQNVbYxNeTR1'
    }
});

// Test 2: Different port (465 with SSL)
console.log('📧 Test 2: Using SSL port 465...');
const transporterSSL = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@campuskarma.burakamal.site',
        pass: 'hQNVbYxNeTR1'
    }
});

async function testConnections() {
    try {
        await transporterApp.verify();
        console.log('✅ App Password + Port 587: SUCCESS');
        return 'app-587';
    } catch (error) {
        console.log('❌ App Password + Port 587: FAILED -', error.message);
    }

    try {
        await transporterSSL.verify();
        console.log('✅ App Password + Port 465: SUCCESS');
        return 'app-465';
    } catch (error) {
        console.log('❌ App Password + Port 465: FAILED -', error.message);
    }

    console.log('\n🔧 All authentication methods failed!');
    console.log('💡 Possible solutions:');
    console.log('   1. Verify the domain is fully set up in Zoho Mail');
    console.log('   2. Check if email account noreply@campuskarma.burakamal.site is created');
    console.log('   3. Verify the app password is correct: hQNVbYxNeTR1');
    console.log('   4. Check if domain DNS records are propagated');
    console.log('   5. Try using the actual account password instead of app password');
    
    return null;
}

testConnections();
