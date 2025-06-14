// Quick MongoDB Atlas Configuration Check
import dotenv from 'dotenv'
dotenv.config()

console.log('🔍 MongoDB Atlas Configuration Check')
console.log('=====================================')

const uri = process.env.MONGODB_URI
if (!uri) {
  console.log('❌ MONGODB_URI not found in .env file')
  process.exit(1)
}

// Parse connection string
const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)\?/)
if (!match) {
  console.log('❌ Invalid connection string format')
  process.exit(1)
}

const [, username, password, cluster, database] = match

console.log('✅ Connection string format is valid')
console.log(`📝 Username: ${username}`)
console.log(`📝 Password: ${'*'.repeat(password.length)}`)
console.log(`📝 Cluster: ${cluster}`)
console.log(`📝 Database: ${database.split('?')[0]}`)

console.log('\n🔧 Next Steps to Complete Setup:')
console.log('================================')
console.log('1. Go to MongoDB Atlas Dashboard')
console.log('2. Click "Network Access" → Add your IP address')
console.log('3. Click "Database Access" → Verify user exists:')
console.log(`   - Username: ${username}`)
console.log(`   - Password: (should match your .env file)`)
console.log('   - Privileges: "Read and write to any database"')
console.log('4. Come back and run: npm start')

console.log('\n🌐 Your MongoDB Atlas URL:')
console.log('https://cloud.mongodb.com/v2/projects')
