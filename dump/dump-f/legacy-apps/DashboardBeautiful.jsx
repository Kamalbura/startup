// SkillLance Beautiful Dashboard v1.0.0.0
// Purpose: Stunning, modern dashboard with glassmorphism and premium UX

import React from 'react';
import { useAuth, useAuthActions } from '../context/FirebaseAuthContext';
import { 
  Sparkles, Trophy, Coins, CheckCircle, Mail, 
  MessageCircle, Search, Plus, Target, LogOut,
  Bell, Settings, User, Calendar, TrendingUp,
  Star, Award, Briefcase, Users
} from 'lucide-react';

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num) => {
  if (num === 1) return 'st';
  if (num === 2) return 'nd';
  if (num === 3) return 'rd';
  return 'th';
};

export default function SkillLanceDashboardBeautiful() {
  const { user, profile } = useAuth();
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userName = profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SkillLance
                </h1>
                <p className="text-white/60 text-sm">India's Premier Student Platform</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>

              {/* Settings */}
              <button className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <Settings className="w-5 h-5 text-white" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">
                    {profile?.displayName || user?.displayName || 'Student'}
                  </p>
                  <p className="text-white/60 text-xs">
                    {profile?.college || 'College Student'}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-3 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all text-red-400 hover:text-red-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {userName}! 👋
                </h2>
                <p className="text-white/80 text-lg mb-4">
                  Ready to earn some karma and make magic happen today?
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">{user?.email}</span>
                    {user?.emailVerified ? (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs border border-green-500/30">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                        ⚠ Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Sparkles className="w-16 h-16 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Trust Score */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Trust Score</h3>
            <p className="text-3xl font-bold text-white mb-2">
              {profile?.trustScore || 100}
            </p>
            <p className="text-green-400 text-xs">+12 this week</p>
          </div>

          {/* Karma Points */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-xl border border-purple-400/30">
                <Coins className="w-6 h-6 text-purple-400" />
              </div>
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Karma Points</h3>
            <p className="text-3xl font-bold text-white mb-2">
              {profile?.karmaPoints || 0}
            </p>
            <p className="text-purple-400 text-xs">Excellent level!</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-xl border border-green-400/30">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Total Earned</h3>
            <p className="text-3xl font-bold text-white mb-2">
              ₹{profile?.totalEarnings || 0}
            </p>
            <p className="text-green-400 text-xs">+₹250 this month</p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-xl border border-blue-400/30">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white/80 text-sm font-medium mb-1">Tasks Complete</h3>
            <p className="text-3xl font-bold text-white mb-2">
              {profile?.completedTasks || 0}
            </p>
            <p className="text-blue-400 text-xs">5 active tasks</p>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/60 text-sm font-medium mb-1">College</p>
                <p className="text-white text-lg">{profile.college || 'Not specified'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/60 text-sm font-medium mb-1">Course</p>
                <p className="text-white text-lg">{profile.course || 'Not specified'}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/60 text-sm font-medium mb-1">Year</p>
                <p className="text-white text-lg">
                  {profile.year ? `${profile.year}${getOrdinalSuffix(profile.year)} Year` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <button className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-6 transition-all group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-blue-500/30">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Post a Task</h4>
                <p className="text-white/60 text-sm">Need help with something?</p>
              </div>
            </button>

            <button className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-6 transition-all group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-green-500/30">
                  <Search className="w-6 h-6 text-green-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Find Tasks</h4>
                <p className="text-white/60 text-sm">Browse available gigs</p>
              </div>
            </button>

            <button className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-6 transition-all group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-purple-500/30">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-2">My Skills</h4>
                <p className="text-white/60 text-sm">Manage your abilities</p>
              </div>
            </button>

            <button className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl p-6 transition-all group">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-orange-500/30">
                  <MessageCircle className="w-6 h-6 text-orange-400" />
                </div>
                <h4 className="text-white font-medium mb-2">Messages</h4>
                <p className="text-white/60 text-sm">Chat with students</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Welcome to SkillLance! 🚀</h4>
            <p className="text-white/70 text-lg mb-6 max-w-md mx-auto">
              You're now part of India's most trusted student platform. Start by posting your first task or browse amazing opportunities!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
                Get Started 🎯
              </button>
              <button className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                Explore Tasks 🔍
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
