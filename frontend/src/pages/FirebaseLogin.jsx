// SkillLance Login - Progressive Authentication Experience
// Purpose: Inspired by Slack & Notion with progressive disclosure and elegant animations

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles, GraduationCap, 
  Check
} from 'lucide-react';
import anime from 'animejs/lib/anime.es.js';

// Import background images
import backgroundLight from '../assets/background.jpg';
import backgroundDark from '../assets/background2.jpg';

// Floating Background Elements Component - OLED Optimized
const FloatingElements = () => {
  // Pure black theme - no animations for OLED battery saving
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden dark:hidden">
      {/* Static geometric shapes for light mode only */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-100/10 to-purple-100/10 rounded-full" />
      <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-indigo-100/10 to-pink-100/10 rounded-lg" />
      <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-gradient-to-br from-green-100/10 to-blue-100/10 rounded-full" />
      <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-gradient-to-br from-yellow-100/10 to-orange-100/10 rounded-xl" />
    </div>
  );
};

export default function SkillLanceLogin() {
  const { error, loading } = useAuth();
  const { signIn, signUp, signInWithGoogle, signInWithMicrosoft, signInWithGitHub, clearError } = useAuthActions();
    const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
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
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutCubic'
      });
    }
  }, []);
  // Clear errors when switching modes
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setLocalError('');
    clearError();
    setFormData({ email: '', password: '', displayName: '' });
    setIsEmailValid(false);
    
    // Subtle animation on mode switch
    if (containerRef.current) {
      anime({
        targets: containerRef.current.querySelector('.form-container'),
        scale: [0.98, 1],
        duration: 300,
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

    // Check email validity and animate password field
    if (name === 'email') {
      const emailIsValid = isValidCollegeEmail(value);
      
      if (emailIsValid !== isEmailValid) {
        setIsEmailValid(emailIsValid);
        
        // Animate password field appearance/disappearance
        if (passwordFieldRef.current) {
          if (emailIsValid) {
            // Show password field with animation
            anime({
              targets: passwordFieldRef.current,
              opacity: [0, 1],
              translateY: [-10, 0],
              duration: 400,
              easing: 'easeOutCubic'
            });
          } else {
            // Hide password field with animation
            anime({
              targets: passwordFieldRef.current,
              opacity: [1, 0],
              translateY: [0, -10],
              duration: 300,
              easing: 'easeInCubic'
            });
          }
        }
      }
    }
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

    // Basic validation
    if (!formData.email) {
      setLocalError('Please enter your college email');
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
    return isSignUp ? 'Create Account' : 'Sign In';
  };

  // Show current error
  const currentError = localError || error;  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundImage: `url(${backgroundLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark mode background overlay */}
      <div 
        className="hidden dark:block fixed inset-0 transition-opacity duration-200 z-0"
        style={{
          backgroundImage: `url(${backgroundDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <FloatingElements />
      
      {/* SkillLance logo - Fixed at top-left */}
      <div className="absolute top-6 left-6 z-20 flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mr-2">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: 900 }}>
          SkillLance
        </h1>
      </div>
        {/* Right-aligned form container */}
      <div className="min-h-screen flex items-center justify-end p-6 pr-12">
        <div
          ref={containerRef}
          className="relative z-10 w-full max-w-sm opacity-0"
        >
        {/* Form Container - Right aligned with transparency and sharp edges */}
        <div className="form-container bg-white/45 dark:bg-black/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-8 transition-all duration-300">
          
          {/* Page Title - Compact */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isSignUp ? 'Join the student community' : 'Sign in to continue'}
            </p>
          </div>          {/* Error Display */}
          {currentError && (
            <div className="mb-4 p-3 bg-red-50/90 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-red-400 dark:text-red-300 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-200 text-xs leading-relaxed">{currentError}</p>
              </div>
            </div>
          )}

          {/* Email/Password Form - Primary */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    id="displayName"
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>
            )}            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">College Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"                  className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all duration-150 backdrop-blur-sm ${
                    (() => {
                      if (formData.email && isEmailValid) {
                        return 'border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50/80 dark:bg-green-900/20 text-gray-900 dark:text-white';
                      } else if (formData.email && !isEmailValid) {
                        return 'border-orange-500 focus:border-orange-500 focus:ring-orange-500/20 bg-orange-50/80 dark:bg-orange-900/20 text-gray-900 dark:text-white';
                      } else {
                        return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white';
                      }
                    })()
                  }`}
                  disabled={loading}
                />
                {formData.email && isEmailValid && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <GraduationCap className="w-3 h-3 mr-1" />
                .edu, .ac.in, .edu.in domains accepted
              </p>
            </div>            {/* Password - Only show when email is valid */}
            {isEmailValid && (
              <div 
                ref={passwordFieldRef} 
                className="password-field-container"
                style={{ opacity: 90, transform: 'translateY(-10px)' }}
              >
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 backdrop-blur-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}{/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isEmailValid || !formData.password || (isSignUp && !formData.displayName?.trim())}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{getButtonText()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </button>
          </form>          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white/90 dark:bg-black/90 text-gray-500 dark:text-gray-400 backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          {/* Social Sign In Buttons - Compact */}
          <div className="space-y-2">            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50/80 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>            <button
              type="button"
              onClick={handleMicrosoftSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50/80 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>  
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Microsoft
            </button>            <button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50/80 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          {/* Additional Links */}
          {!isSignUp && (
            <div className="mt-4 text-center">
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors">
                Forgot your password?
              </button>
            </div>
          )}
        </div>        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-400 dark:text-gray-500 space-x-4">
            <button type="button" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Privacy</button>
            <span>•</span>
            <button type="button" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Terms</button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
