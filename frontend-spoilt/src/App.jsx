// SkillLance Main App Component
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/FirebaseAuthContext';
import SkillLanceLogin from './pages/FirebaseLogin';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Main App Component
function AppContent() {
  const { user, loading } = useAuth();
  
  console.log('🔄 App render - User:', user?.email, 'Loading:', loading);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <SkillLanceLogin />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Root redirect */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* Catch all route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

// Root App with Auth Provider
function App() {
  console.log('🚀 SkillLance App initializing...');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
