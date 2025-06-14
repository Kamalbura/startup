// Database configuration for Vercel serverless deployment
import mongoose from 'mongoose'

let cachedConnection = null

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined')
    }

    console.log('🔄 Connecting to MongoDB...')
    
    const connection = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    })

    cachedConnection = connection
    console.log('✅ MongoDB connected successfully')
    return connection

  } catch (error) {
    console.error('❌ Database connection error:', error.message)
    throw error
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
