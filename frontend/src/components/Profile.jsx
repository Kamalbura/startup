import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/FirebaseAuthContext'
import { User, Mail, MapPin, Calendar, Star, TrendingUp, Briefcase, Edit, Camera } from 'lucide-react'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  })
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills || [],
        socialLinks: user.socialLinks || {
          linkedin: '',
          github: '',
          portfolio: ''
        }
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-64 bg-slate-200 rounded-lg"></div>
            <div className="h-48 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-karma-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-karma-700 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell others about yourself, your interests, and what you're studying..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., IIT Delhi, New Delhi"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Skills</h2>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-karma-600 text-white px-4 py-2 rounded-lg hover:bg-karma-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
            
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
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Social Links</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  name="socialLinks.github"
                  value={formData.socialLinks.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Portfolio
                </label>
                <input
                  type="url"
                  name="socialLinks.portfolio"
                  value={formData.socialLinks.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-karma-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-karma-700 focus:ring-2 focus:ring-karma-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="bg-karma-100 w-24 h-24 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-karma-600" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white border-2 border-white shadow-md rounded-full p-2 hover:bg-slate-50 transition-colors duration-200">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                
                <div className="flex items-center space-x-4 text-slate-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-slate-700 mb-4">{user.bio}</p>
                )}

                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-karma-100 text-karma-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Karma Points</p>
                  <p className="text-3xl font-bold text-karma-600">{user.karma || 0}</p>
                </div>
                <div className="bg-karma-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-karma-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Trust Score</p>
                  <div className="flex items-center space-x-1">
                    <p className="text-3xl font-bold text-trust-600">{user.trustScore || 0}</p>
                    <Star className="w-5 h-5 text-trust-500 fill-current" />
                  </div>
                </div>
                <div className="bg-trust-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-trust-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Institution</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {user.institution || 'Not specified'}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Social Links</h3>
              <div className="space-y-2">
                {user.socialLinks.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-karma-600 hover:text-karma-700 text-sm"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {user.socialLinks.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-karma-600 hover:text-karma-700 text-sm"
                  >
                    GitHub Profile
                  </a>
                )}
                {user.socialLinks.portfolio && (
                  <a
                    href={user.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-karma-600 hover:text-karma-700 text-sm"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
