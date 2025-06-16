// Simple Test App to verify rendering works
import React from 'react';

const TestApp = () => {
  console.log('🚀 TestApp rendering');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '1rem'
        }}>
          🚀 SkillLance
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '1.5rem'
        }}>
          App is loading successfully!
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#888'
        }}>
          Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default TestApp;
