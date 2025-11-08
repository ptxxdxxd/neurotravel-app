import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  User, 
  Bot, 
  Shield, 
  LogOut, 
  Palette,
  CheckCircle,
  Clock,
  MapPin,
  Plus,
  UtensilsCrossed,
  Languages,
  Camera,
  Search
} from 'lucide-react';

interface Profile {
  id: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travel_type?: string;
  budget_range?: string;
  travel_companions?: number;
  status?: string;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserTrips();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading trips:', error);
      } else {
        setTrips(data || []);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${currentTheme}`}>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading your travel dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${currentTheme}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0">
              <img 
                src="/neurotravel_logo_main.png" 
                alt="NeuroTravel Logo" 
                className="h-8 w-auto mr-2 sm:h-10 sm:mr-3"
              />
              <span className="font-bold text-indigo-600 text-sm sm:text-lg truncate">NeuroTravel</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                title="Toggle theme"
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="text-xs sm:text-sm text-gray-700 max-w-32 sm:max-w-none truncate">
                Hello, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Traveler'}!
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Your Travel Dashboard
              </h2>
              <p className="text-gray-600">
                NeuroTravel is your personalized AI-powered travel companion, designed specifically for neurodivergent individuals to plan safe, comfortable, and amazing journeys.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Food Tools Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Planning Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FoodFeatureCard
              title="Food Discovery"
              description="Find sensory-friendly restaurants and cuisines that match your preferences"
              icon={<Search className="w-8 h-8" />}
              color="bg-orange-500"
              onClick={() => console.log('Food Discovery')}
              isHighlighted={true}
            />
            <FoodFeatureCard
              title="Menu Translation & Analysis"
              description="Translate menus and analyze ingredients for dietary requirements"
              icon={<Languages className="w-8 h-8" />}
              color="bg-green-600"
              onClick={() => console.log('Menu Translation')}
              isHighlighted={true}
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <QuickActionCard
            title="Plan New Trip"
            description="Start planning your next sensory-friendly adventure"
            icon={<Plane className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="bg-blue-500"
            onClick={() => navigate('/trip-planning')}
          />
          <QuickActionCard
            title="AI Companion"
            description="Chat with your personalized travel assistant"
            icon={<Bot className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="bg-purple-500"
            onClick={() => console.log('AI Companion')}
          />
          <QuickActionCard
            title="Emergency Kit"
            description="Access safety resources and emergency contacts"
            icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="bg-red-500"
            onClick={() => console.log('Emergency kit')}
          />
          <QuickActionCard
            title="Update Profile"
            description="Customize your preferences and accessibility needs"
            icon={<User className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="bg-green-500"
            onClick={() => console.log('Update profile')}
          />
        </div>

        {/* Profile Status & Recent Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Status */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Status</h3>
            {profile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Name</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {profile.full_name || 'Not Set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Emergency Contacts</span>
                  <span className="flex items-center text-blue-600 font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Profile Setup Needed</h4>
                <p className="text-gray-600 mb-4">
                  Complete your profile to get personalized travel recommendations.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Complete Profile
                </button>
              </div>
            )}
          </div>

          {/* Recent Trips */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Trips</h3>
            {trips.length > 0 ? (
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{trip.title || trip.destination}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                      {trip.budget_range && (
                        <p className="text-xs text-gray-500">Budget: {trip.budget_range}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Trips Yet</h4>
                <p className="text-gray-600 mb-4">
                  Start planning your first neurodivergent-friendly adventure!
                </p>
                <button 
                  onClick={() => navigate('/trip-planning')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Plan Your First Trip
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Quick Action Card Component
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

function QuickActionCard({ title, description, icon, color, onClick }: QuickActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl border border-gray-100"
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

// Food Feature Card Component
interface FoodFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  isHighlighted?: boolean;
}

function FoodFeatureCard({ title, description, icon, color, onClick, isHighlighted }: FoodFeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 ${
        isHighlighted ? 'border-orange-300 ring-2 ring-orange-200' : 'border-gray-100'
      }`}
    >
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 text-white mx-auto`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-3 text-lg sm:text-xl text-center">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center">{description}</p>
      {isHighlighted && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ✨ Featured Tool
          </span>
        </div>
      )}
    </div>
  );
}