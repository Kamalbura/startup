// CSS Test Component - Verify TailwindCSS is working
import React from 'react'

const CSSTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TailwindCSS Test Page
        </h1>
        
        {/* Color Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gradient Backgrounds</h2>
            <div className="space-y-3">
              <div className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <div className="h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"></div>
              <div className="h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-lg"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                Primary Button
              </button>
              <button className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Secondary Button
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Elements</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Test input field" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors"
              />
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
          </div>
        </div>
        
        {/* Icons and Animations */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Animations & Effects</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full animate-bounce flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <div className="w-16 h-16 bg-purple-500 rounded-full animate-spin flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">TailwindCSS is Working! ✅</h3>
          <p className="text-green-700">
            All gradients, animations, and responsive design are functioning correctly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CSSTest
