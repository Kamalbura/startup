import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'

// Providers
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

// Layouts
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'

// Pages (Lazy loaded for performance)
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Lazy load pages
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const LoginPage = React.lazy(() => import('@/pages/LoginPage'))
const SignupPage = React.lazy(() => import('@/pages/SignupPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const HelpPage = React.lazy(() => import('@/pages/HelpPage'))
const HelpDetailPage = React.lazy(() => import('@/pages/HelpDetailPage'))
const CreateHelpPage = React.lazy(() => import('@/pages/CreateHelpPage'))
const ChatPage = React.lazy(() => import('@/pages/ChatPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const AboutPage = React.lazy(() => import('@/pages/AboutPage'))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'))

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error?.status === 404) return false
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) return false
        return failureCount < 2
      },
    },
  },
})

/**
 * Main App Component
 * Sets up all providers and routing
 */
function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <div className="app">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                      <MainLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <HomePage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/about" element={
                      <MainLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <AboutPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={
                      <AuthLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <LoginPage />
                        </Suspense>
                      </AuthLayout>
                    } />
                    
                    <Route path="/signup" element={
                      <AuthLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <SignupPage />
                        </Suspense>
                      </AuthLayout>
                    } />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <MainLayout requireAuth>
                        <Suspense fallback={<LoadingScreen />}>
                          <DashboardPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/help" element={
                      <MainLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <HelpPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/help/create" element={
                      <MainLayout requireAuth>
                        <Suspense fallback={<LoadingScreen />}>
                          <CreateHelpPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/help/:id" element={
                      <MainLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <HelpDetailPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/chat" element={
                      <MainLayout requireAuth>
                        <Suspense fallback={<LoadingScreen />}>
                          <ChatPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/chat/:id" element={
                      <MainLayout requireAuth>
                        <Suspense fallback={<LoadingScreen />}>
                          <ChatPage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    <Route path="/profile" element={
                      <MainLayout requireAuth>
                        <Suspense fallback={<LoadingScreen />}>
                          <ProfilePage />
                        </Suspense>
                      </MainLayout>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={
                      <MainLayout>
                        <Suspense fallback={<LoadingScreen />}>
                          <NotFoundPage />
                        </Suspense>
                      </MainLayout>
                    } />
                  </Routes>
                  
                  {/* Global Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--color-background)',
                        color: 'var(--color-foreground)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      },
                      success: {
                        iconTheme: {
                          primary: 'var(--color-success)',
                          secondary: 'white',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: 'var(--color-error)',
                          secondary: 'white',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}

export default App
