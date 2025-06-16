import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import anime from 'animejs'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'verification' | 'success'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Page entrance animation
    anime({
      targets: '.auth-container',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo'
    })
  }, [])

  const validateEduEmail = (email) => {
    const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/
    return eduRegex.test(email)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateEduEmail(email)) {
      setError('Please enter a valid .edu email address')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call to send magic link
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Animate to next step
      anime({
        targets: '.auth-form',
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
      })
      
      setStep('verification')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <div className="auth-form">
      <div className="text-center mb-8">
        <div className="bg-karma-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail className="h-8 w-8 text-karma-600" />
        </div>
        <h1 className="text-3xl font-karma font-bold text-gray-900 mb-2">
          Welcome to CampusKarma
        </h1>
        <p className="text-gray-600">
          Enter your college email to get started
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            College Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.name@college.edu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Only .edu email addresses are accepted
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-karma py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Sending Magic Link...</span>
            </div>
          ) : (
            'Send Magic Link'
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have a college email?{' '}
            <a href="#" className="text-karma-600 hover:text-karma-700 font-medium">
              Learn more about verification
            </a>
          </p>
        </div>
      </div>
    </div>
  )

  const renderVerificationStep = () => (
    <div className="auth-form text-center">
      <div className="bg-trust-100 rounded-full p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <Mail className="h-8 w-8 text-trust-600" />
      </div>
      
      <h1 className="text-3xl font-karma font-bold text-gray-900 mb-4">
        Check Your Email
      </h1>
      
      <p className="text-gray-600 mb-2">
        We've sent a secure login link to:
      </p>
      <p className="font-medium text-karma-600 mb-6">
        {email}
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Check your spam folder if you don't see the email. 
          The link expires in 10 minutes for security.
        </p>
      </div>

      <button
        onClick={() => setStep('email')}
        className="btn-karma-outline mb-4"
      >
        Use Different Email
      </button>
      
      <p className="text-xs text-gray-500">
        Didn't receive the email? Wait 60 seconds and try again.
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to home */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-karma-600 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-container bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {step === 'email' && renderEmailStep()}
          {step === 'verification' && renderVerificationStep()}
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>No Spam</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
