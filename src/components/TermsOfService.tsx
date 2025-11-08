import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { FileText, Shield, Users, AlertTriangle, Heart, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Last updated: August 18, 2025
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Welcome to NeuroTravel
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              NeuroTravel is designed by and for the neurodivergent community. These terms are written 
              in clear, accessible language and focus on creating a safe, supportive environment for all users. 
              By using NeuroTravel, you agree to these terms.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Our Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">NeuroTravel provides:</p>
            <ul className="space-y-2">
              <li><strong>AI-Powered Travel Planning:</strong> Personalized itineraries based on your accessibility needs</li>
              <li><strong>Sensory-Friendly Venue Database:</strong> Curated information about accessible locations worldwide</li>
              <li><strong>Crisis Support:</strong> 24/7 assistance for emergencies and overwhelming situations</li>
              <li><strong>Community Features:</strong> Connect with other neurodivergent travelers</li>
              <li><strong>Accessibility Profiles:</strong> Customizable settings for your specific needs</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Respectful Communication</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Respect different communication styles and needs</li>
                <li>Use person-first or identity-first language as individuals prefer</li>
                <li>No discrimination based on neurotype, disability, or accessibility needs</li>
                <li>Be patient with different processing speeds and communication methods</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Accurate Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide truthful venue reviews and accessibility information</li>
                <li>Report outdated or incorrect accessibility details</li>
                <li>Share genuine experiences to help the community</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Safety First</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use crisis features responsibly and only when needed</li>
                <li>Keep emergency contact information current</li>
                <li>Report safety concerns immediately</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security & Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Account Creation:</strong> You must provide accurate information and keep it updated</p>
              <p><strong>Password Security:</strong> Use a strong, unique password and enable two-factor authentication</p>
              <p><strong>Shared Access:</strong> You're responsible for all activity under your account</p>
              <p><strong>Age Requirements:</strong> Users under 18 need parental/guardian consent</p>
              <p><strong>Account Termination:</strong> We may suspend accounts that violate these terms</p>
            </div>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Service Availability & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Reliability</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Maintenance windows will be communicated in advance when possible</li>
                  <li>Emergency maintenance may occur without notice</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">AI Assistance Limitations</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI recommendations are suggestions, not professional medical or legal advice</li>
                  <li>Always verify accessibility information independently</li>
                  <li>Crisis support supplements but doesn't replace emergency services</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Subscription Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Free Access:</strong> Basic features remain free forever</p>
              <p><strong>Premium Plans:</strong> Subscription fees are billed monthly or annually</p>
              <p><strong>Accessibility Rates:</strong> Honor-based discounts available for those in need</p>
              <p><strong>Refunds:</strong> Contact us within 30 days for refund requests</p>
              <p><strong>Cancellation:</strong> Cancel anytime; access continues until end of billing period</p>
              <p><strong>Price Changes:</strong> 30 days notice for any price increases</p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Your Content:</strong> You retain ownership of content you create</p>
              <p><strong>License to Us:</strong> You grant us permission to use your content to provide services</p>
              <p><strong>Our Content:</strong> NeuroTravel owns the platform, AI, and original content</p>
              <p><strong>Community Contributions:</strong> Venue reviews and tips help the entire community</p>
            </div>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="w-5 h-5 mr-2" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Service Nature:</strong> NeuroTravel is an information and planning tool</p>
              <p><strong>Travel Decisions:</strong> You make final decisions about travel safety and suitability</p>
              <p><strong>Third-Party Venues:</strong> We're not responsible for accessibility issues at venues</p>
              <p><strong>Emergency Services:</strong> Always contact local emergency services for immediate help</p>
              <p><strong>Maximum Liability:</strong> Limited to fees paid in the last 12 months</p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We may update these terms to:</p>
            <ul className="space-y-2">
              <li>Improve clarity and accessibility</li>
              <li>Reflect new features or services</li>
              <li>Comply with legal requirements</li>
              <li>Better serve the neurodivergent community</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                We'll notify you 30 days before significant changes take effect. 
                Continued use means you accept the updated terms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We're here to help explain anything that's unclear:</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> legal@neurotravel.com</p>
              <p><strong>Accessibility Questions:</strong> accessibility@neurotravel.com</p>
              <p><strong>Response Time:</strong> We respond within 72 hours</p>
              <p><strong>Alternative Formats:</strong> Terms available in audio, large print, or simplified language</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}