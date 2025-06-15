import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppFirebase from './AppFirebase.jsx'

console.log('🚀 SkillLance Main.jsx loaded - Loading AppFirebase...');
console.log('🔧 React version:', React?.version);
console.log('🔧 AppFirebase imported:', AppFirebase);
console.log('🔧 Document ready state:', document.readyState);
console.log('🔧 Root element:', document.getElementById('root'));

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Global error:', event.error);
  console.error('🚨 Error message:', event.message);
  console.error('🚨 Error source:', event.filename, event.lineno, event.colno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(rootElement);
  console.log('✅ React root created successfully');
  
  root.render(
    <StrictMode>
      <AppFirebase />
    </StrictMode>,
  );
  console.log('✅ AppFirebase rendered to root');
} catch (error) {
  console.error('❌ Main.jsx render error:', error);
  console.error('❌ Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
  
  // Fallback render
  const fallbackHTML = `
    <div style="padding: 20px; background: #fee; color: #c00; font-family: Arial, sans-serif;">
      <h1>🚨 SkillLance Render Error</h1>
      <p><strong>Error:</strong> ${error.message}</p>
      <p><strong>Type:</strong> ${error.name}</p>
      <details style="margin-top: 20px;">
        <summary>Stack Trace</summary>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack}</pre>
      </details>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #c00; color: white; border: none; cursor: pointer;">
        Reload Page
      </button>
    </div>
  `;
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = fallbackHTML;
  } else {
    document.body.innerHTML = fallbackHTML;
  }
}
