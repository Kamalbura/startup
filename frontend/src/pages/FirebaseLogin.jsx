// SkillLance Login - Beautiful Professional Split Layout
// Purpose: Modern full-width authentication without card boxes

import React, { useState } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles, GraduationCap, Shield, Zap, Trophy
} from 'lucide-react';

export default function SkillLanceLogin() {
  const { error, loading } = useAuth();
  const { signIn, signUp, signInWithGoogle, clearError } = useAuthActions();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  // Clear errors when switching modes
  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setLocalError('');
    clearError();
    setFormData({ email: '', password: '', displayName: '' });
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

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (!isValidCollegeEmail(formData.email)) {
      setLocalError('Please use your college email (.edu, .ac.in, .edu.in)');
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

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  // Get button text
  const getButtonText = () => {
    if (loading) return 'Please wait...';
    return isSignUp ? 'Create Account' : 'Sign In';
  };

  // Show current error
  const currentError = localError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Identity & Features (45%) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex-col justify-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-56 h-56 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 px-12 text-white">
          {/* Logo & Brand */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="ml-4 text-3xl font-bold">SkillLance</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Turn your skills into{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                opportunities
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join India's most trusted student freelancing platform where skills meet success
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-blue-500/20 backdrop-blur-sm p-4 rounded-2xl border border-blue-400/20">
                <Shield className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">100% Verified Students</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Secure community with institutional email verification and identity checks
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="bg-indigo-500/20 backdrop-blur-sm p-4 rounded-2xl border border-indigo-400/20">
                <Zap className="w-7 h-7 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Instant Project Matching</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Smart algorithms connect you with projects that match your expertise
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="bg-purple-500/20 backdrop-blur-sm p-4 rounded-2xl border border-purple-400/20">
                <Trophy className="w-7 h-7 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Your Reputation</h3>
                <p className="text-blue-100/80 leading-relaxed">
                  Earn karma points, reviews, and establish your professional credibility
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300 mb-1">25K+</div>
              <div className="text-sm text-blue-100/70">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-300 mb-1">₹2.5Cr+</div>
              <div className="text-sm text-blue-100/70">Earned by Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-1">98%</div>
              <div className="text-sm text-blue-100/70">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Form (55%) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-lg">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SkillLance</h1>
            <p className="text-gray-600 mt-2">Student Freelancing Platform</p>
          </div>

          {/* Page Title */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {isSignUp ? 'Join SkillLance' : 'Welcome Back'}
            </h2>
            <p className="text-lg text-gray-600">
              {isSignUp ? 'Create your account and start earning with your skills' : 'Sign in to continue your freelancing journey'}
            </p>
          </div>

          {/* Error Display */}
          {currentError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-700">{currentError}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">                <label htmlFor="displayName" className="text-sm font-semibold text-gray-700 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="displayName"
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">College Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                We accept .edu, .ac.in, and .edu.in domains
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-14 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-white text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-300"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 text-lg">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          {/* Forgot Password & Additional Links */}
          <div className="mt-6 text-center space-y-4">
            {!isSignUp && (
              <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Forgot your password?
              </button>
            )}
              <div className="text-xs text-gray-400 space-x-4">
              <button type="button" className="hover:text-gray-600 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button type="button" className="hover:text-gray-600 transition-colors">Terms of Service</button>
              <span>•</span>              <button type="button" className="hover:text-gray-600 transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
