import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Badge } from '../lib/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../lib/ui/tabs';
import { ArrowLeft, Edit, Calendar, MapPin, Users, DollarSign, Shield, Plane, Clock } from 'lucide-react';

interface TravelPlan {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travel_type: string;
  budget_range: string;
  travel_companions: number;
  accommodation_details: any;
  transportation_details: any;
  accessibility_requirements: string[];
  emergency_plan: any;
  backup_plans: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function TripManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trips, setTrips] = useState<TravelPlan[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  useEffect(() => {
    if (tripId && trips.length > 0) {
      const trip = trips.find(t => t.id === tripId);
      setSelectedTrip(trip || null);
    }
  }, [tripId, trips]);

  const loadTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedTrip(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Trips</span>
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTrip.title}</h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedTrip.destination}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(selectedTrip.status)}>
                  {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                </Badge>
                <Button 
                  onClick={() => navigate(`/trip-planning?edit=${selectedTrip.id}`)}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Trip</span>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="transportation">Transportation</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Trip Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {calculateDuration(selectedTrip.start_date, selectedTrip.end_date)} days
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedTrip.start_date)} - {formatDate(selectedTrip.end_date)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Travelers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedTrip.travel_companions}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedTrip.travel_companions === 1 ? 'Solo traveler' : 'Including companions'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-purple-600">
                      {selectedTrip.budget_range}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedTrip.travel_type.charAt(0).toUpperCase() + selectedTrip.travel_type.slice(1)} travel
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accommodation Preferences</CardTitle>
                  <CardDescription>Your sensory and comfort preferences for accommodations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Room Preferences</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>Room Type: {selectedTrip.accommodation_details?.room_type || 'Not specified'}</li>
                        <li>Noise Level: {selectedTrip.accommodation_details?.noise_level || 'Not specified'}</li>
                        <li>Lighting: {selectedTrip.accommodation_details?.lighting_preferences || 'Not specified'}</li>
                        <li>Floor Preference: {selectedTrip.accommodation_details?.floor_preferences || 'Not specified'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600">
                        {selectedTrip.accommodation_details?.special_requests || 'No special requests specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transportation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transportation Details</CardTitle>
                  <CardDescription>Your transportation preferences and requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Travel Preferences</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>Mode: {selectedTrip.transportation_details?.mode || 'Not specified'}</li>
                        <li>Seating: {selectedTrip.transportation_details?.seating_preference || 'Not specified'}</li>
                        <li>Motion Sensitivity: {selectedTrip.transportation_details?.motion_sensitivity || 'Not specified'}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Additional Needs</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>Assistance Needed: {selectedTrip.transportation_details?.assistance_needed ? 'Yes' : 'No'}</li>
                        <li>Early Boarding: {selectedTrip.transportation_details?.early_boarding ? 'Requested' : 'Not needed'}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Requirements</CardTitle>
                  <CardDescription>All accessibility features and accommodations for this trip</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedTrip.accessibility_requirements && selectedTrip.accessibility_requirements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTrip.accessibility_requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                          <Shield className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No specific accessibility requirements specified for this trip.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Preparedness</CardTitle>
                  <CardDescription>Safety planning and emergency contacts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Emergency Contacts</h4>
                    {selectedTrip.emergency_plan?.emergency_contacts && selectedTrip.emergency_plan.emergency_contacts.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTrip.emergency_plan.emergency_contacts.map((contact: any, index: number) => (
                          <div key={index} className="p-3 bg-red-50 rounded-lg">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.phone} - {contact.relationship}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No emergency contacts specified.</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Medical Information</h4>
                    <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded-lg">
                      {selectedTrip.emergency_plan?.medical_conditions || 'No medical information specified.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Backup Plans</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Overwhelm Management</h5>
                        <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                          {selectedTrip.backup_plans?.overwhelm_plan || 'No plan specified.'}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Emergency Exit Strategy</h5>
                        <p className="text-sm text-gray-600 p-3 bg-green-50 rounded-lg">
                          {selectedTrip.backup_plans?.emergency_exit_strategy || 'No strategy specified.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
              <p className="text-gray-600">Manage all your travel plans in one place</p>
            </div>
            <Button 
              onClick={() => navigate('/trip-planning')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plane className="h-4 w-4" />
              <span>Plan New Trip</span>
            </Button>
          </div>
        </div>

        {trips.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips planned yet</h3>
              <p className="text-gray-600 mb-6">Start planning your first accessible travel experience!</p>
              <Button 
                onClick={() => navigate('/trip-planning')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Plan Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card 
                key={trip.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTrip(trip)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {calculateDuration(trip.start_date, trip.end_date)} days
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {trip.travel_companions} {trip.travel_companions === 1 ? 'traveler' : 'travelers'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {trip.budget_range}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}