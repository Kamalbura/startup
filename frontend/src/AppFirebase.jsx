// SkillLance Main App Component with Firebase Authentication
// Purpose: Main app routing and Firebase auth integration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Firebase Components
import FirebaseLogin from './pages/FirebaseLoginBeautiful';
import Dashboard from './components/Dashboard';
import AuthDebug from './components/AuthDebug';

// Other Components
import About from './pages/About';
import Disputes from './pages/Disputes';
import PostTask from './pages/PostTask';
import Skills from './pages/Skills';
import CSSTest from './components/CSSTest';

// Firebase Auth Context
import { AuthProvider, useAuth, AUTH_STATES } from './context/FirebaseAuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { status } = useAuth();
  
  console.log('🎯 Current auth status:', status);

  // Show loading while checking authentication
  if (status === AUTH_STATES.LOADING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mb-6">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">SkillLance</h2>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }  // Show Firebase login for unauthenticated users or email verification required
  if (status === AUTH_STATES.UNAUTHENTICATED || 
      status === AUTH_STATES.EMAIL_VERIFICATION_REQUIRED) {
    return <FirebaseLogin />;
  }// Show profile completion for incomplete profiles
  if (status === AUTH_STATES.PROFILE_INCOMPLETE) {
    // Skip profile completion for now and go to dashboard
    // Users can complete their profile from dashboard settings
    console.log('🔥 Profile incomplete, redirecting to dashboard');
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }
  // Main app routes for authenticated users
  return (
    <Routes>
      {/* Authenticated user default route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard and main app routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/post-task" element={<PostTask />} />
      <Route path="/skills" element={<Skills />} />
      
      {/* Public info routes (available to authenticated users) */}
      <Route path="/about" element={<About />} />
      <Route path="/disputes" element={<Disputes />} />
      
      {/* Development/testing routes */}
      <Route path="/css-test" element={<CSSTest />} />
      <Route path="/auth-debug" element={<AuthDebug />} />
      
      {/* Redirect unknown routes to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
