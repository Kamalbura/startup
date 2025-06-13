import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, CheckCircle, AlertCircle, Users, TrendingUp, Shield, Zap } from 'lucide-react'

const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'sent' | 'verifying'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailDomain, setEmailDomain] = useState('')
  
  const { login, verifyMagicLink } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check for magic link token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get('token')
    
    if (token) {
      setStep('verifying')
      handleMagicLinkVerification(token)
    }
  }, [location])

  const validateEduEmail = (email) => {
    const eduPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/
    return eduPattern.test(email)
  }

  const extractDomain = (email) => {
    const domain = email.split('@')[1]
    if (domain) {
      // Extract college name from domain (simple version)
      const parts = domain.split('.')
      const collegeName = parts[0]
        .replace(/[^a-zA-Z]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      return collegeName || domain
    }
    return ''
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!validateEduEmail(email)) {
      setError('Please use your college .edu email address')
      return
    }

    setIsLoading(true)
    const domain = extractDomain(email)
    setEmailDomain(domain)

    try {
      const result = await login(email)
      if (result.success) {
        setStep('sent')
      } else {
        setError(result.error || 'Failed to send magic link. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkVerification = async (token) => {
    try {
      const result = await verifyMagicLink(token)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Invalid or expired magic link')
        setStep('email')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
      setStep('email')
    }
  }

  const handleResendEmail = () => {
    setStep('email')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-karma-50 via-white to-trust-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-karma-600 to-karma-800 p-12 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          {/* Logo & Tagline */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 font-karma">
              CampusKarma
            </h1>
            <p className="text-xl text-karma-100 mb-2">
              Turn Your Skills Into Karma
            </p>
            <p className="text-karma-200">
              India's first trust-based skill economy for students
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Verified .edu Only</h3>
                <p className="text-karma-200 text-sm">Trusted student community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Build Your Karma</h3>
                <p className="text-karma-200 text-sm">Reputation that opens doors</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Instant Connections</h3>
                <p className="text-karma-200 text-sm">Find gigs that match your skills</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Student Network</h3>
                <p className="text-karma-200 text-sm">Connect with peers across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-karma-600 font-karma mb-2">
              CampusKarma
            </h1>
            <p className="text-slate-600">Turn Your Skills Into Karma</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            {step === 'email' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="bg-karma-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-karma-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Welcome to CampusKarma
                  </h2>
                  <p className="text-slate-600">
                    Enter your college email to get started
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      College Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      placeholder="your.name@college.edu"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent transition-all duration-200 text-slate-800"
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Only .edu email addresses are accepted
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-karma-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-karma-700 focus:ring-2 focus:ring-karma-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Magic Link...</span>
                      </div>
                    ) : (
                      'Continue with Magic Link'
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-karma-600 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-karma-600 hover:underline">Privacy Policy</a>
                </div>
              </div>
            )}

            {step === 'sent' && (
              <div className="text-center space-y-6">
                <div className="bg-trust-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-trust-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-slate-600 mb-4">
                    We've sent a magic link to
                  </p>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="font-medium text-slate-800">{email}</p>
                    {emailDomain && (
                      <p className="text-sm text-slate-600">{emailDomain}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Click the link in your email to sign in. The link expires in 15 minutes.
                  </p>
                  
                  <button
                    onClick={handleResendEmail}
                    className="text-karma-600 hover:text-karma-700 font-medium text-sm transition-colors duration-200"
                  >
                    Use different email
                  </button>
                </div>

                <div className="bg-karma-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-600">
                    💡 <strong>Tip:</strong> Check your spam folder if you don't see the email
                  </p>
                </div>
              </div>
            )}

            {step === 'verifying' && (
              <div className="text-center space-y-6">
                <div className="bg-karma-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-2 border-karma-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Verifying Your Link
                  </h2>
                  <p className="text-slate-600">
                    Please wait while we sign you in...
                  </p>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              Student-exclusive platform • Trusted by campuses across India
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
