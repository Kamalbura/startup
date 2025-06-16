import React from 'react'
import { User, Star, Award } from 'lucide-react'

const WelcomeBox = ({ user, profile, onCompleteProfile }) => {
  const firstName = profile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student'
  const profileCompleteness = calculateProfileCompleteness(profile, user)
  
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-blue-100 mb-4">
            Ready to earn with your skills?
          </p>
          
          {/* Profile Completeness Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">Profile Completeness</span>
              <span className="text-sm font-semibold">{profileCompleteness}%</span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={onCompleteProfile}
            className="bg-white text-blue-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Complete Profile
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="ml-6">
          <div className="relative">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            {profileCompleteness >= 80 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-yellow-800" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const calculateProfileCompleteness = (profile, user) => {
  let score = 0
  const fields = [
    profile?.displayName || user?.displayName,
    profile?.college,
    profile?.skills?.length > 0,
    profile?.bio,
    profile?.avatar || user?.photoURL,
    user?.emailVerified
  ]
  
  fields.forEach(field => {
    if (field) score += 16.67 // 100/6 fields
  })
  
  return Math.round(score)
}

export default WelcomeBox
