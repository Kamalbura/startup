// SkillLance - Professional Student Talent Platform Dashboard
// Purpose: Modern sidebar-based dashboard for skill showcasing and opportunities

import React, { useState, useEffect, useRef } from 'react'
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext'
import { 
  Home, User, Award, Briefcase, Calendar, MessageSquare, 
  LogOut, Bell, Search, Plus,
  Star, Trophy, DollarSign, Target
} from 'lucide-react'

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num) => {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  return 'th';
};

const Dashboard = () => {
  const { user, profile } = useAuth()
  const { signOut } = useAuthActions()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', message: 'New project matching your skills', time: '2 min ago', unread: true },
    { id: 2, type: 'message', message: 'Message from TechStart Inc.', time: '1 hour ago', unread: true },
    { id: 3, type: 'event', message: 'Upcoming: React Workshop', time: '3 hours ago', unread: false },
  ])

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

  // Navigation items for sidebar
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, current: activeTab === 'dashboard' },
    { id: 'profile', name: 'My Profile', icon: User, current: activeTab === 'profile' },
    { id: 'skills', name: 'Skills', icon: Award, current: activeTab === 'skills' },
    { id: 'projects', name: 'Projects', icon: Briefcase, current: activeTab === 'projects' },
    { id: 'opportunities', name: 'Opportunities', icon: Target, current: activeTab === 'opportunities' },
    { id: 'events', name: 'Events', icon: Calendar, current: activeTab === 'events' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, current: activeTab === 'messages' },
  ]

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - 25% width */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">SL</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillLance
                </h1>
                <p className="text-xs text-gray-500">Talent Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-2 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    item.current
                      ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-l-lg transition-colors w-full text-left`}
                >
                  <item.icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* User Profile in Sidebar */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.college || 'College Student'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 75% width */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Page Title */}
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                  {activeTab === 'dashboard' ? 'Welcome to SkillLance' : activeTab}
                </h1>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
                  />
                </div>                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-1 right-1 block h-2 w-2 bg-red-400 rounded-full"></span>
                    )}
                  </button>                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {notifications.some(n => n.unread) && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <button 
                              key={notification.id} 
                              className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                                notification.unread 
                                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>
        </header>        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderActiveTabContent(activeTab, profile, user)}
          </div>
        </main>
      </div>
    </div>
  )
}

// Function to render content based on active tab
const renderActiveTabContent = (activeTab, profile, user) => {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardHome profile={profile} user={user} />
    case 'profile':
      return <ProfileView profile={profile} user={user} />
    case 'skills':
      return <SkillsView profile={profile} />
    case 'projects':
      return <ProjectsView profile={profile} />
    case 'opportunities':
      return <OpportunitiesView />
    case 'events':
      return <EventsView />
    case 'messages':
      return <MessagesView />
    default:
      return <DashboardHome profile={profile} user={user} />
  }
}

// Dashboard Home Component
const DashboardHome = ({ profile, user }) => (
  <div className="space-y-8">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome back, {profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'}! 👋
      </h2>
      <p className="text-gray-600 mb-4">
        Ready to showcase your talents and find amazing opportunities on SkillLance?
      </p>
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <span className="text-gray-500">Email:</span>
          <span className="ml-2 font-medium text-gray-900">{user?.email}</span>
          {user?.emailVerified ? (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              ✓ Verified
            </span>
          ) : (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              ⚠ Unverified
            </span>
          )}
        </div>
      </div>
    </div>    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <StatCard
        title="Trust Score"
        value={profile?.trustScore || 100}
        icon={<Trophy className="w-6 h-6 text-yellow-500" />}
        bgColor="bg-yellow-50"
        trend="+5 this month"
        trendColor="text-green-600"
      />
      <StatCard
        title="Karma Points"
        value={profile?.karmaPoints || 0}
        icon={<Star className="w-6 h-6 text-purple-500" />}
        bgColor="bg-purple-50"
        trend="Building reputation"
        trendColor="text-blue-600"
      />
      <StatCard
        title="Total Earned"
        value={`₹${profile?.totalEarnings || 0}`}
        icon={<DollarSign className="w-6 h-6 text-green-500" />}
        bgColor="bg-green-50"
        trend="Start earning!"
        trendColor="text-green-600"
      />
      <StatCard
        title="Projects"
        value={profile?.completedTasks || 0}
        icon={<Briefcase className="w-6 h-6 text-blue-500" />}
        bgColor="bg-blue-50"
        trend="Build portfolio"
        trendColor="text-blue-600"
      />
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Update Profile"
          description="Complete your professional profile"
          icon={<User className="w-8 h-8 text-blue-500" />}
          bgColor="bg-blue-50"
          hoverColor="hover:border-blue-400 hover:bg-blue-50"
        />
        <QuickActionCard
          title="Add Skills"
          description="Showcase your abilities"
          icon={<Award className="w-8 h-8 text-purple-500" />}
          bgColor="bg-purple-50"
          hoverColor="hover:border-purple-400 hover:bg-purple-50"
        />
        <QuickActionCard
          title="Find Projects"
          description="Browse opportunities"
          icon={<Target className="w-8 h-8 text-green-500" />}
          bgColor="bg-green-50"
          hoverColor="hover:border-green-400 hover:bg-green-50"
        />
        <QuickActionCard
          title="Join Events"
          description="Network and learn"
          icon={<Calendar className="w-8 h-8 text-orange-500" />}
          bgColor="bg-orange-50"
          hoverColor="hover:border-orange-400 hover:bg-orange-50"
        />
      </div>
    </div>

    {/* Opportunities Feed */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Latest Opportunities</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
      </div>
      <div className="space-y-4">
        <OpportunityCard
          title="Full-Stack Web Development"
          company="TechStart Inc."
          location="Remote"
          budget="₹15,000 - ₹25,000"
          tags={['React', 'Node.js', 'MongoDB']}
          postedTime="2 hours ago"
        />
        <OpportunityCard
          title="UI/UX Design for Mobile App"
          company="DesignCorp"
          location="Hyderabad"
          budget="₹8,000 - ₹12,000"
          tags={['Figma', 'Mobile Design', 'Prototyping']}
          postedTime="5 hours ago"
        />
        <OpportunityCard
          title="Data Analysis Project"
          company="DataMinds"
          location="Bangalore"
          budget="₹10,000 - ₹18,000"
          tags={['Python', 'Pandas', 'Machine Learning']}
          postedTime="1 day ago"
        />
      </div>
    </div>
  </div>
)

// Placeholder components for other tabs
const ProfileView = ({ profile, user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Management</h3>
        <p className="text-gray-600 mb-6">Complete your professional profile to attract opportunities.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={profile?.displayName || user?.displayName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
            <input 
              type="text" 
              value={profile?.college || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your college name"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const SkillsView = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
      <p className="text-gray-600 mb-6">Showcase your skills and get verified by peers.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {['JavaScript', 'React', 'Python', 'UI/UX Design', 'Node.js', 'Machine Learning'].map((skill) => (
          <div key={skill} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm font-medium text-gray-700">{skill}</span>
            <button className="text-blue-600 hover:text-blue-700 text-xs">+Add</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const ProjectsView = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Projects</h3>
      <p className="text-gray-600 mb-6">Track your project portfolio and earnings.</p>
      
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h4>
        <p className="text-gray-600 mb-6">Start by browsing opportunities and submitting proposals.</p>
        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Browse Opportunities
        </button>
      </div>
    </div>
  )
}

const OpportunitiesView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunities</h3>
        <p className="text-gray-600 mb-6">Browse internships, freelance projects, and job openings.</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">All</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Web Development</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Design</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Data Science</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Mobile Development</button>
        </div>
        
        <div className="space-y-4">
          {[1,2,3,4].map((i) => (
            <OpportunityCard
              key={i}
              title={`Amazing Project Opportunity ${i}`}
              company="Tech Company"
              location="Remote"
              budget="₹10,000 - ₹20,000"
              tags={['React', 'Node.js', 'Design']}
              postedTime={`${i} hours ago`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const EventsView = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Events & Workshops</h3>
      <p className="text-gray-600 mb-6">Join hackathons, workshops, and networking events.</p>
      
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Events</h4>
        <p className="text-gray-600">Check back soon for exciting events and workshops!</p>
      </div>
    </div>
  )
}

const MessagesView = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
      <p className="text-gray-600 mb-6">Connect with peers, mentors, and recruiters.</p>
      
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Messages</h4>
        <p className="text-gray-600">Start a conversation by applying to projects!</p>
      </div>
    </div>
  )
}

// Reusable Components
const StatCard = ({ title, value, icon, bgColor, trend, trendColor = "text-gray-500" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 ${bgColor} rounded-xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-xs ${trendColor} font-medium`}>{trend}</p>
        </div>
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, icon, bgColor, hoverColor = "hover:border-blue-400 hover:bg-blue-50" }) => {
  return (
    <button
      className={`text-left p-6 border-2 border-dashed border-gray-300 rounded-xl ${hoverColor} transition-colors group`}
    >
      <div className={`inline-flex p-3 ${bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-sm font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  )
}

const OpportunityCard = ({ title, company, location, budget, tags, postedTime }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{company} • {location}</p>
        </div>
        <span className="text-sm text-gray-500">{postedTime}</span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-bold text-green-600">{budget}</span>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Apply Now
      </button>
    </div>
  )
}

export default Dashboard
