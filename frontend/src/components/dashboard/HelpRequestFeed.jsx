import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, Filter, Search, Plus, TrendingUp,
  Clock, Users, Zap, BookOpen
} from 'lucide-react';
import HelpRequestCard from './HelpRequestCard';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

/**
 * HelpRequestFeed Component
 * 
 * Live scrolling feed of help requests from students.
 * Core feature of SkillLance dashboard.
 * 
 * Features:
 * - Auto-scrolling with pause on hover
 * - Real-time updates (simulated)
 * - Filtering by subject, urgency, location
 * - Search functionality
 * - Quick stats display
 * - Responsive design
 */

const HelpRequestFeed = ({ 
  className = '',
  variant = 'full', // 'full' or 'compact'
  autoScroll = true,
  showFilters = true,
  maxHeight = '600px',
  ...props 
}) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoScrolling, setIsAutoScrolling] = useState(autoScroll);
  const feedRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Mock data - replace with real API calls
  const mockRequests = [
    {
      id: 1,
      title: "Need help with React useEffect cleanup",
      description: "I'm having trouble understanding how to properly cleanup useEffect hooks in React. My component is causing memory leaks and I can't figure out why the cleanup function isn't working as expected.",
      subject: "Programming",
      urgency: "Medium",
      isAnonymous: false,
      authorName: "Priya Sharma",
      authorCollege: "IIT Delhi",
      authorAvatar: null,
      location: "Delhi, India",
      timePosted: "5 min ago",
      estimatedDuration: "30 min",
      helpersInterested: 3,
      tags: ["React", "JavaScript", "useEffect"]
    },
    {
      id: 2,
      title: "Calculus integration problem",
      description: "Struggling with integration by parts for this specific problem. Need someone to walk me through the steps.",
      subject: "Mathematics",
      urgency: "High",
      isAnonymous: true,
      authorName: "Anonymous",
      authorCollege: "Anonymous",
      location: "Mumbai, India",
      timePosted: "12 min ago",
      estimatedDuration: "45 min",
      helpersInterested: 5,
      tags: ["Calculus", "Integration", "Math"]
    },
    {
      id: 3,
      title: "Organic Chemistry reaction mechanism",
      description: "Can someone explain the SN2 reaction mechanism? I understand the basics but need help with stereochemistry aspects.",
      subject: "Chemistry",
      urgency: "Low",
      isAnonymous: false,
      authorName: "Rahul Verma",
      authorCollege: "BITS Pilani",
      authorAvatar: null,
      location: "Rajasthan, India",
      timePosted: "18 min ago", 
      estimatedDuration: "20 min",
      helpersInterested: 2,
      tags: ["Organic Chemistry", "Reaction Mechanism"]
    },
    {
      id: 4,
      title: "Need help with data structures - Binary Trees",
      description: "I'm preparing for coding interviews and having trouble with binary tree traversal algorithms. Specifically need help with in-order, pre-order, and post-order traversals.",
      subject: "Programming",
      urgency: "Medium",
      isAnonymous: true,
      authorName: "Anonymous",
      authorCollege: "Anonymous", 
      location: "Bangalore, India",
      timePosted: "25 min ago",
      estimatedDuration: "60 min",
      helpersInterested: 7,
      tags: ["Data Structures", "Binary Trees", "Algorithms"]
    },
    {
      id: 5,
      title: "Physics - Quantum mechanics wave functions",
      description: "Having difficulty understanding the physical interpretation of wave functions in quantum mechanics. Need conceptual help.",
      subject: "Physics",
      urgency: "Low",
      isAnonymous: false,
      authorName: "Ananya Singh",
      authorCollege: "IISc Bangalore",
      authorAvatar: null,
      location: "Bangalore, India",
      timePosted: "32 min ago",
      estimatedDuration: "40 min",
      helpersInterested: 1,
      tags: ["Quantum Mechanics", "Wave Functions", "Physics"]
    },
    {
      id: 6,
      title: "URGENT: Assignment due tomorrow - Database Design",
      description: "Need immediate help with database normalization for my assignment. Due tomorrow morning and I'm stuck on 3NF conversion.",
      subject: "Programming",
      urgency: "Urgent",
      isAnonymous: true,
      authorName: "Anonymous",
      authorCollege: "Anonymous",
      location: "Pune, India", 
      timePosted: "1 hour ago",
      estimatedDuration: "90 min",
      helpersInterested: 12,
      tags: ["Database", "SQL", "Normalization", "Assignment"]
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Requests', count: mockRequests.length },
    { id: 'Programming', label: 'Programming', count: mockRequests.filter(r => r.subject === 'Programming').length },
    { id: 'Mathematics', label: 'Mathematics', count: mockRequests.filter(r => r.subject === 'Mathematics').length },
    { id: 'Physics', label: 'Physics', count: mockRequests.filter(r => r.subject === 'Physics').length },
    { id: 'Chemistry', label: 'Chemistry', count: mockRequests.filter(r => r.subject === 'Chemistry').length },
    { id: 'urgent', label: 'Urgent Only', count: mockRequests.filter(r => r.urgency === 'Urgent').length }
  ];

  // Quick stats
  const stats = [
    { label: 'Active Requests', value: mockRequests.length, icon: BookOpen, color: 'blue' },
    { label: 'Avg Response Time', value: '< 5 min', icon: Clock, color: 'green' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'purple' },
    { label: 'Helpers Online', value: '247', icon: Users, color: 'orange' }
  ];

  // Initialize requests
  useEffect(() => {
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = requests;

    // Apply subject filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'urgent') {
        filtered = filtered.filter(request => request.urgency === 'Urgent');
      } else {
        filtered = filtered.filter(request => request.subject === activeFilter);
      }
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  }, [requests, activeFilter, searchQuery]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && feedRef.current) {
      autoScrollInterval.current = setInterval(() => {
        if (feedRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            // Reset to top when reached bottom
            feedRef.current.scrollTop = 0;
          } else {
            // Scroll down slowly
            feedRef.current.scrollTop += 1;
          }
        }
      }, 50);
    } else {
      clearInterval(autoScrollInterval.current);
    }

    return () => clearInterval(autoScrollInterval.current);
  }, [isAutoScrolling]);

  // Handle actions
  const handleHelpOffer = (requestId) => {
    console.log('Offering help for request:', requestId);
    // Navigate to help interaction page
  };

  const handleMessage = (requestId) => {
    console.log('Messaging for request:', requestId);
    // Open chat/message modal
  };

  const handleView = (requestId) => {
    console.log('Viewing request:', requestId);
    // Navigate to detailed view
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In real app, fetch new requests from API
    }, 1000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-500" />
            Live Help Feed
          </h2>
          <p className="text-gray-600 mt-1">Real-time help requests from students</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`flex items-center ${isAutoScrolling ? 'text-blue-600' : 'text-gray-600'}`}
          >
            {isAutoScrolling ? 'Pause Auto-scroll' : 'Resume Auto-scroll'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {variant === 'full' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters and Search */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search help requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === option.id
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } border`}
              >
                {option.label}
                <span className="ml-1 text-xs opacity-75">({option.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Requests Feed */}
      <div 
        ref={feedRef}
        className="space-y-4 overflow-y-auto custom-scrollbar"
        style={{ maxHeight }}
        onMouseEnter={() => setIsAutoScrolling(false)}
        onMouseLeave={() => autoScroll && setIsAutoScrolling(true)}
      >
        {filteredRequests.length === 0 ? (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No help requests found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to ask for help!'}
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Post Help Request
            </Button>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <HelpRequestCard
              key={request.id}
              request={request}
              onHelpOffer={handleHelpOffer}
              onMessage={handleMessage}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Show more button for compact variant */}
      {variant === 'compact' && filteredRequests.length > 3 && (
        <div className="text-center">
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            View All Help Requests
            <BookOpen className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default HelpRequestFeed;
