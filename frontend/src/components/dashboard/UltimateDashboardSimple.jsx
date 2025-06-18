import React from 'react'
import { useAuth } from '../../context/FirebaseAuthContext'
import { User, Star, Trophy, DollarSign } from 'lucide-react'

// Simple fallback dashboard for debugging
const UltimateDashboardSimple = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8 p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">🚀 Ultimate Dashboard</h1>
            <p className="text-indigo-100 text-xl">Welcome, {user?.displayName || 'Student'}!</p>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Earnings Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="w-8 h-8 mr-4 text-green-500" />
              Earnings Dashboard
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">₹3,500</div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">₹18,500</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">₹52,000</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">₹145,000</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🔥 Live Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-green-50">
                <div className="text-2xl">💰</div>
                <div>
                  <p className="font-semibold">You earned ₹25,000 from Mobile App UI</p>
                  <p className="text-sm text-gray-500">5 min ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-blue-50">
                <div className="text-2xl">🎨</div>
                <div>
                  <p className="font-semibold">Sarah Chen completed Web Design Project</p>
                  <p className="text-sm text-gray-500">12 min ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-yellow-50">
                <div className="text-2xl">⭐</div>
                <div>
                  <p className="font-semibold">TechCorp left 5-star review for React Development</p>
                  <p className="text-sm text-gray-500">25 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Reputation Card */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-yellow-300" />
              <div className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-full text-sm">
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

          {/* Achievements */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Trophy className="w-7 h-7 mr-3 text-yellow-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-300 text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-bold text-sm">First Project</h4>
                <p className="text-xs text-gray-600">Completed!</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-300 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold text-sm">Speed Demon</h4>
                <p className="text-xs text-gray-600">Unlocked!</p>
              </div>
              <div className="p-4 rounded-2xl bg-pink-50 border-2 border-pink-300 text-center">
                <div className="text-3xl mb-2">❤️</div>
                <h4 className="font-bold text-sm">Client Favorite</h4>
                <p className="text-xs text-gray-600">Achieved!</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 text-center opacity-60">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-bold text-sm">Skill Master</h4>
                <p className="text-xs text-gray-600">3/5 Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Projects Section */}
      <div className="mt-8">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            ✨ Featured Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-bold text-gray-800 mb-2">React.js Web App Development</h4>
              <p className="text-gray-600 text-sm mb-4">Looking for skilled React developer...</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">₹15,000 - ₹25,000</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="font-bold text-gray-800 mb-2">Logo Design for Startup</h4>
              <p className="text-gray-600 text-sm mb-4">Creative logo design needed...</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">₹5,000 - ₹8,000</span>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h4 className="font-bold text-gray-800 mb-2">Python Data Analysis</h4>
              <p className="text-gray-600 text-sm mb-4">Need data scientist for analysis...</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">₹12,000 - ₹20,000</span>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateDashboardSimple
