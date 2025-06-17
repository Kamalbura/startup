// SkillLance Anonymous Request Routes for API
// Purpose: Copy of routes for the Vercel serverless API structure

import express from 'express'
import rateLimit from 'express-rate-limit'
import crypto from 'crypto'

const router = express.Router()

// Import models (we'll need to copy the model to api/models/)
// For now, I'll create a simplified version that works with the API structure

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

/**
 * @route   POST /api/v1/anonymous/request
 * @desc    Create anonymous help request
 * @access  Private
 */
router.post('/request', createRequestLimiter, async (req, res) => {
  try {
    // For now, return a mock response until we set up the full database integration
    const sessionId = crypto.randomUUID()
    const avatar = generateAvatar()
    
    const mockRequest = {
      sessionId,
      title: req.body.title,
      description: req.body.description,
      skillsNeeded: req.body.skillsNeeded || [],
      urgencyLevel: req.body.urgencyLevel || 'Medium',
      estimatedTime: req.body.estimatedTime,
      avatar,
      status: 'Active',
      responseCount: 0,
      views: 0,
      timeRemaining: '24h 0m',
      urgencyColor: '#F59E0B',
      createdAt: new Date()
    }

    res.status(201).json({
      success: true,
      message: 'Anonymous help request created successfully',
      request: mockRequest
    })

  } catch (error) {
    console.error('Create anonymous request error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create help request',
      error: error.message
    })
  }
})

/**
 * @route   GET /api/v1/anonymous/feed
 * @desc    Get real-time help feed (mock data for now)
 * @access  Private
 */
router.get('/feed', async (req, res) => {
  try {
    // Mock feed data
    const mockFeed = [
      {
        sessionId: crypto.randomUUID(),
        title: "Need help with React hooks confusion",
        description: "Struggling with useEffect dependencies. Getting infinite re-renders.",
        skillsNeeded: ["React", "JavaScript"],
        urgencyLevel: "High",
        urgencyColor: "#EF4444",
        estimatedTime: "30min",
        avatar: { color: "#4F46E5", shape: "circle", pattern: "solid" },
        timeRemaining: "23h 45m",
        responseCount: 2,
        views: 15,
        collegeHint: "Engineering College, Mumbai",
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 mins ago
      },
      {
        sessionId: crypto.randomUUID(),
        title: "Python pandas DataFrame merge issue",
        description: "Can't figure out how to merge two DataFrames with different column names.",
        skillsNeeded: ["Python", "Pandas", "Data Science"],
        urgencyLevel: "Medium",
        urgencyColor: "#F59E0B",
        estimatedTime: "1hour",
        avatar: { color: "#7C3AED", shape: "hexagon", pattern: "gradient" },
        timeRemaining: "22h 12m",
        responseCount: 1,
        views: 8,
        collegeHint: "Tech University, Delhi",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        sessionId: crypto.randomUUID(),
        title: "CSS Grid layout not working",
        description: "Grid items are not aligning properly. Need quick help with CSS Grid properties.",
        skillsNeeded: ["CSS", "Frontend", "Web Design"],
        urgencyLevel: "Low",
        urgencyColor: "#10B981",
        estimatedTime: "15min",
        avatar: { color: "#DC2626", shape: "square", pattern: "dots" },
        timeRemaining: "21h 30m",
        responseCount: 0,
        views: 3,
        collegeHint: "Design College, Bangalore",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ]

    res.json({
      success: true,
      feed: mockFeed,
      meta: {
        total: mockFeed.length,
        filters: req.query
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
})

/**
 * @route   GET /api/v1/anonymous/request/:sessionId
 * @desc    Get specific request details
 * @access  Private
 */
router.get('/request/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    
    // Mock request details
    const mockRequest = {
      sessionId,
      title: "Need help with React hooks confusion",
      description: "I'm building a component that fetches data from an API, but I'm getting infinite re-renders with useEffect. I think it's related to the dependency array but I can't figure out what's wrong.",
      skillsNeeded: ["React", "JavaScript", "Hooks"],
      urgencyLevel: "High",
      urgencyColor: "#EF4444",
      estimatedTime: "30min",
      avatar: { color: "#4F46E5", shape: "circle", pattern: "solid" },
      timeRemaining: "23h 45m",
      status: "Active",
      responseCount: 2,
      views: 16,
      collegeHint: "Engineering College, Mumbai",
      tags: ["react", "hooks", "debugging"],
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      helpOffers: [
        {
          message: "I can help! I've dealt with this issue before. Usually it's because you're missing dependencies or have objects in the dependency array.",
          trustScore: 85,
          isAnonymous: false,
          offeredAt: new Date(Date.now() - 10 * 60 * 1000)
        },
        {
          message: "Happy to assist with the useEffect issue. Can share screen if needed.",
          trustScore: 92,
          isAnonymous: true,
          offeredAt: new Date(Date.now() - 5 * 60 * 1000)
        }
      ]
    }

    res.json({
      success: true,
      request: mockRequest
    })

  } catch (error) {
    console.error('Get request error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request details',
      error: error.message
    })
  }
})

/**
 * @route   POST /api/v1/anonymous/request/:sessionId/help
 * @desc    Offer help for a request
 * @access  Private
 */
router.post('/request/:sessionId/help', async (req, res) => {
  try {
    const { message, isAnonymous = false } = req.body

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Help message is required'
      })
    }

    // Mock response
    const helpOffer = {
      message: message.trim(),
      trustScore: 75 + Math.floor(Math.random() * 25), // Random 75-100
      isAnonymous,
      offeredAt: new Date()
    }

    res.json({
      success: true,
      message: 'Help offer submitted successfully',
      helpOffer
    })

  } catch (error) {
    console.error('Offer help error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit help offer',
      error: error.message
    })
  }
})

export default router
