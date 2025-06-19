// Enhanced Firebase Authentication Component for SkillLance
// Purpose: Production-ready login/signup with robust validation and UX

import React, { useState } from 'react';
import { useAuth, useAuthActions, AUTH_STATES } from '../context/FirebaseAuthContext';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, BookOpen, Calendar, AlertTriangle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function EnhancedFirebaseLogin() {
  const { status, error, loading } = useAuth();
  const { signIn, signUp, signInWithGoogle, resetPassword, clearError } = useAuthActions();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    college: '',
    course: '',
    year: ''
  });

  // Enhanced college email validation
  const validateCollegeEmail = (email) => {
    const allowedDomains = [
      "vnrvjiet.ac.in", "cbit.ac.in", "mgit.ac.in", "mgit.com", "vce.ac.in",
      "kmit.in", "vit.ac.in", "iiit.ac.in", "students.iiit.ac.in", "iith.ac.in",
      "nitw.ac.in", "cvr.ac.in", "bvrit.ac.in", "ellenkicet.ac.in", "villamariecollege.ac.in"
    ];
    
    const collegePatterns = [
      /^[^\s@]+@[^\s@]+\.edu$/i,
      /^[^\s@]+@[^\s@]+\.edu\.in$/i,
      /^[^\s@]+@[^\s@]+\.ac\.in$/i,
    ];
    
    if (!email?.includes('@')) return false;
    
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    return allowedDomains.includes(emailDomain) || 
           collegePatterns.some(pattern => pattern.test(email));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (error) clearError();
    if (localError) setLocalError('');
    if (successMessage) setSuccessMessage('');
    
    // Real-time email validation feedback
    if (name === 'email' && value) {
      if (!validateCollegeEmail(value)) {
        setLocalError('Please use your college email (.edu, .ac.in, .edu.in)');
      } else {
        setLocalError('');
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    if (!validateCollegeEmail(formData.email)) {
      setLocalError('Please use a valid college email address');
      return;
    }
    
    try {
      await signIn(formData.email, formData.password);
      setSuccessMessage('Welcome back! Redirecting to dashboard...');
    } catch (error) {
      console.error('Sign in error:', error);
      setLocalError(error.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Enhanced validation for sign up
    if (!formData.displayName?.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    
    if (!formData.college?.trim()) {
      setLocalError('Please enter your college name');
      return;
    }
    
    if (!formData.course?.trim()) {
      setLocalError('Please enter your course/branch');
      return;
    }
    
    if (!formData.year) {
      setLocalError('Please select your year');
      return;
    }
    
    if (!validateCollegeEmail(formData.email)) {
      setLocalError('Please use a valid college email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const userData = {
        displayName: formData.displayName.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        year: parseInt(formData.year) || 1,
      };
      
      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.needsEmailVerification) {
        setSuccessMessage('Account created! Please check your email to verify your account.');
      } else {
        setSuccessMessage('Account created successfully! Welcome to SkillLance!');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setLocalError(error.message || 'Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    try {
      await signInWithGoogle();
      setSuccessMessage('Welcome! Redirecting to dashboard...');
    } catch (error) {
      console.error('Google sign in error:', error);
      setLocalError(error.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.email) {
      setLocalError('Please enter your email address');
      return;
    }
    
    if (!validateCollegeEmail(formData.email)) {
      setLocalError('Please enter a valid college email address');
      return;
    }
    
    try {
      await resetPassword(formData.email);
      setShowResetForm(false);
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      setLocalError(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  // Show email verification message
  if (status === AUTH_STATES.EMAIL_VERIFICATION_REQUIRED) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a verification email to your college email address. 
            Please click the link in the email to verify your account and access SkillLance.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-sm font-medium">
              💡 Check your spam folder if you don't see the email
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            I've Verified My Email
          </button>
        </div>
      </div>
    );
  }

  const currentError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SkillLance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              India's trust-first student skill economy platform
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Earn money with your college skills</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Connect with verified students</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Build your campus reputation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700">Secure payments & trust system</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to SkillLance
            </h1>
            <p className="text-gray-600">Turn your skills into success</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {showResetForm ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-gray-600">
                {showResetForm ? 'Enter your email to reset password' : 
                 isSignUp ? 'Join thousands of students on SkillLance' : 
                 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Toggle Buttons */}
            {!showResetForm && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => {setIsSignUp(false); setLocalError(''); setSuccessMessage('');}}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    !isSignUp 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {setIsSignUp(true); setLocalError(''); setSuccessMessage('');}}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    isSignUp 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Messages */}
            {currentError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{currentError}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Reset Password Form */}
            {showResetForm ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your.email@college.edu"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {setShowResetForm(false); setLocalError(''); setSuccessMessage('');}}
                  className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors"
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              <>
                {/* Main Form */}
                <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
                  {/* Sign Up Fields */}
                  {isSignUp && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            College *
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="college"
                              value={formData.college}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              placeholder="College name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Year *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              name="year"
                              value={formData.year}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              required
                            >
                              <option value="">Year</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                              <option value="5">5th Year</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Course/Branch *
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="e.g., Computer Science, MBA"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      College Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          localError && formData.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="your.email@college.edu"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: .edu, .ac.in, .edu.in domains
                    </p>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={isSignUp ? 'Create a password' : 'Your password'}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {isSignUp && (
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 6 characters
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-gray-700 font-medium">College Google Account</span>
                </button>

                {/* Forgot Password Link */}
                {!isSignUp && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => {setShowResetForm(true); setLocalError(''); setSuccessMessage('');}}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {/* Terms & Privacy */}
                <div className="text-center text-xs text-gray-500 mt-6">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
