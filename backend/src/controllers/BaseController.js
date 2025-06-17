// SkillLance Base Controller
// Purpose: Base class for all controllers with common functionality

import { ResponseHelper, PaginationHelper, QueryHelper } from '../utils/response.js'
import { ValidationError, NotFoundError, asyncHandler } from '../errors/index.js'

/**
 * Base Controller class
 * All controllers should extend this class for consistent behavior
 */
export class BaseController {
  constructor(service) {
    this.service = service
    
    // Bind methods to maintain context
    this.create = this.create.bind(this)
    this.getById = this.getById.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.list = this.list.bind(this)
  }

  /**
   * Get authenticated user from request
   */
  getAuthenticatedUser(req) {
    return req.user || null
  }

  /**
   * Validate required fields
   */
  validateRequiredFields(data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(', ')}`,
        missingFields.map(field => ({ field, message: `${field} is required` }))
      )
    }
  }

  /**
   * Generic create method
   */
  create = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.create(req.body, user)
    
    return ResponseHelper.created(res, 'Resource created successfully', result)
  })

  /**
   * Generic get by ID method
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.getById(id, user)
    
    if (!result) {
      throw new NotFoundError('Resource', id)
    }
    
    return ResponseHelper.success(res, 'Resource retrieved successfully', result)
  })

  /**
   * Generic update method
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.update(id, req.body, user)
    
    if (!result) {
      throw new NotFoundError('Resource', id)
    }
    
    return ResponseHelper.updated(res, 'Resource updated successfully', result)
  })

  /**
   * Generic delete method
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = this.getAuthenticatedUser(req)
    const result = await this.service.delete(id, user)
    
    if (!result) {
      throw new NotFoundError('Resource', id)
    }
    
    return ResponseHelper.deleted(res, 'Resource deleted successfully')
  })

  /**
   * Generic list method with pagination
   */
  list = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const pagination = PaginationHelper.fromQuery(req.query)
    const sort = QueryHelper.buildSort(req.query.sort)
    const filter = this.buildFilter(req.query)
    const projection = QueryHelper.buildProjection(req.query.fields)
    
    const options = {
      filter,
      sort,
      pagination,
      projection
    }
    
    const result = await this.service.list(options, user)
    
    // Update pagination with actual total
    const finalPagination = {
      ...pagination,
      total: result.total,
      pages: Math.ceil(result.total / pagination.limit)
    }
    
    finalPagination.hasNext = pagination.page < finalPagination.pages
    finalPagination.hasPrev = pagination.page > 1
    
    return ResponseHelper.paginated(
      res, 
      'Resources retrieved successfully', 
      result.items, 
      finalPagination
    )
  })

  /**
   * Build filter object - override in specific controllers
   */
  buildFilter(query) {
    return QueryHelper.buildFilter(query, this.getAllowedFilterFields())
  }

  /**
   * Get allowed filter fields - override in specific controllers
   */
  getAllowedFilterFields() {
    return []
  }

  /**
   * Health check method
   */
  healthCheck = asyncHandler(async (req, res) => {
    const health = await this.service.healthCheck()
    return ResponseHelper.success(res, 'Service is healthy', health)
  })

  /**
   * Bulk operations
   */
  bulkCreate = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const { items } = req.body
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required and must not be empty')
    }
    
    const result = await this.service.bulkCreate(items, user)
    return ResponseHelper.created(res, `${result.created} resources created successfully`, result)
  })

  bulkUpdate = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const { items } = req.body
    
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items array is required and must not be empty')
    }
    
    const result = await this.service.bulkUpdate(items, user)
    return ResponseHelper.updated(res, `${result.updated} resources updated successfully`, result)
  })

  bulkDelete = asyncHandler(async (req, res) => {
    const user = this.getAuthenticatedUser(req)
    const { ids } = req.body
    
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('IDs array is required and must not be empty')
    }
    
    const result = await this.service.bulkDelete(ids, user)
    return ResponseHelper.deleted(res, `${result.deleted} resources deleted successfully`)
  })
}

/**
 * Controller factory for creating controllers with specific services
 */
export class ControllerFactory {
  static create(service) {
    return new BaseController(service)
  }
  
  static createWithCustomMethods(service, customMethods = {}) {
    const controller = new BaseController(service)
    
    // Add custom methods
    Object.keys(customMethods).forEach(methodName => {
      controller[methodName] = asyncHandler(customMethods[methodName].bind(controller))
    })
    
    return controller
  }
}
