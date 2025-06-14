// MongoDB Atlas Connection Test
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...')
    console.log('Connection string:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'))
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    })
    
    console.log('✅ MongoDB Atlas connected successfully!')
    console.log('Database:', mongoose.connection.name)
    console.log('Host:', mongoose.connection.host)
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String })
    const TestModel = mongoose.model('Test', testSchema)
    
    const testDoc = new TestModel({ test: 'Connection successful!' })
    await testDoc.save()
    console.log('✅ Test document created successfully!')
    
    await TestModel.deleteOne({ _id: testDoc._id })
    console.log('✅ Test document deleted successfully!')
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:')
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
    
    // Specific error handling
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Fix: Check your username and password in the connection string')
    }
    if (error.message.includes('IP address') || error.message.includes('not allowed')) {
      console.log('\n🔧 Fix: Add your IP address to MongoDB Atlas Network Access')
      console.log('   1. Go to Network Access in MongoDB Atlas')
      console.log('   2. Click "Add IP Address"')
      console.log('   3. Add your current IP or 0.0.0.0/0 for testing')
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n🔧 Fix: Check your internet connection and cluster URL')
    }
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Connection closed')
    process.exit(0)
  }
}

testConnection()
