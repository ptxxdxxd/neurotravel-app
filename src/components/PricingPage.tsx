import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Check, Star, Zap, Shield, Users } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  monthlyLimit: number;
  features: string[];
  popular?: boolean;
  buttonText: string;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    monthlyLimit: 10,
    features: [
      '10 AI conversations per month',
      'Basic travel planning',
      'Sensory preference settings',
      'Emergency contact features',
      'Email support'
    ],
    buttonText: 'Get Started Free'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    monthlyLimit: 100,
    features: [
      '100 AI conversations per month',
      'Advanced trip planning',
      'Detailed accessibility insights',
      'Priority emergency response',
      'Real-time travel updates',
      'Custom sensory profiles',
      'Phone & chat support'
    ],
    popular: true,
    buttonText: 'Upgrade to Premium'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    monthlyLimit: 500,
    features: [
      '500 AI conversations per month',
      'Unlimited trip planning',
      'Advanced accessibility mapping',
      '24/7 crisis intervention',
      'Multiple accessibility profiles',
      'Family account management',
      'Priority support',
      'Custom integrations',
      'Analytics dashboard'
    ],
    buttonText: 'Go Pro'
  }
];

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  monthly_limit: number;
  usage_count: number;
}

export default function PricingPage() {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    } else {
      setSubscriptionLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Handle subscription result from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');

    if (subscriptionStatus === 'success') {
      // Show success message and refresh subscription data
      setTimeout(() => {
        fetchCurrentSubscription();
      }, 1000);
    }
  }, []);

  async function fetchCurrentSubscription() {
    if (!user) return;
    
    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.warn('Could not fetch subscription:', error);
        // Set default free subscription if none exists
        setCurrentSubscription({
          id: 'default',
          plan_type: 'basic',
          status: 'active',
          monthly_limit: 10,
          usage_count: 0
        });
      } else {
        setCurrentSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set default free subscription on error
      setCurrentSubscription({
        id: 'default',
        plan_type: 'basic',
        status: 'active',
        monthly_limit: 10,
        usage_count: 0
      });
    } finally {
      setSubscriptionLoading(false);
    }
  }

  async function handleSubscription(planId: string) {
    if (!user) {
      alert('Please sign in to upgrade your plan');
      return;
    }

    if (planId === 'basic') {
      // Handle free plan activation
      setLoading(planId);
      try {
        const { data, error } = await supabase.functions.invoke('create-subscription', {
          body: {
            planType: 'basic',
            customerEmail: user.email
          }
        });

        if (error) throw error;
        
        // Refresh subscription data
        await fetchCurrentSubscription();
        alert('Free plan activated successfully!');
      } catch (error: any) {
        console.error('Error activating free plan:', error);
        // Fallback: create local subscription record
        try {
          const { error: insertError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: user.id,
              stripe_subscription_id: `free_${user.id}`,
              stripe_customer_id: `customer_free_${user.id}`,
              price_id: 'price_free_basic',
              status: 'active',
              plan_type: 'basic',
              monthly_limit: 10,
              usage_count: 0
            });
          
          if (!insertError) {
            await fetchCurrentSubscription();
            alert('Free plan activated successfully!');
          } else {
            alert('Could not activate plan. Please try again.');
          }
        } catch (fallbackError) {
          alert('Service temporarily unavailable. Please try again later.');
        }
      } finally {
        setLoading(null);
      }
      return;
    }

    // Handle paid plans
    setLoading(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          planType: planId,
          customerEmail: user.email
        }
      });

      if (error) throw error;

      if (data.data?.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert('Payment service temporarily unavailable. Please contact support.');
    } finally {
      setLoading(null);
    }
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan_type === planId;
  };

  const getCurrentPlanInfo = () => {
    if (!currentSubscription) return null;
    return plans.find(plan => plan.id === currentSubscription.plan_type);
  };

  if (subscriptionLoading && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your NeuroTravel Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered accessible travel planning.
            Start free and upgrade as your needs grow.
          </p>
          
          {currentSubscription && (
            <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg inline-block">
              <p className="text-green-800">
                <strong>Current Plan:</strong> {getCurrentPlanInfo()?.name || 'Unknown'} - 
                {currentSubscription.usage_count}/{currentSubscription.monthly_limit} conversations used
              </p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              } ${isCurrentPlan(plan.id) ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" /> Most Popular
                  </span>
                </div>
              )}
              
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Current
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                <p className="text-gray-600">
                  {plan.monthlyLimit} AI conversations per month
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscription(plan.id)}
                disabled={loading === plan.id || isCurrentPlan(plan.id)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isCurrentPlan(plan.id)
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : isCurrentPlan(plan.id) ? (
                  'Current Plan'
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose NeuroTravel?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Planning
              </h3>
              <p className="text-gray-600">
                Advanced AI understands neurodivergent needs and creates personalized travel plans
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crisis Support
              </h3>
              <p className="text-gray-600">
                24/7 emergency response and crisis intervention for safer travel experiences
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Built by and for the neurodivergent community with accessibility at its core
              </p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Ready to get started? Sign up to begin your accessible travel journey.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Free Account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}