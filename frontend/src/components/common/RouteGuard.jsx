import React from 'react';
import { Activity, ArrowLeft, Home, Search } from 'lucide-react';

/**
 * Route Guard Component
 * Handles unimplemented routes with beautiful fallback UI
 */
const RouteGuard = ({ children, routeName = "this page" }) => {
  const [showAnimation, setShowAnimation] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check if the route/component is implemented
  // This is a simple check - you can make it more sophisticated
  const isImplemented = children && React.isValidElement(children);

  if (!isImplemented) {
    if (showAnimation) {
      return <ComingSoonAnimation routeName={routeName} />;
    }
    
    return <ComingSoonPage routeName={routeName} />;
  }

  return children;
};

/**
 * Coming Soon Animation
 */
const ComingSoonAnimation = ({ routeName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Activity className="w-12 h-12 text-white animate-spin" />
          </div>
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-ping opacity-20"></div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-ping opacity-10 delay-75"></div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Preparing {routeName}...
        </h2>
        <p className="text-gray-600 animate-pulse">
          Building something amazing for you ✨
        </p>
      </div>
    </div>
  );
};

/**
 * Coming Soon Page
 */
const ComingSoonPage = ({ routeName }) => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Coming Soon!</h1>
            <p className="text-blue-100">
              We're working hard to bring you {routeName}
            </p>
          </div>
          
          {/* Content */}
          <div className="px-8 py-8">
            {/* Progress Illustration */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            {/* Features Coming */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Coming:</h3>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Beautiful, modern interface
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Mobile-responsive design
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Advanced features & functionality
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Real-time updates
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
              
              <button
                onClick={handleGoBack}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </div>
            
            {/* Fun Message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center">
                🚀 <strong>Meanwhile:</strong> Explore other amazing features in our dashboard!
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center mt-6 text-gray-500">
          <p className="text-sm">
            Want to be notified when {routeName} is ready?<br />
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Join our newsletter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteGuard;
