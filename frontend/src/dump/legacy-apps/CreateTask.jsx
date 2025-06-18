import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/FirebaseAuthContext'
import { IndianRupee, Clock, MapPin, Tag, FileText, Plus, X } from 'lucide-react'

const CreateTask = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budgetType: 'fixed',
    duration: '',
    location: '',
    skills: [],
    urgency: 'normal'
  })
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState({})

  const categories = [
    { value: 'academic', label: 'Academic Help' },
    { value: 'design', label: 'Design & Creative' },
    { value: 'tech', label: 'Tech & Programming' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'events', label: 'Events & Photography' },
    { value: 'writing', label: 'Writing & Content' },
    { value: 'other', label: 'Other' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Valid budget is required'
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      console.log('Task created:', formData)
      navigate('/tasks')
    } catch (error) {
      console.error('Failed to create task:', error)
      setErrors({ submit: 'Failed to create task. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Post a New Task</h1>
        <p className="text-slate-600">
          Get help from talented students in your network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., UI/UX Design for Mobile App"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Describe what you need help with, your requirements, and any specific details..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 ${
                  errors.category ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills *
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="e.g., React.js, Figma, Python"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-karma-600 text-white px-4 py-2 rounded-lg hover:bg-karma-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-karma-100 text-karma-700 rounded-full text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-karma-600 hover:text-karma-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
            </div>
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Budget & Timeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Budget *
              </label>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="500"
                    min="1"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 ${
                      errors.budget ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                </div>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
              {errors.budget && <p className="text-red-600 text-sm mt-1">{errors.budget}</p>}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 days, 1 week, 2 hours"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 ${
                    errors.duration ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                Campus/Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., IIT Delhi, DU North Campus"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 ${
                    errors.location ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Urgency */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-slate-700 mb-2">
                Priority Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Errors */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-karma-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-karma-700 focus:ring-2 focus:ring-karma-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing Task...</span>
              </div>
            ) : (
              'Publish Task'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTask
