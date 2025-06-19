import React from 'react';
import { Activity, RefreshCw, Home } from 'lucide-react';

/**
 * Global Error Boundary with Beautiful Fallback UI
 * Shows animated loading screens and error recovery options
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      showLoadingAnimation: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ showLoadingAnimation: true });
    
    // Show loading animation for 2 seconds before resetting
    setTimeout(() => {
      this.setState({ 
        hasError: false, 
        error: null, 
        showLoadingAnimation: false 
      });
    }, 2000);
  };

  render() {
    if (this.state.showLoadingAnimation) {
      return <LoadingSlideshow />;
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Animated Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
              {/* Animated Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Activity className="w-10 h-10 text-white" />
              </div>
              
              {/* Error Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                Don't worry, it's not you - it's us! Our engineers are probably already on it.
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>
              
              {/* Fun Message */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Pro tip:</strong> Try refreshing the page or check your internet connection!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading Slideshow Component
 * Cycles through different animated loading screens
 */
const LoadingSlideshow = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const loadingScreens = [
    {
      name: "Pulse",
      component: (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse delay-200"></div>
        </div>
      )
    },
    {
      name: "Spin",
      component: (
        <div className="w-12 h-12 border-4 border-blue-200 border-top-blue-600 rounded-full animate-spin"></div>
      )
    },
    {
      name: "Bounce",
      component: (
        <div className="flex items-end space-x-1">
          <div className="w-2 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-12 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-10 bg-gradient-to-t from-pink-500 to-red-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-2 h-6 bg-gradient-to-t from-red-500 to-orange-500 rounded-full animate-bounce delay-300"></div>
        </div>
      )
    },
    {
      name: "Wave",
      component: (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      )
    },
    {
      name: "Glow",
      component: (
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping absolute"></div>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
      )
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % loadingScreens.length);
    }, 800);

    return () => clearInterval(interval);
  }, [loadingScreens.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Current Animation */}
        <div className="mb-8 flex justify-center">
          {loadingScreens[currentSlide].component}
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Something Amazing...
        </h2>
        <p className="text-gray-600 mb-6">
          Showing you: <span className="font-medium text-blue-600">{loadingScreens[currentSlide].name}</span> Animation
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {loadingScreens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* Fun Facts */}
        <div className="mt-8 max-w-sm mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-gray-700">
              🎨 <strong>Did you know?</strong> This slideshow shows all the different loading animations we have in our app!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
