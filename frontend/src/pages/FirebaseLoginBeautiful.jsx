// SkillLance Beautiful Login v1.0.0.0
// Purpose: Stunning, modern Firebase authentication interface

import React, { useState } from 'react';
import { useAuth, useAuthActions, AUTH_STATES } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles 
} from 'lucide-react';

export default function SkillLanceLoginBeautiful() {
  const { status, error, loading } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Glass Card Container */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
          
          {/* Header with Floating Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SkillLance
            </h1>
            <p className="text-white/80 text-lg">
              {isSignUp ? '✨ Join the future of student work' : '🚀 Welcome back, creator'}
            </p>
          </div>

          {/* Error Display */}
          {currentError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300 text-sm">{currentError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-white/90 text-sm font-medium">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium">
                College Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                  disabled={loading}
                />
              </div>
              <p className="text-white/60 text-xs">
                🎓 Supported: .edu, .ac.in, .edu.in domains
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-white/90 text-sm font-medium">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:bg-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
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

            {/* Google Sign In */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/60">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-6 rounded-xl font-medium hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </div>
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-8 text-center">
            <p className="text-white/60">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs">
              🔒 Secure • 🚀 Fast • 🎓 College-verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
