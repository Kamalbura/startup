# SkillLance Vercel Deployment Guide

This document provides instructions for deploying the SkillLance frontend and backend to Vercel.

## Deployment Architecture

SkillLance uses a split deployment architecture on Vercel:
- **Frontend**: Static site built with Vite/React
- **Backend**: Serverless API built with Node.js/Express

## Prerequisites

1. A Vercel account
2. Vercel CLI installed: `npm i -g vercel`
3. Firebase project (for authentication)
4. MongoDB Atlas database

## Frontend Deployment

1. **Set up environment variables in Vercel**:
   
   Navigate to your project settings in the Vercel dashboard and add these variables:
   ```
   VITE_API_URL=https://skilllance-backend.vercel.app/api/v1
   VITE_APP_NAME=SkillLance
   VITE_APP_VERSION=1.0.0
   VITE_ENVIRONMENT=production
   
   # Firebase configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. **Deploy to Vercel**:
   
   From the frontend directory:
   ```
   vercel
   ```
   
   For production:
   ```
   vercel --prod
   ```

## Backend Deployment

1. **Set up environment variables in Vercel**:
   
   Navigate to your project settings in the Vercel dashboard and add these variables:
   ```
   NODE_ENV=production
   API_VERSION=v1
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   FRONTEND_URL=https://skilllance.vercel.app
   ```

2. **Deploy to Vercel**:
   
   From the backend directory:
   ```
   vercel
   ```
   
   For production:
   ```
   vercel --prod
   ```

## Testing the Integration

1. After deploying both frontend and backend, visit your frontend URL.
2. Verify that the frontend can communicate with the backend by:
   - Signing up/logging in
   - Accessing protected routes
   - Testing API functionality

3. Check the Network tab in browser DevTools to ensure API calls are going to the correct backend URL.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Verify that your backend's CORS configuration includes your frontend domain:
   ```javascript
   const corsOptions = {
     origin: [
       'https://skilllance.vercel.app',
       'https://skilllance-frontend.vercel.app',
       // Add any additional domains here
     ],
     credentials: true,
     // ...
   }
   ```

2. Ensure the `FRONTEND_URL` environment variable is set correctly in your backend Vercel project.

### API Connection Issues

If the frontend can't connect to the backend:

1. Check that the `VITE_API_URL` environment variable is set correctly in your frontend Vercel project.
2. Verify that the backend is deployed and accessible by directly visiting an API endpoint.

## Continuous Deployment

Both projects can be connected to GitHub for continuous deployment:

1. Connect your Vercel projects to your GitHub repository
2. Configure production branch (usually `main` or `master`)
3. Customize build settings if needed

Each push to your production branch will trigger a new deployment.
