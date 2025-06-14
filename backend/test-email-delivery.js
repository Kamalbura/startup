import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Comprehensive Email Testing Script for CampusKarma
async function testEmailDelivery() {
    console.log('🚀 CampusKarma Email Delivery Test\n');
    console.log('📧 Testing Zoho Mail SMTP Integration\n');

    // Display configuration
    console.log('⚙️  Current Email Configuration:');
    console.log(`   SERVICE: ${process.env.EMAIL_SERVICE}`);
    console.log(`   SMTP HOST: ${process.env.SMTP_HOST}`);
    console.log(`   SMTP PORT: ${process.env.SMTP_PORT}`);
    console.log(`   SMTP USER: ${process.env.SMTP_USER}`);
    console.log(`   FROM EMAIL: ${process.env.FROM_EMAIL}`);
    console.log(`   SUPPORT EMAIL: ${process.env.SUPPORT_EMAIL}\n`);

    // Check if in console mode
    if (process.env.EMAIL_SERVICE !== 'smtp') {
        console.log('⚠️  EMAIL_SERVICE is set to console mode');
        console.log('   Switching to SMTP for this test...\n');
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        debug: true, // Enable debug output
        logger: true // Log to console
    });

    try {
        // Test 1: Verify SMTP connection
        console.log('🔍 Test 1: Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');

        // Test 2: Send email to personal Gmail
        console.log('📨 Test 2: Sending test email to personal Gmail...');
        const personalEmailResult = await transporter.sendMail({
            from: {
                name: 'CampusKarma',
                address: process.env.FROM_EMAIL
            },
            to: 'burakamal13@gmail.com',
            subject: 'CampusKarma Email Test - Personal Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; overflow: hidden;">
                    <div style="background: white; margin: 20px; border-radius: 10px; padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #667eea; margin: 0; font-size: 32px;">CampusKarma</h1>
                            <p style="color: #666; margin: 10px 0;">Trust-First Student Skill Economy</p>
                        </div>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hi Burak! 👋</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            This is a test email to verify that our Zoho Mail SMTP integration is working correctly 
                            for CampusKarma's email delivery system.
                        </p>
                        
                        <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">Test Details:</h3>
                            <ul style="color: #666; margin: 0;">
                                <li>Email Service: Zoho Mail SMTP</li>
                                <li>From: ${process.env.FROM_EMAIL}</li>
                                <li>Test Time: ${new Date().toLocaleString()}</li>
                                <li>Purpose: Pre-deployment email verification</li>
                            </ul>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            If you're reading this, our email system is working perfectly! 🎉
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 14px; margin: 0;">
                                CampusKarma - Building India's Student Skill Economy<br>
                                <a href="mailto:support@campuskarma.burakamal.site" style="color: #667eea;">support@campuskarma.burakamal.site</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        console.log('✅ Personal email sent successfully!');
        console.log(`   Message ID: ${personalEmailResult.messageId}\n`);

        // Test 3: Send email to college email
        console.log('📨 Test 3: Sending test email to college email...');
        const collegeEmailResult = await transporter.sendMail({
            from: {
                name: 'CampusKarma',
                address: process.env.FROM_EMAIL
            },
            to: '1602-22-748-011@vce.ac.in',
            subject: 'CampusKarma Welcome - College Email Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; overflow: hidden;">
                    <div style="background: white; margin: 20px; border-radius: 10px; padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #667eea; margin: 0; font-size: 32px;">CampusKarma</h1>
                            <p style="color: #666; margin: 10px 0;">Your Campus Skills Marketplace</p>
                        </div>
                        
                        <h2 style="color: #333; margin-bottom: 20px;">Hello VCE Student! 🎓</h2>
                        
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            Welcome to CampusKarma! This is a test email to verify our email delivery 
                            system works with college email addresses.
                        </p>
                        
                        <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #1e40af; margin-top: 0;">🎯 What is CampusKarma?</h3>
                            <p style="color: #666; margin-bottom: 0;">
                                A trust-first platform where VCE students can offer skills, complete projects, 
                                and build verified reputation through peer-to-peer collaboration.
                            </p>
                        </div>
                        
                        <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">✨ Features for VCE Students:</h3>
                            <ul style="color: #666; margin: 0;">
                                <li>🔒 Secure .edu email verification</li>
                                <li>💰 UPI escrow payment system</li>
                                <li>⭐ Karma-based reputation scoring</li>
                                <li>🎓 Campus-specific skill marketplace</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666; margin-bottom: 20px;">Ready to turn your skills into karma?</p>
                            <a href="https://campuskarma.vercel.app" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Join CampusKarma
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 14px; margin: 0;">
                                CampusKarma - Building India's Student Skill Economy<br>
                                Questions? Email us at <a href="mailto:support@campuskarma.burakamal.site" style="color: #667eea;">support@campuskarma.burakamal.site</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        console.log('✅ College email sent successfully!');
        console.log(`   Message ID: ${collegeEmailResult.messageId}\n`);

        // Test 4: Send OTP-style email (to test actual OTP template)
        console.log('📨 Test 4: Sending OTP-style email template test...');
        const otpEmailResult = await transporter.sendMail({
            from: {
                name: 'CampusKarma',
                address: process.env.FROM_EMAIL
            },
            to: 'burakamal13@gmail.com',
            subject: 'Your CampusKarma Verification Code - 123456',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">CampusKarma</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
                    </div>
                    
                    <div style="padding: 40px 20px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #374151; margin-top: 0;">Verify Your Email Address</h2>
                        <p style="color: #6b7280; line-height: 1.6;">
                            Enter the verification code below to complete your CampusKarma registration:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #f3f4f6; padding: 20px 40px; border-radius: 8px; border: 2px dashed #d1d5db;">
                                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">123456</span>
                            </div>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                This is an automated message from CampusKarma. Please do not reply to this email.<br>
                                Need help? Contact us at <a href="mailto:support@campuskarma.burakamal.site" style="color: #667eea;">support@campuskarma.burakamal.site</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        });

        console.log('✅ OTP email template sent successfully!');
        console.log(`   Message ID: ${otpEmailResult.messageId}\n`);

        // Success summary
        console.log('🎉 ALL EMAIL TESTS COMPLETED SUCCESSFULLY!\n');
        console.log('📊 Test Results Summary:');
        console.log(`   ✅ SMTP Connection: Working`);
        console.log(`   ✅ Personal Email (Gmail): Delivered`);
        console.log(`   ✅ College Email (VCE): Delivered`);
        console.log(`   ✅ OTP Template: Working`);
        console.log('\n📧 Next Steps:');
        console.log('   1. Check both email inboxes (and spam folders)');
        console.log('   2. Verify email formatting and branding');
        console.log('   3. Test OTP flow in the application');
        console.log('   4. Deploy to production if all tests pass');

    } catch (error) {
        console.error('\n❌ Email test failed:', error.message);
        
        // Detailed error diagnosis
        console.log('\n🔧 Troubleshooting Guide:');
        
        if (error.code === 'EAUTH') {
            console.log('   📧 Authentication Error:');
            console.log('      - Check SMTP_USER and SMTP_PASS in .env');
            console.log('      - Verify Zoho Mail app password: hQNVbYxNeTR1');
            console.log('      - Ensure 2FA is properly configured');
        } else if (error.code === 'ECONNECTION') {
            console.log('   🌐 Connection Error:');
            console.log('      - Check internet connection');
            console.log('      - Verify SMTP_HOST: smtp.zoho.com');
            console.log('      - Verify SMTP_PORT: 587');
            console.log('      - Check firewall settings');
        } else if (error.code === 'EMESSAGE') {
            console.log('   📝 Message Error:');
            console.log('      - Check email content and formatting');
            console.log('      - Verify recipient email addresses');
            console.log('      - Check FROM_EMAIL configuration');
        } else {
            console.log('   🔍 Unknown Error:');
            console.log(`      - Error Code: ${error.code || 'N/A'}`);
            console.log(`      - Error Details: ${error.message}`);
        }
        
        console.log('\n📋 Quick Fixes:');
        console.log('   1. Verify all environment variables in .env');
        console.log('   2. Check Zoho Mail account status');
        console.log('   3. Test SMTP connection manually');
        console.log('   4. Contact Zoho support if issues persist');
    }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
    testEmailDelivery()
        .then(() => {
            console.log('\n✅ Email testing completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Email testing failed:', error);
            process.exit(1);
        });
}

export default testEmailDelivery;
