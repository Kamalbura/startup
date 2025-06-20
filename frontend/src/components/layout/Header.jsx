import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/FirebaseAuthContext'
import { Button } from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import { cn } from '@/lib/utils'

const Header = ({ className }) => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className={cn("bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Navigation for larger screens */}          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link 
              to="/help" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
            >
              Help
            </Link>
          </nav>

          {/* Center - Logo */}
          <div className="flex items-center justify-center flex-1 md:flex-initial">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: 900 }}>
                SkillLance
              </span>
            </Link>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Authentication */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <AuthButtons navigate={navigate} />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-black">
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/help" 
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center px-3 py-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3b82f6&color=fff`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="text-gray-700 dark:text-white text-sm">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mx-3 mt-2" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/signup');
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// Helper component for user menu
const UserMenu = ({ user, onLogout }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center space-x-2">
      <img
        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3b82f6&color=fff`}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />      <span className="text-gray-700 dark:text-white text-sm">
        {user.displayName || user.email}
      </span>
    </div>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onLogout}
    >
      Logout
    </Button>
  </div>
);

// Helper component for auth buttons
const AuthButtons = ({ navigate }) => (
  <div className="flex items-center space-x-2">
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate('/login')}
    >
      Login
    </Button>
    <Button 
      variant="gradient" 
      size="sm" 
      onClick={() => navigate('/signup')}
    >
      Sign Up
    </Button>
  </div>
);

export default Header
