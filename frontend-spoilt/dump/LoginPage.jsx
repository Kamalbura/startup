import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Check if it's a college email
    const collegeDomainsPattern = /(\.edu|\.edu\.in|\.ac\.in)$/i
    if (!collegeDomainsPattern.test(email)) {
      setError('Please use your college email address (.edu, .edu.in, .ac.in domains)')
      return
    }

    setError('')
    navigate('/verification', { state: { email } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CampusKarma</h1>
          <p className="text-gray-600">Turn Your Skills Into Karma</p>
          <p className="text-sm text-gray-500 mt-4">
            🎓 Welcome to the student gig economy
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@college.edu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use your college email (.edu, .ac.in, .edu.in domains)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue →
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Features */}
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium mb-2">Why CampusKarma?</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Earn money with your skills</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Connect with verified students</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Build your karma & reputation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Secure payments & escrow</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            Secure • Fast • College-verified
          </p>
          <p className="mt-1">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
