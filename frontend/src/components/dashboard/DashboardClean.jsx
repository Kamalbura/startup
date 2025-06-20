import React, { useState } from 'react';
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext';
import { 
  Home, Briefcase, MessageSquare, LogOut, 
  Plus, DollarSign, Star, Users, 
  Activity, BarChart3, Target, Menu, X
} from 'lucide-react';

const DashboardClean = () => {
  const { user } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-200`}
      >
        <div className="flex flex-col w-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ml-3">
                    SkillLance
                  </h1>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-black">
            {/* Mobile menu content similar to desktop */}
            <div className="p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900/50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.displayName || 'Student'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening in your SkillLance community today.
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹2,450</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">Task completed</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Python debugging help • 2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">+₹250</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50/80 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">New review</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">5 stars • 2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                      Post Help Request
                    </button>
                    <button className="w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Browse Tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DashboardClean;
