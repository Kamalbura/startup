import React, { Suspense, lazy } from 'react';
import { Activity } from 'lucide-react';

/**
 * Performance-optimized Dashboard Loader
 * Lazy loads dashboard components for faster initial load
 */

// Lazy load heavy dashboard components
const Profile = lazy(() => import('../dashboard/Profile'));
const Settings = lazy(() => import('../dashboard/Settings'));
const Analytics = lazy(() => import('../dashboard/Analytics'));
const Messages = lazy(() => import('../dashboard/Messages'));
const Earnings = lazy(() => import('../dashboard/Earnings'));

/**
 * Lightweight Loading Component
 */
const DashboardLoader = ({ componentName = "Dashboard" }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-600 text-sm">Loading {componentName}...</p>
    </div>
  </div>
);

/**
 * Performance-optimized component wrapper
 */
const LazyComponent = ({ component: Component, fallback, ...props }) => (
  <Suspense fallback={fallback || <DashboardLoader />}>
    <Component {...props} />
  </Suspense>
);

/**
 * Preload components for better UX
 */
export const preloadDashboardComponents = () => {
  // Preload components when user hovers over navigation
  const preloadProfile = () => import('../dashboard/Profile');
  const preloadSettings = () => import('../dashboard/Settings');
  const preloadAnalytics = () => import('../dashboard/Analytics');
  const preloadMessages = () => import('../dashboard/Messages');
  const preloadEarnings = () => import('../dashboard/Earnings');
  
  return {
    preloadProfile,
    preloadSettings,
    preloadAnalytics,
    preloadMessages,
    preloadEarnings
  };
};

/**
 * Component factory for lazy-loaded dashboard components
 */
export const createLazyDashboardComponent = (componentName) => {
  const components = {
    Profile: () => <LazyComponent component={Profile} fallback={<DashboardLoader componentName="Profile" />} />,
    Settings: () => <LazyComponent component={Settings} fallback={<DashboardLoader componentName="Settings" />} />,
    Analytics: () => <LazyComponent component={Analytics} fallback={<DashboardLoader componentName="Analytics" />} />,
    Messages: () => <LazyComponent component={Messages} fallback={<DashboardLoader componentName="Messages" />} />,
    Earnings: () => <LazyComponent component={Earnings} fallback={<DashboardLoader componentName="Earnings" />} />
  };
  
  return components[componentName] || null;
};

export default LazyComponent;
