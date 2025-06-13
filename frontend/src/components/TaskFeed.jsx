import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, Star, IndianRupee } from 'lucide-react'

const TaskFeed = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const categories = [
    { value: 'all', label: 'All Tasks' },
    { value: 'academic', label: 'Academic Help' },
    { value: 'design', label: 'Design & Creative' },
    { value: 'tech', label: 'Tech & Programming' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'events', label: 'Events & Photography' },
    { value: 'writing', label: 'Writing & Content' },
    { value: 'other', label: 'Other' }
  ]

  // Mock data - replace with API call
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'UI/UX Design for Mobile App',
        description: 'Need help designing a mobile app interface for my startup project. Looking for someone with Figma experience.',
        category: 'design',
        budget: 500,
        budgetType: 'fixed',
        duration: '3 days',
        location: 'IIT Delhi',
        poster: {
          name: 'Rahul Sharma',
          karma: 95,
          trustScore: 4.8
        },
        skills: ['UI/UX', 'Figma', 'Mobile Design'],
        postedAt: '2 hours ago',
        applicants: 5
      },
      {
        id: 2,
        title: 'Python Programming Tutor',
        description: 'Looking for someone to help me understand data structures and algorithms. Need regular sessions.',
        category: 'tutoring',
        budget: 300,
        budgetType: 'hourly',
        duration: '1 week',
        location: 'BITS Pilani',
        poster: {
          name: 'Priya Patel',
          karma: 78,
          trustScore: 4.6
        },
        skills: ['Python', 'Data Structures', 'Algorithms'],
        postedAt: '4 hours ago',
        applicants: 8
      },
      {
        id: 3,
        title: 'Event Photography - College Fest',
        description: 'Need a photographer for our college fest. Must have own equipment and portfolio.',
        category: 'events',
        budget: 1500,
        budgetType: 'fixed',
        duration: '1 day',
        location: 'DU North Campus',
        poster: {
          name: 'Arjun Verma',
          karma: 112,
          trustScore: 4.9
        },
        skills: ['Photography', 'Event Coverage', 'Photo Editing'],
        postedAt: '1 day ago',
        applicants: 12
      },
      {
        id: 4,
        title: 'React.js Web Development',
        description: 'Need help building a portfolio website with React.js. Modern design preferred.',
        category: 'tech',
        budget: 800,
        budgetType: 'fixed',
        duration: '5 days',
        location: 'NIT Trichy',
        poster: {
          name: 'Sneha Kumar',
          karma: 67,
          trustScore: 4.5
        },
        skills: ['React.js', 'JavaScript', 'CSS', 'Web Development'],
        postedAt: '1 day ago',
        applicants: 6
      },
      {
        id: 5,
        title: 'Academic Writing - Research Paper',
        description: 'Need help with writing and formatting a research paper on renewable energy.',
        category: 'writing',
        budget: 400,
        budgetType: 'fixed',
        duration: '1 week',
        location: 'IISC Bangalore',
        poster: {
          name: 'Karthik Rao',
          karma: 89,
          trustScore: 4.7
        },
        skills: ['Academic Writing', 'Research', 'Citations'],
        postedAt: '2 days ago',
        applicants: 4
      }
    ]

    setTimeout(() => {
      setTasks(mockTasks)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'budget-high':
        return b.budget - a.budget
      case 'budget-low':
        return a.budget - b.budget
      case 'applicants':
        return a.applicants - b.applicants
      default:
        return 0 // Keep original order for 'recent'
    }
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Tasks</h1>
        <p className="text-slate-600">Find gigs that match your skills and build your karma</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-karma-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="budget-high">Highest Budget</option>
            <option value="budget-low">Lowest Budget</option>
            <option value="applicants">Least Competition</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Task Cards */}
      <div className="space-y-6">
        {sortedTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{task.title}</h3>
                  <p className="text-slate-600 mb-4">{task.description}</p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-karma-100 text-karma-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-2xl font-bold text-karma-600 mb-1">
                    <IndianRupee className="w-6 h-6" />
                    <span>{task.budget}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {task.budgetType === 'hourly' ? '/hour' : 'fixed'}
                  </p>
                </div>
              </div>

              {/* Task Meta */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{task.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{task.applicants} applicants</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Poster Info */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800">{task.poster.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <span>{task.poster.karma} karma</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-trust-500 fill-current" />
                        <span>{task.poster.trustScore}</span>
                      </div>
                    </div>
                  </div>

                  <button className="bg-karma-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-karma-700 transition-colors duration-200">
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Posted {task.postedAt}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-600">
            Try adjusting your search criteria or check back later for new tasks.
          </p>
        </div>
      )}
    </div>
  )
}

export default TaskFeed
