// CampusKarma Review Model
// Purpose: Trust-building review system with verification

import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  // Core Review Information
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required']
  },

  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer ID is required']
  },

  reviewedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewed user ID is required']
  },

  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },

  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },

  // Review Type
  reviewType: {
    type: String,
    enum: ['Client to Worker', 'Worker to Client'],
    required: true
  },

  // Review Categories (Detailed Feedback)
  criteria: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Trust & Verification
  isVerified: {
    type: Boolean,
    default: true // Auto-verified if tied to completed task
  },

  // Helpful Voting System
  helpfulVotes: {
    type: Number,
    default: 0
  },

  votedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: String,
      enum: ['helpful', 'not_helpful']
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Status & Moderation
  status: {
    type: String,
    enum: ['Active', 'Hidden', 'Flagged', 'Removed'],
    default: 'Active'
  },

  flags: [{
    reason: {
      type: String,
      enum: ['Inappropriate', 'Fake', 'Spam', 'Offensive', 'Other']
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Response from Reviewed User
  response: {
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    respondedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
reviewSchema.index({ reviewedUserId: 1, createdAt: -1 })
reviewSchema.index({ reviewerId: 1, createdAt: -1 })
reviewSchema.index({ taskId: 1 })
reviewSchema.index({ rating: -1 })
reviewSchema.index({ status: 1 })

// Compound index for preventing duplicate reviews
reviewSchema.index({ taskId: 1, reviewerId: 1, reviewType: 1 }, { unique: true })

// Virtual for overall criteria average
reviewSchema.virtual('criteriaAverage').get(function() {
  if (!this.criteria) return null
  
  const values = Object.values(this.criteria).filter(val => val !== undefined)
  if (values.length === 0) return null
  
  return values.reduce((sum, val) => sum + val, 0) / values.length
})

// Virtual for review age
reviewSchema.virtual('reviewAge').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
})

// Pre-save middleware for validation
reviewSchema.pre('save', function(next) {
  // Ensure reviewer and reviewed user are different
  if (this.reviewerId.toString() === this.reviewedUserId.toString()) {
    return next(new Error('Cannot review yourself'))
  }
  
  // Calculate criteria average if criteria provided
  if (this.criteria) {
    const criteriaValues = Object.values(this.criteria).filter(val => val !== undefined)
    if (criteriaValues.length > 0) {
      const average = criteriaValues.reduce((sum, val) => sum + val, 0) / criteriaValues.length
      
      // Ensure overall rating aligns with criteria average (within 1 point)
      if (Math.abs(this.rating - average) > 1) {
        return next(new Error('Overall rating should align with detailed criteria'))
      }
    }
  }
  
  next()
})

// Static methods
reviewSchema.statics.getAverageRatingForUser = async function(userId) {
  const result = await this.aggregate([
    { 
      $match: { 
        reviewedUserId: mongoose.Types.ObjectId(userId),
        status: 'Active'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ])
  
  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: [] }
  }
  
  const data = result[0]
  
  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  data.ratingDistribution.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1
  })
  
  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution
  }
}

reviewSchema.statics.getCriteriaAveragesForUser = async function(userId) {
  const result = await this.aggregate([
    { 
      $match: { 
        reviewedUserId: mongoose.Types.ObjectId(userId),
        status: 'Active',
        criteria: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        avgCommunication: { $avg: '$criteria.communication' },
        avgQuality: { $avg: '$criteria.quality' },
        avgTimeliness: { $avg: '$criteria.timeliness' },
        avgProfessionalism: { $avg: '$criteria.professionalism' }
      }
    }
  ])
  
  if (result.length === 0) {
    return { communication: 0, quality: 0, timeliness: 0, professionalism: 0 }
  }
  
  const data = result[0]
  return {
    communication: Math.round((data.avgCommunication || 0) * 10) / 10,
    quality: Math.round((data.avgQuality || 0) * 10) / 10,
    timeliness: Math.round((data.avgTimeliness || 0) * 10) / 10,
    professionalism: Math.round((data.avgProfessionalism || 0) * 10) / 10
  }
}

// Instance methods
reviewSchema.methods.addHelpfulVote = function(userId, voteType) {
  // Check if user already voted
  const existingVote = this.votedBy.find(vote => vote.userId.toString() === userId.toString())
  
  if (existingVote) {
    if (existingVote.vote === voteType) {
      throw new Error('You have already voted this way')
    } else {
      // Change vote
      existingVote.vote = voteType
      existingVote.votedAt = new Date()
    }
  } else {
    // New vote
    this.votedBy.push({ userId, vote: voteType })
  }
  
  // Recalculate helpful votes
  this.helpfulVotes = this.votedBy.filter(vote => vote.vote === 'helpful').length
  
  return this.save()
}

reviewSchema.methods.addResponse = function(responseComment) {
  this.response = {
    comment: responseComment,
    respondedAt: new Date()
  }
  
  return this.save()
}

reviewSchema.methods.flagReview = function(reason, reportedBy) {
  this.flags.push({
    reason,
    reportedBy,
    reportedAt: new Date()
  })
  
  // Auto-hide if flagged by multiple users
  if (this.flags.length >= 3) {
    this.status = 'Flagged'
  }
  
  return this.save()
}

const Review = mongoose.model('Review', reviewSchema)
export default Review
