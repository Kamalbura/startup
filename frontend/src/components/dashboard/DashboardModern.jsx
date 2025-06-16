import React, { useState, useEffect } from 'react'
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext'
import { 
  Home, User, Award, Briefcase, Calendar, MessageSquare, 
  LogOut, Bell, Search, Plus, Settings, Moon, Sun, Filter
} from 'lucide-react'

// Import new dashboard components
import WelcomeBox from './WelcomeBox'
import StatsPanel from './StatsPanel'
import ProjectFeed from './ProjectFeed'

const DashboardModern = () => {
  const { user, profile } = useAuth()
  const { signOut } = useAuthActions()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', message: 'New project matching your skills', time: '2 min ago', unread: true },
    { id: 2, type: 'message', message: 'Message from TechStart Inc.', time: '1 hour ago', unread: true },
    { id: 3, type: 'proposal', message: 'Your proposal was accepted!', time: '3 hours ago', unread: false },
    { id: 4, type: 'payment', message: 'Payment received: ₹15,000', time: '1 day ago', unread: false },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    )
  }

  const handleCompleteProfile = () => {
    setActiveTab('profile')
  }

  const handleSaveProject = (projectId, saved) => {
    console.log(`Project ${projectId} ${saved ? 'saved' : 'unsaved'}`)
    // Implement save logic with Firestore
  }

  const handleSendProposal = (project) => {
    console.log('Send proposal for:', project.title)
    // Implement proposal modal/flow
  }

  const handleViewProject = (project) => {
    console.log('View project:', project.title)
    // Implement project details modal/page
  }

  // Navigation items for sidebar
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, current: activeTab === 'dashboard' },
    { id: 'projects', name: 'Browse Projects', icon: Briefcase, current: activeTab === 'projects' },
    { id: 'my-projects', name: 'My Projects', icon: User, current: activeTab === 'my-projects' },
    { id: 'skills', name: 'Skills', icon: Award, current: activeTab === 'skills' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, current: activeTab === 'messages', badge: '3' },
    { id: 'events', name: 'Events', icon: Calendar, current: activeTab === 'events' },
  ]

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - 20% width on desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-900 overflow-y-auto border-r border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">SL</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillLance
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Student Talent Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    item.current
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  } group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-l-xl transition-all duration-200 w-full text-left`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`${
                        item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile in Sidebar */}
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center w-full">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {profile?.college || 'College Student'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    title="Toggle theme"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 80% width on desktop */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Page Title */}
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white capitalize">
                  {activeTab === 'dashboard' ? 'Welcome to SkillLance' : activeTab.replace('-', ' ')}
                </h1>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center space-x-4">
                {/* Search - only show on certain tabs */}
                {(activeTab === 'projects' || activeTab === 'dashboard') && (
                  <div className="hidden md:block relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search opportunities..."
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-1 right-1 block h-2 w-2 bg-red-400 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          {notifications.some(n => n.unread) && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <button 
                              key={notification.id} 
                              className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                                notification.unread 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {notification.unread && (
                                  <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Action */}
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">            {renderActiveTabContent(activeTab, {
              profile,
              user,
              isLoading,
              setActiveTab,
              onCompleteProfile: handleCompleteProfile,
              onSaveProject: handleSaveProject,
              onSendProposal: handleSendProposal,
              onViewProject: handleViewProject
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

// Function to render content based on active tab
const renderActiveTabContent = (activeTab, props) => {
  const { profile, user, isLoading, setActiveTab, onCompleteProfile, onSaveProject, onSendProposal, onViewProject } = props

  switch (activeTab) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          {/* Welcome Box */}
          <WelcomeBox 
            user={user}
            profile={profile}
            onCompleteProfile={onCompleteProfile}
          />
          
          {/* Stats Panel */}
          <StatsPanel 
            profile={profile}
            loading={isLoading}
          />
          
          {/* Recent Projects Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Opportunities</h3>
              <button 
                onClick={() => setActiveTab('projects')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all projects →
              </button>
            </div>
            <ProjectFeed 
              projects={[]} // Will show sample data
              loading={isLoading}
              onSaveProject={onSaveProject}
              onSendProposal={onSendProposal}
              onViewProject={onViewProject}
            />
          </div>
        </div>
      )
    
    case 'projects':
      return (
        <ProjectFeed 
          projects={[]} // Will show sample data
          loading={isLoading}
          onSaveProject={onSaveProject}
          onSendProposal={onSendProposal}
          onViewProject={onViewProject}
        />
      )
    
    case 'my-projects':
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Projects</h3>
          <p className="text-gray-600 dark:text-gray-400">Your active and completed projects will appear here.</p>
        </div>
      )
    
    case 'messages':
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages</h3>
          <p className="text-gray-600 dark:text-gray-400">Your conversations with clients and collaborators.</p>
        </div>
      )
    
    default:
      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">This section is coming soon!</p>
        </div>
      )
  }
}

export default DashboardModern
