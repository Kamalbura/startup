import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Testing Email Delivery...\n');

// Create transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply@campuskarma.burakamal.site',
        pass: 'hQNVbYxNeTR1'
    }
});

// Test emails
async function sendTestEmails() {
    try {
        console.log('📧 Sending test email to burakamal13@gmail.com...');
        
        const result1 = await transporter.sendMail({
            from: 'CampusKarma <noreply@campuskarma.burakamal.site>',
            to: 'burakamal13@gmail.com',
            subject: 'CampusKarma Test - Hi Burak!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h1 style="color: #667eea;">Hi Burak! 👋</h1>
                    <p>This is a test email from CampusKarma to verify our email system is working.</p>
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong>Test Details:</strong><br>
                        • Time: ${new Date().toLocaleString()}<br>
                        • From: noreply@campuskarma.burakamal.site<br>
                        • Service: Zoho Mail SMTP
                    </div>
                    <p>If you received this, our email system is working! 🎉</p>
                    <p style="color: #666; font-size: 14px;">CampusKarma - Building India's Student Skill Economy</p>
                </div>
            `
        });
        
        console.log('✅ Personal email sent! Message ID:', result1.messageId);

        console.log('\n📧 Sending test email to 1602-22-748-011@vce.ac.in...');
        
        const result2 = await transporter.sendMail({
            from: 'CampusKarma <noreply@campuskarma.burakamal.site>',
            to: '1602-22-748-011@vce.ac.in',
            subject: 'CampusKarma Welcome - Hello VCE Student!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                    <h1 style="color: #667eea;">Hello VCE Student! 🎓</h1>
                    <p>Welcome to CampusKarma - your campus skills marketplace!</p>
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong>About CampusKarma:</strong><br>
                        • Trust-first student skill economy platform<br>
                        • Secure .edu email verification<br>
                        • UPI escrow payment system<br>
                        • Karma-based reputation scoring
                    </div>
                    <p>Ready to turn your skills into karma?</p>
                    <p style="color: #666; font-size: 14px;">
                        CampusKarma - Building India's Student Skill Economy<br>
                        Questions? Email: support@campuskarma.burakamal.site
                    </p>
                </div>
            `
        });
        
        console.log('✅ College email sent! Message ID:', result2.messageId);
        
        console.log('\n🎉 Both test emails sent successfully!');
        console.log('📋 Please check:');
        console.log('   1. burakamal13@gmail.com inbox (and spam folder)');
        console.log('   2. 1602-22-748-011@vce.ac.in inbox (and spam folder)');
        console.log('   3. Verify professional email formatting');
        
    } catch (error) {
        console.error('\n❌ Email sending failed:', error.message);
        console.log('\n🔧 Check:');
        console.log('   - Internet connection');
        console.log('   - Zoho Mail credentials');
        console.log('   - SMTP settings');
    }
}

sendTestEmails();
