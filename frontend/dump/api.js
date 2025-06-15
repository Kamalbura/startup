// CampusKarma API Service
// Purpose: Centralized API calls with authentication handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('campuskarma_token')
  }

  // Set auth token
  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('campuskarma_token', token)
    } else {
      localStorage.removeItem('campuskarma_token')
    }
  }

  // Get auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }
    
    return headers
  }

  // Generic API call
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.getHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async sendMagicLink(email) {
    return this.apiCall('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyMagicLink(token, email) {
    return this.apiCall('/auth/verify-magic-link', {
      method: 'POST',
      body: JSON.stringify({ token, email }),
    })
  }

  // OTP Authentication (fallback)
  async sendOTP(email) {
    return this.apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyOTP(email, otp) {
    return this.apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
  }

  async refreshToken() {
    return this.apiCall('/auth/refresh-token', {
      method: 'POST',
    })
  }

  async logout() {
    const result = await this.apiCall('/auth/logout', {
      method: 'POST',
    })
    this.setToken(null)
    return result
  }

  async getCurrentUser() {
    return this.apiCall('/auth/me')
  }

  async verifyToken() {
    return this.apiCall('/auth/verify-token')
  }

  // User endpoints
  async getUserProfile() {
    return this.apiCall('/users/profile')
  }

  async updateUserProfile(profileData) {
    return this.apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async searchUsers(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters })
    return this.apiCall(`/users/search?${params}`)
  }

  // Task endpoints
  async getTasks(filters = {}) {
    const params = new URLSearchParams(filters)
    return this.apiCall(`/tasks?${params}`)
  }

  async createTask(taskData) {
    return this.apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async getTask(taskId) {
    return this.apiCall(`/tasks/${taskId}`)
  }

  async bidOnTask(taskId, bidData) {
    return this.apiCall(`/tasks/${taskId}/bid`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    })
  }

  // Skills endpoints
  async getSkills(category = '') {
    const params = category ? `?category=${category}` : ''
    return this.apiCall(`/skills${params}`)
  }

  async getTrendingSkills() {
    return this.apiCall('/skills/trending')
  }
}

// Export singleton instance
export default new ApiService()
