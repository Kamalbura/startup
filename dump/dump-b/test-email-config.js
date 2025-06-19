const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration test for Zoho Mail
async function testZohoEmailConfig() {
    console.log('🔄 Testing Zoho Mail Configuration...\n');
    
    // Current environment variables
    console.log('📧 Current Email Configuration:');
    console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
    console.log(`SMTP_HOST: ${process.env.SMTP_HOST}`);
    console.log(`SMTP_PORT: ${process.env.SMTP_PORT}`);
    console.log(`SMTP_USER: ${process.env.SMTP_USER}`);
    console.log(`FROM_EMAIL: ${process.env.FROM_EMAIL}\n`);

    // Create transporter
    const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // Test 1: Verify SMTP connection
        console.log('🔍 Test 1: Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');

        // Test 2: Send test email
        console.log('📨 Test 2: Sending test email...');
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME || 'CampusKarma',
                address: process.env.FROM_EMAIL
            },
            to: 'burakamal@example.com', // Replace with your test email
            subject: 'CampusKarma Email Test - Zoho Mail Setup',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">CampusKarma Email Test</h2>
                    <p>This is a test email to verify Zoho Mail integration.</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Configuration Details:</h3>
                        <ul style="color: #6b7280;">
                            <li><strong>Email Service:</strong> ${process.env.EMAIL_SERVICE}</li>
                            <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
                            <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
                            <li><strong>From Email:</strong> ${process.env.FROM_EMAIL}</li>
                            <li><strong>Test Time:</strong> ${new Date().toISOString()}</li>
                        </ul>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">
                        If you received this email, your Zoho Mail setup is working correctly!
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📨 Preview URL: ${nodemailer.getTestMessageUrl(info)}\n`);

        // Test 3: Send OTP-style email
        console.log('🔐 Test 3: Sending OTP-style email...');
        const otpMailOptions = {
            from: {
                name: process.env.FROM_NAME || 'CampusKarma',
                address: process.env.FROM_EMAIL
            },
            to: 'burakamal@example.com', // Replace with your test email
            subject: 'Your CampusKarma Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">CampusKarma</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
                    </div>
                    
                    <div style="padding: 40px 20px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #374151; margin-top: 0;">Verify Your Email Address</h2>
                        <p style="color: #6b7280; line-height: 1.6;">
                            Enter the verification code below to complete your registration:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #f3f4f6; padding: 20px 40px; border-radius: 8px; border: 2px dashed #d1d5db;">
                                <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">123456</span>
                            </div>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                This is an automated message from CampusKarma. Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const otpInfo = await transporter.sendMail(otpMailOptions);
        console.log('✅ OTP-style email sent successfully!');
        console.log(`📧 Message ID: ${otpInfo.messageId}\n`);

        console.log('🎉 All tests completed successfully!');
        console.log('📋 Next Steps:');
        console.log('   1. Check your email inbox (and spam folder)');
        console.log('   2. Verify email delivery and formatting');
        console.log('   3. Test with different email addresses');
        console.log('   4. Monitor email deliverability rates');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        // Provide specific troubleshooting based on error
        if (error.code === 'EAUTH') {
            console.log('\n🔧 Authentication Error - Check:');
            console.log('   - SMTP username and password');
            console.log('   - Two-factor authentication settings');
            console.log('   - App-specific passwords if 2FA is enabled');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🔧 Connection Error - Check:');
            console.log('   - SMTP host and port settings');
            console.log('   - Firewall blocking outgoing connections');
            console.log('   - DNS resolution for SMTP host');
        } else if (error.code === 'EMESSAGE') {
            console.log('\n🔧 Message Error - Check:');
            console.log('   - Email content and formatting');
            console.log('   - From and To email addresses');
            console.log('   - Subject line and message size');
        }
    }
}

// Additional utility function to check DNS records
async function checkDNSRecords(domain = 'campuskarma.burakamal.site') {
    console.log(`\n🔍 Checking DNS Records for ${domain}...`);
    
    const dns = require('dns').promises;
    
    try {
        // Check MX records
        console.log('\n📧 MX Records:');
        const mxRecords = await dns.resolveMx(domain);
        mxRecords.forEach(record => {
            console.log(`   Priority: ${record.priority}, Exchange: ${record.exchange}`);
        });
        
        // Check TXT records (for SPF)
        console.log('\n📝 TXT Records:');
        const txtRecords = await dns.resolveTxt(domain);
        txtRecords.forEach(record => {
            const txtString = record.join('');
            if (txtString.includes('v=spf1')) {
                console.log(`   SPF: ${txtString}`);
            }
        });
        
    } catch (error) {
        console.error(`❌ DNS lookup failed: ${error.message}`);
        console.log('   This is normal if DNS records are not configured yet.');
    }
}

// Main execution
if (require.main === module) {
    console.log('🚀 CampusKarma Email Configuration Test\n');
    
    // Check if required environment variables are set
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.log('\nPlease update your .env file with the required SMTP settings.');
        process.exit(1);
    }
    
    testZohoEmailConfig()
        .then(() => checkDNSRecords())
        .then(() => {
            console.log('\n✅ Email configuration test completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Test failed:', error);
            process.exit(1);
        });
}

module.exports = { testZohoEmailConfig, checkDNSRecords };
