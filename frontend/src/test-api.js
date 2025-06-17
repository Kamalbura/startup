// SkillLance API Testing Script
// Purpose: Test all API endpoints for functionality

// Test backend health
console.log('🔍 Testing SkillLance Backend API...')

async function testAPIEndpoints() {
  const baseURL = 'http://localhost:5000'
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Endpoint...')
    const healthResponse = await fetch(`${baseURL}/health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health Check:', healthData)
    
    // Test 2: API v1 Documentation
    console.log('\n2️⃣ Testing API Documentation...')
    const apiResponse = await fetch(`${baseURL}/api/v1`)
    const apiData = await apiResponse.json()
    console.log('✅ API Documentation:', apiData)
    
    // Test 3: Anonymous Requests (without auth - should fail)
    console.log('\n3️⃣ Testing Anonymous Requests (without auth)...')
    try {
      const anonResponse = await fetch(`${baseURL}/api/v1/anonymous/requests`)
      const anonData = await anonResponse.json()
      console.log('⚠️ Anonymous Requests (no auth):', anonData)
    } catch (err) {
      console.log('❌ Expected failure (no auth):', err.message)
    }
    
    // Test 4: Check CORS headers
    console.log('\n4️⃣ Testing CORS Configuration...')
    const corsResponse = await fetch(`${baseURL}/health`, {
      method: 'OPTIONS'
    })
    console.log('✅ CORS Status:', corsResponse.status)
    console.log('✅ CORS Headers:', corsResponse.headers)
    
    console.log('\n🎉 Backend API is healthy and responding!')
    
  } catch (error) {
    console.error('❌ API Test Failed:', error)
  }
}

// Run tests
testAPIEndpoints()

// Test frontend environment variables
console.log('\n📊 Frontend Environment Check:')
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('NODE_ENV:', import.meta.env.NODE_ENV)
console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME)
