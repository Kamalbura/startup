import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.modern.jsx'
import './styles/globals.modern.css'

// Error boundary for the entire app
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
