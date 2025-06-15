// Simple Debug App to isolate the issue
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

console.log('🚀 Loading Simple Debug App...');

function SimpleApp() {
  console.log('🚀 Rendering Simple App...');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ React App is Working!</h1>
      <p>This proves the basic React setup is functional.</p>
      
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
        <h2>Next: Test Firebase Context</h2>
        <p>If you see this, the basic React setup is fine. The issue is likely in the Firebase context or imports.</p>
      </div>
    </div>
  );
}

export default SimpleApp;
