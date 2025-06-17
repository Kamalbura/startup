// SkillLance Anonymous Request API Service
// Purpose: Handle API calls for anonymous help requests

import { auth } from '../config/firebase'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.vercel.app/api/v1' 
  : 'http://localhost:5000/api/v1'

class AnonymousRequestAPI {
  // Get auth token for API calls
  async getAuthToken() {
    const user = auth.currentUser
    if (!user) {
      throw new Error('User not authenticated')
    }
    return await user.getIdToken()
  }

  // Create anonymous help request
  async createRequest(requestData) {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create request')
      }

      return data
    } catch (error) {
      console.error('Create request error:', error)
      throw error
    }
  }
  // Get all anonymous requests (browse feed)
  async getRequests(filters = {}) {
    try {
      const token = await this.getAuthToken()
      
      // Build query parameters
      const queryParams = new URLSearchParams()
      if (filters.skills) queryParams.append('skills', filters.skills.join(','))
      if (filters.urgency) queryParams.append('urgency', filters.urgency)
      if (filters.timeFrame) queryParams.append('timeFrame', filters.timeFrame)
      if (filters.isRemote !== undefined) queryParams.append('isRemote', filters.isRemote)
      
      const url = `${API_BASE_URL}/anonymous/feed${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch requests')
      }

      return data
    } catch (error) {
      console.error('Get requests error:', error)
      throw error
    }
  }
  // Get user's own anonymous requests
  async getMyRequests() {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/my-requests`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch your requests')
      }

      return data
    } catch (error) {
      console.error('Get my requests error:', error)
      throw error
    }
  }

  // Respond to an anonymous request
  async respondToRequest(requestId, responseData) {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/request/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(responseData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to respond to request')
      }

      return data
    } catch (error) {
      console.error('Respond to request error:', error)
      throw error
    }
  }

  // Update request status (accept/decline responses)
  async updateRequestStatus(requestId, statusData) {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/request/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update request status')
      }

      return data
    } catch (error) {
      console.error('Update request status error:', error)
      throw error
    }
  }

  // Delete/cancel request
  async deleteRequest(requestId) {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/request/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete request')
      }

      return data
    } catch (error) {
      console.error('Delete request error:', error)
      throw error
    }
  }

  // Get request analytics/stats
  async getRequestStats() {
    try {
      const token = await this.getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/anonymous/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats')
      }

      return data
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const anonymousRequestAPI = new AnonymousRequestAPI()
export default anonymousRequestAPI
