// Database configuration for Vercel serverless deployment
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

let cachedConnection = null

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    // Check for SKIP_DB flag first
    if (process.env.SKIP_DB === 'true') {
      console.log('⚠️ Database connection skipped (SKIP_DB=true)')
      return null
    }

    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not defined')
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')))
      throw new Error('MONGODB_URI environment variable is not defined')
    }

    console.log('🔄 Connecting to MongoDB...')
    console.log('📍 URI preview:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//[CREDENTIALS]@'))
    
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      retryWrites: true,
      w: 'majority'
    })

    cachedConnection = connection
    console.log('✅ MongoDB connected successfully')
    console.log('📊 Connection state:', mongoose.connection.readyState)
    console.log('🏛️ Database name:', mongoose.connection.db.databaseName)
    
    return connection

  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      reason: error.reason?.message
    })
    
    // Don't throw in production, just log and continue
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Continuing without database in production mode')
      return null
    }
    
    throw error
  }
}

// Health check function
export const checkDBHealth = async () => {
  try {
    if (!cachedConnection) {
      return { status: 'disconnected', message: 'No connection established' }
    }
    
    const admin = mongoose.connection.db.admin()
    await admin.ping()
    
    return {
      status: 'connected',
      message: 'Database is healthy',
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      readyState: mongoose.connection.readyState
    }
  }
}

// Graceful shutdown for serverless
process.on('SIGINT', async () => {
  if (cachedConnection) {
    await mongoose.connection.close()
    console.log('📤 MongoDB connection closed due to app termination')
  }
})

export default connectDB
