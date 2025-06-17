// SkillLance Modern Server Architecture
// Purpose: New server implementation using clean architecture principles

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import winston from 'winston'
import dotenv from 'dotenv'

// Import configurations and utilities
import db from '../config/database.js'
import { errorHandler, notFoundHandler } from './errors/index.js'
import { ResponseHelper } from './utils/response.js'

// Import routes
import anonymousRequestRoutes from './routes/anonymousRequests.js'

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

/**
 * Modern SkillLance Server with Clean Architecture
 */
export class ModernSkillLanceServer {
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
    this.initializeErrorHandling()
    this.initializeSocketIO()
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

    // Global rate limiting
    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
      },
      standardHeaders: true,
      legacyHeaders: false
    })
    this.app.use(globalLimiter)

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
  }

  initializeRoutes() {
    // API version
    const apiVersion = process.env.API_VERSION || 'v1'
    const apiPrefix = `/api/${apiVersion}`

    // Welcome endpoint
    this.app.get('/', (req, res) => {
      return ResponseHelper.success(res, '🎯 Welcome to SkillLance API (Modern Architecture)', {
        tagline: 'Privacy-First Student Help Platform',
        version: apiVersion,
        architecture: 'Clean Architecture with DDD patterns',
        features: [
          'Anonymous Request System',
          'Firebase Authentication',
          'Real-time Features',
          'Advanced Search',
          'Privacy Protection'
        ],
        documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/docs`,
        endpoints: {
          health: '/health',
          anonymous: `${apiPrefix}/anonymous`,
          auth: `${apiPrefix}/auth`,
          users: `${apiPrefix}/users`,
          tasks: `${apiPrefix}/tasks`
        }
      })
    })

    // Global health check
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = db.getHealthStatus()
        const dbStats = await db.getDatabaseStats().catch(() => null)
        
        return ResponseHelper.success(res, 'SkillLance API is healthy', {
          timestamp: new Date().toISOString(),
          version: apiVersion,
          architecture: 'Modern Clean Architecture',
          database: {
            ...dbHealth,
            stats: dbStats
          },
          environment: process.env.NODE_ENV,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          server: {
            port: this.port,
            cors: process.env.CORS_ORIGIN
          }
        })
      } catch (error) {
        logger.error('Health check error:', error)
        return ResponseHelper.success(res, 'SkillLance API is running with limited functionality', {
          timestamp: new Date().toISOString(),
          error: error.message
        }, 206) // Partial Content
      }
    })

    // API Routes
    this.app.use(`${apiPrefix}/anonymous`, anonymousRequestRoutes)

    // API Documentation placeholder
    this.app.get(`${apiPrefix}/docs`, (req, res) => {
      return ResponseHelper.success(res, 'API Documentation', {
        message: 'Interactive API documentation coming soon',
        swagger: `${req.protocol}://${req.get('host')}${apiPrefix}/swagger`,
        postman: 'Postman collection available on request'
      })
    })

    // Test endpoint for monitoring
    this.app.get(`${apiPrefix}/test`, (req, res) => {
      return ResponseHelper.success(res, 'SkillLance Modern API test endpoint', {
        timestamp: new Date().toISOString(),
        architecture: 'Clean Architecture',
        status: 'operational'
      })
    })

    // 404 handler for API routes
    this.app.use(`${apiPrefix}/*`, notFoundHandler)
  }

  initializeErrorHandling() {
    // Global error handler (must be last)
    this.app.use(errorHandler)

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

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
      process.exit(1)
    })

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error)
      process.exit(1)
    })
  }

  initializeSocketIO() {
    // Socket.IO connection handling
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`)

      // Handle anonymous request events
      socket.on('join_request_room', (requestId) => {
        socket.join(`request_${requestId}`)
        logger.info(`Socket ${socket.id} joined request room: ${requestId}`)
      })

      socket.on('leave_request_room', (requestId) => {
        socket.leave(`request_${requestId}`)
        logger.info(`Socket ${socket.id} left request room: ${requestId}`)
      })

      socket.on('new_response', (data) => {
        // Broadcast new response to request room
        this.io.to(`request_${data.requestId}`).emit('response_added', {
          requestId: data.requestId,
          responseId: data.responseId,
          timestamp: new Date()
        })
      })

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`)
      })
    })
  }

  async start() {
    try {
      logger.info('🚀 Starting SkillLance Modern Server...')
      
      // Connect to database
      let dbHealth = null
      try {
        dbHealth = await db.connect()
        logger.info('📊 Database connected successfully')
        
        if (db.startHealthMonitoring) {
          db.startHealthMonitoring(60000) // Monitor every minute
        }
      } catch (dbError) {
        logger.error('⚠️ Database connection failed:', dbError.message)
        dbHealth = { status: 'disconnected', error: dbError.message }
      }

      // Start server
      this.server.listen(this.port, () => {
        logger.info(`🎉 SkillLance Modern Server running on port ${this.port}`)
        logger.info(`🏗️  Architecture: Clean Architecture with DDD`)
        logger.info(`📱 Environment: ${process.env.NODE_ENV}`)
        logger.info(`🗄️  Database: ${dbHealth?.mongoose?.database || 'skilllance'}`)
        logger.info(`⚡ Database Status: ${dbHealth?.status || 'unknown'}`)
        logger.info(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
        logger.info(`🔥 Socket.IO enabled for real-time features`)
        
        if (process.env.NODE_ENV === 'development') {
          logger.info(`📖 API: http://localhost:${this.port}/api/v1`)
          logger.info(`🔧 Health: http://localhost:${this.port}/health`)
          logger.info(`🎯 Anonymous: http://localhost:${this.port}/api/v1/anonymous`)
          logger.info(`📚 Docs: http://localhost:${this.port}/api/v1/docs`)
        }
        
        logger.info('✅ SkillLance Modern Backend Ready!')
        
        if (!dbHealth || dbHealth.status !== 'healthy') {
          logger.warn('⚠️ Note: Database is not connected. Some features may be limited.')
        }
      })

    } catch (error) {
      logger.error('❌ Failed to start server:', error)
      process.exit(1)
    }
  }
}

// Export for use in other files
export default ModernSkillLanceServer
