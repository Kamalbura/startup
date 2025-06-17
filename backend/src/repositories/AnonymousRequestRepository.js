// SkillLance Anonymous Request Repository
// Purpose: Data access layer for anonymous requests

import { BaseRepository } from './BaseRepository.js'
import AnonymousRequest from '../../models/AnonymousRequest.js'

/**
 * Anonymous Request Repository
 * Handles database operations for anonymous requests
 */
export class AnonymousRequestRepository extends BaseRepository {
  constructor() {
    super(AnonymousRequest)
  }

  /**
   * Find open requests with optional filters
   */
  async findOpenRequests(filters = {}, options = {}) {
    const query = {
      status: 'open',
      ...filters
    }

    return this.find(query, options)
  }

  /**
   * Find requests by skills
   */
  async findBySkills(skills, options = {}) {
    const query = {
      status: 'open',
      skillsNeeded: { $in: skills }
    }

    return this.find(query, options)
  }

  /**
   * Find requests by urgency level
   */
  async findByUrgency(urgencyLevels, options = {}) {
    const query = {
      status: 'open',
      urgencyLevel: Array.isArray(urgencyLevels) ? 
        { $in: urgencyLevels } : 
        urgencyLevels
    }

    return this.find(query, options)
  }

  /**
   * Find requests by anonymous user ID
   */
  async findByAnonymousUser(anonymousId, options = {}) {
    const query = {
      requesterAnonymousId: anonymousId
    }

    return this.find(query, options)
  }

  /**
   * Find requests with responses from anonymous user
   */
  async findWithResponsesFromUser(anonymousId, options = {}) {
    const query = {
      'responses.responderAnonymousId': anonymousId
    }

    return this.find(query, options)
  }

  /**
   * Search requests with text query
   */
  async searchRequests(searchQuery, options = {}) {
    const query = {
      status: 'open',
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
      ]
    }

    return this.find(query, options)
  }

  /**
   * Get requests with response count
   */
  async findWithResponseCount(options = {}) {
    const pipeline = [
      { $match: { status: 'open' } },
      {
        $addFields: {
          responseCount: { $size: '$responses' }
        }
      },
      { $sort: options.sort || { createdAt: -1 } }
    ]

    if (options.skip) {
      pipeline.push({ $skip: options.skip })
    }

    if (options.limit) {
      pipeline.push({ $limit: options.limit })
    }

    return this.aggregate(pipeline)
  }

  /**
   * Get trending skills from recent requests
   */
  async getTrendingSkills(daysBack = 7, limit = 10) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'open'
        }
      },
      { $unwind: '$skillsNeeded' },
      {
        $group: {
          _id: '$skillsNeeded',
          count: { $sum: 1 },
          avgEstimatedTime: { $avg: '$estimatedTime' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]

    return this.aggregate(pipeline)
  }

  /**
   * Get request statistics
   */
  async getRequestStats() {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          openRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          inProgressRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          completedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          avgEstimatedTime: { $avg: '$estimatedTime' },
          avgResponseCount: { $avg: { $size: '$responses' } }
        }
      }
    ]

    const result = await this.aggregate(pipeline)
    return result[0] || {
      totalRequests: 0,
      openRequests: 0,
      inProgressRequests: 0,
      completedRequests: 0,
      avgEstimatedTime: 0,
      avgResponseCount: 0
    }
  }

  /**
   * Get user-specific statistics
   */
  async getUserStats(anonymousId) {
    const [requestsCreated, responsesGiven] = await Promise.all([
      this.count({ requesterAnonymousId: anonymousId }),
      this.count({ 'responses.responderAnonymousId': anonymousId })
    ])

    return {
      requestsCreated,
      responsesGiven
    }
  }

  /**
   * Find requests by college hint
   */
  async findByCollegeHint(collegeHint, options = {}) {
    const query = {
      status: 'open',
      collegeHint: { $regex: collegeHint, $options: 'i' }
    }

    return this.find(query, options)
  }

  /**
   * Find remote requests
   */
  async findRemoteRequests(options = {}) {
    const query = {
      status: 'open',
      isRemote: true
    }

    return this.find(query, options)
  }

  /**
   * Find requests with specific tags
   */
  async findByTags(tags, options = {}) {
    const query = {
      status: 'open',
      tags: { $in: tags }
    }

    return this.find(query, options)
  }

  /**
   * Find requests by estimated time range
   */
  async findByTimeRange(minTime, maxTime, options = {}) {
    const query = {
      status: 'open',
      estimatedTime: {
        $gte: minTime,
        $lte: maxTime
      }
    }

    return this.find(query, options)
  }

  /**
   * Get requests with recent activity
   */
  async findWithRecentActivity(hoursBack = 24, options = {}) {
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - hoursBack)

    const query = {
      $or: [
        { createdAt: { $gte: startDate } },
        { 'responses.createdAt': { $gte: startDate } }
      ]
    }

    return this.find(query, options)
  }

  /**
   * Bulk update request statuses
   */
  async bulkUpdateStatus(requestIds, newStatus) {
    const filter = { _id: { $in: requestIds } }
    const update = { 
      status: newStatus, 
      updatedAt: new Date() 
    }

    return this.updateMany(filter, update)
  }

  /**
   * Get expired requests (past deadline)
   */
  async findExpiredRequests(options = {}) {
    const query = {
      status: { $in: ['open', 'in_progress'] },
      createdAt: {
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days old
      }
    }

    return this.find(query, options)
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(daysBack = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          requestsCreated: { $sum: 1 },
          totalResponses: { $sum: { $size: '$responses' } },
          avgResponseTime: { $avg: '$estimatedTime' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]

    return this.aggregate(pipeline)
  }
}
