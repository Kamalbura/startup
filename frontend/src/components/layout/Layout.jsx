import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { cn } from '@/lib/utils'

/**
 * Main layout component that wraps the entire application
 * Provides consistent header, footer, and main content area
 */
const Layout = ({ 
  children, 
  className, 
  headerClassName, 
  footerClassName,
  showHeader = true,
  showFooter = true,
  fullHeight = false 
}) => {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      fullHeight && "h-screen",
      className
    )}>
      {showHeader && <Header className={headerClassName} />}
      
      <main className={cn(
        "flex-1",
        fullHeight && "flex-1 overflow-hidden"
      )}>
        {children || <Outlet />}
      </main>
      
      {showFooter && <Footer className={footerClassName} />}
    </div>
  )
}

/**
 * Minimal layout without header/footer - useful for auth pages
 */
const AuthLayout = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-gray-50",
      className
    )}>
      {children || <Outlet />}
    </div>
  )
}

/**
 * Dashboard layout with consistent padding and structure
 */
const DashboardLayout = ({ children, className, title, actions }) => {
  return (
    <Layout>
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
        {(title || actions) && (
          <div className="flex justify-between items-center mb-8">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            )}
            {actions && (
              <div className="flex items-center space-x-4">
                {actions}
              </div>
            )}
          </div>
        )}
        {children || <Outlet />}
      </div>
    </Layout>
  )
}

/**
 * Full-width layout without max-width constraints
 */
const FullWidthLayout = ({ children, className, ...props }) => {
  return (
    <Layout {...props}>
      <div className={cn("w-full", className)}>
        {children || <Outlet />}
      </div>
    </Layout>
  )
}

export {
  Layout as default,
  AuthLayout,
  DashboardLayout,
  FullWidthLayout
}
