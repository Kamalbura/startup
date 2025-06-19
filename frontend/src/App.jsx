// SkillLance Main App Component with Firebase Authentication
// Purpose: Main app routing and Firebase auth integration

import React, { Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Import essential pages (public pages - immediate load)
import Landing from './pages/Landing';
import About from './pages/About';
import FirebaseLogin from './pages/FirebaseLogin';

// Lazy load protected pages (better performance)
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const PostTask = React.lazy(() => import('./pages/PostTask'));
const Skills = React.lazy(() => import('./pages/Skills'));
const Disputes = React.lazy(() => import('./pages/Disputes'));
const ComponentTest = React.lazy(() => import('./pages/ComponentTest'));

// Prefetch common routes after initial load
const prefetchRoutes = () => {
  // Prefetch dashboard and other common routes after a short delay
  setTimeout(() => {
    import('./components/dashboard/Dashboard');
    import('./pages/PostTask');
  }, 2000);
};

// Loading components
import { LoadingOverlay } from './components/ui/LoadingSpinner';
import { FastLoadingOverlay } from './components/ui/FastLoadingSpinner';

// Firebase Auth Context
import { AuthProvider, useAuth, AUTH_STATES } from './context/FirebaseAuthContext';

/**
 * Placeholder component for pages that will be implemented in later iterations
 */
const PlaceholderPage = ({ title, description }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>
      <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
        🚧 This page will be implemented in upcoming iterations
      </p>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        ← Go Back
      </button>
    </div>
  </div>
);

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

function App() {
  // Only log in development mode
  if (import.meta.env.DEV) {
    console.log('🚀 SkillLance App starting...');
    console.log('🔧 React Router imported:', Router ? '✅' : '❌');
    console.log('🔧 AuthProvider imported:', AuthProvider ? '✅' : '❌');
    console.log('🔧 FirebaseLogin imported:', FirebaseLogin ? '✅' : '❌');
  }
  
  // Start prefetching common routes after component mounts
  React.useEffect(() => {
    prefetchRoutes();
  }, []);
  
  try {
    if (import.meta.env.DEV) {
      console.log('🔧 Creating AuthProvider wrapper...');
    }
    return (
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    );
  } catch (error) {
    console.error('❌ App initialization error:', error);
    console.error('❌ Error stack:', error.stack);
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-yellow-800 mb-4">⚠️ Initialization Error</h1>
          <p className="text-yellow-700 mb-4">Something went wrong while starting the app.</p>
          <p className="text-sm text-yellow-600 mb-4">Error: {error.message}</p>
          <details className="text-left text-xs text-yellow-600 mt-4">
            <summary>Technical Details</summary>
            <pre className="mt-2 p-2 bg-yellow-100 rounded">{error.stack}</pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 mt-4"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

const AppContent = memo(function AppContent() {
  const { status } = useAuth();
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log('🎯 Current auth status:', status);
    console.log('🎯 AUTH_STATES:', AUTH_STATES);
  }
    // Show loading while checking authentication
  if (status === AUTH_STATES.LOADING) {
    if (import.meta.env.DEV) {
      console.log('🔄 Showing loading screen...');
    }
    return (
      <FastLoadingOverlay 
        isVisible={true}
        variant="dots"
        message="Checking authentication..."
        backdrop="blur"
      />
    );
  }
  
  // Public routes for unauthenticated users
  if (status === AUTH_STATES.UNAUTHENTICATED || 
      status === AUTH_STATES.EMAIL_VERIFICATION_REQUIRED) {
    if (import.meta.env.DEV) {
      console.log('🔓 Showing public routes...');
    }
    return (<Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<FirebaseLogin />} />
        <Route path="/signup" element={<FirebaseLogin />} />
        <Route path="/component-test" element={<ComponentTest />} />
          {/* 404 Not Found - Will be implemented in Iteration 3 */}
        <Route path="/notfound" element={<div>404 - Page Not Found</div>} />
        
        {/* Redirect all other routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
    // Show profile completion for incomplete profiles
  if (status === AUTH_STATES.PROFILE_INCOMPLETE) {
    if (import.meta.env.DEV) {
      console.log('🔥 Profile incomplete, redirecting to dashboard');
    }
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }
    // Protected routes for authenticated users
  if (status === AUTH_STATES.AUTHENTICATED) {
    return (
      <Suspense fallback={<LoadingOverlay isVisible={true} variant="dots" message="Loading page..." />}>
        <Routes>
          {/* Authenticated user default route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Core Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
            {/* Help System Routes - Iterations 4-5 */}
          <Route path="/help" element={<PlaceholderPage title="Help Feed" description="Browse all help requests" />} />
          <Route path="/help/create" element={<PlaceholderPage title="Create Help Request" description="Post a new request" />} />
          <Route path="/help/:id" element={<PlaceholderPage title="Help Detail" description="View help request details" />} />
          
          {/* Interactive Features - Iterations 5-7 */}
          <Route path="/interaction/:id" element={<PlaceholderPage title="Live Interaction" description="Real-time collaboration" />} />
          <Route path="/chats" element={<PlaceholderPage title="Message Inbox" description="Chat history" />} />
          
          {/* User Management - Iteration 6 */}
          <Route path="/profile" element={<PlaceholderPage title="User Profile" description="Manage your profile" />} />
          <Route path="/payment" element={<PlaceholderPage title="Payment & Rewards" description="Manage payments" />} />
          
          {/* Admin Panel - Iteration 9 */}
          <Route path="/admin" element={<PlaceholderPage title="Admin Panel" description="Content moderation" />} />
            {/* Existing Implemented Pages */}
          <Route path="/post-task" element={<PostTask />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/about" element={<About />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/component-test" element={<ComponentTest />} />
          
          {/* 404 Not Found */}
          <Route path="/notfound" element={<div>404 - Page Not Found</div>} />
          
          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    );
  }
    // Fallback for unknown auth states
  if (import.meta.env.DEV) {
    console.log('⚠️ Unknown auth state:', status);
  }
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
        <p className="text-red-600">Unknown auth state: {status}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Reload Page
        </button>      </div>
    </div>
  );
});

export default App;