// SkillLance Anonymous Request Routes (Modern Architecture)
// Purpose: Route definitions for anonymous help requests using clean architecture

import express from 'express'
import rateLimit from 'express-rate-limit'
import { routes } from '../controllers/AnonymousRequestController.js'
import { authenticateFirebaseUser } from '../../middleware/firebaseAuth.js'
import { notFoundHandler } from '../errors/index.js'

const router = express.Router()

// Configure rate limiting
const createRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour per IP
  message: {
    success: false,
    message: 'Too many help requests. Please wait before creating another.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false
})

// Apply general rate limiting to all routes
router.use(generalLimiter)

// ==============================
// Public Routes (no auth required)
// ==============================

/**
 * @route   GET /health
 * @desc    Health check for anonymous requests service
 * @access  Public
 */
router.get('/health', ...routes.healthCheck)

/**
 * @route   GET /trending-skills
 * @desc    Get trending skills from recent requests
 * @access  Public
 */
router.get('/trending-skills', ...routes.getTrendingSkills)

// ==============================
// Protected Routes (auth required)
// ==============================

// Apply authentication middleware to all routes below
router.use(authenticateFirebaseUser)

/**
 * @route   POST /request
 * @desc    Create new anonymous help request
 * @access  Private (Firebase Auth)
 * @rateLimit 3 per hour per IP
 */
router.post('/request', createRequestLimiter, ...routes.createRequest)

/**
 * @route   GET /requests
 * @desc    Get all anonymous requests with pagination and filters
 * @access  Private (Firebase Auth)
 */
router.get('/requests', ...routes.getRequests)

/**
 * @route   GET /requests/:id
 * @desc    Get single anonymous request by ID
 * @access  Private (Firebase Auth)
 */
router.get('/requests/:id', ...routes.getRequest)

/**
 * @route   PUT /requests/:id
 * @desc    Update anonymous request (only creator can update)
 * @access  Private (Firebase Auth)
 */
router.put('/requests/:id', ...routes.updateRequest)

/**
 * @route   DELETE /requests/:id
 * @desc    Delete anonymous request (only creator can delete)
 * @access  Private (Firebase Auth)
 */
router.delete('/requests/:id', ...routes.deleteRequest)

/**
 * @route   POST /requests/:id/respond
 * @desc    Respond to an anonymous request
 * @access  Private (Firebase Auth)
 */
router.post('/requests/:id/respond', ...routes.respondToRequest)

/**
 * @route   POST /requests/:id/accept/:responseId
 * @desc    Accept a response to request (only creator can accept)
 * @access  Private (Firebase Auth)
 */
router.post('/requests/:id/accept/:responseId', ...routes.acceptResponse)

/**
 * @route   POST /requests/:id/complete
 * @desc    Mark request as completed (only creator can complete)
 * @access  Private (Firebase Auth)
 */
router.post('/requests/:id/complete', ...routes.completeRequest)

/**
 * @route   GET /search
 * @desc    Search anonymous requests with advanced filters
 * @access  Private (Firebase Auth)
 */
router.get('/search', ...routes.searchRequests)

/**
 * @route   GET /stats
 * @desc    Get user statistics for anonymous requests
 * @access  Private (Firebase Auth)
 */
router.get('/stats', ...routes.getUserStats)

/**
 * @route   GET /analytics
 * @desc    Get analytics dashboard data
 * @access  Private (Firebase Auth)
 */
router.get('/analytics', ...routes.getAnalytics)

// ==============================
// Error Handling
// ==============================

// Handle 404 for undefined routes within this router
router.use('*', notFoundHandler)

export default router
