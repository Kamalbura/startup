// Simple test to verify React, CSS, and basic setup works
import React from 'react';

function SimpleTest() {
  console.log('🧪 SimpleTest component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">🚀 SkillLance</h1>
        <p className="text-gray-600 mb-6">Frontend is working correctly!</p>
        <div className="space-y-2 text-sm text-left">
          <div>✅ React rendering</div>
          <div>✅ Tailwind CSS working</div>
          <div>✅ Vite dev server</div>
          <div>✅ Basic imports</div>
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default SimpleTest;
