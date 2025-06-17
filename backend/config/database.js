// SkillLance Database Configuration - Week 4 Update
// Purpose: Robust MongoDB Atlas connection with Mongoose ODM + Native Client support
// Features: Connection pooling, health monitoring, automatic reconnection, operation testing

import mongoose from 'mongoose'
import { MongoClient, ServerApiVersion } from 'mongodb'
import winston from 'winston'

// Enhanced logger configuration
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

class SkillLanceDatabaseManager {
  constructor() {
    this.isConnected = false
    this.connectionAttempts = 0
    this.maxRetries = 5
    this.mongoClient = null
    this.retryInterval = 5000
    this.healthCheck = {
      lastCheck: null,
      status: 'unknown',
      latency: 0
    }
  }

  async connect() {
    if (this.isConnected) {
      logger.info('✅ Database already connected')
      return this.getHealthStatus()
    }

    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      const error = '❌ MONGODB_URI environment variable is not set'
      logger.error(error)
      throw new Error(error)
    }

    // Enhanced connection options
    const mongooseOptions = {
      maxPoolSize: 15, // Increased pool size for better performance
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
      readPreference: 'primary',
      compressors: ['zlib'], // Enable compression
      zlibCompressionLevel: 6
    }

    const clientOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 15,
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      compressors: ['zlib'],
      zlibCompressionLevel: 6
    }

    try {
      const startTime = Date.now()
      
      logger.info('🔗 Connecting to SkillLance MongoDB Atlas...')
      logger.info('📍 Target Database: skilllance')
      
      // Connect Mongoose ODM
      logger.info('⚡ Initializing Mongoose ODM...')
      await mongoose.connect(mongoUri, mongooseOptions)
      
      // Connect MongoDB Native Client
      logger.info('⚡ Initializing MongoDB Native Client...')
      this.mongoClient = new MongoClient(mongoUri, clientOptions)
      await this.mongoClient.connect()
      
      // Verify connection with ping
      await this.mongoClient.db("admin").command({ ping: 1 })
      
      const connectionTime = Date.now() - startTime
      this.isConnected = true
      this.connectionAttempts = 0
      this.healthCheck.lastCheck = new Date()
      this.healthCheck.status = 'healthy'
      this.healthCheck.latency = connectionTime
      
      logger.info('🚀 SkillLance Database connected successfully!')
      logger.info(`✅ Connection Time: ${connectionTime}ms`)
      logger.info('✅ Mongoose ODM: Ready')
      logger.info('✅ MongoDB Client: Ready')
      logger.info(`📊 Database: ${this.mongoClient.db().databaseName}`)
      logger.info(`🔗 Cluster: ${mongoUri.match(/@(.+?)\.mongodb\.net/)?.[1] || 'unknown'}`)
      
      this.setupEventListeners()
      await this.performInitialHealthCheck()
      
      return this.getHealthStatus()
      
    } catch (error) {
      this.connectionAttempts++
      this.healthCheck.status = 'error'
      this.healthCheck.lastCheck = new Date()
      
      logger.error(`❌ Database connection failed (attempt ${this.connectionAttempts}/${this.maxRetries})`)
      logger.error(`🔍 Error: ${error.message}`)
      
      if (this.connectionAttempts < this.maxRetries) {
        logger.info(`🔄 Retrying in ${this.retryInterval / 1000} seconds...`)
        setTimeout(() => this.connect(), this.retryInterval)
      } else {
        logger.error('💥 Max connection attempts reached!')
        logger.error('💡 Check your MongoDB Atlas cluster status and network connectivity')
        throw error
      }
    }
  }

  setupEventListeners() {
    // Mongoose events
    mongoose.connection.on('error', (error) => {
      logger.error('🔥 Mongoose error:', error.message)
      this.isConnected = false
      this.healthCheck.status = 'error'
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Mongoose disconnected')
      this.isConnected = false
      this.healthCheck.status = 'disconnected'
      this.handleReconnection()
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 Mongoose reconnected')
      this.isConnected = true
      this.healthCheck.status = 'healthy'
    })

    // MongoDB Client events
    if (this.mongoClient) {
      this.mongoClient.on('error', (error) => {
        logger.error('🔥 MongoDB client error:', error.message)
      })

      this.mongoClient.on('close', () => {
        logger.warn('⚠️ MongoDB client closed')
      })

      this.mongoClient.on('reconnect', () => {
        logger.info('🔄 MongoDB client reconnected')
      })
    }

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      logger.info(`🛑 Received ${signal}. Shutting down gracefully...`)
      await this.disconnect()
      process.exit(0)
    }

    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  }

  async handleReconnection() {
    if (!this.isConnected && this.connectionAttempts < this.maxRetries) {
      logger.info('🔄 Attempting automatic reconnection...')
      setTimeout(() => this.connect(), this.retryInterval)
    }
  }

  async disconnect() {
    try {
      logger.info('🔌 Disconnecting from database...')
      
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close()
        logger.info('✅ Mongoose disconnected')
      }

      if (this.mongoClient) {
        await this.mongoClient.close()
        logger.info('✅ MongoDB client disconnected')
      }

      this.isConnected = false
      this.healthCheck.status = 'disconnected'
      
    } catch (error) {
      logger.error('❌ Error during disconnect:', error.message)
    }
  }

  // Enhanced health status with detailed metrics
  getHealthStatus() {
    const mongooseState = mongoose.connection.readyState
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    return {
      isConnected: this.isConnected,
      status: this.healthCheck.status,
      lastCheck: this.healthCheck.lastCheck,
      latency: this.healthCheck.latency,
      mongoose: {
        state: mongooseState,
        stateText: stateMap[mongooseState],
        database: mongoose.connection.db?.databaseName,
        host: mongoose.connection.host,
        collections: mongoose.connection.db?.collections?.length || 0
      },
      nativeClient: {
        isConnected: !!this.mongoClient && this.isConnected,
        database: this.mongoClient?.db()?.databaseName
      },
      connectionAttempts: this.connectionAttempts,
      maxRetries: this.maxRetries,
      timestamp: new Date().toISOString()
    }
  }

  // Get MongoDB native client for direct operations
  getMongoClient() {
    if (!this.mongoClient || !this.isConnected) {
      throw new Error('MongoDB client not available')
    }
    return this.mongoClient
  }

  // Get specific database
  getDatabase(dbName = 'skilllance') {
    return this.getMongoClient().db(dbName)
  }

  // Comprehensive health check with operation testing
  async performInitialHealthCheck() {
    try {
      logger.info('🔍 Performing initial health check...')
      
      const db = this.getDatabase()
      const startTime = Date.now()
      
      // Test basic operations
      const testCollection = db.collection('health_check')
      
      // Write test
      const testDoc = { 
        test: true, 
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
      }
      const insertResult = await testCollection.insertOne(testDoc)
      
      // Read test
      const findResult = await testCollection.findOne({ _id: insertResult.insertedId })
      
      // Update test
      await testCollection.updateOne(
        { _id: insertResult.insertedId },
        { $set: { updated: true } }
      )
      
      // Delete test (cleanup)
      await testCollection.deleteOne({ _id: insertResult.insertedId })
      
      const operationTime = Date.now() - startTime
      
      logger.info('✅ Database operations test completed')
      logger.info(`⚡ Operation time: ${operationTime}ms`)
      
      // Update health metrics
      this.healthCheck.latency = operationTime
      this.healthCheck.status = 'healthy'
      
      return {
        read: !!findResult,
        write: !!insertResult.insertedId,
        update: true,
        delete: true,
        operationTime
      }
      
    } catch (error) {
      logger.error('❌ Health check failed:', error.message)
      this.healthCheck.status = 'unhealthy'
      throw error
    }
  }

  // Get database statistics
  async getDatabaseStats() {
    try {
      const db = this.getDatabase()
      const stats = await db.stats()
      const collections = await db.listCollections().toArray()
      
      return {
        database: stats.db,
        collections: collections.length,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        collectionsDetail: collections.map(col => col.name)
      }
    } catch (error) {
      logger.error('❌ Failed to get database stats:', error.message)
      throw error
    }
  }
}

// Export singleton instance
const db = new SkillLanceDatabaseManager()
export default db

// Additional utility exports
export { SkillLanceDatabaseManager }
export const connectDatabase = () => db.connect()
export const disconnectDatabase = () => db.disconnect()
export const getDatabaseHealth = () => db.getHealthStatus()
export const getMongoClient = () => db.getMongoClient()
export const getDatabase = (dbName) => db.getDatabase(dbName)
