// CampusKarma Skill Model
// Purpose: Skills catalog and quiz management for verification

import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema({
  // Basic Skill Information
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Skill name must be at least 2 characters'],
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },

  category: {
    type: String,
    enum: ['Design', 'Development', 'Writing', 'Marketing', 'Tutoring', 'Photography', 'Video Editing', 'Music', 'Other'],
    required: [true, 'Skill category is required']
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Skill Levels & Progression
  levels: [{
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    description: String,
    requiredScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    }
  }],

  // Quiz Questions for Verification
  quiz: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    
    questionType: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'short_answer'],
      default: 'multiple_choice'
    },
    
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    
    correctAnswer: String, // For short answer questions
    
    explanation: {
      type: String,
      trim: true
    },
    
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    },
    
    points: {
      type: Number,
      default: 10,
      min: 1,
      max: 20
    }
  }],

  // Skill Metrics
  totalUsers: {
    type: Number,
    default: 0
  },

  verifiedUsers: {
    type: Number,
    default: 0
  },

  averageQuizScore: {
    type: Number,
    default: 0
  },

  // Popularity & Demand
  demandLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },

  avgTaskBudget: {
    type: Number,
    default: 0
  },

  totalTasksPosted: {
    type: Number,
    default: 0
  },

  // Status & Moderation
  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // Skill Tags & Related Skills
  tags: [String],
  
  relatedSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],

  // Prerequisites
  prerequisites: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    minLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
skillSchema.index({ category: 1 })
skillSchema.index({ demandLevel: -1 })
skillSchema.index({ totalUsers: -1 })
skillSchema.index({ isActive: 1 })

// Virtual for verification rate
skillSchema.virtual('verificationRate').get(function() {
  if (this.totalUsers === 0) return 0
  return Math.round((this.verifiedUsers / this.totalUsers) * 100)
})

// Virtual for quiz question count by difficulty
skillSchema.virtual('quizStats').get(function() {
  const stats = {
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0,
    Expert: 0,
    total: this.quiz.length
  }
  
  this.quiz.forEach(q => {
    stats[q.difficulty] = (stats[q.difficulty] || 0) + 1
  })
  
  return stats
})

// Static methods
skillSchema.statics.getPopularSkills = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalUsers: -1, verifiedUsers: -1 })
    .limit(limit)
    .select('name category totalUsers verifiedUsers demandLevel')
}

skillSchema.statics.getSkillsByCategory = async function(category) {
  return this.find({ category, isActive: true })
    .sort({ totalUsers: -1 })
    .select('name description totalUsers verifiedUsers demandLevel')
}

skillSchema.statics.searchSkills = async function(query) {
  const searchRegex = new RegExp(query, 'i')
  
  return this.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } }
    ],
    isActive: true
  })
  .sort({ totalUsers: -1 })
  .limit(20)
}

// Instance methods
skillSchema.methods.generateQuiz = function(difficulty = 'mixed', questionCount = 5) {
  let questions = []
  
  if (difficulty === 'mixed') {
    // Get questions from all difficulties
    const beginnerQs = this.quiz.filter(q => q.difficulty === 'Beginner')
    const intermediateQs = this.quiz.filter(q => q.difficulty === 'Intermediate')
    const advancedQs = this.quiz.filter(q => q.difficulty === 'Advanced')
    const expertQs = this.quiz.filter(q => q.difficulty === 'Expert')
    
    // Distribute questions across difficulties
    questions = [
      ...this.shuffleArray(beginnerQs).slice(0, Math.ceil(questionCount * 0.4)),
      ...this.shuffleArray(intermediateQs).slice(0, Math.ceil(questionCount * 0.3)),
      ...this.shuffleArray(advancedQs).slice(0, Math.ceil(questionCount * 0.2)),
      ...this.shuffleArray(expertQs).slice(0, Math.ceil(questionCount * 0.1))
    ]
  } else {
    // Get questions from specific difficulty
    const filteredQuestions = this.quiz.filter(q => q.difficulty === difficulty)
    questions = this.shuffleArray(filteredQuestions).slice(0, questionCount)
  }
  
  // Shuffle final question order
  questions = this.shuffleArray(questions).slice(0, questionCount)
  
  // Remove correct answers from response (security)
  return questions.map(q => ({
    _id: q._id,
    question: q.question,
    questionType: q.questionType,
    options: q.questionType === 'multiple_choice' ? 
      q.options.map(opt => ({ text: opt.text })) : undefined,
    difficulty: q.difficulty,
    points: q.points
  }))
}

skillSchema.methods.shuffleArray = function(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

skillSchema.methods.evaluateQuiz = function(answers) {
  let score = 0
  let totalPoints = 0
  const results = []
  
  answers.forEach(answer => {
    const question = this.quiz.id(answer.questionId)
    if (!question) return
    
    totalPoints += question.points
    let isCorrect = false
    
    if (question.questionType === 'multiple_choice') {
      const selectedOption = question.options.find(opt => opt.text === answer.selectedOption)
      isCorrect = selectedOption && selectedOption.isCorrect
    } else if (question.questionType === 'true_false') {
      const selectedOption = question.options.find(opt => opt.text === answer.selectedOption)
      isCorrect = selectedOption && selectedOption.isCorrect
    } else if (question.questionType === 'short_answer') {
      // Simple text matching (could be enhanced with fuzzy matching)
      isCorrect = answer.textAnswer && 
        answer.textAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
    }
    
    if (isCorrect) {
      score += question.points
    }
    
    results.push({
      questionId: question._id,
      question: question.question,
      isCorrect,
      explanation: question.explanation,
      points: question.points,
      earned: isCorrect ? question.points : 0
    })
  })
  
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
  
  return {
    score: percentage,
    totalQuestions: answers.length,
    correctAnswers: results.filter(r => r.isCorrect).length,
    results,
    passed: percentage >= 70
  }
}

skillSchema.methods.updateStats = async function() {
  // This would typically be called when user skill records are updated
  // For now, we'll implement basic logic
  const User = mongoose.model('User')
  
  const userSkills = await User.aggregate([
    { $unwind: '$skills' },
    { $match: { 'skills.name': this.name } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        verifiedUsers: { 
          $sum: { $cond: [{ $eq: ['$skills.verified', true] }, 1, 0] }
        },
        avgQuizScore: { $avg: '$skills.quizScore' }
      }
    }
  ])
  
  if (userSkills.length > 0) {
    const stats = userSkills[0]
    this.totalUsers = stats.totalUsers
    this.verifiedUsers = stats.verifiedUsers
    this.averageQuizScore = Math.round(stats.avgQuizScore || 0)
  }
  
  return this.save()
}

const Skill = mongoose.model('Skill', skillSchema)
export default Skill
