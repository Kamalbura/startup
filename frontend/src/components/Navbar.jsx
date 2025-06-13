import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, Bell, Plus } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-karma-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CK</span>
              </div>
              <span className="font-bold text-xl text-slate-800 font-karma">
                CampusKarma
              </span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/dashboard"
              className="text-slate-700 hover:text-karma-600 font-medium transition-colors duration-200"
            >
              Dashboard
            </a>
            <a
              href="/tasks"
              className="text-slate-700 hover:text-karma-600 font-medium transition-colors duration-200"
            >
              Browse Tasks
            </a>
            <a
              href="/create-task"
              className="text-slate-700 hover:text-karma-600 font-medium transition-colors duration-200"
            >
              Post Task
            </a>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <button
              onClick={() => navigate('/create-task')}
              className="bg-karma-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-karma-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post Task</span>
            </button>

            {/* Notifications */}
            <button className="p-2 text-slate-600 hover:text-slate-800 transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                <div className="bg-karma-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-karma-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-600">
                    {user?.karma || 0} karma
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50">
        <div className="px-4 py-2 space-y-1">
          <a
            href="/dashboard"
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-karma-600 hover:bg-white rounded-lg transition-colors duration-200"
          >
            Dashboard
          </a>
          <a
            href="/tasks"
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-karma-600 hover:bg-white rounded-lg transition-colors duration-200"
          >
            Browse Tasks
          </a>
          <a
            href="/create-task"
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-karma-600 hover:bg-white rounded-lg transition-colors duration-200"
          >
            Post Task
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
