import React from 'react';

export default function CSSTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CSS Test</h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled properly with colors, gradients, and rounded corners, 
          then Tailwind CSS is working correctly!
        </p>
        <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Test Button
        </button>
      </div>
    </div>
  );
}
