import React, { useState } from 'react'
import { Heart, MapPin, Clock, Users, Star, ExternalLink, DollarSign } from 'lucide-react'

const ProjectCard = ({ project, onSave, onSendProposal, onViewDetails }) => {
  const [isSaved, setIsSaved] = useState(project?.saved || false)
  const [isHovered, setIsHovered] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(project.id, !isSaved)
  }

  const matchScore = calculateSkillMatch(project.requiredSkills, project.userSkills || [])

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 ${
        isHovered ? 'scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {project.title}
            </h3>
            {matchScore >= 80 && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {matchScore}% match
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <img 
              src={project.company?.logo || '/api/placeholder/24/24'} 
              alt={project.company?.name}
              className="w-5 h-5 rounded-full"
            />
            <span className="font-medium">{project.company?.name}</span>
            <span>•</span>
            <span>{project.postedTime}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`p-2 rounded-lg transition-colors ${
            isSaved 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags?.slice(0, 4).map((tag) => (
          <span 
            key={tag}
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
        {project.tags?.length > 4 && (
          <span className="text-gray-500 text-xs">+{project.tags.length - 4} more</span>
        )}
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium text-gray-900">{project.budget}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{project.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{project.proposals} proposals</span>
        </div>
      </div>

      {/* Rating */}
      {project.rating && (
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">{project.rating}</span>
          <span className="text-sm text-gray-500">({project.reviews} reviews)</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails?.(project)}
          className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          View Details
        </button>
        <button
          onClick={() => onSendProposal?.(project)}
          className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
        >
          Send Proposal
        </button>
      </div>
    </div>
  )
}

const calculateSkillMatch = (requiredSkills = [], userSkills = []) => {
  if (!requiredSkills.length) return 0
  
  const matches = requiredSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  )
  
  return Math.round((matches.length / requiredSkills.length) * 100)
}

export default ProjectCard
