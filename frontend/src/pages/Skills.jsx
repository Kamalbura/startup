import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, Code, Design, BookOpen } from 'lucide-react'

const Skills = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center text-karma-600 hover:text-karma-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-karma-600">Skill</span> Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Verify your skills and build trust with potential clients through our quiz-based system.
          </p>
        </div>

        {/* Skills Categories */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Programming</h3>
              <p className="text-gray-600 mb-4">Python, JavaScript, Java, C++</p>
              <div className="text-sm text-karma-600 font-semibold">15+ Skills Available</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Design className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Design</h3>
              <p className="text-gray-600 mb-4">UI/UX, Graphics, Video</p>
              <div className="text-sm text-karma-600 font-semibold">12+ Skills Available</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Content</h3>
              <p className="text-gray-600 mb-4">Writing, Translation, Research</p>
              <div className="text-sm text-karma-600 font-semibold">8+ Skills Available</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 mb-4">Marketing, Analytics, Finance</p>
              <div className="text-sm text-karma-600 font-semibold">10+ Skills Available</div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Skill Verification Works</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Skill</h3>
                  <p className="text-gray-700">Select from our comprehensive list of skills across different categories.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Take the Quiz</h3>
                  <p className="text-gray-700">Complete a comprehensive quiz with practical questions and coding challenges.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Verified</h3>
                  <p className="text-gray-700">Receive your skill badge and boost your karma score for better opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/login-otp" className="btn-karma text-lg px-8 py-3 inline-flex items-center">
              Start Skill Verification
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Coming soon - Currently in development
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills
