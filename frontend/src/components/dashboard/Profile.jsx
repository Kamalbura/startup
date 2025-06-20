import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/FirebaseAuthContext';
import { 
  User, Mail, MapPin, Calendar, Star, TrendingUp, 
  Briefcase, Edit, Camera, Save, X, Plus, Trash2,
  Shield, Award, Clock, Target, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

/**
 * Profile Page Component - Comprehensive User Profile Management
 * Features: Edit profile, skills management, achievements, stats
 * Mobile-responsive and matches dashboard design
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    college: '',
    course: '',
    year: '',
    bio: '',
    location: '',
    phone: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      instagram: ''
    },
    preferences: {
      emailNotifications: true,
      taskNotifications: true,
      marketingEmails: false,
      profileVisibility: 'public'
    }
  });

  // Mock user data (replace with API call)
  const mockUserData = {
    displayName: user?.displayName || 'Alex Johnson',
    email: user?.email || 'alex.johnson@university.edu',
    college: 'University of Technology',
    course: 'Computer Science',
    year: '3rd Year',
    bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Love helping fellow students with programming challenges.',
    location: 'Bangalore, India',
    phone: '+91 98765 43210',
    joinedAt: '2023-09-15',
    karma: 850,
    trustLevel: 'Expert',
    skills: [
      { name: 'React', level: 'Advanced', verified: true },
      { name: 'Node.js', level: 'Advanced', verified: true },
      { name: 'Python', level: 'Intermediate', verified: false },
      { name: 'AWS', level: 'Beginner', verified: false },
      { name: 'MongoDB', level: 'Intermediate', verified: true }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      portfolio: 'https://alexjohnson.dev',
      instagram: ''
    },
    achievements: [
      { title: 'Top Contributor', description: 'Helped 50+ students', icon: Award, color: 'gold' },
      { title: 'Quick Responder', description: 'Average response time < 10 min', icon: Clock, color: 'blue' },
      { title: 'Skill Master', description: '5 verified skills', icon: Target, color: 'purple' },
      { title: 'Trusted Helper', description: '95% success rate', icon: Shield, color: 'green' }
    ],
    stats: {
      helpedStudents: 127,
      successRate: 95,
      totalEarnings: 45000,
      avgRating: 4.8,
      completedTasks: 89,
      responseTime: '8 min'
    }
  };

  useEffect(() => {
    if (user || mockUserData) {
      const userData = user || mockUserData;
      setFormData({
        displayName: userData.displayName || '',
        email: userData.email || '',
        college: userData.college || '',
        course: userData.course || '',
        year: userData.year || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || '',
        skills: userData.skills || [],
        socialLinks: userData.socialLinks || {
          linkedin: '',
          github: '',
          portfolio: '',
          instagram: ''
        },
        preferences: userData.preferences || {
          emailNotifications: true,
          taskNotifications: true,
          marketingEmails: false,
          profileVisibility: 'public'
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      if (updateUser) {
        updateUser(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { 
          name: newSkill.trim(), 
          level: 'Beginner', 
          verified: false 
        }]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const getSkillColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700',
      'Expert': 'bg-gold-100 text-gold-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'skills', name: 'Skills', icon: Target },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'activity', name: 'Activity', icon: TrendingUp }
  ];

  if (!user && !mockUserData) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const userData = user || mockUserData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your profile information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              <Avatar 
                src={userData.avatarUrl} 
                alt={userData.displayName}
                size="xl"
                className="w-24 h-24"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white dark:bg-black border-2 border-white dark:border-gray-700 shadow-md rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="mt-3 text-center md:text-left">
              <Badge 
                variant={userData.trustLevel === 'Expert' ? 'default' : 'secondary'}
                className="text-xs"
              >
                <Shield className="w-3 h-3 mr-1" />
                {userData.trustLevel}
              </Badge>
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    disabled
                  />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="College"
                  />
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Course"
                  />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.displayName}</h2>
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{userData.course} at {userData.college}</span>
                  </div>
                  {userData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(userData.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {userData.bio && (
                  <p className="text-gray-700">{userData.bio}</p>
                )}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:w-64">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Karma</p>
                  <p className="text-xl font-bold text-blue-600">{userData.karma}</p>
                </div>
                <Star className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success</p>
                  <p className="text-xl font-bold text-green-600">{userData.stats?.successRate}%</p>
                </div>
                <Target className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{userData.stats?.helpedStudents}</p>
                  <p className="text-sm text-gray-600">Students Helped</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{userData.stats?.avgRating}</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{userData.stats?.responseTime}</p>
                  <p className="text-sm text-gray-600">Response Time</p>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              {isEditing ? (
                <div className="space-y-3">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <input
                      key={platform}
                      type="url"
                      name={`socialLinks.${platform}`}
                      value={url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(userData.socialLinks || {}).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    )
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Helped with React debugging</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Completed Python assignment help</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Received 5-star rating</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={getSkillColor(skill.level)}>
                    {skill.level}
                  </Badge>
                  {skill.verified && (
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.achievements?.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${achievement.color}-100`}>
                    <Icon className={`w-6 h-6 text-${achievement.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'activity' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h3>
          <div className="space-y-6">
            {/* Activity timeline items */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Received 5-star rating</h4>
                <p className="text-gray-600 text-sm">From Sarah M. for JavaScript debugging help</p>
                <p className="text-gray-500 text-xs">2 hours ago</p>
              </div>
            </div>
            {/* More activity items... */}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
