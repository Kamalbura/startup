import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Shield } from 'lucide-react'

// Import background images
import backgroundLight from '../assets/background3.jpg';
import backgroundDark from '../assets/background2.jpg';

const Disputes = () => {
  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundImage: `url(${backgroundLight})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark mode background overlay */}
      <div 
        className="hidden dark:block fixed inset-0 transition-opacity duration-200"
        style={{
          backgroundImage: `url(${backgroundDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 bg-white/30 dark:bg-black/50 backdrop-blur-sm min-h-screen">
        <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center text-karma-600 hover:text-karma-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-karma-600">Dispute</span> Resolution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fair and transparent dispute resolution system to protect both service providers and clients.
          </p>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-karma-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">How Disputes Work</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Issue</h3>
                  <p className="text-gray-700">Either party can report a dispute through the platform with detailed explanation.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence Review</h3>
                  <p className="text-gray-700">Our team reviews chat logs, submitted work, and payment history.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-karma-600 text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fair Resolution</h3>
                  <p className="text-gray-700">Decision made within 48 hours with escrow funds released accordingly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-8 h-8 text-karma-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Common Issues</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Work Quality</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Work not matching requirements</li>
                  <li>• Missed deadlines</li>
                  <li>• Communication issues</li>
                  <li>• Scope changes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Issues</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Delayed payments</li>
                  <li>• Refund requests</li>
                  <li>• Escrow disputes</li>
                  <li>• Fee disagreements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">Need to report a dispute?</p>
            <a 
              href="mailto:support@campuskarma.burakamal.site" 
              className="btn-karma text-lg px-8 py-3 inline-flex items-center"
            >
              Contact Support
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Disputes
