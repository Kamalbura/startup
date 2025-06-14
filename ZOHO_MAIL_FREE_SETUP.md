# Zoho Mail Free Plan Setup Guide for CampusKarma

This guide will help you set up Zoho Mail Free Plan for your domain `campuskarma.burakamal.site` to get professional email addresses like `noreply@campuskarma.burakamal.site`.

## Prerequisites
- You must own the domain `campuskarma.burakamal.site`
- Access to your domain's DNS settings (where you purchased the domain)
- Admin access to modify DNS records

## Step 1: Sign Up for Zoho Mail Free Plan

1. Go to [Zoho Mail](https://www.zoho.com/mail/)
2. Click on "Sign Up Now" or "Get Started"
3. Choose **"Free Plan"** (supports up to 5 users, 5GB storage per user)
4. Enter your domain: `campuskarma.burakamal.site`
5. Create your Zoho account with a temporary email (you can use your personal email)

## Step 2: Verify Domain Ownership

Zoho will ask you to verify that you own the domain. You'll have several options:

### Option A: HTML File Upload (Recommended)
1. Download the HTML verification file provided by Zoho
2. Upload it to your website's root directory
3. Make it accessible at `http://campuskarma.burakamal.site/zohoverify.html`

### Option B: Meta Tag Verification
1. Add the provided meta tag to your website's homepage `<head>` section
2. Example: `<meta name="zohoverify" content="zoho-verification-code">`

### Option C: DNS TXT Record (Alternative)
1. Go to your domain registrar's DNS management
2. Add a TXT record with the verification code provided by Zoho

## Step 3: Configure DNS Records (MX Records)

After domain verification, you need to add MX records to your DNS:

### MX Records to Add:
```
Priority: 10, Value: mx.zoho.com
Priority: 20, Value: mx2.zoho.com
Priority: 50, Value: mx3.zoho.com
```

### Steps:
1. Log into your domain registrar (where you bought campuskarma.burakamal.site)
2. Find DNS Management or DNS Settings
3. Add the MX records above
4. **Important**: Remove any existing MX records to avoid conflicts
5. Save changes (DNS propagation takes 24-48 hours)

## Step 4: Add SPF Record (Email Authentication)

Add this TXT record to prevent email spoofing:

```
Name: @ (root domain)
Type: TXT
Value: v=spf1 include:zoho.com ~all
```

## Step 5: Add DKIM Record (Optional but Recommended)

1. In Zoho Mail admin panel, go to Email Authentication
2. Generate DKIM key for your domain
3. Add the provided DKIM TXT record to your DNS

## Step 6: Create Email Accounts

Once DNS is configured and propagated:

1. Go to Zoho Mail Admin Console
2. Click "Add User" or "Create User"
3. Create these accounts:
   - `noreply@campuskarma.burakamal.site` (for OTP emails)
   - `support@campuskarma.burakamal.site` (optional, for support)
   - `admin@campuskarma.burakamal.site` (optional, for admin)

## Step 7: Get SMTP Settings

For each email account, get the SMTP settings:

```
SMTP Server: smtp.zoho.com
Port: 587 (TLS) or 465 (SSL)
Username: noreply@campuskarma.burakamal.site
Password: [the password you set for this account]
Security: TLS/STARTTLS (for port 587) or SSL (for port 465)
```

## Step 8: Update Your .env File

Update your backend `.env` file with the Zoho SMTP settings:

```env
# Email Configuration
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@campuskarma.burakamal.site
SMTP_PASS=your_zoho_email_password

# Email Addresses
FROM_EMAIL=noreply@campuskarma.burakamal.site
FROM_NAME=CampusKarma
REPLY_TO_EMAIL=support@campuskarma.burakamal.site
```

## Step 9: Test Email Delivery

1. Run the test script: `node test-zoho.js`
2. Check if emails are being delivered
3. Check spam folders initially

## Step 10: Enable Two-Factor Authentication (Security)

1. Go to Zoho Account Security Settings
2. Enable 2FA for your Zoho account
3. Consider using App Passwords for SMTP if 2FA is enabled

## Troubleshooting

### DNS Propagation Issues
- Use online DNS checker tools
- Wait 24-48 hours for full propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows)

### Email Not Sending
- Check SMTP credentials
- Verify port and security settings
- Check Zoho Mail admin panel for delivery reports
- Ensure no firewall blocking outgoing port 587/465

### Email Going to Spam
- Add SPF and DKIM records
- Send from consistent IP (use same server)
- Avoid spam trigger words in email content
- Build sender reputation gradually

## Free Plan Limitations

- **5 users maximum**
- **5GB storage per user**
- **25MB attachment limit**
- **No IMAP/POP access** (webmail only)
- **Basic features only**

## Cost to Upgrade (Optional)

If you need more features later:
- **Mail Lite**: $1/user/month (IMAP/POP, 10GB storage)
- **Mail Premium**: $2.50/user/month (Advanced features, 50GB storage)

## Next Steps After Setup

1. Test OTP email delivery thoroughly
2. Monitor email deliverability rates
3. Set up email templates for better UX
4. Consider adding DMARC policy for additional security
5. Monitor Zoho Mail admin dashboard regularly

## Support Resources

- [Zoho Mail Help Center](https://help.zoho.com/portal/en/community/mail)
- [DNS Configuration Guide](https://help.zoho.com/portal/en/kb/mail/admin-guide/domain-verification/articles/mx-record-configuration)
- [Email Authentication Setup](https://help.zoho.com/portal/en/kb/mail/admin-guide/email-authentication)

---

## Quick Setup Checklist

- [ ] Sign up for Zoho Mail Free Plan
- [ ] Verify domain ownership
- [ ] Configure MX records
- [ ] Add SPF record
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Create email accounts
- [ ] Update .env file with SMTP settings
- [ ] Test email delivery
- [ ] Enable 2FA for security
- [ ] Monitor and optimize deliverability

Remember: DNS changes can take up to 48 hours to fully propagate worldwide!
