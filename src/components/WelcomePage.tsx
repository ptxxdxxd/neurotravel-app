import React, { useState } from 'react';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Globe, Heart, Users, Mic, MessageSquare, Video, MapPin, Clock, DollarSign, Menu, X } from 'lucide-react';
import ResponsiveImageCard from './ResponsiveImageCard';
import { OptimizedImage } from '../utils/imageOptimization';
import { useIsMobile } from '../hooks/use-mobile';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Pricing', path: '/pricing' },
    { label: 'Testing', path: '/test-accounts' },
    { label: 'Sign In', path: '/login' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Navigation Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/neurotravel_logo_main.png" 
              alt="NeuroTravel Logo" 
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">NeuroTravel</span>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/pricing')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Pricing
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/test-accounts')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Testing
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Get Started
              </Button>
            </div>
          )}
          
          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
              >
                Get Started
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Button 
                  key={item.path}
                  variant="ghost" 
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Travel with
                  <span className="text-blue-600 dark:text-blue-400"> Confidence</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
                  AI-powered travel planning designed for neurodivergent individuals
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
                  Personalized itineraries with safety and sensory considerations. 
                  Designed by and for neurodivergent travelers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  Start Your Safe Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Safety First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span>Neurodivergent Designed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span>Community Focused</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ResponsiveImageCard 
                  imageSrc="/images/autism_friendly_airport_sensory_quiet_room.jpg"
                  imageAlt="Peaceful airport sensory room designed for neurodivergent travelers"
                  textContent="Sensory-friendly spaces designed for comfort"
                  textPosition="bottom"
                  className="w-full h-96"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="px-6 py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Powered by AI, Guided by Empathy
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with deep understanding 
              of neurodivergent needs to create safer, more comfortable travel experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Companion */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">AI Companion</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Real-time support through text, voice, and video communication. Your personal travel assistant 
                  understands your specific needs and preferences.
                </CardDescription>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                    <MessageSquare className="h-3 w-3" />
                    <span>Text</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                    <Mic className="h-3 w-3" />
                    <span>Voice</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                    <Video className="h-3 w-3" />
                    <span>Video</span>
                  </div>
                </div>
                <ResponsiveImageCard 
                  imageSrc="/images/multimodal_ai_travel_assistant_communication.jpg"
                  imageAlt="AI travel assistant with multimodal communication"
                  textContent="AI companion to help with real-time travel assistance"
                  className="w-full h-32 rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Personalized Planning */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Personalized Planning</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Customized itineraries based on your individual sensory preferences, 
                  comfort zones, and accessibility requirements.
                </CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Safety considerations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Heart className="h-4 w-4" />
                    <span>Sensory assessments</span>
                  </div>
                </div>
                <ResponsiveImageCard 
                  imageSrc="/images/family_calm_restaurant_dining.jpg"
                  imageAlt="Family enjoying calm dining experience"
                  textContent="Personalized sensory-friendly recommendations"
                  className="w-full h-32 rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Global Resources */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Global Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Access to verified sensory-friendly venues, quiet spaces, and accessibility 
                  resources worldwide through our comprehensive database.
                </CardDescription>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-semibold text-green-600 dark:text-green-400">1000+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Venues</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">50+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                  </div>
                </div>
                <ResponsiveImageCard 
                  imageSrc="/images/gerald_r_ford_airport_sensory_room_neurodivergent_travel.jpg"
                  imageAlt="Airport sensory room for neurodivergent travelers"
                  textContent="Access to SENSORY ROOM and other accommodations"
                  className="w-full h-32 rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Accessibility Commitment Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everyone Deserves Accessible Travel
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We believe financial barriers should never prevent anyone from accessing 
              the tools they need for safe, comfortable travel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Free Forever */}
            <Card className="border-0 bg-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Free Forever</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <CardDescription className="text-white/80 text-lg">
                  Essential features for everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0</div>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Basic travel planning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Safety features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Sensory venue database</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Community support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-white/30 bg-white/15 backdrop-blur-sm text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Brain className="h-6 w-6" />
                  </div>
                </div>
                <CardDescription className="text-white/80 text-lg">
                  Advanced AI features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">$9.99</div>
                  <div className="text-white/70">per month</div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Advanced AI companion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Unlimited customization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Priority support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Accessibility Rate */}
            <Card className="border-0 bg-white/10 backdrop-blur-sm text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Accessibility Rate</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <CardDescription className="text-white/80 text-lg">
                  50% off Premium for those in need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">$19.99</div>
                  <div className="text-white/70">per month</div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>All Premium features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Financial assistance rate</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Honor-based eligibility</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>Privacy protected</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <DollarSign className="h-5 w-5" />
              <span>Premium subscribers help support free access for those in need</span>
            </div>
            <p className="mt-4 text-white/80">
              <strong>Coming Soon:</strong> Payment features will be integrated with Stripe. 
              Start with our free features today!
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Join Thousands Planning Safer Travels
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real stories from our neurodivergent travel community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use Case Examples */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Sarah, Autism</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Business Traveler</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "NeuroTravel helped me find quiet workspaces and sensory-friendly restaurants 
                  during my business trips. The AI companion provides real-time support when I feel overwhelmed."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Marcus, ADHD</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Family Vacations</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Planning family trips used to be overwhelming. Now I can create detailed, 
                  structured itineraries that account for everyone's needs, including quiet time and sensory breaks."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Alex, Dyspraxia</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Solo Explorer</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "The navigation assistance and clear, simple directions give me confidence 
                  to explore new cities independently. I never feel lost or anxious anymore."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">WCAG 2.1</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accessibility Compliant</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Evidence-Based</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Research Informed</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">Community</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Focused Development</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">Privacy First</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Your Data Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Join our community of neurodivergent travelers and start planning your safest, 
            most comfortable journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Your Safe Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-lg"
            >
              Existing User? Sign In
            </Button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Questions about partnerships? Contact us at 
            <a href="mailto:partnerships@neurotravel.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              partnerships@neurotravel.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/neurotravel_icon.png" 
                  alt="NeuroTravel Icon" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold">NeuroTravel</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering neurodivergent travelers with AI-powered planning and community support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                <li><a href="/test-accounts" className="hover:text-white">Testing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 NeuroTravel. All rights reserved. Made with care for the neurodivergent community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;