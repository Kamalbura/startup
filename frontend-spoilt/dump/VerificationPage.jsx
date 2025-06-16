import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const VerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Handle Magic Link verification
  const handleMagicLink = async () => {
    if (!email) {
      setError('Email is required. Please go back and enter your email.')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('Magic link sent to your email! Check your inbox and click the link to login.')
      } else {
        setError(data.message || 'Failed to send magic link')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP verification
  const handleOTP = () => {
    if (!email) {
      setError('Email is required. Please go back and enter your email.')
      return
    }
    
    // Navigate to OTP login page with email
    navigate('/login-otp', { state: { email } })
  }

  const handleBackToEmail = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">CampusKarma</h1>
          <p className="text-gray-600">Turn Your Skills Into Karma</p>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            College Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use your college email (.edu, .ac.in, .edu.in domains)
          </p>
        </div>

        {/* Verification Options */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Choose Verification Method</h2>
        </div>

        {/* Verification Options */}
        <div className="space-y-4">
          
          {/* Magic Link Option */}
          <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Magic Link</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get a secure login link sent directly to your email. Click the link to login instantly.
                </p>
                <button
                  onClick={handleMagicLink}
                  disabled={loading || !email}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </div>
            </div>
          </div>

          {/* OTP Option */}
          <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">OTP Code</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get a 6-digit verification code. Enter the code to login securely.
                </p>
                <button
                  onClick={handleOTP}
                  disabled={!email}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Use OTP Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={handleBackToEmail}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ← Back to Email Entry
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Both methods are equally secure and fast.
          </p>
          <p className="mt-2">
            Choose the one that works best for you!
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerificationPage
