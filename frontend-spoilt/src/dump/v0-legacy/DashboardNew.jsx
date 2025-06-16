// CampusKarma User Dashboard
// Purpose: Main dashboard with karma display and quick actions

import React from 'react'
import { useAuth } from '../context/FirebaseAuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <span className="text-sm font-bold text-white">CK</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CampusKarma
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.college}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Student'}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to earn some karma today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Karma Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.karma?.trust || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{user?.stats?.totalEarned || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasks Done</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.stats?.completedTasks || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📝</div>
                <p className="text-sm font-medium text-gray-900">Post a Task</p>
                <p className="text-xs text-gray-500">Need help with something?</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm font-medium text-gray-900">Find Tasks</p>
                <p className="text-xs text-gray-500">Browse available gigs</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm font-medium text-gray-900">My Skills</p>
                <p className="text-xs text-gray-500">Manage your abilities</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm font-medium text-gray-900">Messages</p>
                <p className="text-xs text-gray-500">Chat with other students</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Welcome to CampusKarma!</h4>
              <p className="text-gray-600 text-sm">
                Start by posting your first task or browsing available gigs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
