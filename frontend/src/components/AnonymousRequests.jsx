// SkillLance Anonymous Request System Component
// Purpose: Privacy-first help request system for students

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/FirebaseAuthContext'
import { anonymousRequestAPI } from '../services/anonymousRequestAPI'
import { 
  Plus, Clock, Users, AlertCircle, Send, Eye, EyeOff,
  Shield, Heart, MessageCircle, User, Tag, Star, RefreshCw
} from 'lucide-react'

const AnonymousRequests = () => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('browse') // browse, create, myRequests
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Create request form state
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    skillsNeeded: [],
    urgencyLevel: 'Medium',
    estimatedTime: '30 minutes',
    allowSameCollege: false,
    collegeHint: '',
    isRemote: true,
    tags: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  // Sample data for demonstration
  const sampleRequests = [
    {
      id: 1,
      title: "Need help with React useState hook",
      description: "I'm struggling with managing complex state in my React project. Need someone to explain best practices.",
      skillsNeeded: ["React", "JavaScript"],
      urgencyLevel: "Medium",
      estimatedTime: "30 minutes",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      avatar: { color: '#4F46E5', shape: 'circle', pattern: 'solid' },
      anonymousId: "Helper_001",
      isRemote: true,
      responses: 3,
      trustScore: 4.2
    },
    {
      id: 2,
      title: "Python data analysis project guidance", 
      description: "Working on a pandas dataframe analysis project and need help with data visualization using matplotlib.",
      skillsNeeded: ["Python", "Pandas", "Data Analysis"],
      urgencyLevel: "High",
      estimatedTime: "1 hour",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      avatar: { color: '#DC2626', shape: 'square', pattern: 'gradient' },
      anonymousId: "Helper_002", 
      isRemote: true,
      responses: 1,
      trustScore: 3.8
    },
    {
      id: 3,
      title: "Database design review needed",
      description: "Created my first database schema for a web app. Need experienced eyes to review and suggest improvements.",
      skillsNeeded: ["Database Design", "SQL", "PostgreSQL"],
      urgencyLevel: "Low",
      estimatedTime: "45 minutes",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      avatar: { color: '#059669', shape: 'hexagon', pattern: 'dots' },
      anonymousId: "Helper_003",
      isRemote: false,
      responses: 7,
      trustScore: 4.7
    }
  ]
  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await anonymousRequestAPI.getRequests()
      setRequests(response.data || response.requests || [])
    } catch (err) {
      console.error('Failed to load requests:', err)
      setError(err.message || 'Failed to load requests')
      // Fallback to sample data for demo
      setRequests(sampleRequests)
    } finally {
      setLoading(false)
    }
  }

  const handleSkillAdd = () => {
    if (skillInput.trim() && !newRequest.skillsNeeded.includes(skillInput.trim())) {
      setNewRequest(prev => ({
        ...prev,
        skillsNeeded: [...prev.skillsNeeded, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const handleSkillRemove = (skill) => {
    setNewRequest(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.filter(s => s !== skill)
    }))
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !newRequest.tags.includes(tagInput.trim())) {
      setNewRequest(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tag) => {
    setNewRequest(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }
  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!newRequest.title.trim() || !newRequest.description.trim() || newRequest.skillsNeeded.length === 0) {
        throw new Error('Please fill in all required fields')
      }

      await anonymousRequestAPI.createRequest(newRequest)
      
      // Reset form
      setNewRequest({
        title: '',
        description: '',
        skillsNeeded: [],
        urgencyLevel: 'Medium',
        estimatedTime: '30 minutes',
        allowSameCollege: false,
        collegeHint: '',
        isRemote: true,
        tags: []
      })
      
      // Switch to browse view and reload requests
      setActiveView('browse')
      await loadRequests()
      
    } catch (err) {
      console.error('Submit request error:', err)
      setError(err.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const renderAvatar = (avatar) => {
    const baseClasses = "w-10 h-10 flex items-center justify-center text-white font-bold text-sm"
    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-lg", 
      triangle: "rounded-lg transform rotate-45",
      hexagon: "rounded-lg"
    }
    
    return (
      <div 
        className={`${baseClasses} ${shapeClasses[avatar.shape]}`}
        style={{ backgroundColor: avatar.color }}
      >
        <User size={16} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anonymous Help Requests</h1>
          <p className="text-gray-600 mt-1">Privacy-first peer learning community</p>
        </div>        <div className="flex items-center space-x-3">
          <button
            onClick={loadRequests}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setActiveView('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Request Help</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'browse', label: 'Browse Requests', icon: Eye },
            { id: 'create', label: 'Create Request', icon: Plus },
            { id: 'myRequests', label: 'My Requests', icon: User }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Browse Requests View */}
      {activeView === 'browse' && (
        <div className="space-y-6">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Privacy Protected</h3>
                <p className="text-blue-700 text-sm mt-1">
                  All requests are anonymous. Your identity is never revealed unless you choose to connect directly.
                </p>
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map(request => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Request Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {renderAvatar(request.avatar)}
                    <div>
                      <p className="font-medium text-gray-900">{request.anonymousId}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(request.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                    {request.urgencyLevel}
                  </span>
                </div>

                {/* Request Content */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{request.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{request.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {request.skillsNeeded.map(skill => (
                      <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{request.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={14} />
                        <span>{request.responses}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" />
                      <span>{request.trustScore}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    Offer Help
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Request View */}
      {activeView === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="text-blue-600" size={24} />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create Anonymous Help Request</h2>
                <p className="text-gray-600 text-sm">Your identity will remain private</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-600" size={16} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Title
                </label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of what you need help with"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{newRequest.title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide more details about your request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  required
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{newRequest.description.length}/500 characters</p>
              </div>

              {/* Skills Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Needed
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., React, Python, Math)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSkillAdd()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSkillAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newRequest.skillsNeeded.map(skill => (
                    <span 
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Urgency and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <select
                    value={newRequest.urgencyLevel}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time
                  </label>
                  <select
                    value={newRequest.estimatedTime}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3+ hours">3+ hours</option>
                  </select>
                </div>
              </div>

              {/* Remote/In-person */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRequest.isRemote}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, isRemote: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Remote help is acceptable</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveView('browse')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newRequest.title || !newRequest.description || newRequest.skillsNeeded.length === 0}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Requests View */}
      {activeView === 'myRequests' && (
        <div className="space-y-6">
          <div className="text-center py-12">
            <MessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
            <p className="text-gray-600 mb-6">You haven't created any help requests yet.</p>
            <button
              onClick={() => setActiveView('create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Request
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnonymousRequests
