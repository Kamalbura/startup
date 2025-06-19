// Minimal AppFirebase with only AuthProvider
// Purpose: Test if the issue is with Firebase Auth Context

import React from 'react';

function AppFirebaseTest1() {
  console.log('🧪 AppFirebaseTest1 - Testing basic component...');
  
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">🚀 Test 1</h1>
        <p className="text-green-700">Basic component working!</p>
      </div>
    </div>
  );
}

export default AppFirebaseTest1;
