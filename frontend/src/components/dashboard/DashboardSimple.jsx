import React, { useState } from 'react';
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext';
import { 
  Home, Briefcase, MessageSquare, LogOut, 
  Plus, DollarSign, Star, Users, 
  Activity, BarChart3, Target, Menu, X
} from 'lucide-react';

// Import dashboard sub-components
import HelpRequestFeed from './HelpRequestFeed';
import NotificationSystem from './NotificationSystem';

/**
 * SkillLance Dashboard - Simple & Clean Version
 * Works with the background system from the page wrapper
 */

const DashboardSimple = () => {
  const { user } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample stats data
  const stats = [
    { label: 'Active Projects', value: '12', icon: Briefcase, color: 'blue' },
    { label: 'Total Earnings', value: '₹45,000', icon: DollarSign, color: 'green' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'yellow' },
    { label: 'Helped', value: '89', icon: Users, color: 'purple' }
  ];

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Help Requests Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Help Requests</h3>
            <HelpRequestFeed variant="compact" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow">
                Post Help Request
              </button>
              <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Browse Projects
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Payment received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">₹15,000 • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Project completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">React App • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">New review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">5 stars • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return (
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Help Requests</h2>
            <HelpRequestFeed variant="full" />
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Messages</h2>
            <p className="text-gray-600 dark:text-gray-400">Messages component coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Analytics component coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen flex bg-white/10 dark:bg-black/20 backdrop-blur-sm">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white ml-3">SkillLance</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white ml-3">SkillLance</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed left-0 top-16 h-full w-64 bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-30">
        <Plus className="w-6 h-6" />
      </button>

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
};

export default DashboardSimple;
