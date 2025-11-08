import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
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
              <Eye className="w-5 h-5 mr-2" />
              Our Commitment to Your Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              At NeuroTravel, we understand that privacy is especially important for neurodivergent individuals. 
              We are committed to protecting your personal information and being transparent about how we collect, 
              use, and safeguard your data. This policy explains our practices in clear, accessible language.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Account Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email address and name</li>
                <li>Password (encrypted)</li>
                <li>Profile preferences</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Accessibility Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Sensory preferences (noise, light, crowd sensitivity)</li>
                <li>Communication preferences</li>
                <li>Accessibility requirements</li>
                <li>Support needs and comfort settings</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Travel Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Trip plans and itineraries</li>
                <li>Venue preferences and reviews</li>
                <li>Emergency contacts</li>
                <li>Location data (only when using navigation features)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">AI Interaction Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conversations with our AI companion</li>
                <li>Usage patterns and preferences</li>
                <li>Feedback and ratings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li><strong>Personalized Experience:</strong> Customize recommendations based on your accessibility needs and preferences</li>
              <li><strong>Safety & Support:</strong> Provide crisis intervention and emergency assistance when needed</li>
              <li><strong>Service Improvement:</strong> Enhance our AI and features based on usage patterns (anonymized data only)</li>
              <li><strong>Communication:</strong> Send important service updates and safety notifications</li>
              <li><strong>Legal Compliance:</strong> Meet regulatory requirements and protect user safety</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              How We Protect Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Technical Safeguards</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure cloud infrastructure with regular security audits</li>
                <li>Multi-factor authentication for accounts</li>
                <li>Regular security updates and patches</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Access Controls</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Limited employee access on a need-to-know basis</li>
                <li>Regular access reviews and audit logs</li>
                <li>Secure development practices</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Access:</strong> Request a copy of all personal data we have about you</p>
              <p><strong>Correction:</strong> Update or correct any inaccurate information</p>
              <p><strong>Deletion:</strong> Request deletion of your account and associated data</p>
              <p><strong>Portability:</strong> Export your data in a common format</p>
              <p><strong>Opt-out:</strong> Withdraw consent for data processing at any time</p>
              <p><strong>Restrict Processing:</strong> Limit how we use your data</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:privacy@neurotravel.com" className="text-blue-600 hover:underline">
                  privacy@neurotravel.com
                </a>
                . We will respond within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>When We Share Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We do not sell your personal information. We only share data in these limited circumstances:</p>
            <ul className="space-y-2">
              <li><strong>Emergency Services:</strong> When necessary for your safety or legal requirements</li>
              <li><strong>Service Providers:</strong> Trusted partners who help us operate the service (under strict agreements)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
              <li><strong>Anonymous Research:</strong> Aggregated, anonymized data to improve accessibility research</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">If you have questions about this privacy policy or our data practices:</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> privacy@neurotravel.com</p>
              <p><strong>Privacy Officer:</strong> Available for accessibility-focused privacy concerns</p>
              <p><strong>Response Time:</strong> We respond to all privacy inquiries within 72 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}