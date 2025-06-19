// Simple Debug Component to test basic rendering
import React from 'react';

function SimpleDebug() {
  console.log('🐛 SimpleDebug component rendered');
  
  return (
    <div style={{ padding: '20px', background: 'lightblue', minHeight: '100vh' }}>
      <h1>SkillLance - Simple Debug</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default SimpleDebug;
