// CampusKarma Task Model
// Purpose: Gig/task entity with bidding, escrow, and completion tracking

import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  // Basic Task Information
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  category: {
    type: String,
    enum: ['Design', 'Development', 'Writing', 'Marketing', 'Tutoring', 'Photography', 'Video Editing', 'Music', 'Other'],
    required: [true, 'Task category is required']
  },

  // Skills & Requirements
  skillsRequired: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],

  // Financial Information
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [50, 'Minimum budget is ₹50'],
      max: [50000, 'Maximum budget is ₹50,000']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    type: {
      type: String,
      enum: ['Fixed', 'Hourly'],
      default: 'Fixed'
    }
  },

  // Timeline
  deadline: {
    type: Date,
    required: [true, 'Task deadline is required'],
    validate: {
      validator: function(date) {
        return date > new Date()
      },
      message: 'Deadline must be in the future'
    }
  },

  estimatedHours: {
    type: Number,
    min: 1,
    max: 200
  },

  // Parties
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Task Status & Lifecycle
  status: {
    type: String,
    enum: ['Open', 'In Bidding', 'Assigned', 'In Progress', 'Under Review', 'Completed', 'Cancelled', 'Disputed'],
    default: 'Open'
  },

  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },

  // Bidding System
  bids: [{
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      maxlength: 500,
      trim: true
    },
    deliveryTime: {
      type: Number, // in hours
      required: true,
      min: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Active'
    }
  }],

  selectedBid: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  // Attachments & Files
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Work Submission
  deliverables: [{
    filename: String,
    originalName: String,
    url: String,
    fileType: String,
    fileSize: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Payment & Escrow
  escrow: {
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['None', 'Held', 'Released', 'Refunded'],
      default: 'None'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    heldAt: Date,
    releasedAt: Date
  },

  // Reviews & Ratings
  clientReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    createdAt: Date
  },

  workerReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    createdAt: Date
  },

  // College/Location Preferences
  collegePreference: {
    type: String,
    enum: ['Same College', 'Same City', 'Same State', 'Any'],
    default: 'Any'
  },

  location: {
    city: String,
    state: String,
    isRemote: {
      type: Boolean,
      default: true
    }
  },

  // Metrics & Analytics
  views: {
    type: Number,
    default: 0
  },

  bidCount: {
    type: Number,
    default: 0
  },

  // Completion Tracking
  startedAt: Date,
  completedAt: Date,
  reviewedAt: Date,

  // Flags & Moderation
  isFeatured: {
    type: Boolean,
    default: false
  },

  isUrgent: {
    type: Boolean,
    default: false
  },

  flags: [{
    reason: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
taskSchema.index({ postedBy: 1, createdAt: -1 })
taskSchema.index({ assignedTo: 1, status: 1 })
taskSchema.index({ status: 1, createdAt: -1 })
taskSchema.index({ category: 1, status: 1 })
taskSchema.index({ 'budget.amount': 1 })
taskSchema.index({ deadline: 1 })
taskSchema.index({ 'skillsRequired.name': 1 })

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  if (!this.deadline) return null
  const now = new Date()
  const deadline = new Date(this.deadline)
  const diff = deadline - now
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
})

// Virtual for average bid amount
taskSchema.virtual('averageBid').get(function() {
  if (!this.bids || this.bids.length === 0) return 0
  const activeBids = this.bids.filter(bid => bid.status === 'Active')
  if (activeBids.length === 0) return 0
  
  const total = activeBids.reduce((sum, bid) => sum + bid.amount, 0)
  return Math.round(total / activeBids.length)
})

// Virtual for lowest bid
taskSchema.virtual('lowestBid').get(function() {
  if (!this.bids || this.bids.length === 0) return null
  const activeBids = this.bids.filter(bid => bid.status === 'Active')
  if (activeBids.length === 0) return null
  
  return Math.min(...activeBids.map(bid => bid.amount))
})

// Pre-save middleware
taskSchema.pre('save', function(next) {
  // Update bid count
  this.bidCount = this.bids ? this.bids.filter(bid => bid.status === 'Active').length : 0
  
  // Set status based on conditions
  if (this.bidCount > 0 && this.status === 'Open') {
    this.status = 'In Bidding'
  }
  
  // Set urgent flag for tasks with deadline < 24 hours
  const timeToDeadline = new Date(this.deadline) - new Date()
  this.isUrgent = timeToDeadline < (24 * 60 * 60 * 1000)
  
  next()
})

// Instance methods
taskSchema.methods.addBid = function(bidderId, amount, message, deliveryTime) {
  // Check if user already has an active bid
  const existingBid = this.bids.find(
    bid => bid.bidderId.toString() === bidderId.toString() && bid.status === 'Active'
  )
  
  if (existingBid) {
    throw new Error('You already have an active bid on this task')
  }
  
  // Check if task is open for bidding
  if (!['Open', 'In Bidding'].includes(this.status)) {
    throw new Error('This task is not open for bidding')
  }
  
  // Add the bid
  this.bids.push({
    bidderId,
    amount,
    message,
    deliveryTime,
    status: 'Active'
  })
  
  return this.save()
}

taskSchema.methods.acceptBid = function(bidId) {
  const bid = this.bids.id(bidId)
  if (!bid || bid.status !== 'Active') {
    throw new Error('Invalid bid')
  }
  
  // Mark all other bids as rejected
  this.bids.forEach(b => {
    if (b._id.toString() !== bidId.toString()) {
      b.status = 'Rejected'
    } else {
      b.status = 'Accepted'
    }
  })
  
  // Update task status and assignment
  this.selectedBid = bidId
  this.assignedTo = bid.bidderId
  this.status = 'Assigned'
  this.startedAt = new Date()
  
  return this.save()
}

taskSchema.methods.submitWork = function(deliverables, submittedBy) {
  if (this.status !== 'In Progress') {
    throw new Error('Task is not in progress')
  }
  
  this.deliverables = deliverables.map(file => ({
    ...file,
    submittedBy
  }))
  
  this.status = 'Under Review'
  return this.save()
}

taskSchema.methods.completeTask = function(clientRating, clientComment) {
  if (this.status !== 'Under Review') {
    throw new Error('Task is not under review')
  }
  
  this.status = 'Completed'
  this.completedAt = new Date()
  this.clientReview = {
    rating: clientRating,
    comment: clientComment,
    createdAt: new Date()
  }
  
  return this.save()
}

const Task = mongoose.model('Task', taskSchema)
export default Task
