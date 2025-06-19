// SkillLance Anonymous Requests API Service
// Purpose: Connect frontend to backend API for anonymous help requests

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://skilllance-backend-9zle1la22-kamals-projects-a8c83d76.vercel.app'
  : 'http://localhost:5000'

const API_VERSION = 'v1'
const API_PREFIX = `/api/${API_VERSION}`

class AnonymousRequestsAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}${API_PREFIX}/anonymous`
  }

  // Helper method for making API requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Add Firebase Auth token if available
    const user = JSON.parse(localStorage.getItem('firebaseUser') || '{}')
    if (user?.accessToken) {
      defaultOptions.headers['Authorization'] = `Bearer ${user.accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Create a new anonymous help request
  async createRequest(requestData) {
    return this.makeRequest('/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  // Get the real-time help feed
  async getFeed(filters = {}) {
    const queryParams = new URLSearchParams()
    
    // Add filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item))
        } else {
          queryParams.set(key, value)
        }      }
    })

    const queryString = queryParams.toString()
    const endpoint = queryString ? `/feed?${queryString}` : '/feed'
    
    return this.makeRequest(endpoint)
  }

  // Get user's own requests
  async getMyRequests() {
    return this.makeRequest('/my-requests')
  }

  // Offer help for a request
  async offerHelp(requestId, offerData) {
    return this.makeRequest(`/request/${requestId}/offer`, {
      method: 'POST',
      body: JSON.stringify(offerData),
    })
  }

  // Accept a help offer
  async acceptOffer(requestId, helperId) {
    return this.makeRequest(`/request/${requestId}/accept/${helperId}`, {
      method: 'POST',
    })
  }

  // Mark request as completed
  async completeRequest(requestId, completionData) {
    return this.makeRequest(`/request/${requestId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    })
  }

  // Cancel a request
  async cancelRequest(requestId) {
    return this.makeRequest(`/request/${requestId}/cancel`, {
      method: 'DELETE',
    })
  }

  // Get request details by session ID
  async getRequestBySessionId(sessionId) {
    return this.makeRequest(`/request/${sessionId}`)
  }

  // Increment view count for a request
  async incrementViews(requestId) {
    return this.makeRequest(`/request/${requestId}/view`, {
      method: 'POST',
    })
  }
}

// Create and export a singleton instance
const anonymousRequestsAPI = new AnonymousRequestsAPI()

export default anonymousRequestsAPI

// Export individual methods for easier imports
export const {
  createRequest,
  getFeed,
  getMyRequests,
  offerHelp,
  acceptOffer,
  completeRequest,
  cancelRequest,
  getRequestBySessionId,
  incrementViews
} = anonymousRequestsAPI
