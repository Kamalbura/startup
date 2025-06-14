# 📋 Zoho Mail Setup Checklist for CampusKarma

Use this checklist to track your progress setting up Zoho Mail for `campuskarma.burakamal.site`.

## Pre-Setup Requirements
- [ ] Domain `campuskarma.burakamal.site` is owned and accessible
- [ ] Access to domain registrar's DNS management panel
- [ ] Personal email address for Zoho account creation

## Phase 1: Zoho Mail Account Setup
- [ ] Sign up for Zoho Mail Free Plan
- [ ] Enter domain: `campuskarma.burakamal.site`
- [ ] Create Zoho account with temporary email
- [ ] Confirm email and complete account setup

## Phase 2: Domain Verification
- [ ] Choose verification method (HTML file recommended)
- [ ] Download verification file from Zoho
- [ ] Upload to website root or add meta tag
- [ ] Complete domain verification in Zoho admin panel

## Phase 3: DNS Configuration
- [ ] Access domain registrar DNS settings
- [ ] **Remove existing MX records** (important!)
- [ ] Add Zoho MX records:
  - [ ] Priority 10: `mx.zoho.com`
  - [ ] Priority 20: `mx2.zoho.com`
  - [ ] Priority 50: `mx3.zoho.com`
- [ ] Add SPF TXT record: `v=spf1 include:zoho.com ~all`
- [ ] Save DNS changes

## Phase 4: Wait for DNS Propagation
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Test DNS using: `nslookup -type=mx campuskarma.burakamal.site`
- [ ] Verify MX records are active
- [ ] Check SPF record propagation

## Phase 5: Email Account Creation
- [ ] Access Zoho Mail Admin Console
- [ ] Create email accounts:
  - [ ] `noreply@campuskarma.burakamal.site` (main OTP account)
  - [ ] `support@campuskarma.burakamal.site` (optional)
  - [ ] `admin@campuskarma.burakamal.site` (optional)
- [ ] Set strong passwords for each account
- [ ] Note down SMTP settings for each account

## Phase 6: SMTP Configuration
- [ ] Get SMTP settings from Zoho:
  - [ ] SMTP Server: `smtp.zoho.com`
  - [ ] Port: `587` (TLS) or `465` (SSL)
  - [ ] Username: `noreply@campuskarma.burakamal.site`
  - [ ] Password: (account password)
- [ ] Update backend `.env` file with SMTP settings
- [ ] Set `EMAIL_SERVICE=smtp` in environment

## Phase 7: Security Setup
- [ ] Enable Two-Factor Authentication on Zoho account
- [ ] Generate app-specific password if needed for SMTP
- [ ] Set up DKIM authentication (optional but recommended)
- [ ] Configure DMARC policy (advanced, optional)

## Phase 8: Testing & Validation
- [ ] Run email configuration test: `node test-email-config.js`
- [ ] Verify SMTP connection works
- [ ] Send test emails to personal accounts
- [ ] Check email delivery (inbox, not spam)
- [ ] Test OTP email formatting and delivery
- [ ] Verify emails arrive quickly (< 1 minute)

## Phase 9: Production Integration
- [ ] Update production environment variables
- [ ] Test OTP flow with real student emails
- [ ] Monitor email deliverability rates
- [ ] Check spam folder placement
- [ ] Set up email analytics/monitoring

## Phase 10: Optimization & Monitoring
- [ ] Build sender reputation gradually
- [ ] Monitor bounce rates and delivery reports
- [ ] Optimize email content to avoid spam filters
- [ ] Set up alerts for email delivery issues
- [ ] Document email performance metrics

---

## 🚨 Troubleshooting Checklist

If emails are not working:

### SMTP Connection Issues
- [ ] Verify SMTP host, port, and credentials
- [ ] Check if firewall blocks outgoing SMTP ports
- [ ] Confirm 2FA and app passwords if enabled
- [ ] Test with different SMTP ports (587 vs 465)

### DNS/Delivery Issues
- [ ] Verify MX records are properly configured
- [ ] Check SPF record syntax and propagation
- [ ] Ensure no conflicting MX records exist
- [ ] Wait longer for DNS propagation

### Email Going to Spam
- [ ] Add DKIM authentication
- [ ] Improve email content (avoid spam words)
- [ ] Build sender reputation slowly
- [ ] Ask recipients to whitelist the domain

### Free Plan Limitations
- [ ] Confirm under 5 email accounts
- [ ] Check storage usage per account
- [ ] Verify attachment sizes < 25MB
- [ ] Consider upgrade if limits exceeded

---

## 📞 Support Resources

- **Zoho Mail Help**: https://help.zoho.com/portal/en/community/mail
- **DNS Configuration**: https://help.zoho.com/portal/en/kb/mail/admin-guide/domain-verification
- **Email Authentication**: https://help.zoho.com/portal/en/kb/mail/admin-guide/email-authentication

---

## ✅ Completion Criteria

Setup is complete when:
- [ ] All DNS records are configured and propagated
- [ ] Email accounts are created and accessible
- [ ] SMTP authentication works in backend tests
- [ ] OTP emails deliver successfully to student inboxes
- [ ] Email deliverability is > 95%
- [ ] Professional branding is consistent

**Estimated Setup Time**: 2-4 hours (plus 24-48 hours for DNS propagation)

---

*Last Updated: Sprint 9 - Documentation Phase Complete*
