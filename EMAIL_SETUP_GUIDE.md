# 📧 CampusKarma Email Setup Guide

## 🌟 Professional Email System Setup

### **Your Domain Setup:**
- **Subdomain**: `campuskarma.burakamal.site`
- **Email**: `noreply@campuskarma.burakamal.site`
- **Purpose**: Professional OTP and notification emails

---

## 🔧 **Implementation Options**

### **Option 1: Resend.com (Recommended for Startups)**
**Why Resend?**
- ✅ **Free tier**: 3,000 emails/month
- ✅ **Easy setup**: 5-minute configuration
- ✅ **High deliverability**: Better than Gmail SMTP
- ✅ **Professional**: Built for developers
- ✅ **Analytics**: Email tracking and statistics

**Setup Steps:**
1. Go to [resend.com](https://resend.com)
2. Sign up with your account
3. Add domain: `campuskarma.burakamal.site`
4. Add these DNS records to your domain:
   ```
   Type: TXT
   Name: campuskarma.burakamal.site
   Value: [Resend will provide this]
   ```
5. Get your API key
6. Update `.env`: `RESEND_API_KEY=your-key-here`
7. Set: `EMAIL_SERVICE=resend`

### **Option 2: Gmail SMTP (Quick Setup)**
**Setup Steps:**
1. Use your existing Gmail account
2. Enable 2-factor authentication
3. Generate app password
4. Update `.env`:
   ```
   EMAIL_SERVICE=smtp
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### **Option 3: SendGrid (Enterprise)**
**For when you scale:**
- 100 emails/day free
- Very reliable
- More complex setup

---

## 🚀 **Immediate Action Plan**

### **Step 1: Update Environment**
```bash
# In your .env file
EMAIL_SERVICE=resend  # or 'smtp' for Gmail
EMAIL_FROM=noreply@campuskarma.burakamal.site
```

### **Step 2: Test Email Service**
```bash
# Test the email system
node -e "import('./utils/emailService.js').then(e => e.default.testEmailService().then(console.log))"
```

### **Step 3: Deploy to Production**
Once working locally:
1. Set up your domain DNS
2. Configure email service
3. Update production environment variables
4. Test with real emails

---

## 📱 **Email Templates Included**

### **OTP Email Features:**
- ✅ **Beautiful HTML design**
- ✅ **Mobile responsive**
- ✅ **Security warnings**
- ✅ **Professional branding**
- ✅ **Institution personalization**

### **Template Preview:**
```
Subject: Your CampusKarma Verification Code: 123456

[Beautiful HTML email with:]
- CampusKarma branding
- Large OTP display
- Security warnings
- Institution name
- Professional footer
```

---

## 🔐 **Security Features**

- **From Address**: `noreply@campuskarma.burakamal.site`
- **Reply Protection**: No-reply address
- **Rate Limiting**: 3 OTPs per hour
- **Expiry**: 10-minute OTP validity
- **Anti-Spoofing**: DKIM/SPF records

---

## 💡 **Next Steps**

1. **Choose email provider** (Resend recommended)
2. **Set up domain DNS records**
3. **Update environment variables**
4. **Test email delivery**
5. **Deploy to production**

**Budget**: $0/month for development, ~$20/month for production (if using paid services)

---

*This setup will make CampusKarma look extremely professional and trustworthy to students!*
