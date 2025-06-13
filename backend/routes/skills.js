// CampusKarma Skills Routes
// Purpose: Skill management, verification, quiz system

import express from 'express'
import rateLimit from 'express-rate-limit'
import { body, query, param, validationResult } from 'express-validator'
import Skill from '../models/Skill.js'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for skill operations
const skillOperationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many skill operations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * @route   GET /api/v1/skills
 * @desc    Get all skills with filtering and pagination
 * @access  Private
 */
router.get('/',
  authenticateToken,
  skillOperationsLimiter,
  [
    query('category')
      .optional()
      .isIn(['technical', 'creative', 'business', 'academic', 'personal', 'other'])
      .withMessage('Invalid category'),
    query('search')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Search query must be between 2 and 50 characters'),
    query('sortBy')
      .optional()
      .isIn(['name', 'popularity', 'demand', 'newest'])
      .withMessage('Invalid sort option'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
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

      const {
        category,
        search,
        sortBy = 'popularity',
        page = 1,
        limit = 20
      } = req.query

      const skip = (page - 1) * limit

      // Build filter query
      let filterQuery = { isActive: true }

      if (category) filterQuery.category = category
      if (search) {
        filterQuery.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }

      // Build sort query
      let sortQuery = {}
      switch (sortBy) {
        case 'name':
          sortQuery.name = 1
          break
        case 'demand':
          sortQuery.demandLevel = -1
          break
        case 'newest':
          sortQuery.createdAt = -1
          break
        default: // popularity
          sortQuery.totalUsers = -1
      }

      // Execute query
      const skills = await Skill.find(filterQuery)
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const totalSkills = await Skill.countDocuments(filterQuery)
      const totalPages = Math.ceil(totalSkills / limit)

      // Add user verification status for each skill
      const userSkills = await User.findById(req.user.id).select('skills')
      const userSkillIds = userSkills?.skills.map(s => s.skill.toString()) || []

      const skillsWithUserStatus = skills.map(skill => ({
        ...skill,
        userStatus: {
          isAdded: userSkillIds.includes(skill._id.toString()),
          isVerified: userSkills?.skills.find(s => 
            s.skill.toString() === skill._id.toString()
          )?.verified || false
        }
      }))

      res.json({
        success: true,
        message: 'Skills retrieved successfully',
        data: {
          skills: skillsWithUserStatus,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalSkills,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          },
          filters: {
            category,
            search,
            sortBy
          }
        }
      })

    } catch (error) {
      console.error('Get skills error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve skills',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/skills/:id
 * @desc    Get detailed skill information
 * @access  Private
 */
router.get('/:id',
  authenticateToken,
  skillOperationsLimiter,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid skill ID format')
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

      const { id } = req.params

      const skill = await Skill.findById(id).lean()
      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        })
      }

      // Check user's status with this skill
      const user = await User.findById(req.user.id).select('skills')
      const userSkill = user?.skills.find(s => s.skill.toString() === id)

      const skillWithUserStatus = {
        ...skill,
        userStatus: {
          isAdded: !!userSkill,
          isVerified: userSkill?.verified || false,
          level: userSkill?.level || null,
          experience: userSkill?.experience || null,
          addedAt: userSkill?.addedAt || null
        }
      }

      res.json({
        success: true,
        message: 'Skill details retrieved successfully',
        data: {
          skill: skillWithUserStatus
        }
      })

    } catch (error) {
      console.error('Get skill details error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve skill details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/skills/categories
 * @desc    Get all skill categories with counts
 * @access  Private
 */
router.get('/categories',
  authenticateToken,
  skillOperationsLimiter,
  async (req, res) => {
    try {
      // Aggregate skills by category
      const categories = await Skill.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalUsers: { $sum: '$totalUsers' },
            averageDemand: { $avg: '$demandLevel' }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            totalUsers: 1,
            averageDemand: { $round: ['$averageDemand', 1] },
            _id: 0
          }
        },
        { $sort: { count: -1 } }
      ])

      // Add category descriptions
      const categoryDescriptions = {
        technical: 'Programming, development, and technical skills',
        creative: 'Design, content creation, and artistic skills',
        business: 'Marketing, sales, and business development',
        academic: 'Research, writing, and educational skills',
        personal: 'Communication, leadership, and soft skills',
        other: 'Miscellaneous and specialized skills'
      }

      const categoriesWithDescriptions = categories.map(cat => ({
        ...cat,
        description: categoryDescriptions[cat.category] || 'Other skills'
      }))

      res.json({
        success: true,
        message: 'Skill categories retrieved successfully',
        data: {
          categories: categoriesWithDescriptions,
          totalCategories: categories.length
        }
      })

    } catch (error) {
      console.error('Get categories error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   POST /api/v1/skills/:id/verify
 * @desc    Request skill verification (future: quiz-based)
 * @access  Private
 */
router.post('/:id/verify',
  authenticateToken,
  skillOperationsLimiter,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid skill ID format')
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

      const { id } = req.params
      const userId = req.user.id

      // Find skill
      const skill = await Skill.findById(id)
      if (!skill) {
        return res.status(404).json({
          success: false,
          message: 'Skill not found'
        })
      }

      // Find user and check if they have this skill
      const user = await User.findById(userId)
      const userSkillIndex = user.skills.findIndex(s => s.skill.toString() === id)

      if (userSkillIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'You must add this skill to your profile before verification'
        })
      }

      // Check if already verified
      if (user.skills[userSkillIndex].verified) {
        return res.status(400).json({
          success: false,
          message: 'This skill is already verified'
        })
      }

      // For now, auto-verify (in future, this would trigger a quiz)
      user.skills[userSkillIndex].verified = true
      user.skills[userSkillIndex].verifiedAt = new Date()
      
      // Update karma score for verification
      user.trust.karmaScore = (user.trust.karmaScore || 0) + 5

      await user.save()

      // Update skill statistics
      skill.verifiedUsers = (skill.verifiedUsers || 0) + 1
      await skill.save()

      res.json({
        success: true,
        message: 'Skill verification completed successfully',
        data: {
          skill: {
            id: skill._id,
            name: skill.name,
            verified: true,
            verifiedAt: user.skills[userSkillIndex].verifiedAt
          },
          karmaEarned: 5
        }
      })

    } catch (error) {
      console.error('Verify skill error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to verify skill',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/skills/trending
 * @desc    Get trending/popular skills
 * @access  Private
 */
router.get('/trending',
  authenticateToken,
  skillOperationsLimiter,
  [
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

      const { limit = 10 } = req.query

      // Get trending skills based on recent additions and demand
      const trendingSkills = await Skill.find({ isActive: true })
        .sort({
          demandLevel: -1,
          totalUsers: -1,
          createdAt: -1
        })
        .limit(parseInt(limit))
        .lean()

      // Calculate trend score for each skill
      const skillsWithTrendScore = trendingSkills.map(skill => {
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(skill.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        
        // Simple trend calculation (higher for newer skills with more users)
        const trendScore = Math.max(
          skill.totalUsers / Math.max(daysSinceCreation, 1),
          0
        )

        return {
          ...skill,
          trendScore: Math.round(trendScore * 100) / 100
        }
      })

      res.json({
        success: true,
        message: 'Trending skills retrieved successfully',
        data: {
          skills: skillsWithTrendScore,
          generatedAt: new Date().toISOString()
        }
      })

    } catch (error) {
      console.error('Get trending skills error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve trending skills',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   POST /api/v1/skills
 * @desc    Create a new skill (admin/community feature)
 * @access  Private
 */
router.post('/',
  authenticateToken,
  skillOperationsLimiter,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Skill name must be between 2 and 50 characters'),
    body('category')
      .isIn(['technical', 'creative', 'business', 'academic', 'personal', 'other'])
      .withMessage('Invalid category'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Description must be between 10 and 500 characters'),
    body('icon')
      .optional()
      .isURL()
      .withMessage('Icon must be a valid URL')
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

      const { name, category, description, icon } = req.body

      // Check if skill already exists
      const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      })

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'A skill with this name already exists'
        })
      }

      // Create new skill
      const skill = new Skill({
        name: name.trim(),
        category,
        description: description.trim(),
        icon,
        isActive: true,
        totalUsers: 0,
        verifiedUsers: 0,
        demandLevel: 1, // Default demand level
        createdBy: req.user.id
      })

      await skill.save()

      res.status(201).json({
        success: true,
        message: 'Skill created successfully',
        data: {
          skill
        }
      })

    } catch (error) {
      console.error('Create skill error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create skill',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

export default router
