# 🚀 CampusKarma Vercel Deployment Guide

This guide will help you deploy CampusKarma to Vercel with a professional setup including custom domain, email service, and production database.

## 🏗️ Architecture Overview

- **Frontend**: React + Vite → Vercel Static Hosting
- **Backend**: Node.js + Express → Vercel Serverless Functions
- **Database**: MongoDB Atlas (Cloud)
- **Email**: Zoho Mail (Professional)
- **Domain**: Custom domain with professional email

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster and database
- [ ] Configure network access (allow all IPs: 0.0.0.0/0)
- [ ] Create database user with read/write permissions
- [ ] Get connection string

### 2. Zoho Mail Setup (Optional but Recommended)
- [ ] Follow `ZOHO_MAIL_FREE_SETUP.md` guide
- [ ] Configure DNS records for your domain
- [ ] Create `noreply@yourdomain.com` email account
- [ ] Get SMTP credentials

### 3. Environment Variables Preparation
- [ ] Copy `.env.production` template
- [ ] Fill in all required values
- [ ] Test locally with production values

## 🎯 Step-by-Step Deployment

### Step 1: Deploy Backend API

1. **Create Vercel Project for Backend**
   ```bash
   # Navigate to project root
   cd c:\Users\burak\Desktop\startup-1
   
   # Install Vercel CLI (if not installed)
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy backend
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.production`:
     ```
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_super_secure_secret
     EMAIL_SERVICE=smtp
     SMTP_HOST=smtp.zoho.com
     SMTP_PORT=587
     SMTP_USER=noreply@yourdomain.com
     SMTP_PASS=your_zoho_password
     ... (all other variables)
     ```

3. **Test API Deployment**
   ```bash
   # Test health endpoint
   curl https://your-api-domain.vercel.app/api/health
   
   # Should return success with database connection status
   ```

### Step 2: Deploy Frontend

1. **Create Separate Vercel Project for Frontend**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Deploy frontend
   vercel --prod
   ```

2. **Configure Frontend Environment Variables**
   - Add to Vercel Dashboard → Frontend Project → Environment Variables:
     ```
     VITE_API_URL=https://your-api-domain.vercel.app/api/v1
     VITE_APP_NAME=CampusKarma
     VITE_ENVIRONMENT=production
     VITE_ENABLE_SOCKET=false
     ```

3. **Update API URL in Frontend**
   - Vercel will automatically use `.env.production` for production builds
   - Ensure `VITE_API_URL` points to your deployed backend

### Step 3: Custom Domain Setup (Optional)

1. **Purchase Domain** (if not already owned)
   - Recommended: Namecheap, GoDaddy, or Google Domains
   - Example: `campuskarma.burakamal.site`

2. **Configure Domain for Frontend**
   - Go to Vercel Dashboard → Frontend Project → Settings → Domains
   - Add your custom domain: `campuskarma.burakamal.site`
   - Follow DNS configuration instructions

3. **Configure Subdomain for API**
   - Add subdomain: `api.campuskarma.burakamal.site`
   - Point to your backend Vercel deployment
   - Update frontend `VITE_API_URL` to use custom API domain

## 🔧 Configuration Files Summary

### Root Directory (`vercel.json`)
```json
{
  "version": 2,
  "name": "campuskarma-api",
  "builds": [
    {
      "src": "backend/api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/index.js"
    }
  ]
}
```

### Frontend Directory (`frontend/vercel.json`)
```json
{
  "version": 2,
  "name": "campuskarma-frontend",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🧪 Testing Deployment

### Backend Testing
```bash
# Health check
curl https://your-api.vercel.app/api/health

# Test OTP endpoint
curl -X POST https://your-api.vercel.app/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@student.ac.in"}'

# Test OTP verification
curl -X POST https://your-api.vercel.app/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@student.ac.in", "otp": "123456"}'
```

### Frontend Testing
1. Visit your deployed frontend URL
2. Test OTP login flow
3. Verify API calls work correctly
4. Check browser console for errors

## 🚨 Common Issues & Solutions

### Backend Issues

1. **Database Connection Fails**
   - Verify MongoDB Atlas connection string
   - Check network access settings (allow 0.0.0.0/0)
   - Ensure database user has correct permissions

2. **Email Service Fails**
   - Verify Zoho Mail SMTP credentials
   - Check if 2FA requires app password
   - Test email service separately

3. **CORS Errors**
   - Update `CORS_ORIGIN` in backend environment
   - Add frontend domain to CORS whitelist

### Frontend Issues

1. **API Calls Fail**
   - Verify `VITE_API_URL` points to correct backend
   - Check if backend is deployed and accessible
   - Verify CORS configuration

2. **Build Fails**
   - Check for TypeScript/ESLint errors
   - Ensure all dependencies are installed
   - Verify Vite configuration

## 📊 Performance Optimization

### Backend Optimization
- ✅ Database connection pooling implemented
- ✅ Request compression enabled
- ✅ Rate limiting configured
- ✅ Error handling and logging

### Frontend Optimization
- ✅ Vite build optimization
- ✅ Code splitting ready
- ✅ Asset optimization
- ✅ Service worker ready (PWA)

## 🔐 Security Checklist

- [ ] JWT secrets are secure and environment-specific
- [ ] Database access is restricted
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Security headers are set

## 📈 Monitoring & Analytics

### Backend Monitoring
- Vercel Function Logs
- Database connection monitoring
- API response time tracking
- Error rate monitoring

### Frontend Monitoring
- Vercel Analytics
- Core Web Vitals
- User engagement metrics
- Error tracking

## 🚀 Go Live Checklist

1. **Final Testing**
   - [ ] All API endpoints work
   - [ ] OTP email delivery works
   - [ ] Frontend-backend integration works
   - [ ] Database operations work
   - [ ] Error handling works

2. **DNS & Email**
   - [ ] Custom domain configured
   - [ ] SSL certificate active
   - [ ] Email service operational
   - [ ] DNS propagated (24-48 hours)

3. **Monitoring**
   - [ ] Error tracking setup
   - [ ] Performance monitoring
   - [ ] Database monitoring
   - [ ] Email deliverability monitoring

4. **Documentation**
   - [ ] API documentation updated
   - [ ] Deployment notes documented
   - [ ] Environment variables documented
   - [ ] Rollback plan prepared

## 📞 Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Zoho Mail Setup**: See `ZOHO_MAIL_FREE_SETUP.md`
- **Domain Configuration**: See `DOMAIN_SETUP_GUIDE.md`

---

## 🎉 Success Metrics

**Deployment is successful when:**
- ✅ Backend API responds at `/api/health`
- ✅ Frontend loads without errors
- ✅ OTP email delivery works
- ✅ Full authentication flow works
- ✅ Database operations are successful
- ✅ Custom domain is accessible (if configured)

**Estimated Deployment Time**: 2-4 hours (excluding DNS propagation)

---

*This guide covers the complete deployment process from development to production. Follow each step carefully and test thoroughly before going live.*
