import React, { useState, useEffect } from 'react'
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext'
import { 
  Home, User, Award, Briefcase, Calendar, MessageSquare, 
  LogOut, Bell, Search, Plus, Settings, Moon, Sun, Filter,
  Zap, TrendingUp, DollarSign, Clock, Star, ChevronRight,
  Activity, BarChart3, PieChart, Users, Target, Rocket
} from 'lucide-react'

// Import dashboard components
import WelcomeBox from './WelcomeBox'
import StatsPanel from './StatsPanel'
import ProjectFeed from './ProjectFeed'

// Import ALL UI components for ultimate experience
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import LoadingSpinner from '../ui/LoadingSpinner'
import Skeleton from '../ui/Skeleton'

// Import layout components
import Header from '../layout/Header'
import Footer from '../layout/Footer'

// Advanced Data Visualization Component
const AdvancedChart = ({ title, data, type = 'line' }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const chartData = data || [40, 65, 30, 80, 45, 70, 55];
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
        {title}
      </h3>
      <div className="h-32 flex items-end space-x-2">
        {chartData.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-xl transition-all duration-1000 hover:from-purple-500 hover:to-pink-500"
            style={{
              height: isAnimated ? `${(value / maxValue) * 100}%` : '0%',
              transitionDelay: `${index * 100}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Real-time Activity Feed Component
const ActivityFeed = () => {
  const activities = [
    { id: 1, type: 'project', message: 'New project: Web Design for Startup', time: '2 min ago', icon: Briefcase, color: 'blue' },
    { id: 2, type: 'payment', message: 'Payment received: ₹15,000', time: '1 hour ago', icon: DollarSign, color: 'green' },
    { id: 3, type: 'skill', message: 'Skill level increased: React.js', time: '3 hours ago', icon: TrendingUp, color: 'purple' },
    { id: 4, type: 'message', message: 'New message from TechCorp', time: '5 hours ago', icon: MessageSquare, color: 'indigo' },
  ];
  
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-purple-500" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
              <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Floating Action Button Component
const FloatingActionButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 hover:rotate-12 z-50 flex items-center justify-center group"
  >
    <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
  </button>
);

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
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30`}>
      {/* Sidebar - 20% width on desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 overflow-y-auto border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">SL</span>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SkillLance
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Student Talent Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-3">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    item.current
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-900/40 dark:to-indigo-900/40 border-r-4 border-blue-600 text-blue-700 dark:text-blue-300 shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-gray-900 dark:hover:text-white'
                  } group flex items-center justify-between px-5 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 w-full text-left hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`${
                        item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-300`}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-3 py-1 min-w-[24px] text-center font-bold shadow-lg animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Profile in Sidebar */}
            <div className="flex-shrink-0 flex border-t border-gray-200/50 dark:border-gray-700/50 p-5 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <div className="flex items-center w-full">
                <div className="w-14 h-14 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-14 h-14 rounded-full border-2 border-white" />
                  ) : (
                    <User className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
                    {profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">
                    {profile?.college || 'College Student'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110"
                    title="Toggle theme"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:scale-110"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 80% width on desktop */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-gray-50/90 via-blue-50/30 to-indigo-50/30 dark:from-gray-900/90 dark:via-gray-800/30 dark:to-gray-700/30">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl dark:bg-gray-800/80 shadow-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Page Title */}
              <div className="flex items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent capitalize">
                  {activeTab === 'dashboard' ? 'Welcome to SkillLance' : activeTab.replace('-', ' ')}
                </h1>
              </div>

              {/* Top Right Actions */}
              <div className="flex items-center space-x-6">
                {/* Search - only show on certain tabs */}
                {(activeTab === 'projects' || activeTab === 'dashboard') && (
                  <div className="hidden md:block relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search opportunities..."
                      className="pl-12 pr-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-72 bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 text-gray-900 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    />
                  </div>
                )}

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110"
                  >
                    <Bell className="w-6 h-6" />
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {notifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                          {notifications.some(n => n.unread) && (
                            <button 
                              onClick={markAllNotificationsAsRead}
                              className="text-sm text-blue-600 hover:text-blue-700 font-bold"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <button 
                              key={notification.id} 
                              className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 hover:scale-105 ${
                                notification.unread 
                                  ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 shadow-lg' 
                                  : 'bg-gray-50/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{notification.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{notification.time}</p>
                                </div>
                                {notification.unread && (
                                  <div className="ml-3 w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="w-full mt-4 py-3 text-sm text-blue-600 hover:text-blue-700 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Action */}
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/90 via-blue-50/30 to-indigo-50/30 dark:from-gray-900/90 dark:via-gray-800/30 dark:to-gray-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderActiveTabContent(activeTab, {
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
      
      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setActiveTab('projects')} />
    </div>
  )
}

// ULTIMATE LIVE ACTIVITY FEED
const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, type: 'project', user: 'Sarah Chen', action: 'completed', target: 'Web Design Project', time: '2 min ago', avatar: '🎨' },
    { id: 2, type: 'earning', user: 'You', action: 'earned ₹5,000 from', target: 'Mobile App UI', time: '5 min ago', avatar: '💰' },
    { id: 3, type: 'review', user: 'TechCorp', action: 'left 5-star review for', target: 'React Development', time: '12 min ago', avatar: '⭐' },
    { id: 4, type: 'project', user: 'Alex Kumar', action: 'started', target: 'Logo Design', time: '18 min ago', avatar: '🚀' },
    { id: 5, type: 'skill', user: 'Maya Patel', action: 'unlocked', target: 'Python Expert Badge', time: '25 min ago', avatar: '🏆' },
  ]);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-green-500 animate-pulse" />
          Live Activity
        </h3>
        <Badge className="bg-green-100 text-green-800 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
          LIVE
        </Badge>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-2xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold text-blue-600">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium text-gray-800">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              activity.type === 'earning' ? 'bg-green-400' :
              activity.type === 'project' ? 'bg-blue-400' :
              activity.type === 'review' ? 'bg-yellow-400' :
              activity.type === 'skill' ? 'bg-purple-400' : 'bg-gray-400'
            } animate-pulse`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ULTIMATE SKILL RADAR CHART
const SkillRadarChart = () => {
  const skills = [
    { name: 'React', level: 90, color: 'blue' },
    { name: 'Node.js', level: 85, color: 'green' },
    { name: 'Python', level: 95, color: 'yellow' },
    { name: 'Design', level: 80, color: 'purple' },
    { name: 'Marketing', level: 75, color: 'pink' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Target className="w-7 h-7 mr-3 text-purple-500" />
          Skill Radar
        </h3>
        <Button className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          View All Skills
        </Button>
      </div>
      
      <div className="relative h-64 w-64 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Radar grid */}
          {[1, 2, 3, 4, 5].map((ring) => (
            <circle
              key={ring}
              cx="100"
              cy="100"
              r={ring * 20}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
              className="opacity-50"
            />
          ))}
          
          {/* Skill areas */}
          {skills.map((skill, index) => {
            const angle = (index * 72) - 90; // 360/5 = 72 degrees apart
            const radian = (angle * Math.PI) / 180;
            const radius = (skill.level / 100) * 80;
            const x = 100 + Math.cos(radian) * radius;
            const y = 100 + Math.sin(radian) * radius;
            
            return (
              <g key={skill.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={`var(--color-${skill.color}-500)`}
                  className="animate-pulse cursor-pointer hover:r-8 transition-all duration-300"
                />
                <text
                  x={100 + Math.cos(radian) * 95}
                  y={100 + Math.sin(radian) * 95}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {skill.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ULTIMATE PROJECT TIMELINE
const ProjectTimeline = () => {
  const projects = [
    { id: 1, title: 'E-commerce Dashboard', client: 'TechStart', status: 'completed', progress: 100, deadline: '2024-01-15', earning: 25000 },
    { id: 2, title: 'Mobile App UI', client: 'InnovateCorp', status: 'in-progress', progress: 75, deadline: '2024-02-01', earning: 18000 },
    { id: 3, title: 'Brand Identity', client: 'StartupXYZ', status: 'pending', progress: 25, deadline: '2024-02-10', earning: 12000 },
    { id: 4, title: 'Website Redesign', client: 'BusinessHub', status: 'proposal', progress: 0, deadline: '2024-02-20', earning: 30000 },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Clock className="w-7 h-7 mr-3 text-orange-500" />
          Project Timeline
        </h3>
        <Button className="text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          View Calendar
        </Button>
      </div>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="relative p-4 rounded-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                <div className="flex items-center space-x-4 mb-2">
                  <Badge className={`text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-gray-500">Due: {project.deadline}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">₹{project.earning.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{project.progress}% Complete</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ULTIMATE EARNINGS DASHBOARD
const EarningsDashboard = () => {
  const earningsData = {
    today: 2500,
    thisWeek: 15000,
    thisMonth: 45000,
    total: 125000,
    pending: 8000,
    growth: 25.5
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-green-200/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarSign className="w-7 h-7 mr-3 text-green-500" />
          Earnings Overview
        </h3>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-green-600 font-semibold">+{earningsData.growth}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-2xl font-bold text-green-600">₹{earningsData.today.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-2xl font-bold text-blue-600">₹{earningsData.thisWeek.toLocaleString()}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-2xl font-bold text-purple-600">₹{earningsData.thisMonth.toLocaleString()}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300">
          <div className="text-2xl font-bold text-indigo-600">₹{earningsData.total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
      </div>
      
      <div className="bg-white/80 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Pending Payments</span>
          <span className="font-bold text-orange-600">₹{earningsData.pending.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// ULTIMATE ACHIEVEMENT SHOWCASE
const AchievementShowcase = () => {
  const achievements = [
    { id: 1, title: 'First Project', icon: '🚀', unlocked: true, description: 'Complete your first project' },
    { id: 2, title: 'Quick Deliverer', icon: '⚡', unlocked: true, description: 'Deliver 5 projects on time' },
    { id: 3, title: 'Client Favorite', icon: '❤️', unlocked: true, description: 'Receive 10 five-star reviews' },
    { id: 4, title: 'Skill Master', icon: '🎯', unlocked: false, description: 'Master 5 different skills' },
    { id: 5, title: 'Top Earner', icon: '💎', unlocked: false, description: 'Earn ₹1,00,000 total' },
    { id: 6, title: 'Community Hero', icon: '🏆', unlocked: false, description: 'Help 100 fellow students' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Trophy className="w-7 h-7 mr-3 text-yellow-500" />
          Achievements
        </h3>
        <Badge className="bg-yellow-100 text-yellow-800">
          3/6 Unlocked
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <div 
            key={achievement.id}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 cursor-pointer
              ${achievement.unlocked 
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg' 
                : 'border-gray-200 bg-gray-50 opacity-60'
              }
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {achievement.unlocked && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl mb-2 animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                {achievement.icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-600">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Ultra-Enhanced function to render content based on active tab
const renderActiveTabContent = (activeTab, props) => {
  const { profile, user, isLoading, setActiveTab, onCompleteProfile, onSaveProject, onSendProposal, onViewProject } = props

  switch (activeTab) {
    case 'dashboard':
      return (
        <div className="space-y-8">
          {/* Enhanced Welcome Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WelcomeBox 
                user={user}
                profile={profile}
                onCompleteProfile={onCompleteProfile}
              />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
          
          {/* Advanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold">₹45,230</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12% this month</span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-blue-300" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold">7</p>
                  <div className="flex items-center mt-2">
                    <Rocket className="w-4 h-4 mr-1" />
                    <span className="text-sm">3 new this week</span>
                  </div>
                </div>
                <Briefcase className="w-12 h-12 text-purple-300" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold">94%</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">Excellent rating</span>
                  </div>
                </div>
                <Target className="w-12 h-12 text-green-300" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Skill Level</p>
                  <p className="text-3xl font-bold">Expert</p>
                  <div className="flex items-center mt-2">
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-sm">Level 8/10</span>
                  </div>
                </div>
                <Award className="w-12 h-12 text-indigo-300" />
              </div>
            </div>
          </div>
          
          {/* Data Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdvancedChart 
              title="Earnings Overview"
              data={[2000, 3500, 2800, 4200, 3800, 5100, 4500]}
            />
            <AdvancedChart 
              title="Project Completion Rate"
              data={[90, 94, 87, 96, 91, 98, 94]}
            />
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Rocket className="w-8 h-8 mr-3 text-blue-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setActiveTab('projects')}
                className="group p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <Search className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">Browse Projects</h4>
                <p className="text-blue-100">Find your next opportunity</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('skills')}
                className="group p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">Upgrade Skills</h4>
                <p className="text-purple-100">Level up your expertise</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('messages')}
                className="group p-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">Messages</h4>
                <p className="text-green-100">Connect with clients</p>
              </button>
            </div>
          </div>
          
          {/* Enhanced Recent Projects Preview */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <PieChart className="w-8 h-8 mr-3 text-indigo-500" />
                Latest Opportunities
              </h3>
              <button 
                onClick={() => setActiveTab('projects')}
                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:scale-105 transform"
              >
                View all projects
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            <ProjectFeed 
              limit={3}
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <User className="w-8 h-8 mr-3 text-purple-500" />
            My Projects
          </h3>
          <p className="text-gray-600 text-lg">Your active and completed projects will appear here.</p>
        </div>
      )
    
    case 'messages':
      return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 mr-3 text-blue-500" />
            Messages
          </h3>
          <p className="text-gray-600 text-lg">Your conversations with clients and collaborators.</p>
        </div>
      )
    
    case 'skills':
      return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Award className="w-8 h-8 mr-3 text-green-500" />
            Skills Dashboard
          </h3>
          <p className="text-gray-600 text-lg">Manage and upgrade your skills portfolio.</p>
        </div>
      )
    
    default:
      return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
          </h3>
          <p className="text-gray-600 text-lg">This section is coming soon!</p>
        </div>
      )
  }
}

export default DashboardModern
