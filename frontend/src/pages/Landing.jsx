import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, MessageSquare, Shield, Zap, Star, ArrowRight, 
  Lock, Sparkles, User 
} from 'lucide-react';
import { useAuth } from '../context/FirebaseAuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Layout } from '../components/layout';

// Import background images - Using background2.jpg as base image for both themes
import backgroundBase from '../assets/background2.jpg';

/**
 * SkillLance Landing Page
 * 
 * SRS Requirements:
 * - Hero section with intro and CTA to login/signup
 * - Live preview of help requests
 * - Features showcase
 * - Trust indicators and social proof
 * - Mobile-first responsive design
 */

// Helper function to get badge variant
const getBadgeVariant = (urgency) => {
  if (urgency === 'high') return 'destructive';
  if (urgency === 'medium') return 'warning';
  return 'default';
};

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveRequests, setLiveRequests] = useState([]);
  const [stats, setStats] = useState({
    totalHelp: 0,
    activeStudents: 0,
    problemsSolved: 0
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Simulate live help requests for demo
  useEffect(() => {
    const sampleRequests = [
      {
        id: 1,
        title: "Need help with React Hooks implementation",
        subject: "Computer Science",
        timeAgo: "2 mins ago",
        anonymous: true,
        urgency: "high"
      },
      {
        id: 2,
        title: "Statistics homework - hypothesis testing",
        subject: "Mathematics", 
        timeAgo: "5 mins ago",
        anonymous: false,
        urgency: "medium"
      },
      {
        id: 3,
        title: "Essay review for English Literature",
        subject: "Literature",
        timeAgo: "8 mins ago", 
        anonymous: true,
        urgency: "low"
      }
    ];

    setLiveRequests(sampleRequests);
    setStats({
      totalHelp: 1247,
      activeStudents: 342,
      problemsSolved: 968
    });
  }, []);
  const features = [
    {
      id: 'anonymous-help',
      icon: Shield,
      title: "Anonymous Help",
      description: "Request help without revealing your identity. Your privacy is protected."
    },
    {
      id: 'peer-to-peer',
      icon: Users,
      title: "Peer-to-Peer",
      description: "Connect with fellow students who understand your challenges."
    },
    {
      id: 'instant-matching',
      icon: Zap,
      title: "Instant Matching",
      description: "Get matched with the right helper in seconds, not hours."
    },
    {
      id: 'live-collaboration',
      icon: MessageSquare,
      title: "Live Collaboration", 
      description: "Chat, video call, or work together on interactive whiteboards."
    }
  ];
  return (
    <>      {/* Static Background Image - Same for both light and dark themes */}
      <div 
        className="fixed inset-0 transition-opacity duration-200 z-0"
        style={{
          backgroundImage: `url(${backgroundBase})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Scrollable Content Overlay */}
      <div className="relative z-10 min-h-screen">
        <Layout showHeader={true} showFooter={true}>      {/* Hero Section */}
      <section className="relative bg-white/10 dark:bg-black/20 backdrop-blur-none px-6 pt-16 pb-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="inline-flex items-center gap-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  Campus-Exclusive Platform
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight transition-colors">
                  Turn Your Skills Into{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Campus Karma
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  SkillLance is the privacy-first platform where college students can 
                  request anonymous help, showcase verified skills, and build trusted 
                  peer connections through secure collaboration.
                </p>
              </div>{/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="group"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign In
                </Button>

                {/* Development: ComponentTest Link */}
                {import.meta.env.DEV && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/component-test')}
                    className="group border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    🎭 Loading Animations
                  </Button>
                )}
              </div>              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">2,000+ Students</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5 Rating</span>
                </div>
              </div>
            </div>            {/* Live Preview Panel */}
            <div className="relative">
              <Card className="p-6 shadow-xl border-0 bg-white/20 dark:bg-black/30 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Help Requests</h3>
                  <Badge variant="success" size="sm">Real-time</Badge>
                </div>

                <div className="space-y-4">
                  {liveRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg hover:bg-gray-100/40 dark:hover:bg-gray-800/40 transition-colors duration-150">                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{request.title}</h4>
                        <Badge 
                          variant={getBadgeVariant(request.urgency)}
                          size="sm"
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          {request.anonymous && <Lock className="h-3 w-3" />}
                          {request.subject}
                        </span>
                        <span>{request.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4 dark:border-gray-600 dark:hover:bg-gray-700">
                  View All Requests
                </Button>
              </Card>              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200/30 dark:border-gray-700/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.problemsSolved}+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Problems Solved</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-gray-200/30 dark:border-gray-700/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.activeStudents}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Active Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-black transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Students Choose SkillLance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built specifically for college students who value privacy, trust, and academic excellence.
            </p>
          </div>          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="p-6 text-center hover:shadow-lg transition-shadow border border-gray-200/30 dark:border-gray-800/30 bg-white/20 dark:bg-black/30 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50/20 dark:bg-black/20 backdrop-blur-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get help in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "post-request",
                step: "01",
                title: "Post Your Request",
                description: "Share your problem anonymously or publicly. Include details about what you need help with."
              },
              {
                id: "get-matched",
                step: "02", 
                title: "Get Matched",
                description: "Our smart matching system connects you with students who have the right skills to help."
              },
              {
                id: "collaborate",
                step: "03",
                title: "Collaborate & Learn",
                description: "Work together using chat, video calls, or interactive whiteboards. Build lasting connections."
              }
            ].map((item) => (
              <div key={item.id} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-bold text-lg rounded-full mb-6">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Join the Campus Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Thousands of students are already helping each other succeed. Join them today.
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="bg-white dark:bg-black text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-900 border dark:border-gray-700"
            >
              Start Helping Today
            </Button>            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white dark:hover:bg-black hover:text-blue-600 dark:hover:text-blue-400"
            >
              Sign In
            </Button>
          </div>        </div>
      </section>        </Layout>
      </div>
    </>
  );
};

export default Landing;