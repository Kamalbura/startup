// Vercel Serverless Function Entry Point for SkillLance API - Week 4 Enhanced
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import winston from 'winston'
import dotenv from 'dotenv'

// Import enhanced database manager
import db from './config/database.js'

// Import routes
import anonymousRoutes from './routes/anonymousRequests.js'
// TODO: import authRoutes from './routes/auth.js'
// TODO: import userRoutes from './routes/users.js'

// Import middleware
// TODO: import { authErrorHandler } from './middleware/auth.js'

// Configure environment
dotenv.config()

// Enhanced Winston logger for production
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

// Create Express app
const app = express()

// Trust proxy (critical for Vercel deployment)
app.set('trust proxy', 1)

// Database connection management for serverless
let dbConnected = false
const ensureDBConnection = async () => {
  if (!dbConnected) {
    try {
      logger.info('🔄 Establishing database connection...')
      await db.connect()
      dbConnected = true
      logger.info('✅ Database connection established')
      return true
    } catch (error) {
      logger.error('❌ Database connection failed:', error.message)
      return false
    }
  }
  return true
}

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://campuskarma.vercel.app',
        'https://campuskarma-frontend.vercel.app',
        'https://campuskarma.burakamal.site',
        'https://skilllance.vercel.app',
        'https://skilllance-frontend.vercel.app',
        process.env.FRONTEND_URL // Allow dynamic frontend URL from env var
      ].filter(Boolean) // Remove any undefined/null values
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  next()
})

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await ensureDBConnection()
    const dbHealth = await checkDBHealth()
    
    res.json({
      success: true,
      message: 'SkillLance API is running',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
      database: dbHealth,
      environment: process.env.NODE_ENV,
      vercel: true
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service health check failed',
      error: error.message
    })
  }
})

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🎯 Welcome to CampusKarma API',
    tagline: 'Turn Your Skills Into Karma',
    version: process.env.API_VERSION || 'v1',
    environment: process.env.NODE_ENV,
    platform: 'Vercel Serverless',
    endpoints: {
      health: '/api/health',
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      tasks: '/api/v1/tasks',
      skills: '/api/v1/skills'
    }
  })
})

// API version prefix
const apiVersion = process.env.API_VERSION || 'v1'
const apiPrefix = `/api/${apiVersion}`

// Middleware to ensure DB connection for all API routes
app.use(apiPrefix, async (req, res, next) => {
  try {
    await ensureDBConnection()
    next()
  } catch (error) {
    logger.error('Database connection error:', error)
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    })
  }
})

// API Routes
// app.use(`${apiPrefix}/auth`, authRoutes)  // TODO: Add auth routes
app.use(`${apiPrefix}/anonymous`, anonymousRoutes)

// Test endpoint
app.get(`${apiPrefix}/test`, (req, res) => {
  res.json({
    success: true,
    message: 'CampusKarma API test endpoint',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    platform: 'Vercel Serverless'
  })
})

// 404 handler for API routes
app.use(`${apiPrefix}/*`, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    endpoint: req.originalUrl
  })
})

// Error handling middleware
// app.use(authErrorHandler)  // TODO: Add auth error handler

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error)
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(isDevelopment && {
      stack: error.stack,
      details: error
    })
  })
})

// Handle 404 for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    endpoint: req.originalUrl
  })
})

// Export the Express app for Vercel
export default app
