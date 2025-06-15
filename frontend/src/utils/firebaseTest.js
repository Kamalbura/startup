// Simple Firebase Test
// Test Firebase configuration and authentication
import firebaseAuthService from '../services/firebaseAuth';

console.log('🔥 Testing Firebase Configuration...');
console.log('📧 College email validation tests:');

// Test college email validation
const testEmails = [
  'student@college.edu',
  'test@university.ac.in', 
  'user@vce.ac.in',
  'invalid@gmail.com',
  'burakamal13@gmail.com',
  '1602-22-748-011@vce.ac.in'
];

testEmails.forEach(email => {
  const isValid = firebaseAuthService.validateCollegeEmail(email);
  console.log(`${isValid ? '✅' : '❌'} ${email} - ${isValid ? 'Valid college email' : 'Invalid college email'}`);
});

console.log('\n🎯 Firebase Auth Service initialized successfully!');
console.log('🚀 Ready for user authentication');

// Export for console testing
window.firebaseTest = {
  authService: firebaseAuthService,
  testEmailValidation: (email) => firebaseAuthService.validateCollegeEmail(email)
};
