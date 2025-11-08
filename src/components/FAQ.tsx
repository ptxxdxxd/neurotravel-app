import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Button } from '../lib/ui/button';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqData: FAQItem[] = [
  {
    question: "What makes NeuroTravel different from other travel apps?",
    answer: "NeuroTravel is specifically designed for neurodivergent travelers. We provide sensory-aware recommendations, customizable accessibility profiles, crisis intervention support, and AI assistance trained to understand neurodivergent needs. Our platform prioritizes safety, comfort, and individual preferences over generic recommendations.",
    category: "About NeuroTravel"
  },
  {
    question: "How does the AI companion understand my specific needs?",
    answer: "Our AI companion learns from your accessibility profile, sensory preferences, past trips, and ongoing conversations. It considers factors like noise sensitivity, crowd tolerance, lighting preferences, and communication styles to provide personalized recommendations and support.",
    category: "AI Features"
  },
  {
    question: "Is my personal information and accessibility data secure?",
    answer: "Yes, we take privacy extremely seriously. Your data is encrypted, stored securely, and never shared without explicit consent. We follow WCAG 2.1 accessibility standards and maintain strict data protection protocols. You control what information is shared and can delete your data at any time.",
    category: "Privacy & Security"
  },
  {
    question: "What should I do if I experience a crisis while traveling?",
    answer: "NeuroTravel provides 24/7 crisis intervention support for Premium and Pro users. Our AI can detect signs of distress and immediately connect you with appropriate resources. We maintain partnerships with crisis support organizations worldwide and can help locate quiet spaces, sensory-friendly areas, or emergency contacts.",
    category: "Crisis Support"
  },
  {
    question: "Can I use NeuroTravel without internet connection?",
    answer: "Many core features work offline including saved trip plans, emergency contacts, and basic navigation. However, real-time updates, AI conversations, and live venue information require an internet connection. We recommend downloading trip information before traveling.",
    category: "Technical"
  },
  {
    question: "How accurate are the sensory-friendly venue recommendations?",
    answer: "Our venue database is curated through community feedback, professional assessments, and partnerships with accessibility organizations. We continuously update information and encourage user reviews to maintain accuracy. If you find outdated information, please report it through the app.",
    category: "Venues & Recommendations"
  },
  {
    question: "What's included in the free version?",
    answer: "The free version includes basic travel planning, access to our sensory-friendly venue database, safety features, emergency contacts, and community support. You get 10 AI conversations per month and can create detailed accessibility profiles.",
    category: "Pricing"
  },
  {
    question: "How do I qualify for the accessibility discount rate?",
    answer: "Our accessibility rate is available on an honor-based system for individuals who need financial assistance. We believe cost should never be a barrier to accessible travel tools. Simply select the accessibility rate when subscribing - no documentation required.",
    category: "Pricing"
  },
  {
    question: "Can family members or caregivers access my account?",
    answer: "Pro users can set up family account management with controlled access levels. You can grant specific permissions to caregivers while maintaining control over your privacy settings. All shared access is logged and can be revoked at any time.",
    category: "Account Management"
  },
  {
    question: "Does NeuroTravel work internationally?",
    answer: "Yes! NeuroTravel supports international travel with venue information in over 50 countries. Our AI provides region-specific accessibility insights, cultural considerations for neurodivergent travelers, and connects you with local support resources.",
    category: "International Travel"
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];
  const filteredFAQ = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Find answers to common questions about NeuroTravel's features and services
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.map((item, index) => {
          const isOpen = openItems.has(index);
          return (
            <Card key={index} className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -m-2"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </CardTitle>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  {item.category && (
                    <div className="mt-2">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  )}
                </button>
              </CardHeader>
              
              {isOpen && (
                <CardContent id={`faq-answer-${index}`} className="pt-0">
                  <CardDescription className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.answer}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Still have questions?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Our support team is here to help you with any concerns about NeuroTravel.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = 'mailto:support@neurotravel.com'}
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}