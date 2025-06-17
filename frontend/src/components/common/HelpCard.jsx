import { useState } from 'react'
import { Card, Button, Badge, Avatar } from '@/components/ui'
import { cn, formatRelativeTime } from '@/lib/utils'

/**
 * HelpCard Component
 * 
 * A comprehensive help/support card component that displays FAQs,
 * documentation links, contact options, and community resources.
 * Perfect for help pages, dashboards, and onboarding flows.
 * 
 * @example
 * <HelpCard />
 * <HelpCard variant="compact" showSearch={false} />
 */

const HelpCard = ({ 
  variant = 'default',
  showSearch = true,
  className,
  ...props 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Mock data - replace with real data from your backend
  const helpCategories = [
    { id: 'all', label: 'All Topics', count: 24 },
    { id: 'getting-started', label: 'Getting Started', count: 8 },
    { id: 'projects', label: 'Projects & Tasks', count: 6 },
    { id: 'payments', label: 'Payments', count: 4 },
    { id: 'account', label: 'Account Settings', count: 3 },
    { id: 'technical', label: 'Technical Issues', count: 3 }
  ]

  const helpArticles = [
    {
      id: 1,
      title: 'How to create your first project',
      category: 'getting-started',
      views: 1234,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      featured: true,
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: 'Setting up payments and invoicing',
      category: 'payments',
      views: 892, 
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      featured: true,
      difficulty: 'intermediate'
    },
    {
      id: 3,
      title: 'Managing client communications',
      category: 'projects',
      views: 657,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      featured: false,
      difficulty: 'beginner'
    },
    {
      id: 4,
      title: 'Troubleshooting login issues',
      category: 'technical',
      views: 543,
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      featured: false,
      difficulty: 'beginner'
    },
    {
      id: 5,
      title: 'Advanced project templates',
      category: 'projects',
      views: 321,
      lastUpdated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      featured: false,
      difficulty: 'advanced'
    }
  ]

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: '💬',
      action: () => console.log('Contact support'),
      variant: 'primary'
    },
    {
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      icon: '🗨️',
      action: () => console.log('Open live chat'),
      variant: 'secondary'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: '👥',
      action: () => console.log('Open forum'),
      variant: 'outline'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: '🎥',
      action: () => console.log('Open tutorials'),
      variant: 'outline'
    }
  ]

  // Filter articles based on search and category
  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || 
      article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticles = filteredArticles.filter(article => article.featured)
  const regularArticles = filteredArticles.filter(article => !article.featured)

  if (variant === 'compact') {
    return (
      <Card className={cn('p-6', className)} {...props}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
            🆘
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Find answers to common questions or get in touch with our support team.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" size="sm">
              Browse FAQ
            </Button>
            <Button variant="outline" size="sm">
              Contact Us
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Header */}
      <Card className="p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
            🆘
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search */}
          {showSearch && (
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.action}
              className="p-4 h-auto flex-col items-start text-left space-y-2"
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="font-semibold">{action.title}</div>
              <div className="text-sm opacity-75">{action.description}</div>
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {helpCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors',
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                <span>{category.label}</span>
                <Badge variant="outline" size="xs">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        {/* Articles */}
        <div className="lg:col-span-3 space-y-6">
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Articles
              </h3>
              <div className="space-y-4">
                {featuredArticles.map(article => (
                  <ArticleItem key={article.id} article={article} featured />
                ))}
              </div>
            </Card>
          )}

          {/* Regular Articles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeCategory === 'all' ? 'All Articles' : 
               helpCategories.find(c => c.id === activeCategory)?.label || 'Articles'}
            </h3>
            
            {regularArticles.length > 0 ? (
              <div className="space-y-3">
                {regularArticles.map(article => (
                  <ArticleItem key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <p className="text-gray-500">
                  {searchQuery ? 'No articles found for your search.' : 'No articles in this category.'}
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSearchQuery('')}
                    className="mt-3"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

// Article Item Component
const ArticleItem = ({ article, featured = false }) => {
  const difficultyColors = {
    beginner: 'success',
    intermediate: 'warning', 
    advanced: 'error'
  }

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-lg border transition-colors hover:bg-gray-50 cursor-pointer',
      featured && 'border-blue-200 bg-blue-50'
    )}>
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="font-medium text-gray-900 hover:text-blue-600">
            {article.title}
          </h4>
          {featured && (
            <Badge variant="primary" size="xs">
              Featured
            </Badge>
          )}
          <Badge variant={difficultyColors[article.difficulty]} size="xs">
            {article.difficulty}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{article.views.toLocaleString()} views</span>
          <span>Updated {formatRelativeTime(article.lastUpdated)}</span>
        </div>
      </div>
      <div className="ml-4">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

export default HelpCard
