import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/FirebaseAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Settings as SettingsIcon, Bell, Shield, Eye, Globe, 
  Smartphone, Mail, Lock, Trash2, Download, Upload,
  Moon, Sun, Monitor, Save, AlertTriangle, Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

/**
 * Settings Page Component - Comprehensive User Settings Management
 * Features: Privacy, notifications, security, data management
 * Mobile-responsive and matches dashboard design
 */
const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        helpRequests: true,
        taskUpdates: true,
        payments: true,
        marketing: false,
        weeklyDigest: true
      },
      push: {
        helpRequests: true,
        taskUpdates: true,
        payments: true,
        messages: true
      },
      frequency: 'immediate' // immediate, hourly, daily
    },
    privacy: {
      profileVisibility: 'public', // public, college, private
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      searchable: true,
      showOnlineStatus: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30, // minutes
      loginNotifications: true,
      passwordLastChanged: '2024-01-15'
    },
    appearance: {
      theme: 'system', // light, dark, system
      language: 'en',
      timezone: 'Asia/Kolkata',
      compactMode: false
    },
    data: {
      downloadRequested: false,
      lastBackup: '2024-01-10'
    }
  });
  useEffect(() => {
    // Load user settings from API or localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    
    // Sync with current theme from context
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme || 'system'
      }
    }));
  }, [theme]);
  const handleSettingChange = (section, key, value) => {
    // Special handling for theme changes - apply immediately to theme context
    if (section === 'appearance' && key === 'theme') {
      setTheme(value); // This will immediately apply the theme
    }
    
    if (typeof key === 'string' && key.includes('.')) {
      const [subSection, subKey] = key.split('.');
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subSection]: {
            ...prev[section][subSection],
            [subKey]: value
          }
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    }
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage (replace with API call)
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      // Mock data download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock data file
      const userData = {
        profile: user,
        settings: settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skilllance-data-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Mock account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signOut();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const sections = [
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Monitor },
    { id: 'data', name: 'Data & Export', icon: Download }
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and privacy settings</p>
        </div>
        {hasChanges && (
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <span className="text-green-800 dark:text-green-200">Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {section.name}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Notifications</h2>
                <div className="space-y-4">
                  {Object.entries(settings.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'helpRequests' && 'Get notified when someone needs help in your skills'}
                          {key === 'taskUpdates' && 'Updates on your posted tasks and bids'}
                          {key === 'payments' && 'Payment confirmations and receipts'}
                          {key === 'marketing' && 'Product updates and promotional content'}
                          {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={value}
                        onChange={(checked) => handleSettingChange('notifications', `email.${key}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Push Notifications</h2>
                <div className="space-y-4">
                  {Object.entries(settings.notifications.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={value}
                        onChange={(checked) => handleSettingChange('notifications', `push.${key}`, checked)}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Frequency</h2>
                <div className="space-y-3">
                  {[
                    { value: 'immediate', label: 'Immediate', description: 'Get notified right away' },
                    { value: 'hourly', label: 'Hourly Digest', description: 'Batched notifications every hour' },
                    { value: 'daily', label: 'Daily Digest', description: 'One summary email per day' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={settings.notifications.frequency === option.value}
                        onChange={(e) => handleSettingChange('notifications', 'frequency', e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Privacy</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">Public - Anyone can see your profile</option>
                      <option value="college">College Only - Only students from your college</option>
                      <option value="private">Private - Only you can see your profile</option>
                    </select>
                  </div>

                  {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'showEmail' && 'Display your email address on your public profile'}
                          {key === 'showPhone' && 'Display your phone number on your public profile'}
                          {key === 'allowMessages' && 'Allow other students to send you direct messages'}
                          {key === 'searchable' && 'Make your profile discoverable in search results'}
                          {key === 'showOnlineStatus' && 'Show when you\'re online or active'}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={value}
                        onChange={(checked) => handleSettingChange('privacy', key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={settings.security.twoFactorEnabled ? 'default' : 'secondary'}>
                        {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                      >
                        {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Login Notifications</p>
                      <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                    </div>
                    <ToggleSwitch
                      checked={settings.security.loginNotifications}
                      onChange={(checked) => handleSettingChange('security', 'loginNotifications', checked)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Password & Authentication</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">
                        Last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Display Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((theme) => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() => handleSettingChange('appearance', 'theme', theme.value)}                            className={`flex flex-col items-center p-4 border rounded-lg transition-colors ${
                              settings.appearance.theme === theme.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Icon className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Language</label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Asia/Kolkata">India Standard Time (GMT+5:30)</option>
                      <option value="America/New_York">Eastern Time (GMT-5)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT+0)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (GMT+9)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Compact Mode</p>
                      <p className="text-sm text-gray-600">Use a more compact layout to fit more content</p>
                    </div>
                    <ToggleSwitch
                      checked={settings.appearance.compactMode}
                      onChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Data & Export Settings */}
          {activeSection === 'data' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Download Your Data</p>
                      <p className="text-sm text-gray-600">
                        Export all your profile data, messages, and activity history
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadData}
                      disabled={loading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {loading ? 'Preparing...' : 'Download'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Data Backup</p>
                      <p className="text-sm text-gray-600">
                        Last backup: {new Date(settings.data.lastBackup).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Backup Now
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-red-200">
                <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This will permanently delete all your data, 
              including your profile, messages, and activity history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
