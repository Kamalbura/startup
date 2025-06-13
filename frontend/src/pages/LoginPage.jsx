// CampusKarma Magic Link Login Component
// Purpose: Student-friendly authentication with .edu validation

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { 
    sendMagicLink, 
    verifyMagicLink, 
    isGuest, 
    isMagicLinkSent, 
    loading, 
    error, 
    clearError,
    magicLinkEmail 
  } = useAuth()
  
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'verify' | 'success'
  const [showEmailHint, setShowEmailHint] = useState(false)

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Handle URL token verification (if user clicks magic link)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const email = urlParams.get('email')
    
    if (token && email) {
      handleMagicLinkVerification(token, email)
    }
  }, [])

  // Send magic link
  const handleSendMagicLink = async (e) => {
    e.preventDefault()
    clearError()
    
    if (!email) {
      return
    }

    const result = await sendMagicLink(email)
    if (result.success) {
      setStep('verify')
    }
  }

  // Verify magic link token
  const handleMagicLinkVerification = async (token, email) => {
    const result = await verifyMagicLink(token, email)
    if (result.success) {
      setStep('success')
      // Redirect will happen automatically via auth state change
    }
  }

  // Email validation
  const isValidEduEmail = (email) => {
    return email.includes('@') && email.endsWith('.edu')
  }

  // Check if email looks like .edu but isn't
  const isAlmostEduEmail = (email) => {
    return email.includes('@') && 
           (email.includes('edu') || email.includes('university') || email.includes('college')) && 
           !email.endsWith('.edu')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">CK</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CampusKarma
          </h1>
          <p className="text-gray-600 text-sm">
            Where skills meet opportunity 🎓
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
                <p className="text-gray-600">Enter your college email to get started</p>
              </div>

              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setShowEmailHint(isAlmostEduEmail(e.target.value))
                    }}
                    placeholder="yourname@university.edu"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-0`}
                    disabled={loading}
                  />
                  
                  {/* Email hint */}
                  {showEmailHint && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        💡 Make sure your email ends with <code className="bg-amber-100 px-1 rounded">.edu</code>
                      </p>
                    </div>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Only college students with .edu emails can join
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValidEduEmail(email)}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                    loading || !isValidEduEmail(email)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending magic link...
                    </div>
                  ) : (
                    'Send Magic Link ✨'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Check Email */}
          {step === 'verify' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
                <p className="text-gray-600">
                  We sent a magic link to <br />
                  <span className="font-medium text-blue-600">{magicLinkEmail}</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  📧 Click the link in your email to log in instantly
                </p>
              </div>

              <button
                onClick={() => setStep('email')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CampusKarma! 🎉</h2>
                <p className="text-gray-600">
                  You're successfully logged in. Let's get started!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
