// Simple Auth Debug Component - shows current auth state
import React from 'react';
import { useAuth } from '../context/FirebaseAuthContext';

export default function AuthDebugSimple() {
  const { status, user, profile, error, loading } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm max-w-sm">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>User Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</div>
        <div><strong>Profile Name:</strong> {profile?.displayName || user?.displayName || 'None'}</div>
        {error && <div className="text-red-300"><strong>Error:</strong> {error}</div>}
      </div>
    </div>
  );
}
