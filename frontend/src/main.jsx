import React from 'react'
import ReactDOM from 'react-dom/client'
import AppFirebase from './AppFirebase.jsx'
import SimpleDebugApp from './SimpleDebugApp.jsx';
import './index.css'

console.log('🚀 Starting SkillLance App...');

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AppFirebase />
    </React.StrictMode>,
  );
  console.log('✅ AppFirebase rendered successfully');
} catch (error) {
  console.error('❌ Error rendering AppFirebase:', error);
  console.log('🐛 Rendering SimpleDebugApp for troubleshooting...');
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <SimpleDebugApp />
    </React.StrictMode>,
  );
}
