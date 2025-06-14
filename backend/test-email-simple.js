import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmailConfig() {
    console.log('🔄 Testing CampusKarma Email Configuration...\n');
    
    // Display current configuration
    console.log('📧 Email Settings:');
    console.log(`SERVICE: ${process.env.EMAIL_SERVICE}`);
    console.log(`FROM: ${process.env.FROM_EMAIL}`);
    console.log(`SMTP HOST: ${process.env.SMTP_HOST}`);
    console.log(`SMTP PORT: ${process.env.SMTP_PORT}`);
    console.log(`SMTP USER: ${process.env.SMTP_USER}\n`);

    if (process.env.EMAIL_SERVICE === 'console') {
        console.log('📋 Currently in CONSOLE mode for development');
        console.log('   Switch to EMAIL_SERVICE=smtp for production\n');
        return;
    }

    // Test SMTP connection
    const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        console.log('🔍 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');

        // Test email send
        console.log('📨 Sending test email...');
        const info = await transporter.sendMail({
            from: {
                name: process.env.FROM_NAME,
                address: process.env.FROM_EMAIL
            },
            to: 'test@example.com', // Replace with your email for testing
            subject: 'CampusKarma Email Test - Production Ready',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #2563eb;">🎓 CampusKarma Email Test</h2>
                    <p>Your email configuration is working perfectly!</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
                        <h3>Configuration:</h3>
                        <ul>
                            <li>From: ${process.env.FROM_EMAIL}</li>
                            <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                            <li>Time: ${new Date().toISOString()}</li>
                        </ul>
                    </div>
                    <p style="color: #6b7280;">
                        Ready for production deployment! 🚀
                    </p>
                </div>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log(`📧 Message ID: ${info.messageId}\n`);
        console.log('🎉 Email configuration is production ready!');

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔧 Fix: Check your Zoho email password in .env file');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🔧 Fix: Check internet connection and SMTP settings');
        }
    }
}

testEmailConfig();
