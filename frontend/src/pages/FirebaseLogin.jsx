// SkillLance Login - Ultra-Modern Interactive Login Experience
// Purpose: Next-level authentication with animations and 3D effects

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Mail, Lock, Eye, EyeOff, User, AlertCircle, 
  ArrowRight, Sparkles, GraduationCap, Shield, Zap, Trophy,
  Rocket, Star, Code, Users, TrendingUp, Target
} from 'lucide-react';

// Advanced Particle Animation Component
const ParticleField = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200, // Blue to purple range
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
        
        // Connect nearby particles
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
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
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ pointerEvents: 'none' }}
    />
  );
};

// 3D Floating Card Component
const FloatingFeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`
        relative p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20
        transform transition-all duration-700 ease-out
        hover:scale-110 hover:rotate-2 hover:bg-white/20
        shadow-xl hover:shadow-2xl
        ${isHovered ? 'z-10' : ''}
      `}
      style={{
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'translateY(-10px) rotateX(10deg) rotateY(5deg)' : 'translateY(0) rotateX(0) rotateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className={`
          w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 
          flex items-center justify-center mb-4 transform transition-all duration-300
          ${isHovered ? 'scale-110 rotate-12' : ''}
        `}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
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
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Panel - Ultra-Modern Brand Experience (45%) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex-col justify-center relative overflow-hidden">
        {/* Particle Animation Background */}
        <ParticleField />
        
        {/* Enhanced Background Animation Layers */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-56 h-56 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-bounce"></div>
          <div className="absolute bottom-10 left-1/3 w-48 h-48 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '6s'}}></div>
        </div>
        
        <div className="relative z-10 px-12 text-white">
          {/* 3D Logo & Brand */}
          <div className="mb-16">
            <div className="flex items-center mb-8 perspective-1000">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-y-12 transition-all duration-500">
                <Sparkles className="w-11 h-11 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="ml-6 text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">SkillLance</span>
            </div>
            
            <h1 className="text-7xl font-bold mb-8 leading-tight">
              Turn your skills into{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                opportunities
              </span>
            </h1>
            
            <p className="text-2xl text-blue-100 mb-8 leading-relaxed">
              Join India's most trusted student freelancing platform where skills meet success
            </p>
          </div>

          {/* 3D Floating Feature Cards */}
          <div className="space-y-8 mb-16">
            <FloatingFeatureCard 
              icon={Shield}
              title="100% Verified Students"
              description="Secure community with institutional email verification and identity checks"
              delay={200}
            />
            <FloatingFeatureCard 
              icon={Rocket}
              title="AI-Powered Matching"
              description="Smart algorithms connect you with projects that match your expertise perfectly"
              delay={400}
            />
            <FloatingFeatureCard 
              icon={Target}
              title="Build Your Empire"
              description="Earn karma points, reviews, and establish your professional credibility fast"
              delay={600}
            />
          </div>

          {/* Interactive Stats Dashboard */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-5xl font-bold text-blue-300 mb-2 group-hover:text-blue-200 transition-all duration-300 flex items-center justify-center">
                  <Users className="w-8 h-8 mr-2" />
                  25K+
                </div>
                <div className="text-blue-100/80 group-hover:text-blue-100 transition-colors font-semibold">Active Students</div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-5xl font-bold text-indigo-300 mb-2 group-hover:text-indigo-200 transition-all duration-300 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 mr-2" />
                  ₹2.5Cr+
                </div>
                <div className="text-blue-100/80 group-hover:text-blue-100 transition-colors font-semibold">Earned by Students</div>
              </div>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="text-5xl font-bold text-purple-300 mb-2 group-hover:text-purple-200 transition-all duration-300 flex items-center justify-center">
                  <Star className="w-8 h-8 mr-2" />
                  98%
                </div>
                <div className="text-blue-100/80 group-hover:text-blue-100 transition-colors font-semibold">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Authentication Form (55%) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
        </div>
        
        <div className="w-full max-w-lg relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SkillLance</h1>
            <p className="text-gray-600 mt-3 text-lg">Student Freelancing Platform</p>
          </div>

          {/* Page Title */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              {isSignUp ? 'Join SkillLance' : 'Welcome Back'}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {isSignUp ? 'Create your account and start earning with your skills' : 'Sign in to continue your freelancing journey'}
            </p>
          </div>

          {/* Error Display */}
          {currentError && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-400 rounded-2xl shadow-lg animate-pulse">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-400 mr-4 flex-shrink-0" />
                <p className="text-red-700 font-medium">{currentError}</p>
              </div>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Display Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-3">
                <label htmlFor="displayName" className="text-sm font-bold text-gray-800 block">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="displayName"
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-14 pr-5 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-lg hover:shadow-md"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-bold text-gray-800 block">College Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@college.edu"
                  className="w-full pl-14 pr-5 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-lg hover:shadow-md"
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                We accept .edu, .ac.in, and .edu.in domains
              </p>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-bold text-gray-800 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-14 pr-16 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white shadow-sm focus:shadow-lg hover:shadow-md"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 px-8 rounded-2xl text-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-4">
                {loading ? (
                  <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{getButtonText()}</span>
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </>
                )}
              </div>
            </button>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-8 bg-white text-gray-500 font-bold text-lg">or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-8 py-5 border-2 border-gray-200 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-7 h-7 mr-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-lg">Continue with Google</span>
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
