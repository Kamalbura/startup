// Simple Debug Component to test basic rendering
import React from 'react';

function DebugApp() {
  console.log('🔥 DebugApp component is rendering...');
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 SkillLance</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Debug Mode - Frontend is Working!
        </p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '1rem', 
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <p>✅ React is rendering</p>
          <p>✅ CSS is loading</p>
          <p>✅ Components are working</p>
        </div>
        <button 
          onClick={() => alert('SkillLance is ready!')}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
}

export default DebugApp;
