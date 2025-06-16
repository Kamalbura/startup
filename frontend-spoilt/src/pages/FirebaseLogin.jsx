// SkillLance Login Page - Simple Working Version
import React, { useState } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

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

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold">SkillLance</h1>
          </div>
          <p className="text-xl mb-8 opacity-90">
            Connect, collaborate, and earn through skill-based tasks
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Find skilled freelancers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Post and complete tasks</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-white">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isSignUp ? 'Join the SkillLance community' : 'Sign in to your account'}
            </p>
          </div>

          {/* Status Message */}
          {displayError && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-200">
              {displayError}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your college email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
