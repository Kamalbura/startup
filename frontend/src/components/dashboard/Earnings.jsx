import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, Download, 
  BarChart3, Target, Clock, Award, Eye,
  Filter, RefreshCw, ArrowUp, ArrowDown
} from 'lucide-react';

/**
 * Enhanced Earnings Component
 * Comprehensive earnings dashboard with charts and analytics
 */
const Earnings = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced earnings data
  const earningsData = {
    overview: {
      today: 3500,
      thisWeek: 18500,
      thisMonth: 52000,
      total: 145000,
      pending: 12000,
      growth: 32.5
    },
    trends: {
      monthly: [
        { month: 'Jan', amount: 28000, projects: 8, growth: 15 },
        { month: 'Feb', amount: 35000, projects: 12, growth: 25 },
        { month: 'Mar', amount: 42000, projects: 15, growth: 20 },
        { month: 'Apr', amount: 52000, projects: 18, growth: 24 },
        { month: 'May', amount: 48000, projects: 16, growth: -8 },
        { month: 'Jun', amount: 58000, projects: 20, growth: 21 }
      ]
    },
    skills: [
      { skill: 'React Development', earnings: 45000, projects: 15, rate: 3000, trend: 15 },
      { skill: 'UI/UX Design', earnings: 32000, projects: 12, rate: 2667, trend: 8 },
      { skill: 'Python Scripts', earnings: 28000, projects: 10, rate: 2800, trend: 12 },
      { skill: 'Mobile Apps', earnings: 25000, projects: 7, rate: 3571, trend: 18 },
      { skill: 'Data Analysis', earnings: 15000, projects: 3, rate: 5000, trend: 25 }
    ],
    transactions: [
      { id: 1, client: 'TechCorp', project: 'E-commerce Dashboard', amount: 25000, date: '2024-06-15', status: 'completed' },
      { id: 2, client: 'StartupXYZ', project: 'Mobile App UI', amount: 18000, date: '2024-06-10', status: 'completed' },
      { id: 3, client: 'InnovateCorp', project: 'Data Analysis', amount: 15000, date: '2024-06-05', status: 'pending' },
      { id: 4, client: 'DesignStudio', project: 'Logo Design', amount: 8000, date: '2024-05-28', status: 'completed' },
      { id: 5, client: 'WebAgency', project: 'Landing Page', amount: 12000, date: '2024-05-22', status: 'completed' }
    ]
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-105">
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
      {trend !== undefined && (
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings Trend</h3>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1"
          >
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{earningsData.overview.growth}%
          </div>
        </div>
      </div>
      
      <div className="h-64 flex items-end space-x-4">
        {earningsData.trends.monthly.map((item, index) => {
          const maxAmount = Math.max(...earningsData.trends.monthly.map(d => d.amount));
          const height = (item.amount / maxAmount) * 100;
          
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-lg relative overflow-hidden">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg transition-all duration-1000 ease-out hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%`, minHeight: '8px' }}
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-900">₹{(item.amount / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">{item.month}</p>
                <p className="text-xs text-gray-400">{item.projects} projects</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const SkillEarnings = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings by Skill</h3>
      <div className="space-y-4">
        {earningsData.skills.map((skill, index) => {
          const maxEarnings = Math.max(...earningsData.skills.map(s => s.earnings));
          const percentage = (skill.earnings / maxEarnings) * 100;
          
          return (
            <div key={skill.skill} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{skill.skill}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">₹{skill.rate.toLocaleString()}/project avg</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      skill.trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {skill.trend > 0 ? '+' : ''}{skill.trend}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">₹{skill.earnings.toLocaleString()}</span>
                  <p className="text-sm text-gray-500">{skill.projects} projects</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TransactionHistory = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {earningsData.transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium">
                {transaction.client[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.project}</p>
                <p className="text-sm text-gray-500">{transaction.client} • {transaction.date}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                transaction.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PendingPayments = () => (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 text-orange-500 mr-2" />
            Pending Payments
          </h4>
          <p className="text-sm text-gray-600">Expected within 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">₹{earningsData.overview.pending.toLocaleString()}</p>
          <p className="text-sm text-orange-500">3 payments pending</p>
        </div>
      </div>
      
      <div className="w-full bg-orange-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full w-3/4 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your income and financial performance</p>
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
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today"
          value={`₹${earningsData.overview.today.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          trend={15}
        />
        <StatCard
          title="This Week"
          value={`₹${earningsData.overview.thisWeek.toLocaleString()}`}
          icon={Calendar}
          color="bg-blue-500"
          trend={25}
        />
        <StatCard
          title="This Month"
          value={`₹${earningsData.overview.thisMonth.toLocaleString()}`}
          icon={BarChart3}
          color="bg-purple-500"
          trend={earningsData.overview.growth}
        />
        <StatCard
          title="Total Earned"
          value={`₹${(earningsData.overview.total / 1000).toFixed(0)}k`}
          subtitle="All time"
          icon={Award}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart />
        <SkillEarnings />
      </div>

      {/* Pending Payments */}
      <PendingPayments />

      {/* Transaction History */}
      <TransactionHistory />

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <Target className="w-6 h-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Performing Skill</h4>
            <p className="text-sm text-gray-600">Data Analysis has the highest rate per project at ₹5,000</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Growth Opportunity</h4>
            <p className="text-sm text-gray-600">Mobile Apps showing 18% growth - consider focusing more on this skill</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Earnings Goal</h4>
            <p className="text-sm text-gray-600">On track to reach ₹60k this month with current growth rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
