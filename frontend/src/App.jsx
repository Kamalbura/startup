import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import PostTask from './pages/PostTask'
import Profile from './pages/Profile'
import SkillQuiz from './pages/SkillQuiz'
import Messages from './pages/Messages'
import Disputes from './pages/Disputes'
import About from './pages/About'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-task" element={<PostTask />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/skills" element={<SkillQuiz />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/disputes" element={<Disputes />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
