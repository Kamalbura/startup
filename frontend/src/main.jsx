import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppFirebase from './AppFirebase.jsx'

console.log('🚀 SkillLance Main.jsx loaded - Starting main app...');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppFirebase />
  </StrictMode>,
)
