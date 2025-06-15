// Firebase Auth Debug Component
// Purpose: Step by step Firebase authentication testing

import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import firebaseAuthService from '../services/firebaseAuth';

const FirebaseAuthDebug = () => {
  const [steps, setSteps] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authState, setAuthState] = useState('initializing');

  const addStep = (step) => {
    setSteps(prev => [...prev, `${new Date().toLocaleTimeString()}: ${step}`]);
    console.log('🔥 Debug:', step);
  };

  useEffect(() => {
    addStep('🚀 Starting Firebase Auth Debug...');

    // Test Firebase Auth State Listener
    addStep('📡 Setting up Firebase auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        addStep(`✅ User authenticated: ${user.email}`);
        addStep(`📧 Email verified: ${user.emailVerified}`);
        setCurrentUser(user);
        setAuthState('authenticated');
      } else {
        addStep('❌ No user authenticated');
        setCurrentUser(null);
        setAuthState('unauthenticated');
      }
    });

    // Test Firebase Auth Service
    addStep('🧪 Testing Firebase Auth Service...');
    try {
      const testListener = firebaseAuthService.onAuthStateChange((user) => {
        addStep(`🔥 Firebase Service detected user: ${user ? 'Yes' : 'No'}`);
      });
      addStep('✅ Firebase Auth Service listener working');
    } catch (error) {
      addStep(`❌ Firebase Auth Service error: ${error.message}`);
    }

    return () => {
      unsubscribe();
      addStep('🧹 Cleanup completed');
    };
  }, []);

  const testSignIn = async () => {
    addStep('🔐 Testing sign in...');
    try {
      const result = await firebaseAuthService.signUpWithEmail(
        'test@vnrvjiet.ac.in', 
        'testpassword123',
        {
          displayName: 'Test User',
          college: 'VNRVJIET',
          course: 'Computer Science',
          year: 3
        }
      );
      addStep('✅ Sign up test successful');
    } catch (error) {
      addStep(`❌ Sign up test failed: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'monospace', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🔥 Firebase Auth Debug</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Current Auth State: <span style={{ color: authState === 'authenticated' ? '#4ade80' : '#f87171' }}>{authState}</span></h2>
        {currentUser && (
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h3>Current User:</h3>
            <p>Email: {currentUser.email}</p>
            <p>UID: {currentUser.uid}</p>
            <p>Email Verified: {currentUser.emailVerified ? 'Yes' : 'No'}</p>
            <p>Display Name: {currentUser.displayName || 'Not set'}</p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={testSignIn}
          style={{
            background: '#4ade80',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Test Sign Up
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#f87171',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reload Test
        </button>
      </div>

      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1rem', 
        borderRadius: '8px',
        maxHeight: '400px',
        overflowY: 'scroll'
      }}>
        <h3>Debug Steps:</h3>
        {steps.map((step, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            {step}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <p>Progress: {steps.length} steps completed</p>
        <p>Status: {authState === 'initializing' ? 'Initializing...' : 'Running...'}</p>
      </div>
    </div>
  );
};

export default FirebaseAuthDebug;
