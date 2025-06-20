import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Clock, Star } from 'lucide-react'

// Import background images
import backgroundLight from '../assets/background.jpg';
import backgroundDark from '../assets/background2.jpg';

const PostTask = () => {
  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundImage: `url(${backgroundLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark mode background overlay */}
      <div 
        className="hidden dark:block fixed inset-0 transition-opacity duration-200"
        style={{
          backgroundImage: `url(${backgroundDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 bg-white/10 dark:bg-black/20 backdrop-blur-none min-h-screen">
        <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center text-karma-600 hover:text-karma-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Post a <span className="text-karma-600">Task</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help from talented students in your campus community.
          </p>
        </div>

        {/* Coming Soon */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-karma-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-karma-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-lg text-gray-600 mb-8">
              The task posting feature is currently in development. Soon you'll be able to:
            </p>

            <div className="grid gap-4 mb-8">
              <div className="flex items-center justify-center text-gray-700">
                <Clock className="w-5 h-5 text-karma-600 mr-3" />
                Set deadlines and budgets
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <Star className="w-5 h-5 text-karma-600 mr-3" />
                Choose from verified students
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <Plus className="w-5 h-5 text-karma-600 mr-3" />
                Track progress in real-time
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/login-otp" className="btn-karma text-lg px-8 py-3 inline-flex items-center">
                Join CampusKarma
              </Link>
              <p className="text-sm text-gray-500">
                Get notified when this feature launches
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default PostTask
