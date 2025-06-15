// SkillLance Database Configuration
// Purpose: MongoDB connection with production-ready settings

import mongoose from 'mongoose'
import winston from 'winston'

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

class DatabaseConnection {
  constructor() {
    this.isConnected = false
    this.connectionAttempts = 0
    this.maxRetries = 5
  }

  async connect() {
    if (this.isConnected) {
      logger.info('Database already connected')
      return
    }    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuskarma'
    
    const options = {
      // Removed deprecated options for modern MongoDB driver compatibility
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    }

    try {
      await mongoose.connect(mongoUri, options)
      this.isConnected = true
      this.connectionAttempts = 0
      
      logger.info('🚀 CampusKarma Database connected successfully')
      
      // Connection event listeners
      mongoose.connection.on('error', (error) => {
        logger.error('Database connection error:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected')
        this.isConnected = false
        this.handleReconnection()
      })

      mongoose.connection.on('reconnected', () => {
        logger.info('Database reconnected')
        this.isConnected = true
      })    } catch (error) {
      this.connectionAttempts++
      logger.error(`Database connection failed (attempt ${this.connectionAttempts}):`, error)
      
      if (this.connectionAttempts < this.maxRetries) {
        logger.info(`Retrying connection in 5 seconds...`)
        setTimeout(() => this.connect(), 5000)
      } else {
        logger.error('❌ Maximum database connection attempts reached. Server will continue without database.')
        logger.info('💡 To fix: Ensure MongoDB is running or update MONGODB_URI in .env')
        logger.info(`📝 Current MONGODB_URI: ${mongoUri}`)
        // Don't throw error, let server continue for development
      }
    }
  }

  async handleReconnection() {
    if (!this.isConnected && this.connectionAttempts < this.maxRetries) {
      logger.info('Attempting to reconnect to database...')
      setTimeout(() => this.connect(), 5000)
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.disconnect()
      this.isConnected = false
      logger.info('Database disconnected')
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  }
}

// Export singleton instance
const db = new DatabaseConnection()
export default db
