// CampusKarma User Routes
// Purpose: User profile management, skill verification, karma system

import express from 'express'
import rateLimit from 'express-rate-limit'
import { body, query, validationResult } from 'express-validator'
import User from '../models/User.js'
import Skill from '../models/Skill.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for user operations
const userOperationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many user operations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting for profile updates
const profileUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit profile updates to 5 per hour
  message: {
    success: false,
    message: 'Too many profile updates, please wait before updating again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user's detailed profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-__v')
      .populate('skills.skill', 'name category icon description')
      .lean()

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      })
    }

    // Calculate user stats
    const stats = {
      totalSkills: user.skills?.length || 0,
      verifiedSkills: user.skills?.filter(skill => skill.verified)?.length || 0,
      profileCompleteness: calculateProfileCompleteness(user),
      trustLevel: getTrustLevel(user.trust?.karmaScore || 0)
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          ...user,
          stats
        }
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile information
 * @access  Private
 */
router.put('/profile',
  authenticateToken,
  profileUpdateLimiter,
  [
    body('profile.firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('First name must be between 2 and 30 characters'),
    body('profile.lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Last name must be between 2 and 30 characters'),
    body('profile.bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('profile.phone')
      .optional()
      .isMobilePhone('en-IN')
      .withMessage('Please provide a valid Indian phone number'),
    body('profile.year')
      .optional()
      .isIn(['1st', '2nd', '3rd', '4th', 'Masters', 'PhD'])
      .withMessage('Invalid academic year'),
    body('profile.major')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Major must be between 2 and 100 characters'),
    body('socialLinks.linkedin')
      .optional()
      .isURL()
      .withMessage('LinkedIn must be a valid URL'),
    body('socialLinks.github')
      .optional()
      .isURL()
      .withMessage('GitHub must be a valid URL'),
    body('socialLinks.portfolio')
      .optional()
      .isURL()
      .withMessage('Portfolio must be a valid URL')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      const userId = req.user.id
      const updateData = req.body

      // Find and update user
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $set: updateData,
          updatedAt: new Date()
        },
        { 
          new: true, 
          runValidators: true 
        }
      ).select('-__v')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user
        }
      })

    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/users/search
 * @desc    Search users by skills, college, or name
 * @access  Private
 */
router.get('/search',
  authenticateToken,
  userOperationsLimiter,
  [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Search query must be between 2 and 50 characters'),
    query('college')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('College filter must be between 2 and 100 characters'),
    query('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      const { q, college, skills, page = 1, limit = 10 } = req.query
      const skip = (page - 1) * limit

      // Build search query
      let searchQuery = {
        'profile.isVerified': true, // Only show verified users
        _id: { $ne: req.user.id } // Exclude current user
      }

      // Text search
      if (q) {
        searchQuery.$or = [
          { 'profile.firstName': { $regex: q, $options: 'i' } },
          { 'profile.lastName': { $regex: q, $options: 'i' } },
          { 'skills.name': { $regex: q, $options: 'i' } }
        ]
      }

      // College filter
      if (college) {
        searchQuery.institution = { $regex: college, $options: 'i' }
      }

      // Skills filter
      if (skills && skills.length > 0) {
        searchQuery['skills.name'] = { $in: skills }
      }

      // Execute search
      const users = await User.find(searchQuery)
        .select('email institution profile trust skills createdAt')
        .populate('skills.skill', 'name category icon')
        .sort({ 'trust.karmaScore': -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const totalUsers = await User.countDocuments(searchQuery)
      const totalPages = Math.ceil(totalUsers / limit)

      res.json({
        success: true,
        message: 'User search completed',
        data: {
          users,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      })

    } catch (error) {
      console.error('User search error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to search users',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/users/:id/public
 * @desc    Get public profile of a user
 * @access  Private
 */
router.get('/:id/public',
  authenticateToken,
  userOperationsLimiter,
  async (req, res) => {
    try {
      const { id } = req.params

      const user = await User.findById(id)
        .select('email institution profile trust skills createdAt reviews')
        .populate('skills.skill', 'name category icon description')
        .populate('reviews', 'rating comment createdAt')
        .lean()

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Only return public information
      const publicProfile = {
        id: user._id,
        institution: user.institution,
        profile: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
          bio: user.profile?.bio,
          avatarUrl: user.profile?.avatarUrl,
          year: user.profile?.year,
          major: user.profile?.major,
          isVerified: user.profile?.isVerified
        },
        trust: user.trust,
        skills: user.skills,
        stats: {
          memberSince: user.createdAt,
          totalReviews: user.reviews?.length || 0,
          averageRating: calculateAverageRating(user.reviews || [])
        },
        socialLinks: user.socialLinks
      }

      res.json({
        success: true,
        message: 'Public profile retrieved successfully',
        data: {
          user: publicProfile
        }
      })

    } catch (error) {
      console.error('Get public profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve public profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   POST /api/v1/users/skills/add
 * @desc    Add skill to user profile
 * @access  Private
 */
router.post('/skills/add',
  authenticateToken,
  userOperationsLimiter,
  [
    body('skillName')
      .notEmpty()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Skill name must be between 2 and 50 characters'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
      .withMessage('Invalid skill level'),
    body('experience')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Experience description cannot exceed 200 characters')
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        })
      }

      const { skillName, level, experience } = req.body
      const userId = req.user.id

      // Find or create skill
      let skill = await Skill.findOne({ name: skillName })
      if (!skill) {
        skill = new Skill({
          name: skillName,
          category: 'Other', // Default category
          description: `${skillName} skill`,
          isActive: true
        })
        await skill.save()
      }

      // Add skill to user
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Check if user already has this skill
      const existingSkill = user.skills.find(s => s.skill.toString() === skill._id.toString())
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill already added to profile'
        })
      }

      // Add skill to user profile
      user.skills.push({
        skill: skill._id,
        level,
        experience,
        verified: false,
        addedAt: new Date()
      })

      await user.save()

      // Update skill statistics
      skill.totalUsers = (skill.totalUsers || 0) + 1
      await skill.save()

      res.json({
        success: true,
        message: 'Skill added successfully',
        data: {
          skill: {
            id: skill._id,
            name: skill.name,
            level,
            experience,
            verified: false
          }
        }
      })

    } catch (error) {
      console.error('Add skill error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to add skill',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   DELETE /api/v1/users/skills/:skillId
 * @desc    Remove skill from user profile
 * @access  Private
 */
router.delete('/skills/:skillId',
  authenticateToken,
  userOperationsLimiter,
  async (req, res) => {
    try {
      const { skillId } = req.params
      const userId = req.user.id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Find and remove skill
      const skillIndex = user.skills.findIndex(s => s.skill.toString() === skillId)
      if (skillIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found in user profile'
        })
      }

      user.skills.splice(skillIndex, 1)
      await user.save()

      // Update skill statistics
      await Skill.findByIdAndUpdate(skillId, {
        $inc: { totalUsers: -1 }
      })

      res.json({
        success: true,
        message: 'Skill removed successfully'
      })

    } catch (error) {
      console.error('Remove skill error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to remove skill',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

// Helper functions
function calculateProfileCompleteness(user) {
  let completeness = 0
  const fields = [
    'email',
    'profile.firstName',
    'profile.lastName',
    'profile.bio',
    'profile.phone',
    'profile.year',
    'profile.major',
    'profile.avatarUrl'
  ]

  fields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], user)
    if (value) completeness += 12.5 // 100 / 8 fields
  })

  return Math.min(Math.round(completeness), 100)
}

function getTrustLevel(karmaScore) {
  if (karmaScore >= 100) return 'Expert'
  if (karmaScore >= 75) return 'Advanced'
  if (karmaScore >= 50) return 'Intermediate'
  if (karmaScore >= 25) return 'Beginner'
  return 'New'
}

function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export default router
