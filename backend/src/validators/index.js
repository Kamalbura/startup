// SkillLance Validation Utilities
// Purpose: Input validation schemas and middleware using Joi

import Joi from 'joi'
import { ValidationError, asyncHandler } from '../errors/index.js'

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // MongoDB ObjectId validation
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  
  // Email validation
  email: Joi.string().email().required(),
  
  // Password validation (minimum 8 characters, at least one letter and one number)
  password: Joi.string().min(8).pattern(/^(?=.*[a-zA-Z])(?=.*\d)/).required(),
    // Phone number validation
  phone: Joi.string().pattern(/^\+?[\d\s\-()]+$/).optional(),
  
  // URL validation
  url: Joi.string().uri().optional(),
  
  // Pagination parameters
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),
  
  // Sorting parameters
  sort: Joi.string().optional(),
  
  // Search parameters
  search: Joi.string().min(1).max(255).optional(),
  
  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
  }),
  
  // File upload
  file: Joi.object({
    filename: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().max(10 * 1024 * 1024) // 10MB max
  }),
  
  // Skills validation
  skills: Joi.array().items(Joi.string().min(2).max(50)).min(1).max(20),
  
  // Tags validation
  tags: Joi.array().items(Joi.string().min(2).max(30)).max(10),
  
  // Urgency levels
  urgencyLevel: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
  
  // Status fields
  status: Joi.string().valid('active', 'inactive', 'pending', 'completed', 'cancelled'),
  
  // Privacy settings
  privacyLevel: Joi.string().valid('public', 'private', 'friends', 'college'),
  
  // Location
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }),
  
  // Address
  address: Joi.object({
    street: Joi.string().max(100).optional(),
    city: Joi.string().max(50).required(),
    state: Joi.string().max(50).required(),
    country: Joi.string().max(50).required(),
    zipCode: Joi.string().max(20).optional()
  }),
  
  // College information
  college: Joi.object({
    name: Joi.string().max(100).required(),
    domain: Joi.string().pattern(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(),
    verified: Joi.boolean().default(false)
  })
}

/**
 * Anonymous Request validation schemas
 */
export const AnonymousRequestSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    skillsNeeded: CommonSchemas.skills,
    urgencyLevel: CommonSchemas.urgencyLevel,
    estimatedTime: Joi.number().min(1).max(240).required(), // in hours
    allowSameCollege: Joi.boolean().default(false),
    collegeHint: Joi.string().max(100).optional(),
    isRemote: Joi.boolean().default(true),
    tags: CommonSchemas.tags,
    budget: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().min(Joi.ref('min')).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').default('USD')
    }).optional()
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    skillsNeeded: CommonSchemas.skills.optional(),
    urgencyLevel: CommonSchemas.urgencyLevel.optional(),
    estimatedTime: Joi.number().min(1).max(240).optional(),
    allowSameCollege: Joi.boolean().optional(),
    collegeHint: Joi.string().max(100).optional(),
    isRemote: Joi.boolean().optional(),
    tags: CommonSchemas.tags.optional(),
    status: Joi.string().valid('open', 'in_progress', 'completed', 'cancelled').optional()
  }),

  query: Joi.object({
    ...CommonSchemas.pagination.describe().keys,
    sort: CommonSchemas.sort,
    search: CommonSchemas.search,
    skills: Joi.array().items(Joi.string()).optional(),
    urgencyLevel: Joi.array().items(Joi.string().valid('low', 'medium', 'high', 'urgent')).optional(),
    isRemote: Joi.boolean().optional(),
    status: Joi.array().items(Joi.string().valid('open', 'in_progress', 'completed', 'cancelled')).optional(),
    ...CommonSchemas.dateRange.describe().keys
  })
}

/**
 * User validation schemas
 */
export const UserSchemas = {
  create: Joi.object({
    email: CommonSchemas.email,
    password: CommonSchemas.password,
    fullName: Joi.string().min(2).max(100).required(),
    username: Joi.string().min(3).max(30).pattern(/^\w+$/).required(),
    college: CommonSchemas.college,
    skills: CommonSchemas.skills.optional(),
    bio: Joi.string().max(500).optional(),
    phone: CommonSchemas.phone,
    avatar: Joi.string().uri().optional(),
    socialLinks: Joi.object({
      linkedin: Joi.string().uri().optional(),
      github: Joi.string().uri().optional(),
      portfolio: Joi.string().uri().optional()
    }).optional(),
    preferences: Joi.object({
      emailNotifications: Joi.boolean().default(true),
      pushNotifications: Joi.boolean().default(true),
      privacyLevel: CommonSchemas.privacyLevel.default('college')
    }).optional()
  }),

  update: Joi.object({
    fullName: Joi.string().min(2).max(100).optional(),
    bio: Joi.string().max(500).optional(),
    skills: CommonSchemas.skills.optional(),
    phone: CommonSchemas.phone.optional(),
    avatar: Joi.string().uri().optional(),
    socialLinks: Joi.object({
      linkedin: Joi.string().uri().optional(),
      github: Joi.string().uri().optional(),
      portfolio: Joi.string().uri().optional()
    }).optional(),
    preferences: Joi.object({
      emailNotifications: Joi.boolean().optional(),
      pushNotifications: Joi.boolean().optional(),
      privacyLevel: CommonSchemas.privacyLevel.optional()
    }).optional()
  }),

  query: Joi.object({
    ...CommonSchemas.pagination.describe().keys,
    sort: CommonSchemas.sort,
    search: CommonSchemas.search,
    skills: Joi.array().items(Joi.string()).optional(),
    college: Joi.string().optional(),
    verified: Joi.boolean().optional(),
    ...CommonSchemas.dateRange.describe().keys
  })
}

/**
 * Task validation schemas
 */
export const TaskSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string().valid('academic', 'technical', 'creative', 'other').required(),
    skillsRequired: CommonSchemas.skills,
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').required(),
    estimatedTime: Joi.number().min(1).max(240).required(),
    budget: Joi.object({
      amount: Joi.number().min(0).required(),
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').default('USD')
    }).required(),
    deadline: Joi.date().iso().min('now').required(),
    attachments: Joi.array().items(CommonSchemas.file).optional(),
    tags: CommonSchemas.tags,
    isRemote: Joi.boolean().default(false),
    location: CommonSchemas.location.optional(),
    maxApplicants: Joi.number().integer().min(1).max(50).default(10)
  }),

  update: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    skillsRequired: CommonSchemas.skills.optional(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
    estimatedTime: Joi.number().min(1).max(240).optional(),
    budget: Joi.object({
      amount: Joi.number().min(0).optional(),
      currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').optional()
    }).optional(),
    deadline: Joi.date().iso().min('now').optional(),
    tags: CommonSchemas.tags.optional(),
    status: Joi.string().valid('open', 'assigned', 'in_progress', 'completed', 'cancelled').optional(),
    maxApplicants: Joi.number().integer().min(1).max(50).optional()
  })
}

/**
 * Validation middleware factory
 */
export const validate = (schema, property = 'body') => {
  return asyncHandler(async (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }))

      throw new ValidationError('Validation failed', errors)
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value
    next()
  })
}

/**
 * Validate request parameters
 */
export const validateParams = (schema) => validate(schema, 'params')

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => validate(schema, 'query')

/**
 * Validate request body
 */
export const validateBody = (schema) => validate(schema, 'body')

/**
 * Custom validation helpers
 */
export const ValidationHelpers = {
  /**
   * Check if value is a valid MongoDB ObjectId
   */
  isValidObjectId(value) {
    return /^[0-9a-fA-F]{24}$/.test(value)
  },

  /**
   * Sanitize string input
   */
  sanitizeString(str) {
    if (typeof str !== 'string') return str
    return str.trim().replace(/\s+/g, ' ')
  },
  /**
   * Validate college email domain
   */
  async validateCollegeDomain(email) {
    // Extract domain from email for future college validation
    // For now, return valid as we'll implement this later
    return { valid: true, college: null }
  },

  /**
   * Validate file upload
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    } = options

    const errors = []

    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`)
    }

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`)
    }

    return {
      valid: errors.length === 0,
      errors
    }
  },

  /**
   * Validate skills array
   */
  validateSkills(skills) {
    if (!Array.isArray(skills)) return { valid: false, errors: ['Skills must be an array'] }
    
    const errors = []
    const uniqueSkills = [...new Set(skills.map(skill => skill.toLowerCase()))]
    
    if (uniqueSkills.length !== skills.length) {
      errors.push('Duplicate skills are not allowed')
    }
    
    return {
      valid: errors.length === 0,
      errors,
      sanitized: uniqueSkills
    }
  }
}
