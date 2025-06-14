# 📧 Zoho Mail Setup Guide for CampusKarma

## 🎯 **Goal**: Set up professional email `noreply@campuskarma.burakamal.site`

---

## 📋 **Step-by-Step Setup**

### **Step 1: Sign Up for Zoho Mail Free Plan**
1. Go to: https://www.zoho.com/mail/
2. Click "Sign Up" 
3. Choose "Free Plan" (5 GB storage, 5 users)
4. Enter your domain: `campuskarma.burakamal.site`

### **Step 2: Verify Domain Ownership**
Zoho will ask you to verify domain ownership. You'll need to add DNS records:

#### **Option A: TXT Record (Recommended)**
```
Type: TXT
Name: @ (or campuskarma.burakamal.site)
Value: zoho-verification=zb12345678.zmverify.zoho.com
TTL: 3600
```

#### **Option B: CNAME Record**
```
Type: CNAME
Name: zb12345678
Value: zmverify.zoho.com
TTL: 3600
```

### **Step 3: Configure MX Records**
Add these MX records to your DNS:
```
Priority: 10, Mail Server: mx.zoho.com
Priority: 20, Mail Server: mx2.zoho.com
Priority: 50, Mail Server: mx3.zoho.com
```

### **Step 4: Create Professional Email Accounts**
Create these email accounts in Zoho:
- `noreply@campuskarma.burakamal.site` (Primary for OTP emails)
- `support@campuskarma.burakamal.site` (Customer support)
- `admin@campuskarma.burakamal.site` (Admin notifications)

### **Step 5: Enable SMTP for Applications**
1. Go to Zoho Mail Admin Console
2. Navigate to: Security > App Passwords
3. Generate app-specific password for CampusKarma
4. Note down the credentials

---

## 🔧 **SMTP Configuration for CampusKarma**

### **Zoho SMTP Settings:**
- **SMTP Server**: smtp.zoho.com
- **Port**: 587 (TLS) or 465 (SSL)
- **Security**: STARTTLS or SSL/TLS
- **Authentication**: Required
- **Username**: noreply@campuskarma.burakamal.site
- **Password**: [App-specific password from Zoho]

---

## ⚙️ **Environment Configuration**

Update your `.env` file:
```env
# Email Service Configuration
EMAIL_SERVICE=smtp
EMAIL_FROM=noreply@campuskarma.burakamal.site
EMAIL_FROM_NAME=CampusKarma Team

# Zoho SMTP Configuration
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your-zoho-app-password

# Alternative Email Addresses
EMAIL_SUPPORT=support@campuskarma.burakamal.site
EMAIL_ADMIN=admin@campuskarma.burakamal.site
```

---

## 🧪 **Testing Steps**

1. **Verify DNS propagation** (may take 24-48 hours)
2. **Test SMTP connection** using our test script
3. **Send test OTP email**
4. **Verify email delivery and formatting**

---

## 💰 **Cost Breakdown**
- **Zoho Mail Free Plan**: $0/month (5 users, 5GB each)
- **Domain**: Already owned (`burakamal.site`)
- **Total Monthly Cost**: $0

---

## 🔒 **Security Features**
- ✅ **Professional domain**: Builds trust with students
- ✅ **App passwords**: Secure SMTP authentication
- ✅ **TLS encryption**: Secure email transmission
- ✅ **Anti-spam**: Zoho's built-in protection
- ✅ **DKIM/SPF**: Email authentication (auto-configured)

---

## 📱 **Additional Benefits**
- Professional email addresses for your team
- Email forwarding and aliases
- Mobile app access
- Web interface for email management
- Integration with other Zoho services

---

*This setup will make CampusKarma look extremely professional and trustworthy to college students!*
