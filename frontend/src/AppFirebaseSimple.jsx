// Minimal AppFirebase for debugging
// Purpose: Test if the issue is with Firebase Auth Context or component imports

import React from 'react';

function AppFirebaseSimple() {
  console.log('🧪 AppFirebaseSimple rendering...');
  
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">🚀 SkillLance</h1>
        <p className="text-blue-700">AppFirebase Simple Test - Working!</p>
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <p className="text-sm text-gray-600">
            If you see this, React and basic imports are working.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppFirebaseSimple;
