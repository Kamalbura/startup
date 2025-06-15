// Legacy auth routes - deprecated in favor of Firebase Auth
// This file exists only to prevent import errors during transition
// TODO: Remove this file and update server.js imports

import express from 'express';

const router = express.Router();

// Redirect all legacy auth requests to Firebase auth
router.all('*', (req, res) => {
  res.status(410).json({
    success: false,
    message: 'Legacy authentication has been deprecated. Please use Firebase Auth endpoints at /api/v1/firebase-auth/',
    redirectTo: '/api/v1/firebase-auth/' + req.path
  });
});

export default router;
