import React from 'react';
import UltimateDashboard from './UltimateDashboard';
import UltimateDashboardSimple from './UltimateDashboardSimple';
import UltimateDashboardEnhanced from './UltimateDashboardEnhanced';
//import DashboardModern from './DashboardModern';

/**
 * General Dashboard component that renders a specific variant based on the `variant` prop.
 * Variants: 'simple', 'enhanced', 'ultimate', 'modern'
 */
const Dashboard = ({ variant = 'modern', ...props }) => {
  switch (variant) {
    case 'simple':
      return <UltimateDashboardSimple {...props} />;
    case 'enhanced':
      return <UltimateDashboardEnhanced {...props} />;
    case 'ultimate':
      return <UltimateDashboard {...props} />;
    case 'modern':
    default:
      return <DashboardModern {...props} />;
  }
};

export default Dashboard;
