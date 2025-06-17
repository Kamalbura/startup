import { getAuthHeaders } from './firebase'

/**
 * API Client for SkillLance Backend
 * Provides centralized HTTP client with authentication, error handling, and request/response interceptors
 */
class ApiClient {
  constructor(baseURL = null) {
    this.baseURL = baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    this.timeout = 10000 // 10 seconds
    this.retryAttempts = 3
    this.retryDelay = 1000 // 1 second
  }

  /**
   * Make HTTP request with automatic retry and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
      ...options
    }

    // Add authentication headers if user is logged in
    try {
      const authHeaders = await getAuthHeaders()
      defaultOptions.headers = { ...defaultOptions.headers, ...authHeaders }
    } catch (error) {
      // User not authenticated, continue without auth headers
      console.debug('No authentication available for request')
    }

    // Handle request body
    if (defaultOptions.body && typeof defaultOptions.body === 'object') {
      defaultOptions.body = JSON.stringify(defaultOptions.body)
    }

    let lastError
    
    // Retry logic
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...defaultOptions,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response)
          throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status, errorData)
        }

        // Parse response
        const data = await this.parseResponse(response)
        return data

      } catch (error) {
        lastError = error
        
        // Don't retry on client errors (4xx) or authentication errors
        if (error.status >= 400 && error.status < 500) {
          throw error
        }

        // Don't retry on the last attempt
        if (attempt === this.retryAttempts) {
          throw error
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt)
        console.warn(`Request failed, retrying... (${attempt}/${this.retryAttempts})`)
      }
    }

    throw lastError
  }

  /**
   * Parse response based on content type
   */
  async parseResponse(response) {
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      return response.json()
    }
    
    if (contentType?.includes('text/')) {
      return response.text()
    }
    
    return response.blob()
  }

  /**
   * Parse error response
   */
  async parseErrorResponse(response) {
    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      }
      return { message: await response.text() }
    } catch {
      return { message: `HTTP ${response.status} ${response.statusText}` }
    }
  }

  /**
   * Delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // HTTP Methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data
    })
  }

  put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data
    })
  }

  patch(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // File upload utility
  async uploadFile(endpoint, file, onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)

    const authHeaders = await getAuthHeaders()
    delete authHeaders['Content-Type'] // Let browser set it for FormData

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100
          onProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            resolve(xhr.responseText)
          }
        } else {
          reject(new ApiError(`Upload failed: ${xhr.statusText}`, xhr.status))
        }
      }

      xhr.onerror = () => {
        reject(new ApiError('Upload failed: Network error'))
      }

      xhr.open('POST', `${this.baseURL}${endpoint}`)
      
      // Set auth headers
      Object.entries(authHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.send(formData)
    })
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status = null, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Create default API client instance
const apiClient = new ApiClient()

// Export both the class and default instance
export { ApiClient, ApiError }
export default apiClient
