# 🌐 CampusKarma Professional Domain Setup

## 📧 **Email Addresses Configured:**
- **Primary**: `noreply@campuskarma.burakamal.site` (OTP & notifications)
- **Authentication**: `auth@campuskarma.burakamal.site` (auth-related emails)
- **Support**: `support@campuskarma.burakamal.site` (user support)

---

## 🔧 **Domain Setup Steps**

### **Step 1: DNS Configuration**
Add these DNS records to your `burakamal.site` domain:

```dns
# Subdomain for CampusKarma
Type: CNAME
Name: campuskarma
Value: your-hosting-provider.com
TTL: 3600

# Email verification (when using Resend/SendGrid)
Type: TXT
Name: campuskarma
Value: [Email provider will give you this]
TTL: 3600

# SPF Record (Email Security)
Type: TXT
Name: campuskarma
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600

# DKIM Record (Email Authentication)
Type: TXT
Name: resend._domainkey.campuskarma
Value: [Resend will provide this]
TTL: 3600
```

### **Step 2: Email Service Setup (Resend Recommended)**

#### **Option A: Resend.com Setup**
1. **Go to**: [resend.com](https://resend.com)
2. **Sign up** with your account
3. **Add Domain**: `campuskarma.burakamal.site`
4. **Copy DNS records** provided by Resend
5. **Add DNS records** to your domain
6. **Verify domain** in Resend dashboard
7. **Get API key** from Resend
8. **Update .env**:
   ```bash
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_api_key_here
   ```

#### **Option B: Gmail SMTP (Quick Start)**
1. **Use Gmail** with app password
2. **Update .env**:
   ```bash
   EMAIL_SERVICE=smtp
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-app-password
   ```

---

## 🚀 **Production Deployment Plan**

### **Phase 1: Domain Setup**
- [ ] Configure DNS records
- [ ] Set up email service (Resend)
- [ ] Verify email delivery

### **Phase 2: Frontend Deployment**
- [ ] Deploy to Vercel/Netlify
- [ ] Point `campuskarma.burakamal.site` to deployment
- [ ] Update environment variables

### **Phase 3: Backend Deployment**
- [ ] Deploy to Railway/Heroku
- [ ] Configure production MongoDB
- [ ] Set up email service in production

---

## 📊 **Professional Benefits**

### **Trust & Credibility:**
- ✅ **Custom Domain**: Looks professional vs localhost
- ✅ **Branded Emails**: No-reply from your domain
- ✅ **SSL Certificate**: Secure HTTPS connection
- ✅ **Professional Footer**: Contact information & branding

### **Email Deliverability:**
- ✅ **SPF/DKIM Records**: Better email delivery
- ✅ **No-Reply Address**: Prevents spam replies
- ✅ **Proper Headers**: Professional email structure
- ✅ **Unsubscribe Links**: Email compliance

### **User Experience:**
- ✅ **Consistent Branding**: Same domain throughout
- ✅ **Clear Contact**: Support email for help
- ✅ **Mobile Responsive**: Beautiful on all devices
- ✅ **Fast Loading**: Optimized email templates

---

## 🧪 **Testing Guide**

### **Current Status (Development):**
```bash
# Test email service
npm run test-email

# Check email in console
npm start
# Look for: "📧 OTP for email: 123456"
```

### **Production Testing:**
```bash
# After domain setup
EMAIL_SERVICE=resend npm start

# Test with real email
curl -X POST http://localhost:5000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "your-college-email@vce.ac.in"}'
```

---

## 💰 **Cost Breakdown**

### **Free Tier (Development):**
- **Resend**: 3,000 emails/month free
- **Domain**: Already owned
- **MongoDB Atlas**: 512MB free
- **Total**: $0/month

### **Production Estimate:**
- **Resend Pro**: $20/month (50,000 emails)
- **Hosting**: $5-10/month
- **Domain**: Already owned
- **Total**: ~$25-30/month

---

## 🎯 **Next Actions**

1. **Choose email provider** (Resend recommended)
2. **Set up DNS records** for campuskarma.burakamal.site
3. **Configure email service** 
4. **Test email delivery**
5. **Update frontend URLs** to use production domain

**Ready to make CampusKarma look incredibly professional!** 🚀
