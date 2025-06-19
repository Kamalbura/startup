// Debug component to test authentication state
// Purpose: Display current authentication state for debugging

import React from 'react';
import { useAuth } from '../context/FirebaseAuthContext';

export default function AuthDebug() {
  const { status, user, profile, error, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 SkillLance Authentication Debug
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Status
            </h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${
                status === 'authenticated' ? 'bg-green-100 text-green-800' :
                status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>{status}</span></p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
            </div>
          </div>

          {/* User Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User Data
            </h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                <p><strong>Provider:</strong> {user.providerData?.[0]?.providerId || 'Unknown'}</p>
              </div>
            ) : (
              <p className="text-gray-500">No user data</p>
            )}
          </div>

          {/* Profile Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Data
            </h2>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><strong>Display Name:</strong> {profile.displayName || 'Not set'}</p>
                <p><strong>College:</strong> {profile.college || 'Not set'}</p>
                <p><strong>Course:</strong> {profile.course || 'Not set'}</p>
                <p><strong>Year:</strong> {profile.year || 'Not set'}</p>
                <p><strong>Profile Complete:</strong> {profile.profileComplete ? 'Yes' : 'No'}</p>
                <p><strong>Trust Score:</strong> {profile.trustScore || 0}</p>
                <p><strong>Karma Points:</strong> {profile.karmaPoints || 0}</p>
              </div>
            ) : (
              <p className="text-gray-500">No profile data</p>
            )}
          </div>

          {/* Raw Data */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Raw Data (JSON)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">User:</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Profile:</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
