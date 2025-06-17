// SkillLance Anonymous Request Service
// Purpose: Business logic for privacy-first help requests

import { BaseService } from './BaseService.js'
import { ValidationError, NotFoundError, AuthorizationError } from '../errors/index.js'
import crypto from 'crypto'

/**
 * Anonymous Request Service
 * Handles business logic for anonymous help requests
 */
export class AnonymousRequestService extends BaseService {
  constructor(repository) {
    super(repository, 'AnonymousRequest')
  }

  /**
   * Create anonymous request with privacy protection
   */
  async create(data, user = null) {
    if (!user) {
      throw new ValidationError('Authentication required to create anonymous request')
    }

    return super.create(data, user)
  }

  /**
   * Get requests visible to user based on privacy settings
   */
  async list(options = {}, user = null) {
    // Anonymous requests are visible to all authenticated users
    // but with privacy-protected data
    return super.list(options, user)
  }

  /**
   * Get single request with privacy checks
   */
  async getById(id, user = null) {
    const request = await super.getById(id, user)
    
    if (!request) {
      return null
    }

    // Additional privacy checks can be added here
    return request
  }

  /**
   * Update request - only creator can update
   */
  async update(id, data, user = null) {
    if (!user) {
      throw new AuthorizationError('Authentication required to update request')
    }

    return super.update(id, data, user)
  }

  /**
   * Delete request - only creator can delete
   */
  async delete(id, user = null) {
    if (!user) {
      throw new AuthorizationError('Authentication required to delete request')
    }

    return super.delete(id, user)
  }

  /**
   * Respond to anonymous request
   */
  async respond(requestId, responseData, user) {
    if (!user) {
      throw new ValidationError('Authentication required to respond to request')
    }

    const request = await this.repository.findById(requestId)
    if (!request) {
      throw new NotFoundError('Anonymous request', requestId)
    }

    if (request.status !== 'open') {
      throw new ValidationError('Cannot respond to a request that is not open')
    }

    // Check if user has already responded
    const existingResponse = request.responses.find(
      response => response.responderAnonymousId === this.generateAnonymousId(user.uid)
    )

    if (existingResponse) {
      throw new ValidationError('You have already responded to this request')
    }

    // Create response
    const response = {
      responderAnonymousId: this.generateAnonymousId(user.uid),
      message: responseData.message,
      proposedSolution: responseData.proposedSolution,
      estimatedTime: responseData.estimatedTime,
      avatar: this.generateAvatar(),
      createdAt: new Date()
    }

    // Add response to request
    request.responses.push(response)
    request.responseCount += 1

    const updatedRequest = await this.repository.update(requestId, {
      responses: request.responses,
      responseCount: request.responseCount
    })

    return this.transformForResponse(updatedRequest, user)
  }

  /**
   * Accept a response (only request creator can do this)
   */
  async acceptResponse(requestId, responseId, user) {
    if (!user) {
      throw new AuthorizationError('Authentication required to accept response')
    }

    const request = await this.repository.findById(requestId)
    if (!request) {
      throw new NotFoundError('Anonymous request', requestId)
    }

    // Check if user is the request creator
    if (request.requesterAnonymousId !== this.generateAnonymousId(user.uid)) {
      throw new AuthorizationError('Only the request creator can accept responses')
    }

    const response = request.responses.find(r => r._id.toString() === responseId)
    if (!response) {
      throw new NotFoundError('Response', responseId)
    }

    if (response.status !== 'pending') {
      throw new ValidationError('Response has already been processed')
    }

    // Update response status
    response.status = 'accepted'
    response.acceptedAt = new Date()

    // Update request status
    request.status = 'in_progress'
    request.acceptedResponseId = responseId

    const updatedRequest = await this.repository.update(requestId, {
      responses: request.responses,
      status: request.status,
      acceptedResponseId: request.acceptedResponseId
    })

    return this.transformForResponse(updatedRequest, user)
  }

  /**
   * Mark request as completed
   */
  async completeRequest(requestId, completionData, user) {
    if (!user) {
      throw new AuthorizationError('Authentication required to complete request')
    }

    const request = await this.repository.findById(requestId)
    if (!request) {
      throw new NotFoundError('Anonymous request', requestId)
    }

    // Check if user is the request creator
    if (request.requesterAnonymousId !== this.generateAnonymousId(user.uid)) {
      throw new AuthorizationError('Only the request creator can complete requests')
    }

    if (request.status !== 'in_progress') {
      throw new ValidationError('Request must be in progress to be completed')
    }

    const updatedRequest = await this.repository.update(requestId, {
      status: 'completed',
      completedAt: new Date(),
      rating: completionData.rating,
      feedback: completionData.feedback
    })

    return this.transformForResponse(updatedRequest, user)
  }

  /**
   * Search requests with advanced filters
   */
  async search(searchOptions, user = null) {
    const {
      query,
      skills,
      urgencyLevel,
      isRemote,
      maxEstimatedTime,
      tags,
      pagination = { page: 1, limit: 10 }
    } = searchOptions

    const filter = { status: 'open' }

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }

    // Skills filter
    if (skills && skills.length > 0) {
      filter.skillsNeeded = { $in: skills }
    }

    // Urgency filter
    if (urgencyLevel) {
      if (Array.isArray(urgencyLevel)) {
        filter.urgencyLevel = { $in: urgencyLevel }
      } else {
        filter.urgencyLevel = urgencyLevel
      }
    }

    // Remote filter
    if (typeof isRemote === 'boolean') {
      filter.isRemote = isRemote
    }

    // Time filter
    if (maxEstimatedTime) {
      filter.estimatedTime = { $lte: maxEstimatedTime }
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags }
    }

    const options = {
      filter,
      sort: this.buildSearchSort(searchOptions.sort),
      pagination
    }

    return this.list(options, user)
  }

  // ==============================
  // Validation and transformation methods
  // ==============================

  async validateCreate(data, user) {
    if (!data.title || data.title.length < 5) {
      throw new ValidationError('Title must be at least 5 characters long')
    }

    if (!data.description || data.description.length < 10) {
      throw new ValidationError('Description must be at least 10 characters long')
    }

    if (!data.skillsNeeded || data.skillsNeeded.length === 0) {
      throw new ValidationError('At least one skill must be specified')
    }

    if (!data.estimatedTime || data.estimatedTime < 1) {
      throw new ValidationError('Estimated time must be at least 1 hour')
    }
  }

  async transformForCreate(data, user) {
    return {
      ...data,
      requesterAnonymousId: this.generateAnonymousId(user.uid),
      requesterAvatar: this.generateAvatar(),
      status: 'open',
      responseCount: 0,
      responses: [],
      createdAt: new Date()
    }
  }

  async transformForResponse(data, user) {
    const response = { ...data }

    // Remove sensitive Firebase UID information
    if (response.requesterAnonymousId) {
      response.isOwnRequest = user ? 
        response.requesterAnonymousId === this.generateAnonymousId(user.uid) : 
        false
    }

    return response
  }

  async checkUpdatePermission(resource, user) {
    if (resource.requesterAnonymousId !== this.generateAnonymousId(user.uid)) {
      throw new AuthorizationError('Only the request creator can update this request')
    }
  }

  async checkDeletePermission(resource, user) {
    if (resource.requesterAnonymousId !== this.generateAnonymousId(user.uid)) {
      throw new AuthorizationError('Only the request creator can delete this request')
    }
  }

  // ==============================
  // Helper methods
  // ==============================

  /**
   * Generate anonymous user ID from Firebase UID
   */
  generateAnonymousId(firebaseUid) {
    const salt = process.env.ANON_SALT || 'skilllance'
    return crypto.createHash('sha256').update(firebaseUid + salt).digest('hex').substring(0, 16)
  }

  /**
   * Generate random avatar configuration
   */
  generateAvatar() {
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
   * Build sort options for search
   */
  buildSearchSort(sortOption) {
    switch (sortOption) {
      case 'newest':
        return { createdAt: -1 }
      case 'oldest':
        return { createdAt: 1 }
      case 'urgency':
        return { urgencyLevel: 1, createdAt: -1 }
      case 'time':
        return { estimatedTime: 1, createdAt: -1 }
      case 'responses':
        return { responseCount: -1, createdAt: -1 }
      default:
        return { createdAt: -1 }
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(user) {
    if (!user) {
      throw new ValidationError('Authentication required')
    }

    const anonymousId = this.generateAnonymousId(user.uid)
    
    const [createdCount, responseCount] = await Promise.all([
      this.repository.count({ requesterAnonymousId: anonymousId }),
      this.repository.count({ 'responses.responderAnonymousId': anonymousId })
    ])

    return {
      requestsCreated: createdCount,
      responsesGiven: responseCount,
      anonymousId
    }
  }

  /**
   * Get trending skills
   */
  async getTrendingSkills(limit = 10) {
    const pipeline = [
      { $match: { status: 'open', createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $unwind: '$skillsNeeded' },
      { $group: { _id: '$skillsNeeded', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]

    const results = await this.repository.aggregate(pipeline)
    return results.map(item => ({ skill: item._id, count: item.count }))
  }
}
