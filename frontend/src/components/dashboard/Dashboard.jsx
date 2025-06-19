import React, { useState, useEffect } from 'react';
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext';
import { 
  Home, Briefcase, MessageSquare, LogOut, Bell, 
  Plus, Settings, DollarSign, Star, Users, 
  Activity, BarChart3, Target, User, Search,
  Filter, ChevronRight, TrendingUp, Clock, CheckCircle
} from 'lucide-react';

// Import dashboard sub-components
import HelpRequestFeed from './HelpRequestFeed';

/**
 * SkillLance Dashboard - Clean & Professional
 * Matches the aesthetic of our login page
 */

const Dashboard = () => {
  const { user } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Clean, essential data
  const stats = [
    { label: 'Earned', value: '₹1.2L', icon: DollarSign, color: 'green' },
    { label: 'Success', value: '96%', icon: Target, color: 'blue' },
    { label: 'Projects', value: '47', icon: Briefcase, color: 'purple' },
    { label: 'Rating', value: '4.9★', icon: Star, color: 'yellow' }
  ];

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'earnings', name: 'Earnings', icon: DollarSign },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'messages', name: 'Messages', icon: MessageSquare, badge: '3' }
  ];

  const notifications = [
    { id: 1, message: 'New project matching your skills', time: '2m ago', unread: true },
    { id: 2, message: 'Payment received: ₹15,000', time: '1h ago', unread: false },
    { id: 3, message: 'Your proposal was accepted!', time: '3h ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="flex h-screen">
        
        {/* Clean Sidebar */}
        <div className="w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-lg">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" 
                  style={{ fontFamily: 'cursive' }}>
                SkillLance
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.displayName?.[0] || 'S'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.displayName || 'Student'}</p>
                  <p className="text-xs text-gray-500">Expert Level</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Good morning, {user?.displayName || 'Student'}!
                </h2>
                <p className="text-sm text-gray-600">Here's your dashboard overview</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            {renderTabContent()}
          </main>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-20 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return renderProjects();
      case 'earnings':
        return renderEarnings();
      case 'analytics':
        return renderAnalytics();
      case 'messages':
        return renderMessages();
      default:
        return renderOverview();
    }
  }

  function renderOverview() {
    return (
      <div className="space-y-6">
        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBg(stat.color)}`}>
                  <stat.icon className={`w-4 h-4 ${getIconColor(stat.color)}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Help Feed */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Live Help Requests</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <HelpRequestFeed variant="compact" />
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                  Post Help Request
                </button>
                <button className="w-full border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Browse Projects
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Payment received</p>
                    <p className="text-xs text-gray-500">₹15,000 • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Project completed</p>
                    <p className="text-xs text-gray-500">React App • 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">New review</p>
                    <p className="text-xs text-gray-500">5 stars • 2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderProjects() {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Help Requests</h2>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
            Post Request
          </button>
        </div>
        <HelpRequestFeed variant="full" />
      </div>
    );
  }

  function renderEarnings() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-semibold text-green-600">₹3,500</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-2xl font-semibold text-blue-600">₹18,500</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-semibold text-purple-600">₹52,000</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-semibold text-indigo-600">₹1,45,000</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Chart</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  function renderAnalytics() {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Analytics coming soon</p>
        </div>
      </div>
    );
  }

  function renderMessages() {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Messages coming soon</p>
        </div>
      </div>
    );
  }

  function getIconBg(color) {
    const colors = {
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
      yellow: 'bg-yellow-100'
    };
    return colors[color] || 'bg-gray-100';
  }

  function getIconColor(color) {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600'
    };
    return colors[color] || 'text-gray-600';
  }
};
export default Dashboard;