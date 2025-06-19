// CampusKarma Main App Component
// Purpose: Main app routing and authentication flow

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Components
import LoginPage from './pages/LoginPage'
import VerificationPage from './pages/VerificationPage'
import LoginPageOTP from './pages/LoginPageOTP'
import Dashboard from './components/Dashboard'
import CSSTest from './components/CSSTest'
import Landing from './pages/Landing'
import About from './pages/About'
import Disputes from './pages/Disputes'
import PostTask from './pages/PostTask'
import Skills from './pages/Skills'

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

function AppContent() {
  const { isAuthenticated, isGuest, isChecking } = useAuth()

  // Show loading spinner while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading CampusKarma...</p>
        </div>
      </div>
    )
  }
  return (
    <Routes>
      {/* Homepage/Landing */}
      <Route 
        path="/home" 
        element={<Landing />} 
      />
      
      {/* Temporary CSS Test Route */}
      <Route 
        path="/test" 
        element={<CSSTest />} 
      />
        {/* Public Routes */}      
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      
      <Route 
        path="/verification" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <VerificationPage />} 
      />
      
      <Route 
        path="/login-otp" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPageOTP />} 
      />
        {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />

      {/* Additional Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/disputes" element={<Disputes />} />
      <Route path="/post-task" element={<PostTask />} />
      <Route path="/skills" element={<Skills />} />
        
      {/* Default Route - Homepage */}
      <Route 
        path="/" 
        element={<Landing />} 
      />
      
      {/* Catch all - redirect to homepage */}
      <Route 
        path="*" 
        element={<Navigate to="/" />} 
      />
    </Routes>
  )
}

export default App
