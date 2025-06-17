// SkillLance Main App Component with Firebase Authentication
// Purpose: Main app routing and Firebase auth integration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Firebase Components
import FirebaseLogin from './pages/FirebaseLogin';
import DashboardModern from './components/dashboard/DashboardModern';
import DashboardPage from './pages/Dashboard';
import AuthDebug from './components/AuthDebug';
import LoadingSpinner from './components/LoadingSpinner';

// Other Components
import About from './pages/About';
import Disputes from './pages/Disputes';
import PostTask from './pages/PostTask';
import Skills from './pages/Skills';
import CSSTest from './components/CSSTest';
import ComponentTest from './pages/ComponentTest';

// Firebase Auth Context
import { AuthProvider, useAuth, AUTH_STATES } from './context/FirebaseAuthContext';

function App() {
  console.log('🚀 SkillLance App starting...');
  console.log('🔧 React Router imported:', Router ? '✅' : '❌');
  console.log('🔧 AuthProvider imported:', AuthProvider ? '✅' : '❌');
  console.log('🔧 FirebaseLogin imported:', FirebaseLogin ? '✅' : '❌');
  
  try {
    console.log('🔧 Creating AuthProvider wrapper...');
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

function AppContent() {
  const { status } = useAuth();
  
  console.log('🎯 Current auth status:', status);
  console.log('🎯 AUTH_STATES:', AUTH_STATES);

  // Show loading while checking authentication
  if (status === AUTH_STATES.LOADING) {
    console.log('🔄 Showing loading screen...');
    return <LoadingSpinner />;
  }
  
  // Show Firebase login for unauthenticated users or email verification required
  if (status === AUTH_STATES.UNAUTHENTICATED || 
      status === AUTH_STATES.EMAIL_VERIFICATION_REQUIRED) {
    console.log('🔓 Showing Firebase login...');
    return <FirebaseLogin />;
  }
  
  // Show profile completion for incomplete profiles
  if (status === AUTH_STATES.PROFILE_INCOMPLETE) {
    // Skip profile completion for now and go to dashboard
    // Users can complete their profile from dashboard settings    console.log('🔥 Profile incomplete, redirecting to dashboard');
    return (
      <Routes>
        <Route path="/dashboard" element={<DashboardModern />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }
  
  // Main app routes for authenticated users
  if (status === AUTH_STATES.AUTHENTICATED) {
    console.log('✅ User is authenticated, showing main app...');
    return (
      <Routes>
        {/* Authenticated user default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />        {/* Dashboard and main app routes */}
        <Route path="/dashboard" element={<DashboardModern />} />
        <Route path="/dashboard-new" element={<DashboardPage />} />
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/skills" element={<Skills />} />
        
        {/* Public info routes (available to authenticated users) */}
        <Route path="/about" element={<About />} />
        <Route path="/disputes" element={<Disputes />} />
        
        {/* Development/testing routes */}
        <Route path="/css-test" element={<CSSTest />} />
        <Route path="/auth-debug" element={<AuthDebug />} />
        <Route path="/component-test" element={<ComponentTest />} />
        
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }
  
  // Fallback for unknown auth states
  console.log('⚠️ Unknown auth state:', status);
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
        </button>
      </div>
    </div>
  );
}

export default App;
