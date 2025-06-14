import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Users, Star, TrendingUp } from 'lucide-react'
// import anime from 'animejs' // Temporarily disabled

const Landing = () => {
  useEffect(() => {
    // Hero animation - temporarily disabled
    console.log('Landing page loaded - animations disabled for now')
    
    // TODO: Re-enable animations after fixing animejs
    /*
    anime({
      targets: '.hero-title',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutExpo'
    })

    anime({
      targets: '.hero-subtitle',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 200,
      easing: 'easeOutExpo'
    })

    anime({
      targets: '.hero-cta',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: 400,
      easing: 'easeOutExpo'
    })

    // Stats animation
    anime({
      targets: '.stat-card',
      translateY: [40, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100, {start: 600}),
      easing: 'easeOutExpo'
    })
    */
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="font-karma font-bold text-2xl text-gradient">
                CampusKarma
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-karma-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-karma-600 transition-colors">
                About
              </a>
              <Link to="/auth" className="btn-karma">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="hero-title text-5xl md:text-7xl font-karma font-bold text-gray-900 mb-6">
              Turn Your Skills Into{' '}
              <span className="text-gradient">CampusKarma</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              India's first trust-based student skill economy. 
              Earn real money, build verified reputation, and connect with peers across campuses.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="btn-karma text-lg px-8 py-3 inline-flex items-center">
                Start Earning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/auth" className="btn-karma-outline text-lg px-8 py-3">
                Post a Task
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stat-card text-center">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-3xl font-bold text-karma-600 mb-2">1000+</div>
                <div className="text-gray-600">Students Earning</div>
              </div>
            </div>
            <div className="stat-card text-center">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-3xl font-bold text-trust-600 mb-2">₹2.5L+</div>
                <div className="text-gray-600">Total Earnings</div>
              </div>
            </div>
            <div className="stat-card text-center">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-3xl font-bold text-campus-600 mb-2">50+</div>
                <div className="text-gray-600">Colleges Connected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-karma font-bold text-gray-900 mb-4">
              Built for Student Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every feature designed to build trust, verify skills, and create real opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-trust text-center">
              <div className="bg-karma-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-karma-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust-First Platform</h3>
              <p className="text-gray-600">
                .edu verification, UPI escrow, and karma scoring ensure safe transactions
              </p>
            </div>
            
            <div className="card-trust text-center">
              <div className="bg-trust-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-trust-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Skills</h3>
              <p className="text-gray-600">
                Quiz-based skill validation with anti-cheat technology
              </p>
            </div>
            
            <div className="card-trust text-center">
              <div className="bg-campus-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-campus-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Reputation</h3>
              <p className="text-gray-600">
                Earn karma points, collect badges, and showcase your college achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 campus-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-karma font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students already earning and building their reputation
          </p>
          <Link to="/auth" className="btn-karma bg-white text-karma-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center">
            Join CampusKarma
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-karma font-bold text-2xl mb-4">CampusKarma</div>
              <p className="text-gray-400">
                Empowering India's student economy, one skill at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/post-task" className="hover:text-white transition-colors">Post Task</Link></li>
                <li><Link to="/skills" className="hover:text-white transition-colors">Skill Verification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link to="/disputes" className="hover:text-white transition-colors">Dispute Resolution</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusKarma. Made with ❤️ for India's student community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
