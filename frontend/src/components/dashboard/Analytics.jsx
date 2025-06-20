import React, { useState } from 'react';
import { 
  DollarSign, Users, Clock, Target, Award, Activity, 
  Calendar, Download, RefreshCw,
  ArrowUp, ArrowDown, Star, Briefcase
} from 'lucide-react';

/**
 * Analytics Dashboard Component
 * Comprehensive analytics with charts, metrics, and insights
 */
const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Sample analytics data
  const analyticsData = {
    overview: {
      totalEarnings: 145000,
      totalProjects: 47,
      avgRating: 4.9,
      successRate: 96,
      growthRate: 32.5,
      activeClients: 23
    },
    earnings: {
      trend: [
        { period: 'Jan', amount: 28000, projects: 8 },
        { period: 'Feb', amount: 35000, projects: 12 },
        { period: 'Mar', amount: 42000, projects: 15 },
        { period: 'Apr', amount: 52000, projects: 18 },
        { period: 'May', amount: 48000, projects: 16 },
        { period: 'Jun', amount: 58000, projects: 20 }
      ],
      bySkill: [
        { skill: 'React Development', earnings: 45000, projects: 15, avgRate: 3000 },
        { skill: 'UI/UX Design', earnings: 32000, projects: 12, avgRate: 2667 },
        { skill: 'Python Scripts', earnings: 28000, projects: 10, avgRate: 2800 },
        { skill: 'Mobile Apps', earnings: 25000, projects: 7, avgRate: 3571 },
        { skill: 'Data Analysis', earnings: 15000, projects: 3, avgRate: 5000 }
      ]
    },
    performance: {
      projectTypes: [
        { type: 'Web Development', count: 18, percentage: 38 },
        { type: 'Design', count: 12, percentage: 26 },
        { type: 'Mobile Apps', count: 8, percentage: 17 },
        { type: 'Data Science', count: 6, percentage: 13 },
        { type: 'Other', count: 3, percentage: 6 }
      ],
      clientRatings: [
        { rating: 5, count: 32, percentage: 68 },
        { rating: 4, count: 12, percentage: 26 },
        { rating: 3, count: 2, percentage: 4 },
        { rating: 2, count: 1, percentage: 2 },
        { rating: 1, count: 0, percentage: 0 }
      ]
    },
    timeTracking: {
      avgHoursPerProject: 28,
      totalHours: 1316,
      mostProductiveHour: '2 PM - 3 PM',
      mostProductiveDay: 'Wednesday'
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3">
          {trend > 0 ? (
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
  const EarningsChart = () => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings Trend</h3>
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-2">
        {analyticsData.earnings.trend.map((item, index) => {
          const maxAmount = Math.max(...analyticsData.earnings.trend.map(d => d.amount));
          const height = (item.amount / maxAmount) * 100;
          
          return (
            <div key={item.period} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900">₹{(item.amount / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">{item.period}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  const SkillBreakdown = () => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Earnings by Skill</h3>
      <div className="space-y-4">
        {analyticsData.earnings.bySkill.map((skill, index) => {
          const maxEarnings = Math.max(...analyticsData.earnings.bySkill.map(s => s.earnings));
          const percentage = (skill.earnings / maxEarnings) * 100;
          
          return (
            <div key={skill.skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{skill.skill}</span>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">₹{skill.earnings.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-2">({skill.projects} projects)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">Avg ₹{skill.avgRate.toLocaleString()} per project</p>
            </div>
          );
        })}
      </div>
    </div>
  );
  const ProjectTypeChart = () => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Project Types</h3>
      <div className="space-y-3">
        {analyticsData.performance.projectTypes.map((type, index) => (
          <div key={type.type} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-blue-500' :
                index === 1 ? 'bg-purple-500' :
                index === 2 ? 'bg-green-500' :
                index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <span className="font-medium text-gray-900">{type.type}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">{type.count}</span>
              <span className="text-sm text-gray-500 ml-1">({type.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const RatingDistribution = () => (
    <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Client Ratings</h3>
      <div className="space-y-3">
        {analyticsData.performance.clientRatings.reverse().map((rating) => (
          <div key={rating.rating} className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-12 text-right">
              {rating.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your performance and earnings insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₹${(analyticsData.overview.totalEarnings / 1000).toFixed(0)}k`}
          subtitle="All time"
          icon={DollarSign}
          color="bg-green-500"
          trend={32.5}
        />
        <StatCard
          title="Projects Completed"
          value={analyticsData.overview.totalProjects}
          subtitle={`${analyticsData.overview.successRate}% success rate`}
          icon={Briefcase}
          color="bg-blue-500"
          trend={18.2}
        />
        <StatCard
          title="Average Rating"
          value={`${analyticsData.overview.avgRating}★`}
          subtitle="Based on 47 reviews"
          icon={Star}
          color="bg-yellow-500"
          trend={5.1}
        />
        <StatCard
          title="Active Clients"
          value={analyticsData.overview.activeClients}
          subtitle="This month"
          icon={Users}
          color="bg-purple-500"
          trend={12.8}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart />
        <SkillBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTypeChart />
        <RatingDistribution />
      </div>      {/* Time Tracking Insights */}
      <div className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Time Tracking Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analyticsData.timeTracking.totalHours}</p>
            <p className="text-sm text-gray-600">Total Hours</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analyticsData.timeTracking.avgHoursPerProject}</p>
            <p className="text-sm text-gray-600">Avg Hours/Project</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-900">{analyticsData.timeTracking.mostProductiveHour}</p>
            <p className="text-sm text-gray-600">Most Productive Hour</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Calendar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-900">{analyticsData.timeTracking.mostProductiveDay}</p>
            <p className="text-sm text-gray-600">Most Productive Day</p>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <Award className="w-6 h-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Skill</h4>
            <p className="text-sm text-gray-600">React Development generates the highest earnings per project</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Growth Trend</h4>
            <p className="text-sm text-gray-600">Consistent 32% growth over the last 6 months</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Client Satisfaction</h4>
            <p className="text-sm text-gray-600">94% of clients rate your work 4 stars or higher</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
