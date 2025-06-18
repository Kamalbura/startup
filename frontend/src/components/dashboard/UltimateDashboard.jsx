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

// Import ALL dashboard components
import WelcomeBox from './WelcomeBox'
import StatsPanel from './StatsPanel'
import ProjectFeed from './ProjectFeed'
import ProjectCard from './ProjectCard'

// Import ALL UI components
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import Modal from '../ui/Modal'
import LoadingSpinner from '../ui/LoadingSpinner'
import Skeleton from '../ui/Skeleton'

// 🚀 ULTIMATE LIVE ACTIVITY FEED
const UltimateLiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, type: 'project', user: 'Sarah Chen', action: 'completed', target: 'Web Design Project', time: '2 min ago', avatar: '🎨', amount: 15000 },
    { id: 2, type: 'earning', user: 'You', action: 'earned ₹25,000 from', target: 'Mobile App UI', time: '5 min ago', avatar: '💰', amount: 25000 },
    { id: 3, type: 'review', user: 'TechCorp', action: 'left 5-star review for', target: 'React Development', time: '12 min ago', avatar: '⭐', amount: 0 },
    { id: 4, type: 'project', user: 'Alex Kumar', action: 'started', target: 'Logo Design', time: '18 min ago', avatar: '🚀', amount: 8000 },
    { id: 5, type: 'skill', user: 'Maya Patel', action: 'unlocked', target: 'Python Expert Badge', time: '25 min ago', avatar: '🏆', amount: 0 },
    { id: 6, type: 'milestone', user: 'You', action: 'reached', target: '₹1L Total Earnings', time: '1 hour ago', avatar: '🎯', amount: 100000 },
  ]);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center">
          <Activity className="w-8 h-8 mr-4 text-green-500 animate-pulse" />
          Live Activity
        </h3>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800 animate-pulse px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></div>
            LIVE
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            6 Updates
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-4 p-5 rounded-3xl hover:bg-blue-50/50 transition-all duration-300 transform hover:scale-105 animate-fadeInUp border border-white/30 bg-white/50 backdrop-blur-sm shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-3xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
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
            <div className={`w-4 h-4 rounded-full ${
              activity.type === 'earning' ? 'bg-green-400 shadow-green-400/50' :
              activity.type === 'project' ? 'bg-blue-400 shadow-blue-400/50' :
              activity.type === 'review' ? 'bg-yellow-400 shadow-yellow-400/50' :
              activity.type === 'skill' ? 'bg-purple-400 shadow-purple-400/50' :
              activity.type === 'milestone' ? 'bg-pink-400 shadow-pink-400/50' :
              'bg-gray-400 shadow-gray-400/50'
            } animate-pulse shadow-lg`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎯 ULTIMATE SKILL RADAR CHART
const UltimateSkillRadarChart = () => {
  const skills = [
    { name: 'React', level: 95, color: '#3B82F6', projects: 24 },
    { name: 'Node.js', level: 88, color: '#10B981', projects: 18 },
    { name: 'Python', level: 92, color: '#F59E0B', projects: 21 },
    { name: 'Design', level: 85, color: '#8B5CF6', projects: 15 },
    { name: 'Marketing', level: 78, color: '#EC4899', projects: 12 },
    { name: 'DevOps', level: 82, color: '#EF4444', projects: 9 },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center">
          <Target className="w-8 h-8 mr-4 text-purple-500" />
          Skill Mastery
        </h3>
        <Button className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
          <Award className="w-4 h-4 mr-2" />
          View All Skills
        </Button>
      </div>
      
      <div className="relative h-80 w-80 mx-auto mb-8">
        <svg viewBox="0 0 320 320" className="w-full h-full">
          {/* Enhanced radar grid */}
          {[1, 2, 3, 4, 5].map((ring) => (
            <circle
              key={ring}
              cx="160"
              cy="160"
              r={ring * 30}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
              className="opacity-30"
            />
          ))}
          
          {/* Grid lines */}
          {skills.map((_, index) => {
            const angle = (index * 60) - 90; // 360/6 = 60 degrees apart
            const radian = (angle * Math.PI) / 180;
            const x2 = 160 + Math.cos(radian) * 150;
            const y2 = 160 + Math.sin(radian) * 150;
            
            return (
              <line
                key={index}
                x1="160"
                y1="160"
                x2={x2}
                y2={y2}
                stroke="#e5e7eb"
                strokeWidth="1"
                className="opacity-30"
              />
            );
          })}
          
          {/* Skill data polygon */}
          <polygon
            points={skills.map((skill, index) => {
              const angle = (index * 60) - 90;
              const radian = (angle * Math.PI) / 180;
              const radius = (skill.level / 100) * 120;
              const x = 160 + Math.cos(radian) * radius;
              const y = 160 + Math.sin(radian) * radius;
              return `${x},${y}`;
            }).join(' ')}
            fill="url(#skillGradient)"
            stroke="#8B5CF6"
            strokeWidth="3"
            className="opacity-70"
          />
          
          {/* Skill points */}
          {skills.map((skill, index) => {
            const angle = (index * 60) - 90;
            const radian = (angle * Math.PI) / 180;
            const radius = (skill.level / 100) * 120;
            const x = 160 + Math.cos(radian) * radius;
            const y = 160 + Math.sin(radian) * radius;
            
            return (
              <g key={skill.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={skill.color}
                  className="animate-pulse cursor-pointer hover:r-10 transition-all duration-300 shadow-lg"
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                />
                <text
                  x={160 + Math.cos(radian) * 170}
                  y={160 + Math.sin(radian) * 170}
                  textAnchor="middle"
                  className="text-sm font-bold fill-gray-700"
                >
                  {skill.name}
                </text>
                <text
                  x={160 + Math.cos(radian) * 170}
                  y={160 + Math.sin(radian) * 170 + 14}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  Level {skill.level}
                </text>
              </g>
            );
          })}
          
          {/* Gradient definition */}
          <defs>
            <radialGradient id="skillGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {/* Skill breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div 
            key={skill.name} 
            className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-300 transform hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3 shadow-lg" 
                style={{ backgroundColor: skill.color }}
              ></div>
              <span className="font-semibold text-gray-800">{skill.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{skill.level}%</div>
              <div className="text-xs text-gray-500">{skill.projects} projects</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🏆 ULTIMATE ACHIEVEMENT SHOWCASE
const UltimateAchievementShowcase = () => {
  const achievements = [
    { 
      id: 1, 
      title: 'First Project', 
      icon: '🚀', 
      unlocked: true, 
      description: 'Complete your first project',
      reward: '500 XP',
      date: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Speed Demon', 
      icon: '⚡', 
      unlocked: true, 
      description: 'Deliver 5 projects ahead of schedule',
      reward: '1000 XP',
      date: '2024-01-28'
    },
    { 
      id: 3, 
      title: 'Client Favorite', 
      icon: '❤️', 
      unlocked: true, 
      description: 'Receive 10 five-star reviews',
      reward: 'Pro Badge',
      date: '2024-02-10'
    },
    { 
      id: 4, 
      title: 'Skill Master', 
      icon: '🎯', 
      unlocked: false, 
      description: 'Master 5 different skills',
      reward: 'Expert Status',
      progress: 3,
      total: 5
    },
    { 
      id: 5, 
      title: 'Milestone Earner', 
      icon: '💎', 
      unlocked: true, 
      description: 'Earn ₹1,00,000 total',
      reward: 'Premium Features',
      date: '2024-02-18'
    },
    { 
      id: 6, 
      title: 'Community Hero', 
      icon: '🏆', 
      unlocked: false, 
      description: 'Help 100 fellow students',
      reward: 'Hall of Fame',
      progress: 27,
      total: 100
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-yellow-200/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-gray-800 flex items-center">
          <Trophy className="w-8 h-8 mr-4 text-yellow-500 animate-bounce" />
          Achievements
        </h3>
        <div className="flex items-center space-x-3">
          <Badge className="bg-yellow-100 text-yellow-800 px-3 py-2 text-sm font-semibold">
            {unlockedCount}/{achievements.length} Unlocked
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">{unlockedCount * 750} XP</div>
            <div className="text-xs text-gray-500">Total Experience</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <div 
            key={achievement.id}
            className={`
              relative p-6 rounded-3xl border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer group
              ${achievement.unlocked 
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl hover:shadow-2xl' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 opacity-70 hover:opacity-90'
              }
            `}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {achievement.unlocked && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div className="text-center">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300" 
                   style={{ 
                     animationDelay: `${index * 200}ms`,
                     filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                   }}>
                {achievement.icon}
              </div>
              
              <h4 className="font-bold text-gray-800 mb-2 text-lg">{achievement.title}</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{achievement.description}</p>
              
              {achievement.unlocked ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Trophy className="w-3 h-3 mr-1" />
                    {achievement.reward}
                  </div>
                  <div className="text-xs text-gray-500">
                    Unlocked on {achievement.date}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 font-medium">
                    Reward: {achievement.reward}
                  </div>
                  {achievement.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 💰 ULTIMATE EARNINGS DASHBOARD
const UltimateEarningsDashboard = () => {
  const earningsData = {
    today: 3500,
    thisWeek: 18500,
    thisMonth: 52000,
    total: 145000,
    pending: 12000,
    growth: 32.5,
    topSkill: 'React Development',
    avgPerProject: 8500,
    completionRate: 96
  };

  const monthlyData = [
    { month: 'Jan', amount: 28000, projects: 8 },
    { month: 'Feb', amount: 35000, projects: 12 },
    { month: 'Mar', amount: 42000, projects: 15 },
    { month: 'Apr', amount: 52000, projects: 18 },
  ];

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
      
      {/* Main earnings grid */}
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
      
      {/* Detailed insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/80 rounded-3xl p-6 border border-white/40">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
            Monthly Trends
          </h4>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold mr-4">
                    {data.month}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">₹{data.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{data.projects} projects</div>
                  </div>
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(data.amount / 60000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/80 rounded-3xl p-6 border border-white/40">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-500" />
            Performance Metrics
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-green-50/50">
              <div>
                <div className="font-semibold text-gray-800">Top Earning Skill</div>
                <div className="text-sm text-gray-600">{earningsData.topSkill}</div>
              </div>
              <div className="text-2xl font-bold text-green-600">₹25K</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50">
              <div>
                <div className="font-semibold text-gray-800">Avg Per Project</div>
                <div className="text-sm text-gray-600">Based on last 20 projects</div>
              </div>
              <div className="text-2xl font-bold text-purple-600">₹{earningsData.avgPerProject.toLocaleString()}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50">
              <div>
                <div className="font-semibold text-gray-800">Success Rate</div>
                <div className="text-sm text-gray-600">Project completion</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{earningsData.completionRate}%</div>
            </div>
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

// 🚀 ULTIMATE DASHBOARD COMPONENT
const UltimateDashboard = () => {
  const { user, profile } = useAuth();
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* 🌟 ULTIMATE HERO SECTION */}
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
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Pro Member
              </Badge>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Settings className="w-5 h-5" />
              </Button>
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

      {/* 🎯 ULTIMATE MAIN CONTENT */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-8 space-y-8">
            {/* Earnings Dashboard */}
            <UltimateEarningsDashboard />
            
            {/* Live Activity Feed */}
            <UltimateLiveActivityFeed />
          </div>

          {/* Right Column - Skills & Achievements */}
          <div className="lg:col-span-4 space-y-8">
            {/* Skill Radar Chart */}
            <UltimateSkillRadarChart />
            
            {/* Achievement Showcase */}
            <UltimateAchievementShowcase />
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
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                <Search className="w-5 h-5 mr-2" />
                Browse All Projects
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <ProjectFeed 
              limit={6}
              onSaveProject={handleSaveProject}
              onSendProposal={handleSendProposal}
              onViewProject={handleViewProject}
            />
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563EB, #7C3AED);
        }
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
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UltimateDashboard;
