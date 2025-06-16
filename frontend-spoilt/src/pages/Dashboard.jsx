// SkillLance Dashboard - Simple Working Version
import React, { useState } from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Search, MessageSquare, Bell, User, Settings, LogOut, Plus,
  Briefcase, Star, Clock, Filter, ChevronDown, MapPin, 
  DollarSign, Users, Sparkles
} from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('browse');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Mock project data
  const mockProjects = [
    {
      id: 1,
      title: "React.js Web App Development",
      description: "Looking for a skilled React developer to build a modern web application",
      budget: "₹15,000 - ₹25,000",
      duration: "2-3 weeks",
      skills: ["React.js", "JavaScript", "CSS"],
      client: "TechStart Pvt Ltd",
      location: "Remote",
      postedTime: "2 hours ago",
      proposals: 12,
      rating: 4.8
    },
    {
      id: 2,
      title: "Logo Design for Startup",
      description: "Creative logo design needed for a new fintech startup",
      budget: "₹5,000 - ₹8,000",
      duration: "1 week",
      skills: ["Graphic Design", "Adobe Illustrator"],
      client: "InnovateFin",
      location: "Mumbai",
      postedTime: "4 hours ago",
      proposals: 8,
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">SkillLance</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('browse')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'browse' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Projects
              </button>
              <button 
                onClick={() => setActiveTab('my-projects')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'my-projects' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                My Projects
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'messages' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <span className="hidden md:block font-medium">{getUserDisplayName()}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-1">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
                <p className="text-blue-100 mb-4">Ready to earn with your skills?</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Complete Profile
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Post a Project
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Search className="w-4 h-4 mr-2" />
                    Find Talent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Content Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'browse' ? 'Browse Projects' : 
                   activeTab === 'my-projects' ? 'My Projects' : 'Messages'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'browse' ? 'Discover opportunities that match your skills' : 
                   activeTab === 'my-projects' ? 'Manage your active and completed projects' : 'Stay connected with your clients'}
                </p>
              </div>
              
              {activeTab === 'browse' && (
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              )}
            </div>

            {/* Browse Projects Content */}
            {activeTab === 'browse' && (
              <div className="space-y-6">
                {mockProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{project.rating}</span>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.proposals} proposals</span>
                      </div>
                    </div>

                    {/* Client & Actions */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {project.client.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{project.client}</p>
                          <p className="text-sm text-gray-600">{project.postedTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Save
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Send Proposal
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* My Projects Content */}
            {activeTab === 'my-projects' && (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-6">Start browsing projects and send your first proposal!</p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Projects
                </button>
              </div>
            )}

            {/* Messages Content */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                <p className="text-gray-600 mb-6">Your conversations with clients will appear here.</p>
                <button 
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
