// Step 2: Test Firebase Context Import
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

console.log('🚀 Loading Firebase Context Test...');

// Test Firebase Auth Context import
try {
  console.log('🔥 Attempting to import FirebaseAuthContext...');
  import('./context/FirebaseAuthContext.jsx').then((module) => {
    console.log('✅ FirebaseAuthContext imported successfully:', Object.keys(module));
  }).catch((error) => {
    console.error('❌ Failed to import FirebaseAuthContext:', error);
  });
} catch (error) {
  console.error('❌ Error importing FirebaseAuthContext:', error);
}

// Test FirebaseLogin component import
try {
  console.log('🔥 Attempting to import FirebaseLogin...');
  import('./pages/FirebaseLogin.jsx').then((module) => {
    console.log('✅ FirebaseLogin imported successfully:', Object.keys(module));
  }).catch((error) => {
    console.error('❌ Failed to import FirebaseLogin:', error);
  });
} catch (error) {
  console.error('❌ Error importing FirebaseLogin:', error);
}

function FirebaseTestApp() {
  console.log('🚀 Rendering Firebase Test App...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>🔥 Firebase Import Test</h1>
      <p>Check the console for import results.</p>
      
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Router Test:</h2>
        <Router>
          <Routes>
            <Route path="/" element={<div>✅ React Router is working!</div>} />
            <Route path="*" element={<div>✅ Catch-all route working!</div>} />
          </Routes>
        </Router>
      </div>
      
      <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h2>Import Status:</h2>
        <p>Check the browser console (F12) for import results.</p>
        <p>If imports are successful, we can proceed to test the context.</p>
      </div>
    </div>
  );
}

export default FirebaseTestApp;
