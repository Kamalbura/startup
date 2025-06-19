import React from 'react'
import Dashboard from '../components/dashboard/Dashboard'

/**
 * Page-level Dashboard component that uses the unified dashboard
 * This serves as a redirect/wrapper for the main Dashboard component
 */
const DashboardPage = () => {
  return <Dashboard variant="modern" />
}

export default DashboardPage