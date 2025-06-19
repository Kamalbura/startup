// CampusKarma Simple Login Page (No TailwindCSS)
// Purpose: Student-friendly authentication with Indian college validation

import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/FirebaseAuthContext'
import '../simple.css'

const LoginPageSimple = () => {
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

  // Email validation for Indian colleges
  const isValidCollegeEmail = (email) => {
    const allowedDomains = [
      "vnrvjiet.ac.in", "cbit.ac.in", "mgit.ac.in", "mgit.com", "vce.ac.in",
      "kmit.in", "vit.ac.in", "iiit.ac.in", "students.iiit.ac.in", "iith.ac.in",
      "nitw.ac.in", "cvr.ac.in", "bvrit.ac.in", "ellenkicet.ac.in", "villamariecollege.ac.in",
      "edu", "edu.in", "ac.in"
    ]
    
    if (!email.includes('@')) return false
    
    const emailDomain = email.split('@')[1]
    return allowedDomains.some(domain => 
      emailDomain === domain || emailDomain.endsWith('.' + domain)
    )
  }

  // Check if email looks like college but isn't supported
  const isAlmostCollegeEmail = (email) => {
    return email.includes('@') && 
           (email.includes('edu') || email.includes('university') || email.includes('college') || 
            email.includes('ac.in') || email.includes('edu.in')) && 
           !isValidCollegeEmail(email)
  }

  return (
    <div className="login-container">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo & Title */}
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">CK</span>
          </div>
          <h1 className="title">CampusKarma</h1>
          <p className="subtitle">Where skills meet opportunity 🎓</p>
        </div>

        {/* Auth Card */}
        <div className="login-card">
          {/* Step 1: Email Input */}
          {step === 'email' && (
            <div>
              <div className="welcome-text">
                <h2 className="welcome-title">Welcome!</h2>
                <p className="welcome-desc">Enter your college email to get started</p>
              </div>

              <form onSubmit={handleSendMagicLink}>
                <div className="form-group">
                  <label htmlFor="email" className="label">
                    College Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setShowEmailHint(isAlmostCollegeEmail(e.target.value))
                    }}
                    placeholder="yourname@vce.ac.in"
                    className={`input ${error ? 'input-error' : ''}`}
                    disabled={loading}
                  />
                  
                  {/* Email hint */}
                  {showEmailHint && (
                    <div className="hint-box">
                      <p className="hint-text">
                        💡 Supported domains: .ac.in, .edu.in, .edu
                      </p>
                    </div>
                  )}
                  
                  <p className="help-text">
                    Supported: CBIT, MGIT, VCE, KMIT, VIT, IIIT, IIT Hyderabad, NIT Warangal & more
                  </p>
                </div>

                {error && (
                  <div className="error-box">
                    <p className="error-text">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValidCollegeEmail(email)}
                  className={`btn ${loading || !isValidCollegeEmail(email) ? 'btn-disabled' : 'btn-primary'}`}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending magic link...
                    </>
                  ) : (
                    'Send Magic Link ✨'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Check Email */}
          {step === 'verify' && (
            <div style={{ textAlign: 'center' }}>
              <div className="email-icon">
                <span style={{ fontSize: '2rem' }}>📧</span>
              </div>
              
              <div className="welcome-text">
                <h2 className="welcome-title">Check your email!</h2>
                <p className="welcome-desc">
                  We sent a magic link to <br />
                  <span style={{ fontWeight: '500', color: '#3b82f6' }}>{magicLinkEmail}</span>
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                  📧 Click the link in your email to log in instantly
                </p>
              </div>

              <button
                onClick={() => setStep('email')}
                className="back-link"
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <div className="success-icon">
                <span style={{ fontSize: '2rem', color: '#16a34a' }}>✅</span>
              </div>
              
              <div className="welcome-text">
                <h2 className="welcome-title">Welcome to CampusKarma! 🎉</h2>
                <p className="welcome-desc">
                  You're successfully logged in. Let's get started!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer-text">
          By signing up, you agree to our terms and privacy policy
        </div>
      </div>
    </div>
  )
}

export default LoginPageSimple
