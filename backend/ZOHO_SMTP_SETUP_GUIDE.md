# 🔧 ZOHO MAIL SMTP CONFIGURATION - COMPLETE GUIDE

## 🎯 STEP-BY-STEP ZOHO SMTP SETUP

### **STEP 1: Enable Two-Factor Authentication (Required for App Passwords)**

1. **In Zoho Admin Console** (where you are now):
   - Go to **Security** → **TFA** (Two-Factor Authentication)
   - **Enable TFA** for your admin account
   - Complete the setup with your phone number

### **STEP 2: Create App-Specific Password**

1. **Login to your personal Zoho Mail** (not admin console):
   - Go to https://mail.zoho.com
   - Login with `noreply@campuskarma.burakamal.site`

2. **Navigate to Security Settings**:
   - Click your **profile picture** (top right)
   - Select **Settings**
   - Go to **Security** tab
   - Find **App Passwords** section

3. **Generate App Password**:
   - Click **Generate New Password**
   - Enter name: `CampusKarma SMTP`
   - Click **Generate**
   - **COPY THE 16-CHARACTER PASSWORD** (looks like: `abcd efgh ijkl mnop`)

### **STEP 3: Update .env Configuration**

Replace in your `.env` file:
```
SMTP_PASS=YOUR_16_CHARACTER_APP_PASSWORD_HERE
```

### **STEP 4: Alternative Method - If App Passwords Don't Work**

Some Zoho accounts require **OAuth2** or **Secure Authentication**:

1. **In Zoho Admin Console** (where you are):
   - Go to **Mail Settings** → **Organization Settings**
   - Look for **SMTP Authentication** settings
   - Enable **Allow less secure apps** (if available)

### **STEP 5: Verify Domain and Email Account**

1. **Check Domain Status**:
   - In Admin Console → **Mail Settings** → **Domains**
   - Ensure `campuskarma.burakamal.site` shows as **Verified**

2. **Verify Email Account**:
   - Go to **Users** → **Active Users**
   - Ensure `noreply@campuskarma.burakamal.site` exists and is **Active**

## 🔍 CURRENT ISSUE DIAGNOSIS

Your current `.env` has:
```
SMTP_PASS=pycPX8TSFm7a
```

This looks like a regular password, but Zoho SMTP requires:
- **App-Specific Password** (16 characters with spaces)
- **OR** OAuth2 authentication
- **OR** Less secure app access enabled

## 🚨 IMMEDIATE ACTION REQUIRED

1. **Generate App Password** following Step 2 above
2. **Update .env** with the new 16-character password
3. **Test SMTP connection** with the test script

## 📧 CORRECT .ENV CONFIGURATION

```env
# Email Service Configuration
EMAIL_SERVICE=smtp
EMAIL_FROM=noreply@campuskarma.burakamal.site
EMAIL_FROM_NAME=CampusKarma

# Zoho Mail SMTP - PRODUCTION READY
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=abcd efgh ijkl mnop    # <-- Your 16-character app password here
```

## 🧪 TEST SCRIPT READY

Once you update the password, run:
```bash
node test-zoho-smtp-auth.js
```

---

**NEXT STEP**: Go to https://mail.zoho.com → Login → Settings → Security → App Passwords → Generate New Password
