// Loading Spinner Component
import React from 'react';
import { Sparkles } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse mx-auto">
            <Sparkles className="w-10 h-10 text-white animate-spin" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-30 mx-auto animate-pulse"></div>
        </div>
          {/* Brand Text */}
        <h1 className="text-4xl font-bold text-white mb-4">SkillLance</h1>
        <p className="text-blue-100 text-lg mb-8">Authenticating...</p>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;