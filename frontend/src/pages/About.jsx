import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const About = () => {
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
            About <span className="text-karma-600">CampusKarma</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building India's trust-first student skill economy platform where college students can earn, collaborate, and build verified reputation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              CampusKarma is revolutionizing how college students collaborate, earn, and build their professional reputation. 
              We believe every student has unique skills that can benefit the campus community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Through our trust-first platform, students can offer services, complete projects, and build verified karma 
              that follows them into their professional careers.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-karma-600 mb-4">Trust-First Approach</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• College email verification (.edu domains)</li>
                <li>• UPI escrow payment system</li>
                <li>• Karma-based reputation scoring</li>
                <li>• Anti-fraud protection</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-karma-600 mb-4">Student-Centric Design</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Gen Z optimized UI/UX</li>
                <li>• Campus-specific filters</li>
                <li>• Micro-entrepreneurship support</li>
                <li>• Skill verification system</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link to="/login-otp" className="btn-karma text-lg px-8 py-3 inline-flex items-center">
              Join CampusKarma Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
