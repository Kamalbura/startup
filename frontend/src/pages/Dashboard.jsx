import React from 'react'
import DashboardSimple from '../components/dashboard/DashboardSimple'

// Import background images
import backgroundLight from '../assets/background.jpg';
import backgroundDark from '../assets/background2.jpg';

/**
 * Page-level Dashboard component that uses the clean, simple dashboard
 * This serves as a wrapper for the DashboardSimple component with background images
 */
const DashboardPage = () => {
  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundImage: `url(${backgroundLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark mode background overlay */}
      <div 
        className="hidden dark:block fixed inset-0 transition-opacity duration-200"
        style={{
          backgroundImage: `url(${backgroundDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />        {/* Dashboard content */}
      <div className="relative z-10 min-h-screen">
        <DashboardSimple />
      </div>
    </div>
  )
}

export default DashboardPage