// Temporary Firebase Auth Debug Component
// Purpose: Test Firebase connection and auth state directly

import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function FirebaseDebug() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔧 FirebaseDebug: Setting up auth listener...');
    console.log('🔧 Firebase auth object:', auth);
    
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('🔧 Auth state changed:', user);
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.error('🔧 Auth state error:', error);
        setError(error.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('🔧 Error setting up auth listener:', error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">🔧 Firebase Debug</h1>
          <p className="text-blue-600">Testing Firebase connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">🔧 Firebase Error</h1>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-800 mb-4">🔧 Firebase Debug</h1>
        <div className="text-left bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Auth Status:</h2>
          <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
          {user && (
            <>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Display Name:</strong> {user.displayName || 'None'}</p>
            </>
          )}
        </div>
        <button 
          onClick={() => console.log('🔧 Current user:', auth.currentUser)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Log Current User
        </button>
      </div>  
    </div>
  );
}

export default FirebaseDebug;
