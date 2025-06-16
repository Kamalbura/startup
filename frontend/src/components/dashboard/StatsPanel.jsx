import React from 'react'
import { DollarSign, Briefcase, Activity, Star, TrendingUp } from 'lucide-react'

const StatsPanel = ({ profile, loading = false }) => {
  const stats = [
    {
      label: "Total Earnings",
      value: profile?.totalEarnings ? `₹${profile.totalEarnings.toLocaleString()}` : "₹45,230",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+12% this month"
    },
    {
      label: "Completed",
      value: profile?.completedTasks || "12",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+3 projects"
    },
    {
      label: "Active",
      value: profile?.activeTasks || "3",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "2 pending"
    },
    {
      label: "Rating",
      value: profile?.rating ? `${profile.rating}` : "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "⭐ Excellent"
    }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Stats</h3>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend }) => (
  <div className="group">
    <div className={`${bgColor} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 ${bgColor} rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {trend && (
          <p className="text-xs text-gray-500">{trend}</p>
        )}
      </div>
    </div>
  </div>
)

export default StatsPanel
