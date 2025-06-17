// SkillLance Anonymous Request Controller
// Purpose: HTTP request handling for anonymous requests

import { BaseController } from './BaseController.js'
import { AnonymousRequestService } from '../services/AnonymousRequestService.js'
import { AnonymousRequestRepository } from '../repositories/AnonymousRequestRepository.js'
import { validateBody, validateQuery, validateParams, AnonymousRequestSchemas, CommonSchemas } from '../validators/index.js'
import { ResponseHelper } from '../utils/response.js'
import { ValidationError, NotFoundError, asyncHandler } from '../errors/index.js'
import Joi from 'joi'

/**
 * Anonymous Request Controller
 * Handles HTTP requests for anonymous help requests
 */
export class AnonymousRequestController extends BaseController {
  constructor() {
    const repository = new AnonymousRequestRepository()
    const service = new AnonymousRequestService(repository)
    super(service)
  }

  /**
   * Get allowed filter fields for queries
   */
  getAllowedFilterFields() {
    return ['skills', 'urgencyLevel', 'isRemote', 'status', 'tags']
  }

  /**
   * Create anonymous request
   * POST /api/v1/anonymous/request
   */
  createRequest = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.create(req.body, user)
    
    return ResponseHelper.created(res, 'Anonymous request created successfully', result)
  })

  /**
   * Get all anonymous requests with filters
   * GET /api/v1/anonymous/requests
   */
  getRequests = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.list(req.query, user)
    
    return ResponseHelper.success(res, 'Requests retrieved successfully', result.items, 200, {
      pagination: {
        page: result.page,
        pages: result.pages,
        total: result.total
      }
    })
  })

  /**
   * Get single anonymous request
   * GET /api/v1/anonymous/requests/:id
   */
  getRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.getById(id, user)
    
    if (!result) {
      throw new NotFoundError('Anonymous request', id)
    }
    
    return ResponseHelper.success(res, 'Request retrieved successfully', result)
  })

  /**
   * Update anonymous request
   * PUT /api/v1/anonymous/requests/:id
   */
  updateRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.update(id, req.body, user)
    
    if (!result) {
      throw new NotFoundError('Anonymous request', id)
    }
    
    return ResponseHelper.updated(res, 'Request updated successfully', result)
  })

  /**
   * Delete anonymous request
   * DELETE /api/v1/anonymous/requests/:id
   */
  deleteRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.delete(id, user)
    
    if (!result) {
      throw new NotFoundError('Anonymous request', id)
    }
    
    return ResponseHelper.deleted(res, 'Request deleted successfully')
  })

  /**
   * Respond to anonymous request
   * POST /api/v1/anonymous/requests/:id/respond
   */
  respondToRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    
    if (!user) {
      throw new ValidationError('Authentication required to respond to request')
    }
    
    const result = await this.service.respond(id, req.body, user)
    
    return ResponseHelper.created(res, 'Response submitted successfully', result)
  })

  /**
   * Accept a response to request
   * POST /api/v1/anonymous/requests/:id/accept/:responseId
   */
  acceptResponse = asyncHandler(async (req, res) => {
    const { id, responseId } = req.params
    const user = this.getAuthenticatedUser(req)
    
    if (!user) {
      throw new ValidationError('Authentication required')
    }
    
    const result = await this.service.acceptResponse(id, responseId, user)
    
    return ResponseHelper.updated(res, 'Response accepted successfully', result)
  })

  /**
   * Complete request
   * POST /api/v1/anonymous/requests/:id/complete
   */
  completeRequest = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    
    if (!user) {
      throw new ValidationError('Authentication required')
    }
    
    const result = await this.service.completeRequest(id, req.body, user)
    
    return ResponseHelper.updated(res, 'Request completed successfully', result)
  })

  /**
   * Search requests
   * GET /api/v1/anonymous/search
   */
  searchRequests = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.search(req.query, user)
    
    return ResponseHelper.success(res, 'Search completed successfully', result.items, 200, {
      pagination: {
        page: result.page,
        pages: result.pages,
        total: result.total
      },
      query: req.query.query
    })
  })

  /**
   * Get user statistics
   * GET /api/v1/anonymous/stats
   */
  getUserStats = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    
    if (!user) {
      throw new ValidationError('Authentication required')
    }
    
    const result = await this.service.getUserStats(user)
    
    return ResponseHelper.success(res, 'User statistics retrieved successfully', result)
  })

  /**
   * Get trending skills
   * GET /api/v1/anonymous/trending-skills
   */
  getTrendingSkills = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const result = await this.service.getTrendingSkills(limit)
    
    return ResponseHelper.success(res, 'Trending skills retrieved successfully', result)
  })

  /**
   * Get request analytics
   * GET /api/v1/anonymous/analytics
   */
  getAnalytics = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    
    if (!user) {
      throw new ValidationError('Authentication required')
    }
    
    const [stats, trending] = await Promise.all([
      this.service.getUserStats(user),
      this.service.getTrendingSkills(5)
    ])
    
    return ResponseHelper.success(res, 'Analytics retrieved successfully', {
      userStats: stats,
      trendingSkills: trending
    })
  })

  /**
   * Health check for anonymous requests service
   * GET /api/v1/anonymous/health
   */
  healthCheck = asyncHandler(async (req, res) => {
    const health = await this.service.healthCheck()
    
    return ResponseHelper.success(res, 'Anonymous requests service is healthy', health)
  })
}

// Create controller instance
const anonymousRequestController = new AnonymousRequestController()

// Export route handlers with validation middleware
export const routes = {
  // Create request
  createRequest: [
    validateBody(AnonymousRequestSchemas.create),
    anonymousRequestController.createRequest
  ],

  // Get requests
  getRequests: [
    validateQuery(AnonymousRequestSchemas.query),
    anonymousRequestController.getRequests
  ],

  // Get single request
  getRequest: [
    validateParams(Joi.object({ id: CommonSchemas.objectId })),
    anonymousRequestController.getRequest
  ],

  // Update request
  updateRequest: [
    validateParams(Joi.object({ id: CommonSchemas.objectId })),
    validateBody(AnonymousRequestSchemas.update),
    anonymousRequestController.updateRequest
  ],

  // Delete request
  deleteRequest: [
    validateParams(Joi.object({ id: CommonSchemas.objectId })),
    anonymousRequestController.deleteRequest
  ],

  // Respond to request
  respondToRequest: [
    validateParams(Joi.object({ id: CommonSchemas.objectId })),
    validateBody(Joi.object({
      message: Joi.string().min(10).max(1000).required(),
      proposedSolution: Joi.string().min(10).max(2000).optional(),
      estimatedTime: Joi.number().min(1).max(240).required()
    })),
    anonymousRequestController.respondToRequest
  ],

  // Accept response
  acceptResponse: [
    validateParams(Joi.object({ 
      id: CommonSchemas.objectId,
      responseId: CommonSchemas.objectId
    })),
    anonymousRequestController.acceptResponse
  ],

  // Complete request
  completeRequest: [
    validateParams(Joi.object({ id: CommonSchemas.objectId })),
    validateBody(Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      feedback: Joi.string().max(1000).optional()
    })),
    anonymousRequestController.completeRequest
  ],

  // Search requests
  searchRequests: [
    validateQuery(Joi.object({
      query: Joi.string().min(1).max(255).optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      urgencyLevel: Joi.array().items(Joi.string().valid('low', 'medium', 'high', 'urgent')).optional(),
      isRemote: Joi.boolean().optional(),
      maxEstimatedTime: Joi.number().min(1).max(240).optional(),
      tags: Joi.array().items(Joi.string()).optional(),
      sort: Joi.string().valid('newest', 'oldest', 'urgency', 'time', 'responses').optional(),
      ...CommonSchemas.pagination.describe().keys
    })),
    anonymousRequestController.searchRequests
  ],

  // Get user stats
  getUserStats: [
    anonymousRequestController.getUserStats
  ],

  // Get trending skills
  getTrendingSkills: [
    validateQuery(Joi.object({
      limit: Joi.number().integer().min(1).max(50).optional()
    })),
    anonymousRequestController.getTrendingSkills
  ],

  // Get analytics
  getAnalytics: [
    anonymousRequestController.getAnalytics
  ],

  // Health check
  healthCheck: [
    anonymousRequestController.healthCheck
  ]
}

export default anonymousRequestController
