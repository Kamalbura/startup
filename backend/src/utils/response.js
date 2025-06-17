// SkillLance API Response Utilities
// Purpose: Standardized response formatting for consistent API responses

/**
 * Standard API response structure
 */
export class APIResponse {
  constructor(success = true, message = '', data = null, meta = null) {
    this.success = success
    this.message = message
    this.timestamp = new Date().toISOString()
    
    if (data !== null) {
      this.data = data
    }
    
    if (meta !== null) {
      this.meta = meta
    }
  }

  static success(message = 'Success', data = null, meta = null) {
    return new APIResponse(true, message, data, meta)
  }

  static error(message = 'Error', data = null, meta = null) {
    return new APIResponse(false, message, data, meta)
  }

  static created(message = 'Resource created successfully', data = null, meta = null) {
    return new APIResponse(true, message, data, meta)
  }

  static updated(message = 'Resource updated successfully', data = null, meta = null) {
    return new APIResponse(true, message, data, meta)
  }

  static deleted(message = 'Resource deleted successfully', data = null, meta = null) {
    return new APIResponse(true, message, data, meta)
  }

  static paginated(message = 'Success', data = [], pagination = {}) {
    const meta = {
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        pages: pagination.pages || Math.ceil(pagination.total / pagination.limit) || 0,
        hasNext: pagination.hasNext || false,
        hasPrev: pagination.hasPrev || false
      }
    }
    
    return new APIResponse(true, message, data, meta)
  }
}

/**
 * Response helper methods for Express.js
 */
export const ResponseHelper = {
  /**
   * Send success response
   */
  success(res, message = 'Success', data = null, statusCode = 200, meta = null) {
    const response = APIResponse.success(message, data, meta)
    return res.status(statusCode).json(response)
  },

  /**
   * Send created response
   */
  created(res, message = 'Resource created successfully', data = null, meta = null) {
    const response = APIResponse.created(message, data, meta)
    return res.status(201).json(response)
  },

  /**
   * Send updated response
   */
  updated(res, message = 'Resource updated successfully', data = null, meta = null) {
    const response = APIResponse.updated(message, data, meta)
    return res.status(200).json(response)
  },

  /**
   * Send deleted response
   */
  deleted(res, message = 'Resource deleted successfully', data = null, meta = null) {
    const response = APIResponse.deleted(message, data, meta)
    return res.status(200).json(response)
  },

  /**
   * Send paginated response
   */
  paginated(res, message = 'Success', data = [], pagination = {}) {
    const response = APIResponse.paginated(message, data, pagination)
    return res.status(200).json(response)
  },

  /**
   * Send no content response
   */
  noContent(res) {
    return res.status(204).send()
  },

  /**
   * Send accepted response (for async operations)
   */
  accepted(res, message = 'Request accepted for processing', data = null, meta = null) {
    const response = APIResponse.success(message, data, meta)
    return res.status(202).json(response)
  }
}

/**
 * Pagination helper
 */
export class PaginationHelper {
  /**
   * Calculate pagination metadata
   */
  static calculatePagination(page, limit, total) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const itemsPerPage = Math.max(1, Math.min(100, parseInt(limit) || 10)) // Max 100 items per page
    const totalItems = parseInt(total) || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const offset = (currentPage - 1) * itemsPerPage

    return {
      page: currentPage,
      limit: itemsPerPage,
      total: totalItems,
      pages: totalPages,
      offset,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null
    }
  }

  /**
   * Get pagination from query parameters
   */
  static fromQuery(query) {
    return this.calculatePagination(query.page, query.limit, 0) // Total will be set later
  }

  /**
   * Generate pagination links
   */
  static generateLinks(baseUrl, pagination) {
    const links = {}

    if (pagination.hasNext) {
      links.next = `${baseUrl}?page=${pagination.nextPage}&limit=${pagination.limit}`
    }

    if (pagination.hasPrev) {
      links.prev = `${baseUrl}?page=${pagination.prevPage}&limit=${pagination.limit}`
    }

    links.first = `${baseUrl}?page=1&limit=${pagination.limit}`
    
    if (pagination.pages > 0) {
      links.last = `${baseUrl}?page=${pagination.pages}&limit=${pagination.limit}`
    }

    return links
  }
}

/**
 * Query helper for common database operations
 */
export class QueryHelper {
  /**
   * Build sort object from query string
   * Example: ?sort=name,-createdAt becomes { name: 1, createdAt: -1 }
   */
  static buildSort(sortQuery) {
    if (!sortQuery) return { createdAt: -1 } // Default sort by newest

    const sortObj = {}
    const fields = sortQuery.split(',')

    fields.forEach(field => {
      const trimmed = field.trim()
      if (trimmed.startsWith('-')) {
        sortObj[trimmed.substring(1)] = -1
      } else {
        sortObj[trimmed] = 1
      }
    })

    return sortObj
  }

  /**
   * Build filter object from query parameters
   */
  static buildFilter(query, allowedFields = []) {
    const filter = {}
    
    allowedFields.forEach(field => {
      if (query[field] !== undefined) {
        filter[field] = query[field]
      }
    })

    // Handle search parameter
    if (query.search && query.searchFields) {
      const searchFields = query.searchFields.split(',')
      filter.$or = searchFields.map(field => ({
        [field]: { $regex: query.search, $options: 'i' }
      }))
    }

    // Handle date ranges
    if (query.startDate || query.endDate) {
      filter.createdAt = {}
      if (query.startDate) {
        filter.createdAt.$gte = new Date(query.startDate)
      }
      if (query.endDate) {
        filter.createdAt.$lte = new Date(query.endDate)
      }
    }

    return filter
  }

  /**
   * Build projection object for field selection
   * Example: ?fields=name,email,-password becomes { name: 1, email: 1, password: 0 }
   */
  static buildProjection(fieldsQuery) {
    if (!fieldsQuery) return {}

    const projection = {}
    const fields = fieldsQuery.split(',')

    fields.forEach(field => {
      const trimmed = field.trim()
      if (trimmed.startsWith('-')) {
        projection[trimmed.substring(1)] = 0
      } else {
        projection[trimmed] = 1
      }
    })

    return projection
  }
}
