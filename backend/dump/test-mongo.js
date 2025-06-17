// Test MongoDB Atlas connection
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const testConnection = async () => {
  try {
    console.log('Testing MongoDB Atlas connection...')
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:]*@/, ':****@'))
    
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Atlas connected successfully!')
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const doc = new TestModel({ test: 'Connection test' })
    await doc.save()
    console.log('✅ Test document created successfully!')
    
    await TestModel.deleteOne({ _id: doc._id })
    console.log('✅ Test document deleted successfully!')
    
    await mongoose.connection.close()
    console.log('✅ MongoDB connection closed')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
