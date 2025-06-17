// SkillLance Base Service
// Purpose: Base class for all services with common business logic patterns

import { ValidationError, NotFoundError, AuthorizationError, DatabaseError } from '../errors/index.js'

/**
 * Base Service class
 * All services should extend this class for consistent behavior
 */
export class BaseService {
  constructor(repository, model) {
    this.repository = repository
    this.model = model
  }

  /**
   * Create a new resource
   */
  async create(data, user = null) {
    try {
      // Perform pre-creation validation
      await this.validateCreate(data, user)
      
      // Transform data before creation
      const transformedData = await this.transformForCreate(data, user)
      
      // Create the resource
      const result = await this.repository.create(transformedData)
      
      // Post-creation processing
      await this.afterCreate(result, user)
      
      return this.transformForResponse(result, user)
    } catch (error) {
      throw this.handleError(error, 'create')
    }
  }

  /**
   * Get a resource by ID
   */
  async getById(id, user = null) {
    try {
      const result = await this.repository.findById(id)
      
      if (!result) {
        return null
      }
      
      // Check permissions
      await this.checkReadPermission(result, user)
      
      return this.transformForResponse(result, user)
    } catch (error) {
      throw this.handleError(error, 'getById')
    }
  }

  /**
   * Update a resource
   */
  async update(id, data, user = null) {
    try {
      const existing = await this.repository.findById(id)
      
      if (!existing) {
        return null
      }
      
      // Check permissions
      await this.checkUpdatePermission(existing, user)
      
      // Perform pre-update validation
      await this.validateUpdate(data, existing, user)
      
      // Transform data before update
      const transformedData = await this.transformForUpdate(data, existing, user)
      
      // Update the resource
      const result = await this.repository.update(id, transformedData)
      
      // Post-update processing
      await this.afterUpdate(result, existing, user)
      
      return this.transformForResponse(result, user)
    } catch (error) {
      throw this.handleError(error, 'update')
    }
  }

  /**
   * Delete a resource
   */
  async delete(id, user = null) {
    try {
      const existing = await this.repository.findById(id)
      
      if (!existing) {
        return null
      }
      
      // Check permissions
      await this.checkDeletePermission(existing, user)
      
      // Perform pre-deletion validation
      await this.validateDelete(existing, user)
      
      // Delete the resource
      const result = await this.repository.delete(id)
      
      // Post-deletion processing
      await this.afterDelete(existing, user)
      
      return result
    } catch (error) {
      throw this.handleError(error, 'delete')
    }
  }

  /**
   * List resources with filtering, sorting, and pagination
   */
  async list(options = {}, user = null) {
    try {
      const {
        filter = {},
        sort = { createdAt: -1 },
        pagination = { page: 1, limit: 10 },
        projection = {}
      } = options

      // Apply user-specific filters
      const finalFilter = await this.applyUserFilter(filter, user)
      
      // Get total count
      const total = await this.repository.count(finalFilter)
      
      // Get items
      const items = await this.repository.find(finalFilter, {
        sort,
        skip: pagination.offset,
        limit: pagination.limit,
        projection
      })

      // Transform results
      const transformedItems = await Promise.all(
        items.map(item => this.transformForResponse(item, user))
      )

      return {
        items: transformedItems,
        total,
        page: pagination.page,
        pages: Math.ceil(total / pagination.limit)
      }
    } catch (error) {
      throw this.handleError(error, 'list')
    }
  }

  /**
   * Bulk create resources
   */
  async bulkCreate(items, user = null) {
    try {
      const results = []
      const errors = []

      for (const [index, item] of items.entries()) {
        try {
          const result = await this.create(item, user)
          results.push(result)
        } catch (error) {
          errors.push({ index, error: error.message })
        }
      }      return {
        created: results.length,
        errorsCount: errors.length,
        results,
        errors
      }
    } catch (error) {
      throw this.handleError(error, 'bulkCreate')
    }
  }

  /**
   * Bulk update resources
   */
  async bulkUpdate(items, user = null) {
    try {
      const results = []
      const errors = []

      for (const [index, item] of items.entries()) {
        try {
          if (!item.id) {
            errors.push({ index, error: 'ID is required for update' })
            continue
          }
          
          const result = await this.update(item.id, item, user)
          if (result) {
            results.push(result)
          } else {
            errors.push({ index, error: 'Resource not found' })
          }
        } catch (error) {
          errors.push({ index, error: error.message })
        }
      }      return {
        updated: results.length,
        errorsCount: errors.length,
        results,
        errors
      }
    } catch (error) {
      throw this.handleError(error, 'bulkUpdate')
    }
  }

  /**
   * Bulk delete resources
   */
  async bulkDelete(ids, user = null) {
    try {
      const results = []
      const errors = []

      for (const [index, id] of ids.entries()) {
        try {
          const result = await this.delete(id, user)
          if (result) {
            results.push(id)
          } else {
            errors.push({ index, id, error: 'Resource not found' })
          }
        } catch (error) {
          errors.push({ index, id, error: error.message })
        }
      }      return {
        deleted: results.length,
        errorsCount: errors.length,
        results,
        errors
      }
    } catch (error) {
      throw this.handleError(error, 'bulkDelete')
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const stats = await this.repository.getStats()
      return {
        status: 'healthy',
        service: this.constructor.name,
        stats,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        service: this.constructor.name,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  // ==============================
  // Override these methods in specific services
  // ==============================

  /**
   * Validate data before creation
   */
  async validateCreate(data, user) {
    // Override in specific services
  }

  /**
   * Validate data before update
   */
  async validateUpdate(data, existing, user) {
    // Override in specific services
  }

  /**
   * Validate before deletion
   */
  async validateDelete(existing, user) {
    // Override in specific services
  }

  /**
   * Transform data before creation
   */
  async transformForCreate(data, user) {
    return data
  }

  /**
   * Transform data before update
   */
  async transformForUpdate(data, existing, user) {
    return data
  }

  /**
   * Transform data for response
   */
  async transformForResponse(data, user) {
    return data
  }

  /**
   * Check read permission
   */
  async checkReadPermission(resource, user) {
    // Override in specific services
  }

  /**
   * Check update permission
   */
  async checkUpdatePermission(resource, user) {
    // Override in specific services
  }

  /**
   * Check delete permission
   */
  async checkDeletePermission(resource, user) {
    // Override in specific services
  }

  /**
   * Apply user-specific filters
   */
  async applyUserFilter(filter, user) {
    return filter
  }

  /**
   * Post-creation processing
   */
  async afterCreate(result, user) {
    // Override in specific services
  }

  /**
   * Post-update processing
   */
  async afterUpdate(result, existing, user) {
    // Override in specific services
  }

  /**
   * Post-deletion processing
   */
  async afterDelete(existing, user) {
    // Override in specific services
  }

  /**
   * Handle and transform errors
   */
  handleError(error, operation) {
    console.error(`${this.constructor.name} ${operation} error:`, error)
    
    if (error instanceof ValidationError || 
        error instanceof NotFoundError || 
        error instanceof AuthorizationError) {
      return error
    }
    
    return new DatabaseError(`${operation} operation failed: ${error.message}`, operation)
  }
}
