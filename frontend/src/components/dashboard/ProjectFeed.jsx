import React, { useState } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import ProjectCard from './ProjectCard'

const ProjectFeed = ({ projects = [], loading = false, onSaveProject, onSendProposal, onViewProject }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    budget: '',
    location: '',
    tags: [],
    duration: ''
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)

  // Sample projects data (replace with real data from Firestore)
  const sampleProjects = [
    {
      id: 1,
      title: "React.js Web App Development",
      description: "Looking for a skilled React developer to build a modern web application with clean UI/UX",
      company: { name: "TechStart Pvt Ltd", logo: "/api/placeholder/24/24" },
      budget: "₹15,000 - ₹25,000",
      duration: "2-3 weeks",
      location: "Remote",
      proposals: 12,
      rating: 4.8,
      reviews: 45,
      tags: ["React.js", "JavaScript", "CSS", "HTML"],
      requiredSkills: ["React", "JavaScript", "HTML", "CSS"],
      postedTime: "2 hours ago",
      saved: false
    },
    {
      id: 2,
      title: "Logo Design for Startup",
      description: "Creative logo design needed for a new fintech startup. Looking for modern, professional design",
      company: { name: "FinTech Solutions", logo: "/api/placeholder/24/24" },
      budget: "₹5,000 - ₹8,000",
      duration: "1 week",
      location: "Mumbai",
      proposals: 8,
      rating: 4.9,
      reviews: 32,
      tags: ["Graphic Design", "Adobe Illustrator", "Branding"],
      requiredSkills: ["Graphic Design", "Logo Design", "Branding"],
      postedTime: "4 hours ago",
      saved: true
    },
    {
      id: 3,
      title: "Python Data Analysis Project",
      description: "Need help with data analysis using Python and pandas. Academic research project on student performance",
      company: { name: "Research Institute", logo: "/api/placeholder/24/24" },
      budget: "₹8,000 - ₹12,000",
      duration: "1-2 weeks",
      location: "Remote",
      proposals: 15,
      rating: 4.7,
      reviews: 28,
      tags: ["Python", "Data Analysis", "Pandas", "Research"],
      requiredSkills: ["Python", "Data Analysis", "Statistics"],
      postedTime: "1 day ago",
      saved: false
    }
  ]

  const allProjects = projects.length > 0 ? projects : sampleProjects
  
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesBudget = !selectedFilters.budget || project.budget.includes(selectedFilters.budget)
    const matchesLocation = !selectedFilters.location || project.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
    const matchesTags = selectedFilters.tags.length === 0 || 
                       selectedFilters.tags.some(tag => project.tags.some(projectTag => projectTag.toLowerCase().includes(tag.toLowerCase())))
    
    return matchesSearch && matchesBudget && matchesLocation && matchesTags
  })

  const handleTagFilter = (tag) => {
    setSelectedFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Browse Projects</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div className="flex border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by title, skills, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <select
              value={selectedFilters.budget}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, budget: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">All Budgets</option>
              <option value="5,000">Under ₹10,000</option>
              <option value="15,000">₹10,000 - ₹20,000</option>
              <option value="25,000">Above ₹20,000</option>
            </select>

            <input
              type="text"
              placeholder="Filter by location"
              value={selectedFilters.location}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2"
            />

            <select
              value={selectedFilters.duration}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, duration: e.target.value }))}
              className="border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="">All Durations</option>
              <option value="1 week">1 week</option>
              <option value="2-3 weeks">2-3 weeks</option>
              <option value="1 month">1+ month</option>
            </select>
          </div>
        )}

        {/* Popular Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['React.js', 'Python', 'Design', 'Data Analysis', 'Mobile App'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedFilters.tags.includes(tag)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mt-4">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} matching your criteria
        </p>
      </div>

      {/* Projects Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSave={onSaveProject}
            onSendProposal={onSendProposal}
            onViewDetails={onViewProject}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more opportunities.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedFilters({ budget: '', location: '', tags: [], duration: '' })
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectFeed
