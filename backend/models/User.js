// CampusKarma User Model
// Purpose: Core user entity with trust, skills, and verification

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  // Firebase Integration
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness
    index: true
  },

  // Basic Information
  name: {
    type: String,
    required: function() {
      // Name required only if firebaseUid is not present (legacy users)
      return !this.firebaseUid;
    },
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Support multiple college email formats
        const collegeEmailPatterns = [
          /^[^\s@]+@[^\s@]+\.edu$/i,
          /^[^\s@]+@[^\s@]+\.edu\.in$/i,
          /^[^\s@]+@[^\s@]+\.ac\.in$/i,
          /^[^\s@]+@[^\s@]+\.vce\.ac\.in$/i
        ];
        return collegeEmailPatterns.some(pattern => pattern.test(email));
      },
      message: 'Only college email addresses (.edu, .ac.in, .edu.in) are allowed'
    }
  },

  // Email verification status (from Firebase)
  emailVerified: {
    type: Boolean,
    default: false
  },

  // Profile picture (from Firebase or uploaded)
  profilePicture: {
    type: String,
    default: ''
  },

  // College Information
  college: {
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true
    },
    domain: {
      type: String,
      required: true,
      lowercase: true
    },
    city: String,
    state: String
  },

  // Profile Information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  
  profileImage: {
    type: String,
    default: null
  },

  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Postgraduate'],
    required: true
  },

  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },

  // Trust & Reputation System
  karmaScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },

  trustLevel: {
    type: String,
    enum: ['Newbie', 'Trusted', 'Verified', 'Expert', 'Master'],
    default: 'Newbie'
  },

  // Skills & Verification
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Design', 'Development', 'Writing', 'Marketing', 'Tutoring', 'Photography', 'Video Editing', 'Music', 'Other'],
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    quizScore: {
      type: Number,
      min: 0,
      max: 100
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3
    }
  }],

  // Activity & Statistics
  tasksCompleted: {
    type: Number,
    default: 0
  },
  
  tasksPosted: {
    type: Number,
    default: 0
  },

  totalEarnings: {
    type: Number,
    default: 0
  },

  totalSpent: {
    type: Number,
    default: 0
  },

  // Reviews & Ratings
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  reviewCount: {
    type: Number,
    default: 0
  },

  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // Security & Anti-Fraud
  loginAttempts: {
    type: Number,
    default: 0
  },

  lockoutUntil: Date,
  magicLinkToken: String,
  magicLinkExpires: Date,
  
  // OTP Authentication (fallback)
  otp: String,
  otpExpires: Date,
  otpAttempts: {
    type: Number,
    default: 0
  },

  // Social Links (Optional)
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    instagram: String
  },

  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    taskNotifications: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },

  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
userSchema.index({ 'college.domain': 1 })
userSchema.index({ karmaScore: -1 })
userSchema.index({ createdAt: -1 })
userSchema.index({ 'skills.name': 1, 'skills.verified': 1 })

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockoutUntil && this.lockoutUntil > Date.now())
})

// Virtual for trust badge
userSchema.virtual('trustBadge').get(function() {
  if (this.karmaScore >= 90) return 'Master'
  if (this.karmaScore >= 80) return 'Expert'
  if (this.karmaScore >= 70) return 'Verified'
  if (this.karmaScore >= 60) return 'Trusted'
  return 'Newbie'
})

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Update trust level based on karma score
  if (this.karmaScore >= 90) this.trustLevel = 'Master'
  else if (this.karmaScore >= 80) this.trustLevel = 'Expert'
  else if (this.karmaScore >= 70) this.trustLevel = 'Verified'
  else if (this.karmaScore >= 60) this.trustLevel = 'Trusted'
  else this.trustLevel = 'Newbie'

  // Update last active
  this.lastActive = new Date()
  
  next()
})

// Instance methods
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockoutUntil && this.lockoutUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockoutUntil: 1 },
      $set: { loginAttempts: 1 }
    })
  }
  
  const updates = { $inc: { loginAttempts: 1 } }
  
  // If we have hit max attempts and it's not locked, lock the account
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5
  const lockoutHours = parseFloat(process.env.LOCKOUT_TIME_HOURS) || 1
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockoutUntil: Date.now() + (lockoutHours * 60 * 60 * 1000) }
  }
  
  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockoutUntil: 1 }
  })
}

userSchema.methods.updateKarmaScore = function(change, reason) {
  const newScore = Math.max(0, Math.min(100, this.karmaScore + change))
  this.karmaScore = newScore
  
  // Log karma change for audit trail
  console.log(`Karma updated for ${this.email}: ${change} (${reason}). New score: ${newScore}`)
  
  return this.save()
}

userSchema.methods.verifySkill = function(skillName, quizScore) {
  const skill = this.skills.find(s => s.name === skillName)
  if (skill && quizScore >= 70) {
    skill.verified = true
    skill.verificationDate = new Date()
    skill.quizScore = quizScore
    
    // Increase karma for skill verification
    this.updateKarmaScore(5, 'Skill verification')
  }
  return this.save()
}

// Clean user data for API responses (remove sensitive fields)
userSchema.methods.toCleanJSON = function() {
  const user = this.toObject()
  delete user.magicLinkToken
  delete user.magicLinkExpires
  delete user.otp
  delete user.otpExpires
  delete user.otpAttempts
  delete user.loginAttempts
  delete user.lockoutUntil
  return user
}

const User = mongoose.model('User', userSchema)
export default User
