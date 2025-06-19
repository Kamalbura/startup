// Simple Test Component to debug Firebase Auth
// This will help us identify what's causing the white screen

import React, { useState, useEffect } from 'react';

const AuthTest = () => {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔥 AuthTest component mounted');
    
    // Test Firebase import
    try {
      import('../config/firebase').then((firebase) => {
        console.log('🔥 Firebase config loaded:', firebase);
        setStatus('firebase_loaded');
      }).catch((err) => {
        console.error('🔥 Firebase config error:', err);
        setError('Firebase config failed to load');
        setStatus('error');
      });
    } catch (err) {
      console.error('🔥 Firebase import error:', err);
      setError('Firebase import failed');
      setStatus('error');
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Firebase...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Firebase Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-green-600 mb-4">Firebase Loaded Successfully!</h2>
        <p className="text-gray-700 mb-4">Firebase configuration is working correctly.</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
