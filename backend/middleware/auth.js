// CampusKarma Authentication Middleware
// Purpose: JWT verification, route protection, user context injection

import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
})

// Middleware to authenticate JWT tokens
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to suspicious activity'
      })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated'
      })
    }

    // Update last active timestamp
    user.lastActive = new Date()
    await user.save()

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

// Middleware for optional authentication (user context if token present)
export const optionalAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user
        user.lastActive = new Date()
        await user.save()
      }
    }
    
    next()
  } catch (error) {
    // Continue without authentication for optional routes
    next()
  }
}

// Middleware to check if user has verified skills
export const requireVerifiedSkills = (skillNames = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (skillNames.length === 0) {
      return next()
    }

    const userSkills = req.user.skills || []
    const hasRequiredSkills = skillNames.every(skillName => 
      userSkills.some(skill => 
        skill.name === skillName && skill.verified === true
      )
    )

    if (!hasRequiredSkills) {
      return res.status(403).json({
        success: false,
        message: 'Verified skills required',
        requiredSkills: skillNames,
        userVerifiedSkills: userSkills
          .filter(skill => skill.verified)
          .map(skill => skill.name)
      })
    }

    next()
  }
}

// Middleware to check karma threshold
export const requireKarmaLevel = (minKarma = 50) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    if (req.user.karmaScore < minKarma) {
      return res.status(403).json({
        success: false,
        message: `Minimum karma score of ${minKarma} required`,
        currentKarma: req.user.karmaScore,
        requiredKarma: minKarma
      })
    }

    next()
  }
}

// Middleware to check if user owns resource
export const requireResourceOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const resourceId = req.params[resourceIdParam]
    const userId = req.user._id.toString()

    // This middleware needs to be combined with resource fetching
    // The actual ownership check should be done in the route handler
    req.resourceOwnershipCheck = { resourceId, userId }
    next()
  }
}

// Middleware for admin/moderator roles
export const requireAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    })
  }

  // Check if user has admin privileges (you can add role field to User model)
  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required'
    })
  }

  next()
}

// Middleware to track user activity
export const trackUserActivity = (activityType) => {
  return async (req, res, next) => {
    if (req.user) {
      try {
        // Log user activity (you can extend this to track detailed analytics)
        logger.info(`User activity: ${req.user.email} - ${activityType}`, {
          userId: req.user._id,
          activity: activityType,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        })
        
        // Update user's last active timestamp
        req.user.lastActive = new Date()
        await req.user.save()
      } catch (error) {
        logger.error('Error tracking user activity:', error)
      }
    }
    next()
  }
}

// Middleware to validate college domain
export const validateCollegeDomain = async (req, res, next) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Check if email is .edu
    const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/
    if (!eduRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Only .edu email addresses are allowed'
      })
    }

    // Extract domain and college info
    const domain = email.split('@')[1]
    const collegeName = domain.split('.').slice(0, -1).join('.')
    
    // Attach college info to request
    req.collegeInfo = { domain, collegeName }
    
    next()
  } catch (error) {
    logger.error('College domain validation error:', error)
    return res.status(500).json({
      success: false,
      message: 'Domain validation failed'
    })
  }
}

// Error handler for authentication-related errors
export const authErrorHandler = (error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
  
  if (error.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }
  
  next(error)
}
