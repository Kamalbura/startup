import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bell, X, MessageSquare, Star, DollarSign, AlertCircle } from 'lucide-react';

/**
 * Real-time Notification System
 * Simple and functional notification component for the dashboard
 */
const NotificationSystem = ({ 
  notifications: propNotifications, 
  showNotifications, 
  setShowNotifications 
}) => {
  const [internalNotifications, setInternalNotifications] = useState([]);
  const [internalShowDropdown, setInternalShowDropdown] = useState(false);

  // Sample notifications if none provided
  const defaultNotifications = [
    { id: 1, message: 'New project request received', time: '2 min ago', unread: true, type: 'message' },
    { id: 2, message: 'Payment of ₹15,000 received', time: '1 hour ago', unread: true, type: 'payment' },
    { id: 3, message: 'Project milestone completed', time: '3 hours ago', unread: false, type: 'system' },
    { id: 4, message: 'Client left a 5-star review', time: '1 day ago', unread: false, type: 'review' }
  ];

  // Use provided notifications or default ones
  const displayNotifications = propNotifications || internalNotifications || defaultNotifications;
  const isDropdownOpen = showNotifications !== undefined ? showNotifications : internalShowDropdown;
  const setDropdownOpen = setShowNotifications || setInternalShowDropdown;

  // Calculate unread count
  const unreadCount = displayNotifications.filter(n => n.unread).length;
  // Notification type icons and colors
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  // Initialize default notifications if none provided
  useEffect(() => {
    if (!propNotifications && internalNotifications.length === 0) {
      setInternalNotifications(defaultNotifications);
    }
  }, [propNotifications, internalNotifications.length, defaultNotifications]);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const markAsRead = (notificationId) => {
    if (propNotifications && setShowNotifications) {
      // If using external state, you'd need a callback to update external notifications
      return;
    }
    
    setInternalNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}      <button
        onClick={handleToggleDropdown}
        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>      {/* Notifications Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/75 dark:bg-black/75 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button
                onClick={() => setDropdownOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">            {displayNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No notifications yet</p>
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left ${
                    notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title || 'Notification'}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>          {displayNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

NotificationSystem.propTypes = {
  notifications: PropTypes.array,
  showNotifications: PropTypes.bool,
  setShowNotifications: PropTypes.func
};

export default NotificationSystem;
