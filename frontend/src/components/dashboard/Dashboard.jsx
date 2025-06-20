import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, Briefcase, MessageSquare, LogOut, 
  Plus, DollarSign, Star, Users, 
  Activity, BarChart3, Target, Menu, X, ArrowRight,
  Settings as SettingsIcon
} from 'lucide-react';

// Import dashboard sub-components
import HelpRequestFeed from './HelpRequestFeed';
import NotificationSystem from './NotificationSystem';

// Lazy load heavy components for better performance
const Profile = React.lazy(() => import('./Profile'));
const Settings = React.lazy(() => import('./Settings'));
const Analytics = React.lazy(() => import('./Analytics'));
const Messages = React.lazy(() => import('./Messages'));
const Earnings = React.lazy(() => import('./Earnings'));

/**
 * SkillLance Dashboard - Clean, Professional & Responsive
 * Matches the aesthetic of our login page
 * Mobile-first design for students
 */

// Loading component for lazy-loaded components
const LoadingFallback = ({ componentName = "content" }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">Loading {componentName}...</p>
    </div>
  </div>
);

LoadingFallback.propTypes = {
  componentName: PropTypes.string
};

const Dashboard = () => {
  const { user } = useAuth();
  const { signOut } = useAuthActions();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Debug theme state
  useEffect(() => {
    console.log('Dashboard theme state:', { isDarkMode, htmlClasses: document.documentElement.classList.toString() });
  }, [isDarkMode]);
  
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'New project request received', time: '2 min ago', unread: true },
    { id: 2, message: 'Payment of ₹15,000 received', time: '1 hour ago', unread: true },
    { id: 3, message: 'Project milestone completed', time: '3 hours ago', unread: false },
    { id: 4, message: 'Client left a 5-star review', time: '1 day ago', unread: false }
  ];
  
  // Clean, essential data
  const stats = [
    { label: 'Earned', value: '₹1.2L', icon: DollarSign, color: 'green' },
    { label: 'Success', value: '96%', icon: Target, color: 'blue' },
    { label: 'Projects', value: '47', icon: Briefcase, color: 'purple' },
    { label: 'Rating', value: '4.9★', icon: Star, color: 'yellow' }
  ];  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'earnings', name: 'Earnings', icon: DollarSign },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'messages', name: 'Messages', icon: MessageSquare, badge: '3' },
    { id: 'help', name: 'Help', icon: MessageSquare }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Click outside to close sidebar when collapsed
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('desktop-sidebar');
      const isClickInsideSidebar = sidebar?.contains(event.target);
      
      // If sidebar is collapsed and user clicks outside, keep it collapsed
      // If sidebar is expanded and user clicks outside (but not on the toggle button), collapse it
      if (!isClickInsideSidebar && !sidebarCollapsed) {
        // Check if click was on the toggle button
        const toggleButton = event.target.closest('[data-sidebar-toggle]');
        if (!toggleButton) {
          setSidebarCollapsed(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };  }, [sidebarCollapsed]);

  // Helper functions
  const getIconBg = (color) => {
    const colors = {
      green: 'bg-green-100 dark:bg-green-900/20',
      blue: 'bg-blue-100 dark:bg-blue-900/20',
      purple: 'bg-purple-100 dark:bg-purple-900/20',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20'
    };
    return colors[color] || 'bg-gray-100 dark:bg-gray-800';
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600 dark:text-green-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      yellow: 'text-yellow-600 dark:text-yellow-400'
    };
    return colors[color] || 'text-gray-600 dark:text-gray-400';
  };

  // Render functions
  const renderErrorFallback = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Don't worry, we're working on it!</p>
        <button 
          onClick={() => setActiveTab('overview')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
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
          <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Help Requests</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View all</button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <HelpRequestFeed variant="compact" />
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
                Post Help Request
              </button>
              <button className="w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Browse Projects
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-black rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Payment received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">₹15,000 • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">Project completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">React App • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
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
  const renderProjects = () => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Help Requests</h2>
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow">
          Post Request
        </button>
      </div>
      <HelpRequestFeed variant="full" />
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Help & Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAQ Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">How do I post a help request?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Click the "+" button or go to Projects tab to create a new help request.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">How do payments work?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Payments are processed securely through our platform. Check the Earnings tab for details.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">How to improve my rating?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Provide quality help, respond quickly, and maintain good communication with clients.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Support</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg text-left hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm opacity-90">Get instant help</div>
                  </div>
                </div>
              </button>
              <button className="w-full border border-gray-200 dark:border-gray-700 p-4 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">support@skilllance.com</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    try {
      switch (activeTab) {
        case 'overview':
          return renderOverview();
        case 'projects':
          return renderProjects();
        case 'earnings':
          return (
            <React.Suspense fallback={<LoadingFallback componentName="Earnings" />}>
              <Earnings />
            </React.Suspense>
          );
        case 'analytics':
          return (
            <React.Suspense fallback={<LoadingFallback componentName="Analytics" />}>
              <Analytics />
            </React.Suspense>
          );
        case 'messages':
          return (
            <React.Suspense fallback={<LoadingFallback componentName="Messages" />}>
              <Messages />
            </React.Suspense>
          );
        case 'profile':
          return (
            <React.Suspense fallback={<LoadingFallback componentName="Profile" />}>
              <Profile />
            </React.Suspense>
          );
        case 'settings':
          return (
            <React.Suspense fallback={<LoadingFallback componentName="Settings" />}>
              <Settings />
            </React.Suspense>
          );
        case 'help':
          return renderHelp();
        default:
          return renderOverview();
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return renderErrorFallback();
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white/10 dark:bg-black/20 backdrop-blur-sm">

        {/* Desktop Sidebar - Pure Black Theme */}
        <div 
          id="desktop-sidebar"
          className={`hidden lg:flex ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-200`}
        >
          {/* Logo Section */}
          <div className="flex flex-col w-full">            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              {sidebarCollapsed ? (
                /* Collapsed state - centered logo only */
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                /* Expanded state - logo and toggle button in separate areas */
                <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                  {/* Logo Section - takes available space */}
                  <div className="flex items-center min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent ml-3 truncate" 
                        style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900 }}>
                      SkillLance
                    </h1>
                  </div>
                    {/* Toggle Button - separate column */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150"
                      data-sidebar-toggle
                    >
                      <Menu className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* External toggle button for collapsed state */}
              {sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="absolute top-6 -right-3 p-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-full shadow-sm transition-all duration-150 z-10"
                  data-sidebar-toggle
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>{/* Navigation */}
            <nav className="p-4 space-y-2 flex-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar if clicking outside when collapsed
                    if (sidebarCollapsed && window.innerWidth >= 1024) {
                      // Auto-expand on click for better UX
                    }
                  }}
                  onMouseEnter={() => {
                    // Preload component on hover for better performance
                    if (item.id === 'profile') import('./Profile');
                    if (item.id === 'analytics') import('./Analytics');
                    if (item.id === 'messages') import('./Messages');
                    if (item.id === 'earnings') import('./Earnings');
                  }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'px-2 justify-center' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-4 h-4" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left ml-3">{item.name}</span>
                      {item.badge && (
                        <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.displayName?.[0] || 'S'}
                  </div>                  {!sidebarCollapsed && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.displayName || 'Student'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Expert Level</p>
                    </div>
                  )}
                </div>                {!sidebarCollapsed && (
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {/* Mobile Header */}
          <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-3"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                {/* Mobile Logo */}
                <div className="flex items-center lg:hidden">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <Activity className="w-3 h-3 text-white" />
                  </div>
                  <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent" 
                      style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 900 }}>
                    SkillLance
                  </h1>
                </div>

                {/* Desktop Title */}                <div className="hidden lg:block">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Good morning, {user?.displayName || 'Student'}!
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Here's your dashboard overview</p>
                </div>
              </div>              <div className="flex items-center space-x-3">
                <NotificationSystem 
                  notifications={notifications}
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
                />
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SettingsIcon className="w-5 h-5" />
                </button>
                
                {/* Mobile User Avatar */}
                <button 
                  onClick={handleSignOut}
                  className="lg:hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >
                  {user?.displayName?.[0] || 'S'}
                </button>
              </div>
            </div>
          </header>          {/* Dashboard Content */}
          <main className="p-4 sm:p-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
            {renderTabContent()}
          </main>
        </div>
      </div>
      {/* Mobile Menu Overlay and Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl" aria-label="Mobile navigation menu">
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
          </nav>
        </div>
      )}
      {/* Floating Action Button */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40">
        <Plus className="w-5 h-5" />
      </button>
    </>
  );
};

export default Dashboard;