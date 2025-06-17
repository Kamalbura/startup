// SkillLance Anonymous Request Routes
// Purpose: API endpoints for privacy-first help requests

import express from 'express'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'
import AnonymousRequest from '../models/AnonymousRequest.js'
import { authenticateFirebaseUser } from '../middleware/firebaseAuth.js'

const router = express.Router()

// Rate limiting for anonymous requests
const createRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour per IP
  message: {
    success: false,
    message: 'Too many help requests. Please wait before creating another.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

const viewRequestsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false
})

// Helper function to generate avatar
const generateAvatar = () => {
  const colors = ['#4F46E5', '#7C3AED', '#DC2626', '#059669', '#D97706', '#2563EB']
  const shapes = ['circle', 'square', 'triangle', 'hexagon']
  const patterns = ['solid', 'gradient', 'dots', 'stripes']
  
  return {
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    pattern: patterns[Math.floor(Math.random() * patterns.length)]
  }
}

// Helper function to generate anonymous user ID
const generateAnonymousId = (firebaseUid) => {
  // Create a consistent but anonymous identifier
  return crypto.createHash('sha256').update(firebaseUid + process.env.ANON_SALT || 'skilllance').digest('hex').substring(0, 16)
}

/**
 * @route   POST /api/v1/anonymous/request
 * @desc    Create anonymous help request
 * @access  Private (Firebase Auth required)
 */
router.post('/request', 
  authenticateFirebaseUser,
  createRequestLimiter,
  async (req, res) => {
    try {
      const firebaseUser = req.user
      const { 
        title, 
        description, 
        skillsNeeded, 
        urgencyLevel, 
        estimatedTime,
        allowSameCollege,
        collegeHint,
        isRemote,
        tags
      } = req.body

      // Validation
      if (!title || !description || !skillsNeeded || !estimatedTime) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, skills needed, and estimated time are required'
        })
      }

      if (skillsNeeded.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one skill is required'
        })
      }

      // Generate session ID and anonymous user ID
      const sessionId = crypto.randomUUID()
      const anonymousUserId = generateAnonymousId(firebaseUser.uid)
      
      // Hash IP for rate limiting (don't store actual IP)
      const ipHash = crypto.createHash('sha256').update(req.ip).digest('hex')

      // Create anonymous request
      const request = new AnonymousRequest({
        sessionId,
        anonymousUserId,
        title: title.trim(),
        description: description.trim(),
        skillsNeeded: skillsNeeded.map(skill => skill.trim()),
        urgencyLevel: urgencyLevel || 'Medium',
        estimatedTime,
        avatar: generateAvatar(),
        allowSameCollege: allowSameCollege !== false,
        collegeHint: collegeHint?.trim() || '',
        location: {
          isRemote: isRemote !== false
        },
        tags: tags ? tags.map(tag => tag.trim().toLowerCase()) : [],
        ipHash,
        userAgent: req.get('User-Agent') || '',
        createdFrom: 'web'
      })

      await request.save()

      res.status(201).json({
        success: true,
        message: 'Anonymous help request created successfully',
        request: {
          sessionId: request.sessionId,
          title: request.title,
          description: request.description,
          skillsNeeded: request.skillsNeeded,
          urgencyLevel: request.urgencyLevel,
          estimatedTime: request.estimatedTime,
          avatar: request.avatar,
          timeRemaining: request.timeRemaining,
          urgencyColor: request.urgencyColor,
          status: request.status,
          responseCount: request.responseCount,
          views: request.views,
          createdAt: request.createdAt
        }
      })

    } catch (error) {
      console.error('Create anonymous request error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create help request',
        error: error.message
      })
    }
  }
)

/**
 * @route   GET /api/v1/anonymous/feed
 * @desc    Get real-time help feed (anonymous requests)
 * @access  Private
 */
router.get('/feed',
  authenticateFirebaseUser,
  viewRequestsLimiter,
  async (req, res) => {
    try {
      const { 
        limit = 20, 
        skills = [], 
        urgency = [],
        college = '',
        remote = true 
      } = req.query

      // Parse query parameters
      const skillsArray = skills ? (Array.isArray(skills) ? skills : [skills]) : []
      const urgencyArray = urgency ? (Array.isArray(urgency) ? urgency : [urgency]) : []

      // Build query
      const query = { status: 'Active' }
      
      if (skillsArray.length > 0) {
        query.skillsNeeded = { $in: skillsArray }
      }
      
      if (urgencyArray.length > 0) {
        query.urgencyLevel = { $in: urgencyArray }
      }

      if (college && college !== 'all') {
        query.collegeHint = new RegExp(college, 'i')
      }

      if (remote === 'false') {
        query['location.isRemote'] = false
      }

      // Get active requests
      const requests = await AnonymousRequest.find(query)
        .sort({ urgencyLevel: -1, createdAt: -1 })
        .limit(parseInt(limit))
        .select('-anonymousUserId -ipHash -userAgent -helpOffers.helperId')

      // Add computed fields
      const feed = requests.map(request => ({
        sessionId: request.sessionId,
        title: request.title,
        description: request.description,
        skillsNeeded: request.skillsNeeded,
        urgencyLevel: request.urgencyLevel,
        urgencyColor: request.urgencyColor,
        estimatedTime: request.estimatedTime,
        avatar: request.avatar,
        timeRemaining: request.timeRemaining,
        responseCount: request.responseCount,
        views: request.views,
        collegeHint: request.collegeHint,
        location: request.location,
        tags: request.tags,
        createdAt: request.createdAt,
        canHelp: true // User can offer help to any request
      }))

      res.json({
        success: true,
        feed,
        meta: {
          total: feed.length,
          filters: {
            skills: skillsArray,
            urgency: urgencyArray,
            college,
            remote: remote === 'true'
          }
        }
      })

    } catch (error) {
      console.error('Get feed error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch help feed',
        error: error.message
      })
    }
  }
)

/**
 * @route   GET /api/v1/anonymous/request/:sessionId
 * @desc    Get specific anonymous request details
 * @access  Private
 */
router.get('/request/:sessionId',
  authenticateFirebaseUser,
  viewRequestsLimiter,
  async (req, res) => {
    try {
      const { sessionId } = req.params
      
      const request = await AnonymousRequest.findOne({ sessionId })
        .select('-anonymousUserId -ipHash -userAgent')

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Help request not found or expired'
        })
      }

      // Increment view count
      await request.incrementViews()

      res.json({
        success: true,
        request: {
          sessionId: request.sessionId,
          title: request.title,
          description: request.description,
          skillsNeeded: request.skillsNeeded,
          urgencyLevel: request.urgencyLevel,
          urgencyColor: request.urgencyColor,
          estimatedTime: request.estimatedTime,
          avatar: request.avatar,
          timeRemaining: request.timeRemaining,
          status: request.status,
          responseCount: request.responseCount,
          views: request.views,
          collegeHint: request.collegeHint,
          location: request.location,
          tags: request.tags,
          createdAt: request.createdAt,
          helpOffers: request.helpOffers.map(offer => ({
            message: offer.message,
            trustScore: offer.trustScore,
            isAnonymous: offer.isAnonymous,
            offeredAt: offer.offeredAt
          }))
        }
      })

    } catch (error) {
      console.error('Get request error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch request details',
        error: error.message
      })
    }
  }
)

/**
 * @route   POST /api/v1/anonymous/request/:sessionId/help
 * @desc    Offer help for anonymous request
 * @access  Private
 */
router.post('/request/:sessionId/help',
  authenticateFirebaseUser,
  async (req, res) => {
    try {
      const { sessionId } = req.params
      const { message, isAnonymous = false } = req.body
      const firebaseUser = req.user

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Help message is required'
        })
      }

      const request = await AnonymousRequest.findOne({ sessionId, status: 'Active' })

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Active help request not found'
        })
      }

      // Generate helper ID (anonymous or identifiable)
      const helperId = isAnonymous 
        ? generateAnonymousId(firebaseUser.uid + sessionId)
        : firebaseUser.uid

      // Mock trust score (in real implementation, fetch from trust system)
      const trustScore = 75 + Math.floor(Math.random() * 25) // 75-100

      // Add help offer
      await request.addHelpOffer(helperId, message.trim(), trustScore, isAnonymous)

      res.json({
        success: true,
        message: 'Help offer submitted successfully',
        helpOffer: {
          message: message.trim(),
          trustScore,
          isAnonymous,
          offeredAt: new Date()
        }
      })

    } catch (error) {
      console.error('Offer help error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to submit help offer',
        error: error.message
      })
    }
  }
)

/**
 * @route   GET /api/v1/anonymous/my-requests
 * @desc    Get user's own anonymous requests
 * @access  Private
 */
router.get('/my-requests',
  authenticateFirebaseUser,
  async (req, res) => {
    try {
      const firebaseUser = req.user
      const anonymousUserId = generateAnonymousId(firebaseUser.uid)

      const requests = await AnonymousRequest.find({ anonymousUserId })
        .sort({ createdAt: -1 })
        .select('-anonymousUserId -ipHash -userAgent')

      const myRequests = requests.map(request => ({
        sessionId: request.sessionId,
        title: request.title,
        description: request.description,
        skillsNeeded: request.skillsNeeded,
        urgencyLevel: request.urgencyLevel,
        urgencyColor: request.urgencyColor,
        estimatedTime: request.estimatedTime,
        avatar: request.avatar,
        timeRemaining: request.timeRemaining,
        status: request.status,
        responseCount: request.responseCount,
        views: request.views,
        createdAt: request.createdAt,
        helpOffers: request.helpOffers.length
      }))

      res.json({
        success: true,
        requests: myRequests,
        total: myRequests.length
      })

    } catch (error) {
      console.error('Get my requests error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch your requests',
        error: error.message
      })
    }
  }
)

/**
 * @route   PUT /api/v1/anonymous/request/:sessionId/status
 * @desc    Update request status (complete, cancel)
 * @access  Private (only request owner)
 */
router.put('/request/:sessionId/status',
  authenticateFirebaseUser,
  async (req, res) => {
    try {
      const { sessionId } = req.params
      const { status } = req.body
      const firebaseUser = req.user

      if (!['Completed', 'Cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Use "Completed" or "Cancelled"'
        })
      }

      const anonymousUserId = generateAnonymousId(firebaseUser.uid)
      
      const request = await AnonymousRequest.findOne({ 
        sessionId, 
        anonymousUserId 
      })

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found or you do not have permission'
        })
      }

      request.status = status
      request.lastActivityAt = new Date()
      await request.save()

      res.json({
        success: true,
        message: `Request marked as ${status.toLowerCase()}`,
        request: {
          sessionId: request.sessionId,
          status: request.status,
          lastActivityAt: request.lastActivityAt
        }
      })

    } catch (error) {
      console.error('Update request status error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update request status',
        error: error.message
      })
    }
  }
)

/**
 * @route   GET /api/v1/anonymous/health
 * @desc    Health check for anonymous routes
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Anonymous Request routes are healthy',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/v1/anonymous/health',
      'GET /api/v1/anonymous/feed (requires auth)',
      'POST /api/v1/anonymous/request (requires auth)',
      'GET /api/v1/anonymous/request/:sessionId (requires auth)',
      'POST /api/v1/anonymous/request/:sessionId/help (requires auth)',
      'GET /api/v1/anonymous/my-requests (requires auth)'
    ]
  })
})

export default router
