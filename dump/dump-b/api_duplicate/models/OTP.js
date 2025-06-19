// CampusKarma OTP Model
// Purpose: Store OTP verification data in MongoDB

import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    index: true
  },

  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true
    // TTL index is defined separately below
  },

  attempts: {
    type: Number,
    default: 0,
    max: 3
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  institution: {
    type: String,
    required: false
  },

  domain: {
    type: String,
    required: true
  },

  ipAddress: {
    type: String,
    required: false
  },

  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

// Indexes for performance and TTL
otpSchema.index({ email: 1, createdAt: -1 })
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Methods
otpSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt
}

otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1
  return this.save()
}

otpSchema.methods.markAsVerified = function() {
  this.isVerified = true
  return this.save()
}

export default mongoose.model('OTP', otpSchema)
