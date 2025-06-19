// SkillLance Login - Modern Responsive Login Experience
// Purpose: Clean, scalable authentication with smooth scrolling and responsive design

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles, GraduationCap, Shield,
  Rocket, Star, Users, TrendingUp, Target
} from 'lucide-react';

// Subtle Particle Animation Component (Optimized)
const ParticleField = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Reduced particles for better performance
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        hue: Math.random() * 40 + 220, // Blue range
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 50%, 70%, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20"
      style={{ pointerEvents: 'none' }}
    />
  );
};

// Clean Feature Card Component (Responsive)
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-blue-100 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

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
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Panel - Brand Experience */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex-col justify-center relative overflow-hidden">
        {/* Particle Animation Background */}
        <ParticleField />
        
        {/* Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10 px-8 text-white">
          {/* Logo & Brand */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-4 text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">SkillLance</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Turn your skills into{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                opportunities
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              Join India's most trusted student freelancing platform
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4 mb-8">
            <FeatureCard 
              icon={Shield}
              title="100% Verified Students"
              description="Secure community with institutional email verification"
            />
            <FeatureCard 
              icon={Rocket}
              title="AI-Powered Matching"
              description="Smart algorithms connect you with perfect projects"
            />
            <FeatureCard 
              icon={Target}
              title="Build Your Reputation"
              description="Earn karma points and establish professional credibility"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-blue-300 mb-1 flex items-center justify-center">
                  <Users className="w-4 h-4 mr-1" />
                  25K+
                </div>
                <div className="text-xs text-blue-100">Students</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-indigo-300 mb-1 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  ₹2.5Cr+
                </div>
                <div className="text-xs text-blue-100">Earned</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-2xl font-bold text-purple-300 mb-1 flex items-center justify-center">
                  <Star className="w-4 h-4 mr-1" />
                  98%
                </div>
                <div className="text-xs text-blue-100">Success</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SkillLance</h1>
            <p className="text-gray-600 mt-2 text-sm">Student Freelancing Platform</p>
          </div>

          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3">
              {isSignUp ? 'Join SkillLance' : 'Welcome Back'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {isSignUp ? 'Create your account and start earning' : 'Sign in to continue your journey'}
            </p>
          </div>

          {/* Error Display */}
          {currentError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-xl shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{currentError}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div>
                <label htmlFor="displayName" className="text-sm font-semibold text-gray-800 block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="displayName"
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-md"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-800 block mb-2">College Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"
                  className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-md"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <GraduationCap className="w-4 h-4 mr-1" />
                We accept .edu, .ac.in, and .edu.in domains
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-800 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-md"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{getButtonText()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-base">Continue with Google</span>
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-base">
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

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-3">
            {!isSignUp && (
              <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                Forgot your password?
              </button>
            )}
            <div className="text-xs text-gray-400 space-x-3">
              <button type="button" className="hover:text-gray-600 transition-colors">Privacy Policy</button>
              <span>•</span>
              <button type="button" className="hover:text-gray-600 transition-colors">Terms of Service</button>
              <span>•</span>
              <button type="button" className="hover:text-gray-600 transition-colors">Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
