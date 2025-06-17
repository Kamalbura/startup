// SkillLance Custom Error Classes
// Purpose: Standardized error handling with proper HTTP status codes and error types

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details
    this.isOperational = true
    this.timestamp = new Date().toISOString()

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      success: false,
      error: {
        name: this.name,
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
      }
    }
  }
}

/**
 * Validation Error - 400 Bad Request
 * Used for input validation failures
 */
export class ValidationError extends AppError {
  constructor(message = 'Invalid input data', details = null) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

/**
 * Authentication Error - 401 Unauthorized
 * Used for authentication failures
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

/**
 * Authorization Error - 403 Forbidden
 * Used for authorization failures
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

/**
 * Not Found Error - 404 Not Found
 * Used when resources are not found
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = null) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`
    super(message, 404, 'NOT_FOUND_ERROR', { resource, id })
  }
}

/**
 * Conflict Error - 409 Conflict
 * Used for resource conflicts (e.g., duplicate entries)
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details = null) {
    super(message, 409, 'CONFLICT_ERROR', details)
  }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 * Used for rate limiting violations
 */
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', retryAfter = null) {
    super(message, 429, 'RATE_LIMIT_ERROR', { retryAfter })
  }
}

/**
 * Service Unavailable Error - 503 Service Unavailable
 * Used for external service failures
 */
export class ServiceUnavailableError extends AppError {
  constructor(service = 'External service', message = null) {
    const errorMessage = message || `${service} is currently unavailable`
    super(errorMessage, 503, 'SERVICE_UNAVAILABLE_ERROR', { service })
  }
}

/**
 * Database Error - 500 Internal Server Error
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', operation = null) {
    super(message, 500, 'DATABASE_ERROR', { operation })
  }
}

/**
 * External API Error - 502 Bad Gateway
 * Used for external API failures
 */
export class ExternalAPIError extends AppError {
  constructor(api = 'External API', message = null, statusCode = 502) {
    const errorMessage = message || `${api} request failed`
    super(errorMessage, statusCode, 'EXTERNAL_API_ERROR', { api })
  }
}

/**
 * Business Logic Error - 422 Unprocessable Entity
 * Used for business rule violations
 */
export class BusinessLogicError extends AppError {
  constructor(message = 'Business rule violation', rule = null) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR', { rule })
  }
}

/**
 * Error factory for creating errors from different sources
 */
export class ErrorFactory {
  /**
   * Create error from Mongoose validation error
   */
  static fromMongooseValidation(error) {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }))
    
    return new ValidationError('Validation failed', errors)
  }

  /**
   * Create error from Mongoose duplicate key error
   */
  static fromMongooseDuplicateKey(error) {
    const field = Object.keys(error.keyValue)[0]
    const value = error.keyValue[field]
    
    return new ConflictError(`${field} '${value}' already exists`, {
      field,
      value,
      duplicateKey: true
    })
  }

  /**
   * Create error from Firebase Auth error
   */
  static fromFirebaseAuth(error) {
    switch (error.code) {
      case 'auth/invalid-token':
      case 'auth/token-expired':
        return new AuthenticationError('Invalid or expired token')
      case 'auth/insufficient-permission':
        return new AuthorizationError('Insufficient permissions')
      case 'auth/user-not-found':
        return new NotFoundError('User')
      default:
        return new AppError(`Authentication error: ${error.message}`, 401, 'FIREBASE_AUTH_ERROR')
    }
  }

  /**
   * Create error from unknown error
   */
  static fromUnknown(error) {
    if (error instanceof AppError) {
      return error
    }

    // Handle Mongoose errors
    if (error.name === 'ValidationError') {
      return this.fromMongooseValidation(error)
    }

    if (error.code === 11000) {
      return this.fromMongooseDuplicateKey(error)
    }

    // Handle Firebase errors
    if (error.code && error.code.startsWith('auth/')) {
      return this.fromFirebaseAuth(error)
    }

    // Default to internal server error
    return new AppError(
      error.message || 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR'
    )
  }
}

/**
 * Error handler middleware
 * Processes all errors and sends standardized responses
 */
export const errorHandler = (error, req, res, next) => {
  const appError = ErrorFactory.fromUnknown(error)
  
  // Log error (avoid logging validation errors to reduce noise)
  if (appError.statusCode >= 500) {
    console.error('❌ Server Error:', {
      error: appError.name,
      message: appError.message,
      code: appError.errorCode,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      stack: appError.stack
    })
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Client Error:', {
      error: appError.name,
      message: appError.message,
      code: appError.errorCode,
      url: req.originalUrl,
      method: req.method
    })
  }

  // Send error response
  return res.status(appError.statusCode).json(appError.toJSON())
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Not found handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError('API endpoint', req.originalUrl)
  next(error)
}
