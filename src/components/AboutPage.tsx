import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Button } from '../lib/ui/button';
import { Heart, Users, Brain, Globe, Shield, Lightbulb, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About NeuroTravel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Born from the neurodivergent community's need for truly accessible travel planning. 
            We understand because we are the community we serve.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  To make travel accessible, safe, and enjoyable for every neurodivergent individual by providing 
                  AI-powered planning tools, community support, and crisis intervention services designed with 
                  deep understanding of our unique needs.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Neurodivergent-First</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Every feature designed with autism, ADHD, dyslexia, and other neurodivergent experiences in mind
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Safety Focused</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Crisis intervention, emergency support, and safety-first recommendations for peace of mind
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Built by our community, for our community, with ongoing input from neurodivergent travelers
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="w-6 h-6 mr-3" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                NeuroTravel began when our founders, neurodivergent travelers themselves, experienced 
                the unique challenges of planning accessible trips. Traditional travel apps didn't understand 
                sensory sensitivities, the need for routine, or the importance of quiet spaces and clear communication.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                After countless overwhelming airport experiences, restaurants that were too loud, and 
                accommodations that didn't meet accessibility needs, we realized the travel industry 
                needed a fundamental shift in perspective.
              </p>
              <p className="text-lg leading-relaxed">
                Today, NeuroTravel serves thousands of neurodivergent travelers worldwide, providing 
                not just trip planning, but a supportive community and the confidence to explore the world 
                safely and comfortably.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Accessibility First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Every decision prioritizes accessibility and inclusion. We follow WCAG 2.1 standards 
                  and continuously improve based on community feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Dignity & Respect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We respect individual differences, communication styles, and support needs. 
                  No judgments, just understanding and practical assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Privacy Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is yours. We use encryption, transparent policies, and give you 
                  complete control over your information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Financial Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Core features remain free forever. Accessibility discounts ensure cost 
                  never prevents access to the tools you need.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Evidence-Based Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Features based on research, community input, and real-world testing. 
                  We measure success by user safety and satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Continuous Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Regular updates based on user feedback, new research, and evolving 
                  accessibility standards. Your input shapes our roadmap.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="px-6 py-12 bg-blue-50 dark:bg-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Safe Trips Planned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1,500+</div>
              <div className="text-gray-600 dark:text-gray-300">Verified Venues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Countries Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Crisis Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Leadership Team
          </h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Neurodivergent-Led Organization</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our leadership team is majority neurodivergent, including individuals with autism, 
                  ADHD, dyslexia, and other neurological differences. We also work with accessibility 
                  consultants, crisis intervention specialists, and travel industry experts who share 
                  our commitment to inclusive design.
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  <strong>Diversity:</strong> Our team includes various neurotypes, backgrounds, ages, 
                  and travel experiences to ensure NeuroTravel serves our entire community.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-lg mb-6 opacity-90">
                Whether you're a neurodivergent traveler, accessibility advocate, or organization 
                interested in partnership, we'd love to connect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:hello@neurotravel.com'}
                  className="border-white text-white hover:bg-white/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm opacity-75">
                  <strong>Partnerships:</strong> partnerships@neurotravel.com<br/>
                  <strong>Research Collaboration:</strong> research@neurotravel.com<br/>
                  <strong>Accessibility Questions:</strong> accessibility@neurotravel.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}