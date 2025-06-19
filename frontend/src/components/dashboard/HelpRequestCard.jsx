import React, { useState } from 'react';
import { 
  MessageCircle, Clock, User, Eye, EyeOff, 
  BookOpen, Code, Calculator, Lightbulb,
  ThumbsUp, ArrowRight, MapPin
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

/**
 * HelpRequestCard Component
 * 
 * Displays individual help requests from students in the live feed.
 * Supports anonymous and public requests with different subjects.
 * 
 * Features:
 * - Anonymous/Public visibility toggle
 * - Subject categorization (Math, Programming, etc.)
 * - Urgency levels (Low, Medium, High, Urgent)
 * - College/Location display
 * - Time posted and estimated duration
 * - Quick actions (Help, Message, View)
 */

const HelpRequestCard = ({ 
  request, 
  onHelpOffer, 
  onMessage, 
  onView,
  className = '',
  ...props 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Subject icon mapping
  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Mathematics': Calculator,
      'Programming': Code,
      'Physics': Lightbulb,
      'Chemistry': BookOpen,
      'Biology': BookOpen,
      'English': BookOpen,
      'History': BookOpen,
      'Other': User
    };
    return iconMap[subject] || User;
  };

  // Urgency color mapping
  const getUrgencyColor = (urgency) => {
    const colorMap = {
      'Low': 'bg-green-100 text-green-800 border-green-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Urgent': 'bg-red-100 text-red-800 border-red-200'
    };
    return colorMap[urgency] || colorMap['Medium'];
  };

  // Subject color mapping
  const getSubjectColor = (subject) => {
    const colorMap = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Programming': 'bg-purple-100 text-purple-800',
      'Physics': 'bg-yellow-100 text-yellow-800',
      'Chemistry': 'bg-green-100 text-green-800',
      'Biology': 'bg-emerald-100 text-emerald-800',
      'English': 'bg-pink-100 text-pink-800',
      'History': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colorMap[subject] || colorMap['Other'];
  };

  const SubjectIcon = getSubjectIcon(request.subject);

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-0 shadow-md ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Anonymous/Public indicator */}
            <div className="flex items-center space-x-2">
              {request.isAnonymous ? (
                <div className="flex items-center space-x-1 text-gray-500">
                  <EyeOff className="w-4 h-4" />
                  <span className="text-xs font-medium">Anonymous</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Avatar 
                    src={request.authorAvatar} 
                    alt={request.authorName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{request.authorName}</p>
                    <p className="text-xs text-gray-500">{request.authorCollege}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Urgency Badge */}
          <Badge className={`text-xs font-medium px-2 py-1 rounded-full border ${getUrgencyColor(request.urgency)}`}>
            {request.urgency}
          </Badge>
        </div>

        {/* Subject and Location */}
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`text-xs font-medium px-2 py-1 rounded-lg ${getSubjectColor(request.subject)}`}>
            <SubjectIcon className="w-3 h-3 mr-1" />
            {request.subject}
          </Badge>
          
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {request.location}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {request.title}
        </h3>

        {/* Preview/Description */}
        <p className={`text-sm text-gray-600 mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {request.description}
        </p>

        {/* Expand/Collapse button for long descriptions */}
        {request.description.length > 150 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-4 text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {request.timePosted}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Est. {request.estimatedDuration}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>{request.helpersInterested} interested</span>
            <ThumbsUp className="w-3 h-3" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => onHelpOffer(request.id)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            <span>Offer Help</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onMessage(request.id)}
            className="px-3 py-2 border border-gray-200 hover:bg-gray-50"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(request.id)}
            className="px-3 py-2 border border-gray-200 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HelpRequestCard;
