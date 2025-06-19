// SkillLance Login - Progressive Authentication Experience
// Purpose: Inspired by Slack & Notion with progressive disclosure and elegant animations

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles, GraduationCap, Zap, Shield, 
  Check
} from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';

// Floating Background Elements Component
const FloatingElements = () => {
  const elementsRef = useRef([]);
  
  useEffect(() => {
    // Animate floating elements
    elementsRef.current.forEach((el, index) => {
      if (el) {
        anime({
          targets: el,
          translateY: [-10, 10],
          translateX: [-5, 5],
          rotate: [-5, 5],
          duration: 3000 + (index * 500),
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true,
        });
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated background shapes */}
      <div 
        ref={el => elementsRef.current[0] = el}
        className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full backdrop-blur-sm"
      />
      <div 
        ref={el => elementsRef.current[1] = el}
        className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-indigo-200/20 to-pink-200/20 rounded-lg backdrop-blur-sm"
      />
      <div 
        ref={el => elementsRef.current[2] = el}
        className="absolute bottom-32 left-1/4 w-8 h-8 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full backdrop-blur-sm"
      />
      <div 
        ref={el => elementsRef.current[3] = el}
        className="absolute bottom-40 right-1/3 w-14 h-14 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-xl backdrop-blur-sm"
      />
      <div 
        ref={el => elementsRef.current[4] = el}
        className="absolute top-1/2 left-12 w-6 h-6 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full backdrop-blur-sm"
      />
      <div 
        ref={el => elementsRef.current[5] = el}
        className="absolute top-1/3 right-12 w-10 h-10 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-lg backdrop-blur-sm"
      />
    </div>
  );
};

export default function SkillLanceLogin() {
  const { error, loading } = useAuth();
  const { signIn, signUp, signInWithGoogle, signInWithMicrosoft, signInWithGitHub, clearError } = useAuthActions();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [emailStep, setEmailStep] = useState(true);
  const containerRef = useRef(null);
  const passwordFieldRef = useRef(null);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  // Animate container on mount
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutCubic'
      });
    }
  }, []);

  // Progressive form disclosure - show password field when email is entered
  useEffect(() => {
    if (formData.email && isValidCollegeEmail(formData.email) && !showPasswordField) {
      setShowPasswordField(true);
      setEmailStep(false);
      
      // Animate password field appearance
      setTimeout(() => {
        if (passwordFieldRef.current) {
          anime({
            targets: passwordFieldRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.95, 1],
            duration: 600,
            easing: 'easeOutCubic'
          });
        }
      }, 100);
    }
  }, [formData.email, showPasswordField]);

  // Clear errors when switching modes
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setLocalError('');
    clearError();
    setFormData({ email: '', password: '', displayName: '' });
    setShowPasswordField(false);
    setEmailStep(true);
    
    // Subtle animation on mode switch
    if (containerRef.current) {
      anime({
        targets: containerRef.current.querySelector('.form-container'),
        scale: [0.98, 1],
        duration: 400,
        easing: 'easeOutCubic'
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when typing
    if (localError) setLocalError('');
    if (error) clearError();
  };

  // Validate college email
  const isValidCollegeEmail = (email) => {
    const collegePatterns = [
      /^[^\s@]+@[^\s@]+\.edu$/i,
      /^[^\s@]+@[^\s@]+\.edu\.in$/i,
      /^[^\s@]+@[^\s@]+\.ac\.in$/i,
    ];
    
    return collegePatterns.some(pattern => pattern.test(email));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Progressive form validation
    if (!formData.email) {
      setLocalError('Please enter your email address');
      return;
    }

    if (!isValidCollegeEmail(formData.email)) {
      setLocalError('Please use your college email (.edu, .ac.in, .edu.in)');
      return;
    }

    if (!formData.password) {
      setLocalError('Please enter your password');
      return;
    }

    if (isSignUp && !formData.displayName?.trim()) {
      setLocalError('Please enter your full name');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, {
          displayName: formData.displayName,
        });
      } else {
        await signIn(formData.email, formData.password);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please try again.');
    }
  };

  // Handle social sign ins
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithMicrosoft();
    } catch (err) {
      setLocalError(err.message || 'Microsoft sign-in failed. Please try again.');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (err) {
      setLocalError(err.message || 'GitHub sign-in failed. Please try again.');
    }
  };

  // Get button text
  const getButtonText = () => {
    if (loading) return 'Please wait...';
    if (emailStep && !showPasswordField) return 'Continue';
    return isSignUp ? 'Create Account' : 'Sign In';
  };

  // Show current error
  const currentError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElements />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div ref={containerRef} className="w-full max-w-md">
          
          {/* Brand Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-xl backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              SkillLance
            </h1>
            <p className="text-lg text-gray-600 font-medium">Student Freelancing Platform</p>
          </div>

          {/* Main Form Card */}
          <div className="form-container bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6">
            
            {/* Page Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isSignUp ? 'Join SkillLance' : 'Welcome back'}
              </h2>
              <p className="text-gray-600 text-lg">
                {emailStep 
                  ? 'Enter your college email to get started' 
                  : (isSignUp ? 'Complete your account setup' : 'Sign in to continue')
                }
              </p>
            </div>

            {/* Error Display */}
            {currentError && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl shadow-sm">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-medium">{currentError}</p>
                </div>
              </div>
            )}

            {/* Progressive Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Display Name (Sign Up only, before email step completion) */}
              {isSignUp && showPasswordField && (
                <div>
                  <label htmlFor="displayName" className="text-sm font-semibold text-gray-800 block mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="displayName"
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-lg backdrop-blur-sm"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-gray-800 block mb-3">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@college.edu"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-lg backdrop-blur-sm"
                    disabled={loading}
                  />
                  {formData.email && isValidCollegeEmail(formData.email) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-2">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  We accept .edu, .ac.in, and .edu.in domains
                </p>
              </div>

              {/* Password Field (Progressive Disclosure) */}
              {showPasswordField && (
                <div ref={passwordFieldRef} style={{ opacity: 0 }}>
                  <label htmlFor="password" className="text-sm font-semibold text-gray-800 block mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-14 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm focus:shadow-lg backdrop-blur-sm"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (emailStep && !formData.email)}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl text-lg font-bold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{getButtonText()}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Social Authentication */}
            {showPasswordField && (
              <div className="mt-8">
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-6 bg-white text-gray-500 font-medium">or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-lg backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleMicrosoftSignIn}
                    disabled={loading}
                    className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-lg backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#F25022" d="M1 1h10v10H1z"/>
                      <path fill="#00A4EF" d="M13 1h10v10H13z"/>  
                      <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                      <path fill="#FFB900" d="M13 13h10v10H13z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleGitHubSignIn}
                    disabled={loading}
                    className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-lg backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Toggle Sign Up/Sign In */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-base">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            {!isSignUp && showPasswordField && (
              <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors hover:underline">
                Forgot your password?
              </button>
            )}
            <div className="text-xs text-gray-400 space-x-4">
              <button type="button" className="hover:text-gray-600 transition-colors hover:underline">
                Privacy Policy
              </button>
              <span>•</span>
              <button type="button" className="hover:text-gray-600 transition-colors hover:underline">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
