import React from 'react'
import { useAuth } from '../context/FirebaseAuthContext'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

/**
 * Modern Dashboard Page Component
 * A comprehensive dashboard that provides users with an overview of their
 * activity, recent tasks, earnings, and quick actions.
 */

const DashboardPage = () => {
  const { user, profile } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">Please sign in</CardTitle>
          <p className="text-gray-600 mb-4">You need to be authenticated to view the dashboard.</p>
          <Button href="/login">Sign In</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.displayName || user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <Badge variant="success">+2</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹15,420</p>
                </div>
                <Badge variant="default">This month</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8/5.0</p>
                </div>
                <Badge variant="warning">98% success</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">New project proposal submitted</h4>
                  <p className="text-sm text-gray-600">Design Landing Page - TechStart Inc.</p>
                </div>
                <Badge variant="default">2 hours ago</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Payment received</h4>
                  <p className="text-sm text-gray-600">₹2,500 for Mobile App UI</p>
                </div>
                <Badge variant="success">Yesterday</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Project completed</h4>
                  <p className="text-sm text-gray-600">Logo Design Package - StartupXYZ</p>
                </div>
                <Badge variant="outline">3 days ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
