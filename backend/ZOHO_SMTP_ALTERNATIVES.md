# ZOHO MAIL SMTP - ALTERNATIVE CONFIGURATIONS

## Option 1: Standard Configuration (Try this first)
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your_app_specific_password
```

## Option 2: SSL Configuration (if Option 1 fails)
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your_app_specific_password
```

## Option 3: Regional Server (if in India/Asia)
```
SMTP_HOST=smtp.zoho.in
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your_app_specific_password
```

## Option 4: Enterprise Server (if using Zoho Workplace)
```
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your_app_specific_password
```

## CRITICAL STEPS:

### 1. Generate App-Specific Password:
- Login to Zoho Mail
- Settings → Account Security → App Passwords
- Generate new password for "CampusKarma SMTP"
- Use this 16-character password in SMTP_PASS

### 2. Verify Domain:
- Ensure campuskarma.burakamal.site is verified in Zoho
- Check that noreply@campuskarma.burakamal.site account exists

### 3. Test Authentication:
```bash
cd backend
node test-zoho-auth.js
```

### 4. Common Issues:
- Using regular password instead of app-specific password ❌
- Domain not verified in Zoho ❌  
- Email account doesn't exist ❌
- Wrong SMTP server for your region ❌
- 2FA not enabled (required for app passwords) ❌
