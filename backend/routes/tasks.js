// CampusKarma Task Routes
// Purpose: Task management, bidding system, escrow operations

import express from 'express'
import rateLimit from 'express-rate-limit'
import { body, query, param, validationResult } from 'express-validator'
import Task from '../models/Task.js'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Rate limiting for task operations
const taskOperationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many task operations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiting for task creation
const taskCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit task creation to 5 per hour
  message: {
    success: false,
    message: 'Too many tasks created, please wait before creating another.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/',
  authenticateToken,
  taskCreationLimiter,
  [
    body('title')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Title must be between 5 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Description must be between 20 and 2000 characters'),
    body('budget')
      .isFloat({ min: 50, max: 50000 })
      .withMessage('Budget must be between ₹50 and ₹50,000'),
    body('category')
      .isIn(['academic', 'creative', 'technical', 'business', 'personal', 'other'])
      .withMessage('Invalid category'),
    body('skillsRequired')
      .isArray({ min: 1, max: 5 })
      .withMessage('Please specify 1-5 required skills'),
    body('deadline')
      .isISO8601()
      .withMessage('Please provide a valid deadline')
      .custom((value) => {
        const deadline = new Date(value)
        const now = new Date()
        const maxDeadline = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)) // 90 days
        
        if (deadline <= now) {
          throw new Error('Deadline must be in the future')
        }
        if (deadline > maxDeadline) {
          throw new Error('Deadline cannot be more than 90 days in the future')
        }
        return true
      }),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high', 'urgent'])
      .withMessage('Invalid priority level'),
    body('attachments')
      .optional()
      .isArray({ max: 5 })
      .withMessage('Maximum 5 attachments allowed')
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
      const taskData = {
        ...req.body,
        postedBy: userId,
        status: 'open',
        visibility: 'public',
        createdAt: new Date()
      }

      // Create task
      const task = new Task(taskData)
      await task.save()

      // Populate task with user details
      await task.populate('postedBy', 'profile.firstName profile.lastName profile.avatarUrl institution trust.karmaScore')

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: {
          task
        }
      })

    } catch (error) {
      console.error('Create task error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/tasks
 * @desc    Get tasks with filtering and pagination
 * @access  Private
 */
router.get('/',
  authenticateToken,
  taskOperationsLimiter,
  [
    query('category')
      .optional()
      .isIn(['academic', 'creative', 'technical', 'business', 'personal', 'other'])
      .withMessage('Invalid category'),
    query('status')
      .optional()
      .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    query('minBudget')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum budget must be a positive number'),
    query('maxBudget')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum budget must be a positive number'),
    query('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array'),
    query('sortBy')
      .optional()
      .isIn(['newest', 'oldest', 'budget_high', 'budget_low', 'deadline'])
      .withMessage('Invalid sort option'),
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

      const {
        category,
        status = 'open',
        minBudget,
        maxBudget,
        skills,
        sortBy = 'newest',
        page = 1,
        limit = 10
      } = req.query

      const skip = (page - 1) * limit

      // Build filter query
      let filterQuery = {
        visibility: 'public',
        postedBy: { $ne: req.user.id } // Exclude user's own tasks
      }

      if (category) filterQuery.category = category
      if (status) filterQuery.status = status
      if (minBudget || maxBudget) {
        filterQuery.budget = {}
        if (minBudget) filterQuery.budget.$gte = parseFloat(minBudget)
        if (maxBudget) filterQuery.budget.$lte = parseFloat(maxBudget)
      }
      if (skills && skills.length > 0) {
        filterQuery.skillsRequired = { $in: skills }
      }

      // Build sort query
      let sortQuery = {}
      switch (sortBy) {
        case 'oldest':
          sortQuery.createdAt = 1
          break
        case 'budget_high':
          sortQuery.budget = -1
          break
        case 'budget_low':
          sortQuery.budget = 1
          break
        case 'deadline':
          sortQuery.deadline = 1
          break
        default: // newest
          sortQuery.createdAt = -1
      }

      // Execute query
      const tasks = await Task.find(filterQuery)
        .populate('postedBy', 'profile.firstName profile.lastName profile.avatarUrl institution trust.karmaScore')
        .populate('assignedTo', 'profile.firstName profile.lastName profile.avatarUrl')
        .sort(sortQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const totalTasks = await Task.countDocuments(filterQuery)
      const totalPages = Math.ceil(totalTasks / limit)

      res.json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: {
          tasks,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalTasks,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          },
          filters: {
            category,
            status,
            minBudget,
            maxBudget,
            skills,
            sortBy
          }
        }
      })

    } catch (error) {
      console.error('Get tasks error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tasks',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task details by ID
 * @access  Private
 */
router.get('/:id',
  authenticateToken,
  taskOperationsLimiter,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task ID format')
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

      const task = await Task.findById(id)
        .populate('postedBy', 'profile.firstName profile.lastName profile.avatarUrl institution trust.karmaScore profile.bio')
        .populate('assignedTo', 'profile.firstName profile.lastName profile.avatarUrl trust.karmaScore')
        .populate('bids.bidder', 'profile.firstName profile.lastName profile.avatarUrl trust.karmaScore')
        .lean()

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      // Check if user can view this task
      const canView = task.visibility === 'public' || 
                     task.postedBy._id.toString() === req.user.id ||
                     task.assignedTo?._id.toString() === req.user.id ||
                     task.bids.some(bid => bid.bidder._id.toString() === req.user.id)

      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this task'
        })
      }

      // Add user-specific information
      const userBid = task.bids.find(bid => bid.bidder._id.toString() === req.user.id)
      const isOwner = task.postedBy._id.toString() === req.user.id
      const isAssigned = task.assignedTo?._id.toString() === req.user.id

      const taskWithUserContext = {
        ...task,
        userContext: {
          isOwner,
          isAssigned,
          hasBid: !!userBid,
          userBid: userBid || null
        }
      }

      res.json({
        success: true,
        message: 'Task details retrieved successfully',
        data: {
          task: taskWithUserContext
        }
      })

    } catch (error) {
      console.error('Get task details error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve task details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   POST /api/v1/tasks/:id/bid
 * @desc    Place a bid on a task
 * @access  Private
 */
router.post('/:id/bid',
  authenticateToken,
  taskOperationsLimiter,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task ID format'),
    body('amount')
      .isFloat({ min: 10 })
      .withMessage('Bid amount must be at least ₹10'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Bid message must be between 10 and 500 characters'),
    body('timeline')
      .isInt({ min: 1, max: 90 })
      .withMessage('Timeline must be between 1 and 90 days')
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
      const { amount, message, timeline } = req.body
      const userId = req.user.id

      // Find task
      const task = await Task.findById(id)
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      // Validate bid constraints
      if (task.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Cannot bid on a task that is not open'
        })
      }

      if (task.postedBy.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot bid on your own task'
        })
      }

      // Check if user already has a bid
      const existingBid = task.bids.find(bid => bid.bidder.toString() === userId)
      if (existingBid) {
        return res.status(400).json({
          success: false,
          message: 'You have already placed a bid on this task'
        })
      }

      // Validate bid amount
      if (amount > task.budget * 1.2) { // Allow 20% over budget
        return res.status(400).json({
          success: false,
          message: 'Bid amount cannot exceed 120% of the task budget'
        })
      }

      // Add bid to task
      const newBid = {
        bidder: userId,
        amount,
        message,
        timeline,
        createdAt: new Date()
      }

      task.bids.push(newBid)
      await task.save()

      // Populate the new bid
      await task.populate('bids.bidder', 'profile.firstName profile.lastName profile.avatarUrl trust.karmaScore')

      const addedBid = task.bids[task.bids.length - 1]

      res.status(201).json({
        success: true,
        message: 'Bid placed successfully',
        data: {
          bid: addedBid,
          taskId: task._id,
          totalBids: task.bids.length
        }
      })

    } catch (error) {
      console.error('Place bid error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to place bid',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   PUT /api/v1/tasks/:id/assign/:bidderId
 * @desc    Assign task to a bidder
 * @access  Private (Task Owner)
 */
router.put('/:id/assign/:bidderId',
  authenticateToken,
  taskOperationsLimiter,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid task ID format'),
    param('bidderId')
      .isMongoId()
      .withMessage('Invalid bidder ID format')
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

      const { id, bidderId } = req.params
      const userId = req.user.id

      // Find task
      const task = await Task.findById(id)
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        })
      }

      // Check if user owns the task
      if (task.postedBy.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Only task owner can assign tasks'
        })
      }

      // Validate task status
      if (task.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Task is not available for assignment'
        })
      }

      // Find the bid
      const selectedBid = task.bids.find(bid => bid.bidder.toString() === bidderId)
      if (!selectedBid) {
        return res.status(404).json({
          success: false,
          message: 'Bid not found for this task'
        })
      }

      // Update task
      task.assignedTo = bidderId
      task.status = 'assigned'
      task.assignedAt = new Date()
      task.agreedAmount = selectedBid.amount
      task.timeline = selectedBid.timeline

      await task.save()

      // Populate task with updated information
      await task.populate('assignedTo', 'profile.firstName profile.lastName profile.avatarUrl')

      res.json({
        success: true,
        message: 'Task assigned successfully',
        data: {
          task: {
            id: task._id,
            status: task.status,
            assignedTo: task.assignedTo,
            agreedAmount: task.agreedAmount,
            timeline: task.timeline,
            assignedAt: task.assignedAt
          }
        }
      })

    } catch (error) {
      console.error('Assign task error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to assign task',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/tasks/my/created
 * @desc    Get tasks created by current user
 * @access  Private
 */
router.get('/my/created',
  authenticateToken,
  taskOperationsLimiter,
  [
    query('status')
      .optional()
      .isIn(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
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

      const { status, page = 1, limit = 10 } = req.query
      const skip = (page - 1) * limit
      const userId = req.user.id

      // Build filter query
      let filterQuery = { postedBy: userId }
      if (status) filterQuery.status = status

      // Execute query
      const tasks = await Task.find(filterQuery)
        .populate('assignedTo', 'profile.firstName profile.lastName profile.avatarUrl trust.karmaScore')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const totalTasks = await Task.countDocuments(filterQuery)
      const totalPages = Math.ceil(totalTasks / limit)

      // Add statistics
      const stats = {
        total: totalTasks,
        open: await Task.countDocuments({ postedBy: userId, status: 'open' }),
        assigned: await Task.countDocuments({ postedBy: userId, status: 'assigned' }),
        completed: await Task.countDocuments({ postedBy: userId, status: 'completed' })
      }

      res.json({
        success: true,
        message: 'Created tasks retrieved successfully',
        data: {
          tasks,
          stats,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalTasks,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      })

    } catch (error) {
      console.error('Get created tasks error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve created tasks',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

/**
 * @route   GET /api/v1/tasks/my/assigned
 * @desc    Get tasks assigned to current user
 * @access  Private
 */
router.get('/my/assigned',
  authenticateToken,
  taskOperationsLimiter,
  [
    query('status')
      .optional()
      .isIn(['assigned', 'in_progress', 'completed'])
      .withMessage('Invalid status'),
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

      const { status, page = 1, limit = 10 } = req.query
      const skip = (page - 1) * limit
      const userId = req.user.id

      // Build filter query
      let filterQuery = { assignedTo: userId }
      if (status) filterQuery.status = status

      // Execute query
      const tasks = await Task.find(filterQuery)
        .populate('postedBy', 'profile.firstName profile.lastName profile.avatarUrl institution trust.karmaScore')
        .sort({ assignedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()

      const totalTasks = await Task.countDocuments(filterQuery)
      const totalPages = Math.ceil(totalTasks / limit)

      // Add statistics
      const stats = {
        total: totalTasks,
        assigned: await Task.countDocuments({ assignedTo: userId, status: 'assigned' }),
        inProgress: await Task.countDocuments({ assignedTo: userId, status: 'in_progress' }),
        completed: await Task.countDocuments({ assignedTo: userId, status: 'completed' })
      }

      res.json({
        success: true,
        message: 'Assigned tasks retrieved successfully',
        data: {
          tasks,
          stats,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalTasks,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      })

    } catch (error) {
      console.error('Get assigned tasks error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve assigned tasks',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

export default router
