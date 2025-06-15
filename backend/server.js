// SkillLance Server - Main Entry Point
// Purpose: Express server with security, middleware, and route configuration

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import winston from 'winston'
import dotenv from 'dotenv'

// Import configurations and services
import db from './config/database.js'
// import authService from './utils/authService.js' // Temporarily disabled

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import taskRoutes from './routes/tasks.js'
import skillRoutes from './routes/skills.js'
import firebaseAuthRoutes from './routes/firebaseAuth.js'

// Import middleware
import { authErrorHandler } from './middleware/auth.js'

// Import route handlers (we'll create these next)
// import authRoutes from './routes/auth.js'
// import userRoutes from './routes/users.js'
// import taskRoutes from './routes/tasks.js'
// import skillRoutes from './routes/skills.js'

// Load environment variables
dotenv.config()

// Initialize logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
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

class CampusKarmaServer {
  constructor() {
    this.app = express()
    this.server = createServer(this.app)
    this.io = new SocketServer(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    })
    this.port = process.env.PORT || 5000
    
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeSocketIO()
    this.initializeErrorHandling()
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "ws:", "wss:"]
        }
      },
      crossOriginEmbedderPolicy: false
    }))

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
      },
      standardHeaders: true,
      legacyHeaders: false
    })
    this.app.use(limiter)

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Compression
    this.app.use(compression())

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
      next()
    })

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const dbStatus = db.getConnectionStatus()
      res.json({
        success: true,
        message: 'CampusKarma API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1',
        database: dbStatus,
        environment: process.env.NODE_ENV
      })
    })
  }

  initializeRoutes() {
    // API version prefix
    const apiVersion = process.env.API_VERSION || 'v1'
    const apiPrefix = `/api/${apiVersion}`

    // Welcome endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '🎯 Welcome to CampusKarma API',
        tagline: 'Turn Your Skills Into Karma',
        version: apiVersion,
        documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/docs`,        endpoints: {
          health: '/health',
          auth: `${apiPrefix}/auth`,
          firebaseAuth: `${apiPrefix}/firebase-auth`,
          users: `${apiPrefix}/users`,
          tasks: `${apiPrefix}/tasks`,
          skills: `${apiPrefix}/skills`
        }
      })
    })    // API Routes
    this.app.use(`${apiPrefix}/auth`, authRoutes)
    this.app.use(`${apiPrefix}/firebase-auth`, firebaseAuthRoutes)
    this.app.use(`${apiPrefix}/users`, userRoutes)
    this.app.use(`${apiPrefix}/tasks`, taskRoutes)
    this.app.use(`${apiPrefix}/skills`, skillRoutes)

    // Temporary route for testing
    this.app.get(`${apiPrefix}/test`, (req, res) => {
      res.json({
        success: true,
        message: 'CampusKarma API test endpoint',
        timestamp: new Date().toISOString()
      })
    })

    // 404 handler for API routes
    this.app.use(`${apiPrefix}/*`, (req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        endpoint: req.originalUrl
      })
    })
  }  initializeSocketIO() {
    // Socket.IO authentication middleware (simplified for now)
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error('Authentication error'))
        }

        // Simplified token verification for now
        socket.userId = 'temp-user-id'
        socket.userEmail = 'temp-email'
        next()
      } catch (error) {
        logger.error('Socket authentication error:', error)
        next(new Error('Authentication failed'))
      }
    })

    // Socket.IO connection handling
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.userEmail}`)

      // Join user-specific room for notifications
      socket.join(`user_${socket.userId}`)

      // Handle real-time events
      socket.on('join_task_room', (taskId) => {
        socket.join(`task_${taskId}`)
        logger.info(`User ${socket.userEmail} joined task room: ${taskId}`)
      })

      socket.on('leave_task_room', (taskId) => {
        socket.leave(`task_${taskId}`)
        logger.info(`User ${socket.userEmail} left task room: ${taskId}`)
      })

      socket.on('send_message', (data) => {
        // Handle real-time messaging
        this.io.to(`task_${data.taskId}`).emit('new_message', {
          ...data,
          senderId: socket.userId,
          timestamp: new Date()
        })
      })

      socket.on('place_bid', (data) => {
        // Handle real-time bidding
        this.io.to(`task_${data.taskId}`).emit('new_bid', {
          ...data,
          bidderId: socket.userId,
          timestamp: new Date()
        })
      })

      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.userEmail}`)
      })
    })
  }

  initializeErrorHandling() {
    // Authentication error handler
    this.app.use(authErrorHandler)

    // Global error handler
    this.app.use((error, req, res, next) => {
      logger.error('Unhandled error:', error)

      // Mongoose validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors
        })
      }

      // Mongoose duplicate key error
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]
        return res.status(400).json({
          success: false,
          message: `${field} already exists`
        })
      }

      // Default error response
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      })
    })

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully')
      this.server.close(() => {
        logger.info('Process terminated')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully')
      this.server.close(() => {
        logger.info('Process terminated')
        process.exit(0)
      })
    })
  }

  async start() {
    try {
      // Connect to database
      await db.connect()
      
      // Start server
      this.server.listen(this.port, () => {
        logger.info(`🚀 CampusKarma Server running on port ${this.port}`)
        logger.info(`📱 Environment: ${process.env.NODE_ENV}`)
        logger.info(`🗄️  Database: ${db.getConnectionStatus().name}`)
        logger.info(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
        logger.info(`⚡ Socket.IO enabled for real-time features`)
        
        if (process.env.NODE_ENV === 'development') {
          logger.info(`📖 API Documentation: http://localhost:${this.port}/api/v1`)
          logger.info(`🔧 Health Check: http://localhost:${this.port}/health`)
        }
      })
    } catch (error) {
      logger.error('Failed to start server:', error)
      process.exit(1)
    }
  }
}

// Create and start server
const server = new CampusKarmaServer()
server.start()

// Export for testing
export default server
