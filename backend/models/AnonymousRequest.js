// SkillLance Anonymous Request Model
// Purpose: Handle anonymous help requests with privacy-first design

import mongoose from 'mongoose'

const anonymousRequestSchema = new mongoose.Schema({
  // Anonymous Identity
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  anonymousUserId: {
    type: String,
    required: true,
    index: true
    // Links to user without revealing identity
  },

  // Request Details
  title: {
    type: String,
    required: [true, 'Help request title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  skillsNeeded: [{
    type: String,
    required: true,
    trim: true
  }],

  urgencyLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },

  estimatedTime: {
    type: String,
    enum: ['15min', '30min', '1hour', '2hours', '3hours+'],
    required: true
  },

  // Anonymous Avatar (for UI)
  avatar: {
    color: {
      type: String,
      required: true,
      default: '#4F46E5' // Random color generated
    },
    shape: {
      type: String,
      enum: ['circle', 'square', 'triangle', 'hexagon'],
      default: 'circle'
    },
    pattern: {
      type: String,
      enum: ['solid', 'gradient', 'dots', 'stripes'],
      default: 'solid'
    }
  },

  // Matching & Response
  status: {
    type: String,
    enum: ['Active', 'Matched', 'InProgress', 'Completed', 'Expired', 'Cancelled'],
    default: 'Active',
    index: true
  },

  matchedHelperId: {
    type: String,
    default: null,
    sparse: true
  },

  responseCount: {
    type: Number,
    default: 0
  },

  // Privacy & Security
  isAnonymous: {
    type: Boolean,
    default: true
  },

  allowSameCollege: {
    type: Boolean,
    default: true
  },

  collegeHint: {
    type: String,
    maxlength: 50
    // e.g., "Engineering College, Mumbai" (no specific name)
  },

  // Session Management
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Auto-delete after expiry
  },

  lastActivityAt: {
    type: Date,
    default: Date.now
  },

  // Interaction Tracking
  views: {
    type: Number,
    default: 0
  },

  helpOffers: [{
    helperId: String,
    offeredAt: { type: Date, default: Date.now },
    message: String,
    trustScore: Number,
    isAnonymous: { type: Boolean, default: false }
  }],

  // Location (Optional, Approximate)
  location: {
    city: String,
    state: String,
    isRemote: { type: Boolean, default: true }
  },

  // Tags for better matching
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],

  // Metadata
  createdFrom: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },

  userAgent: String,
  ipHash: String, // Hashed IP for rate limiting, not storing actual IP

}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.anonymousUserId;
      delete ret.ipHash;
      delete ret.userAgent;
      return ret;
    }
  }
})

// Indexes for performance
anonymousRequestSchema.index({ status: 1, createdAt: -1 })
anonymousRequestSchema.index({ skillsNeeded: 1, status: 1 })
anonymousRequestSchema.index({ urgencyLevel: -1, createdAt: -1 })
anonymousRequestSchema.index({ collegeHint: 1, status: 1 })
anonymousRequestSchema.index({ expiresAt: 1 }) // TTL index

// Virtual for time remaining
anonymousRequestSchema.virtual('timeRemaining').get(function() {
  const now = new Date()
  const remaining = this.expiresAt - now
  
  if (remaining <= 0) return 'Expired'
  
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
})

// Virtual for urgency color
anonymousRequestSchema.virtual('urgencyColor').get(function() {
  const colors = {
    'Low': '#10B981',     // Green
    'Medium': '#F59E0B',  // Amber  
    'High': '#EF4444',    // Red
    'Critical': '#DC2626' // Dark Red
  }
  return colors[this.urgencyLevel] || colors.Medium
})

// Methods
anonymousRequestSchema.methods.addHelpOffer = function(helperId, message, trustScore, isAnonymous = false) {
  this.helpOffers.push({
    helperId,
    message,
    trustScore,
    isAnonymous,
    offeredAt: new Date()
  })
  this.responseCount = this.helpOffers.length
  return this.save()
}

anonymousRequestSchema.methods.matchWithHelper = function(helperId) {
  this.status = 'Matched'
  this.matchedHelperId = helperId
  this.lastActivityAt = new Date()
  return this.save()
}

anonymousRequestSchema.methods.markAsCompleted = function() {
  this.status = 'Completed'
  this.lastActivityAt = new Date()
  return this.save()
}

anonymousRequestSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

// Static methods for queries
anonymousRequestSchema.statics.getActiveFeed = function(limit = 20, skills = [], urgency = []) {
  const query = { status: 'Active' }
  
  if (skills.length > 0) {
    query.skillsNeeded = { $in: skills }
  }
  
  if (urgency.length > 0) {
    query.urgencyLevel = { $in: urgency }
  }
  
  return this.find(query)
    .sort({ urgencyLevel: -1, createdAt: -1 })
    .limit(limit)
    .select('-anonymousUserId -ipHash -userAgent')
}

anonymousRequestSchema.statics.getBySessionId = function(sessionId) {
  return this.findOne({ sessionId })
}

anonymousRequestSchema.statics.getUserRequests = function(anonymousUserId) {
  return this.find({ anonymousUserId })
    .sort({ createdAt: -1 })
}

// Pre-save middleware
anonymousRequestSchema.pre('save', function(next) {
  // Auto-generate expiry if not set (24 hours default)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
  
  // Update last activity
  this.lastActivityAt = new Date()
  
  next()
})

const AnonymousRequest = mongoose.model('AnonymousRequest', anonymousRequestSchema)

export default AnonymousRequest
