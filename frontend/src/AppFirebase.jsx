// SkillLance Main App Component with Firebase Authentication
// Purpose: Main app routing and Firebase auth integration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Firebase Components
import FirebaseLogin from './pages/FirebaseLogin';
import Dashboard from './components/dashboard/Dashboard';
import AuthDebug from './components/AuthDebug';
import LoadingSpinner from './components/LoadingSpinner';

// Other Components
import About from './pages/About';
import Disputes from './pages/Disputes';
import PostTask from './pages/PostTask';
import Skills from './pages/Skills';
import CSSTest from './components/CSSTest';

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
    console.log('🔥 Profile incomplete, redirecting to dashboard');
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard variant="enhanced" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }
  
  // Main app routes for authenticated users
  if (status === AUTH_STATES.AUTHENTICATED) {
    return (
      <Routes>
        {/* Authenticated user default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Main Dashboard - Clean and Simple */}
        <Route path="/dashboard" element={<Dashboard variant="simple" />} />
        <Route path="/dashboard-enhanced" element={<Dashboard variant="enhanced" />} />
        <Route path="/dashboard-ultimate" element={<Dashboard variant="ultimate" />} />
        <Route path="/dashboard-classic" element={<Dashboard variant="modern" />} />
        <Route path="/post-task" element={<PostTask />} />
        <Route path="/skills" element={<Skills />} />
        
        {/* Public info routes (available to authenticated users) */}
        <Route path="/about" element={<About />} />
        <Route path="/disputes" element={<Disputes />} />
        
        {/* Development/testing routes - removed for production cleanup */}
        
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
