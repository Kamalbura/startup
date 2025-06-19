import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { 
  Card, 
  Button, 
  Badge, 
  Avatar, 
  SkeletonCard, 
  SkeletonList 
} from '@/components/ui'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'

/**
 * Modern Dashboard Page
 * 
 * A comprehensive dashboard that provides users with an overview of their
 * activity, recent tasks, earnings, and quick actions.
 * Features responsive design and loading states.
 */

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock data
        setStats({
          activeProjects: 3,
          completedTasks: 24,
          totalEarnings: 15420,
          rating: 4.8,
          responseTime: '2h'
        })

        setRecentTasks([
          {
            id: 1,
            title: 'Design Landing Page',
            client: 'TechStart Inc.',
            status: 'in-progress',
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            budget: 800,
            avatar: null
          },
          {
            id: 2,
            title: 'Build Mobile App UI',
            client: 'Creative Agency',
            status: 'review',
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            budget: 1200,
            avatar: null
          },
          {
            id: 3,
            title: 'Logo Design Package',
            client: 'StartupXYZ',
            status: 'completed',
            deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            budget: 500,
            avatar: null
          }
        ])

        setEarnings({
          thisMonth: 3420,
          lastMonth: 2180,
          growth: 56.9
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return <DashboardSkeleton />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be authenticated to view the dashboard.</p>
          <Button href="/auth/login">Sign In</Button>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Projects"
            value={stats?.activeProjects || 0}
            icon="📋"
            color="blue"
          />
          <StatsCard
            title="Completed Tasks"
            value={stats?.completedTasks || 0}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Total Earnings"
            value={formatCurrency(stats?.totalEarnings || 0)}
            icon="💰"
            color="purple"
          />
          <StatsCard
            title="Rating"
            value={`${stats?.rating || 0}/5.0`}
            icon="⭐"
            color="yellow"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Earnings Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold">
                      {formatCurrency(earnings?.thisMonth || 0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Month</span>
                    <span className="font-semibold">
                      {formatCurrency(earnings?.lastMonth || 0)}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth</span>
                    <Badge variant="success" size="sm">
                      +{earnings?.growth || 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  📝 Create New Proposal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  🔍 Browse Projects
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  💬 Messages
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  ⚙️ Account Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center">
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
          colorClasses[color]
        )}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  )
}

// Task Card Component
const TaskCard = ({ task }) => {
  const statusConfig = {
    'in-progress': { color: 'warning', label: 'In Progress' },
    'review': { color: 'info', label: 'Under Review' },
    'completed': { color: 'success', label: 'Completed' }
  }

  const status = statusConfig[task.status] || { color: 'default', label: 'Unknown' }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <Avatar 
          fallback={task.client.charAt(0)} 
          size="sm"
        />
        <div>
          <h4 className="font-medium text-gray-900">{task.title}</h4>
          <p className="text-sm text-gray-600">{task.client}</p>
          <p className="text-xs text-gray-500">
            Due {formatRelativeTime(task.deadline)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-900">
          {formatCurrency(task.budget)}
        </span>
        <Badge variant={status.color} size="sm">
          {status.label}
        </Badge>
      </div>
    </div>
  )
}

// Loading Skeleton
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonList items={3} />
          </div>
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
