import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Button } from '../lib/ui/button';
import { Progress } from '../lib/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb, Heart, Shield, Zap } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  action?: string;
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to NeuroTravel',
      description: 'Your safe space for accessible travel planning',
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            NeuroTravel is designed specifically for neurodivergent travelers. 
            We understand sensory sensitivities, routine needs, and the importance of clear communication.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Safety First</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">AI Powered</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Create Your Accessibility Profile',
      description: 'Help us understand your unique needs and preferences',
      icon: <Lightbulb className="w-8 h-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Your accessibility profile helps our AI provide personalized recommendations:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Sensory Preferences</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Noise, lighting, and crowd tolerance</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Communication Style</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">How you prefer to receive information</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Support Needs</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crisis intervention and emergency contacts</p>
              </div>
            </li>
          </ul>
        </div>
      ),
      action: 'Set Up Profile'
    },
    {
      id: 'ai-companion',
      title: 'Meet Your AI Companion',
      description: 'Available 24/7 for travel support and crisis intervention',
      icon: <Zap className="w-8 h-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Your AI companion understands neurodivergent needs and provides:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Travel Planning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personalized itineraries with sensory considerations
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Crisis Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Immediate assistance during overwhelming situations
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Real-time Help</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Navigation, venue information, and problem-solving
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Learning System</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adapts to your preferences and communication style
              </p>
            </div>
          </div>
        </div>
      ),
      action: 'Try AI Companion'
    },
    {
      id: 'features',
      title: 'Explore Key Features',
      description: 'Discover tools designed for accessible travel',
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Trip Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• Sensory-friendly venue database</li>
                  <li>• Customizable itineraries</li>
                  <li>• Accessibility assessments</li>
                  <li>• Emergency contact integration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Safety Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  <li>• 24/7 crisis intervention</li>
                  <li>• Emergency contacts</li>
                  <li>• Safe space locator</li>
                  <li>• Real-time support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Pro Tip:</strong> Start with a short, familiar trip to test features and build confidence.
            </p>
          </div>
        </div>
      ),
      action: 'Start Planning'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {steps[currentStep].icon}
              <div>
                <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
            {onSkip && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip Tour
              </Button>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step indicators */}
          <div className="flex space-x-2 mt-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : completedSteps.has(index)
                    ? 'bg-green-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                'Complete Tour'
              ) : (
                <>
                  {steps[currentStep].action || 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('neurotravel-onboarding-completed');
    if (!completed) {
      setShowOnboarding(true);
    } else {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('neurotravel-onboarding-completed', 'true');
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem('neurotravel-onboarding-completed', 'true');
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const restartOnboarding = () => {
    localStorage.removeItem('neurotravel-onboarding-completed');
    setShowOnboarding(true);
    setHasCompletedOnboarding(false);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    completeOnboarding,
    skipOnboarding,
    restartOnboarding
  };
}