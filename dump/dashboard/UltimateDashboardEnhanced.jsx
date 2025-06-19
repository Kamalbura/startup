import React, { useState, useEffect } from 'react'
import { useAuth, useAuthActions } from '../../context/FirebaseAuthContext'
import { 
  Home, User, Award, Briefcase, Calendar, MessageSquare, 
  LogOut, Bell, Search, Plus, Settings, Moon, Sun, Filter,
  Zap, Star, TrendingUp, Target, Rocket, Code, Users, Trophy,
  Activity, BarChart3, PieChart, LineChart, DollarSign, Clock,
  CheckCircle, AlertCircle, Heart, Bookmark, Share2, Eye,
  Download, Upload, PlayCircle, Pause, MoreHorizontal,
  ChevronRight, ExternalLink, Sparkles, Layers, Globe
} from 'lucide-react'

// Import WORKING dashboard components
import ProjectFeed from './ProjectFeed'

// WORKING Ultimate Dashboard - Enhanced Step by Step
const UltimateDashboardEnhanced = () => {
  const { user, profile } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'project', message: 'New project matching your skills', time: '2 min ago', unread: true },
    { id: 2, type: 'message', message: 'Message from TechStart Inc.', time: '1 hour ago', unread: true },
    { id: 3, type: 'proposal', message: 'Your proposal was accepted!', time: '3 hours ago', unread: false },
    { id: 4, type: 'payment', message: 'Payment received: ₹15,000', time: '1 day ago', unread: false },
  ]);

  const handleCompleteProfile = () => {
    setActiveTab('profile');
  };

  const handleSaveProject = (projectId, saved) => {
    console.log(`Project ${projectId} ${saved ? 'saved' : 'unsaved'}`);
  };

  const handleSendProposal = (project) => {
    console.log('Send proposal for:', project.title);
  };

  const handleViewProject = (project) => {
    console.log('View project:', project.title);
  };

  // Enhanced Live Activity Feed
  const LiveActivityFeed = () => {
    const [activities, setActivities] = useState([
      { id: 1, type: 'project', user: 'Sarah Chen', action: 'completed', target: 'Web Design Project', time: '2 min ago', avatar: '🎨', amount: 15000 },
      { id: 2, type: 'earning', user: 'You', action: 'earned ₹25,000 from', target: 'Mobile App UI', time: '5 min ago', avatar: '💰', amount: 25000 },
      { id: 3, type: 'review', user: 'TechCorp', action: 'left 5-star review for', target: 'React Development', time: '12 min ago', avatar: '⭐', amount: 0 },
      { id: 4, type: 'project', user: 'Alex Kumar', action: 'started', target: 'Logo Design', time: '18 min ago', avatar: '🚀', amount: 8000 },
      { id: 5, type: 'skill', user: 'Maya Patel', action: 'unlocked', target: 'Python Expert Badge', time: '25 min ago', avatar: '🏆', amount: 0 },
    ]);

    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center">
            <Activity className="w-8 h-8 mr-4 text-green-500 animate-pulse" />
            Live Activity
          </h3>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 text-green-800 animate-pulse px-3 py-1 rounded-full text-sm font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping inline-block"></div>
              LIVE
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {activities.length} Updates
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 p-5 rounded-3xl hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-105 border border-white/30 bg-white/50 backdrop-blur-sm shadow-lg"
              style={{ 
                animation: `fadeInUp 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms` 
              }}
            >
              <div className="text-3xl" style={{ 
                animation: `bounce 2s infinite`,
                animationDelay: `${index * 200}ms` 
              }}>
                {activity.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                  <span className="font-bold text-blue-600">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-semibold text-gray-800">{activity.target}</span>
                  {activity.amount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ₹{activity.amount.toLocaleString()}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </p>
              </div>
              <div className={`w-4 h-4 rounded-full animate-pulse shadow-lg ${
                activity.type === 'earning' ? 'bg-green-400' :
                activity.type === 'project' ? 'bg-blue-400' :
                activity.type === 'review' ? 'bg-yellow-400' :
                activity.type === 'skill' ? 'bg-purple-400' : 'bg-gray-400'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Enhanced Earnings Dashboard
  const EarningsDashboard = () => {
    const earningsData = {
      today: 3500,
      thisWeek: 18500,
      thisMonth: 52000,
      total: 145000,
      pending: 12000,
      growth: 32.5
    };

    return (
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-200/50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center">
            <DollarSign className="w-8 h-8 mr-4 text-green-500 animate-pulse" />
            Earnings Dashboard
          </h3>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-green-600">+{earningsData.growth}%</span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-2">₹{earningsData.today.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">Today</div>
            <div className="mt-2 flex items-center justify-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15%
            </div>
          </div>
          
          <div className="bg-white/80 rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">₹{earningsData.thisWeek.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">This Week</div>
            <div className="mt-2 flex items-center justify-center text-xs text-blue-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +25%
            </div>
          </div>
          
          <div className="bg-white/80 rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">₹{earningsData.thisMonth.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">This Month</div>
            <div className="mt-2 flex items-center justify-center text-xs text-purple-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{earningsData.growth}%
            </div>
          </div>
          
          <div className="bg-white/80 rounded-3xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-lg border border-indigo-100">
            <div className="text-3xl font-bold text-indigo-600 mb-2">₹{earningsData.total.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">Total Earned</div>
            <div className="mt-2 flex items-center justify-center text-xs text-indigo-600">
              <Trophy className="w-3 h-3 mr-1" />
              Milestone!
            </div>
          </div>
        </div>
        
        {/* Pending payments */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-6 border border-orange-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-800 flex items-center mb-2">
                <Clock className="w-6 h-6 mr-3 text-orange-500" />
                Pending Payments
              </h4>
              <span className="text-gray-600">Expected within 7 days</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">₹{earningsData.pending.toLocaleString()}</div>
              <div className="text-sm text-orange-500">3 payments pending</div>
            </div>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-3 mt-4">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full w-4/5 animate-pulse shadow-lg"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-b-[3rem] shadow-2xl mb-8">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Welcome back, {user?.displayName || 'Student'}! 🚀</h1>
                <p className="text-indigo-100 text-xl">Ready to turn your skills into success?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 text-white border-white/30 px-4 py-2 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 mr-2 inline" />
                Pro Member
              </div>
              <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-105">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">₹1.45L</div>
              <div className="text-indigo-200 text-sm">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">96%</div>
              <div className="text-indigo-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">47</div>
              <div className="text-indigo-200 text-sm">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">4.9★</div>
              <div className="text-indigo-200 text-sm">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-8 space-y-8">
            {/* Earnings Dashboard */}
            <EarningsDashboard />
            
            {/* Live Activity Feed */}
            <LiveActivityFeed />
          </div>

          {/* Right Column - Reputation & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Reputation Card */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8 text-yellow-300 animate-pulse" />
                <div className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-full text-sm font-semibold">
                  Pro Member
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Reputation Score</h3>
              <div className="text-4xl font-bold mb-2">4.9/5.0</div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                ))}
              </div>
              <p className="text-purple-100 text-sm">Based on 127 reviews</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Rocket className="w-7 h-7 mr-3 text-blue-500 animate-bounce" />
                Quick Actions
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Search className="w-6 h-6 mr-3" />
                      <span className="font-semibold">Find Projects</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('skills')}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-6 h-6 mr-3" />
                      <span className="font-semibold">Upgrade Skills</span>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('messages')}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="w-6 h-6 mr-3" />
                      <span className="font-semibold">Messages</span>
                    </div>
                    <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">3</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Project Feed */}
        <div className="mt-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-800 flex items-center">
                <Sparkles className="w-8 h-8 mr-4 text-yellow-500 animate-pulse" />
                Featured Opportunities
              </h3>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                <Search className="w-5 h-5 mr-2 inline" />
                Browse All Projects
                <ExternalLink className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
            <ProjectFeed 
              limit={6}
              onSaveProject={handleSaveProject}
              onSendProposal={handleSendProposal}
              onViewProject={handleViewProject}
            />
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {!profile?.isProfileComplete && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">🎉 Welcome to SkillLance!</h3>
                <p className="text-purple-100 mb-4 text-lg">
                  Complete your profile to unlock premium features and get matched with high-paying projects.
                </p>
                <button 
                  onClick={handleCompleteProfile}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-6 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Complete Profile <ChevronRight className="w-5 h-5 ml-2 inline" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-10px);
          }
          70% {
            transform: translateY(-5px);
          }
          90% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};

export default UltimateDashboardEnhanced;
