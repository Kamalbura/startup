import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SimpleTest from './SimpleTest.jsx'

console.log('🧪 Testing basic React setup...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('✅ React root created successfully');
  
  root.render(
    <StrictMode>
      <SimpleTest />
    </StrictMode>
  );
  console.log('✅ SimpleTest rendered successfully');
} catch (error) {
  console.error('❌ Main.jsx render error:', error);
  
  // Fallback render
  const fallbackHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; font-family: Arial, sans-serif;">
      <h1>🚨 SkillLance Error</h1>
      <p><strong>Error:</strong> ${error.message}</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #c00; color: white; border: none; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = fallbackHTML;
  }
}
