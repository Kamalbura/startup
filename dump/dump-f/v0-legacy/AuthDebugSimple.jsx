// Simple Auth Debug Component
// Purpose: Debug Firebase Auth Context step by step

import React, { useState, useEffect } from 'react';

const AuthDebugSimple = () => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const addStep = (step) => {
    setSteps(prev => [...prev, step]);
    setCurrentStep(prev => prev + 1);
  };

  useEffect(() => {
    const testFirebaseAuth = async () => {
      try {
        addStep('1. Starting Firebase Auth Debug...');
        
        // Test Firebase config import
        addStep('2. Testing Firebase config import...');
        const firebaseConfig = await import('../config/firebase');
        addStep('3. ✅ Firebase config imported successfully');
        
        // Test Firebase Auth service import
        addStep('4. Testing Firebase Auth service import...');
        const firebaseAuthService = await import('../services/firebaseAuth');
        addStep('5. ✅ Firebase Auth service imported successfully');
        
        // Test Firebase Auth Context import
        addStep('6. Testing Firebase Auth Context import...');
        const FirebaseAuthContext = await import('../context/FirebaseAuthContext');
        addStep('7. ✅ Firebase Auth Context imported successfully');
        
        // Check if Firebase is initialized
        addStep('8. Testing Firebase initialization...');
        if (firebaseConfig.auth) {
          addStep('9. ✅ Firebase Auth is initialized');
        } else {
          addStep('9. ❌ Firebase Auth is not initialized');
        }
        
        addStep('10. ✅ All Firebase components loaded successfully!');
        
      } catch (error) {
        addStep(`❌ Error: ${error.message}`);
        console.error('Firebase Auth Debug Error:', error);
      }
    };

    testFirebaseAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🔥 Firebase Auth Debug</h1>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                step.includes('✅') 
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : step.includes('❌')
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : 'bg-blue-50 border-blue-400 text-blue-800'
              }`}
            >
              <div className="font-mono text-sm">{step}</div>
            </div>
          ))}
        </div>
        
        {steps.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Progress:</strong> {currentStep} steps completed
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Status:</strong> {steps[steps.length - 1]?.includes('❌') ? 'Error detected' : 'Running...'}
            </p>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugSimple;
