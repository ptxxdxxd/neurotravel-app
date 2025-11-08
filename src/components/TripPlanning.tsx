import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';
import { Input } from '../lib/ui/input';
import { Label } from '../lib/ui/label';
import { Textarea } from '../lib/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../lib/ui/select';
import { Checkbox } from '../lib/ui/checkbox';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Shield, Brain, Heart, Plus, Trash2 } from 'lucide-react';

interface TripFormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travel_type: string;
  budget_range: string;
  travel_companions: number;
  accommodation_details: {
    room_type: string;
    noise_level: string;
    lighting_preferences: string;
    floor_preferences: string;
    special_requests: string;
  };
  transportation_details: {
    mode: string;
    seating_preference: string;
    assistance_needed: boolean;
    motion_sensitivity: string;
    early_boarding: boolean;
  };
  accessibility_requirements: string[];
  emergency_plan: {
    emergency_contacts: { name: string; phone: string; relationship: string }[];
    medical_conditions: string;
    medications: string[];
    sensory_triggers: string[];
    coping_strategies: string[];
  };
  backup_plans: {
    overwhelm_plan: string;
    quiet_spaces: string;
    emergency_exit_strategy: string;
  };
  itinerary_days: ItineraryDay[];
}

interface ItineraryDay {
  day_number: number;
  date: string;
  morning_activities: Activity[];
  afternoon_activities: Activity[];
  evening_activities: Activity[];
  break_times: string[];
  sensory_breaks: string[];
  accessibility_notes: string;
  energy_level_required: 'low' | 'moderate' | 'high';
  estimated_crowds: 'minimal' | 'moderate' | 'busy' | 'very_busy';
}

interface Activity {
  id: string;
  name: string;
  location: string;
  time: string;
  duration: string;
  sensory_considerations: string;
  accessibility_notes: string;
  backup_plan: string;
}

const TRAVEL_TYPES = [
  { value: 'leisure', label: 'Leisure/Vacation' },
  { value: 'business', label: 'Business Travel' },
  { value: 'medical', label: 'Medical Appointment' },
  { value: 'family', label: 'Family Visit' },
  { value: 'educational', label: 'Educational/Conference' },
  { value: 'other', label: 'Other' }
];

const BUDGET_RANGES = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: 'over-5000', label: 'Over $5,000' }
];

const ACCESSIBILITY_OPTIONS = [
  'Quiet accommodations',
  'Low sensory environments',
  'Flexible scheduling',
  'Written communication preferred',
  'Visual schedules needed',
  'Assistance with navigation',
  'Dietary accommodations',
  'Medication storage',
  'Emergency contact protocols',
  'Sensory break spaces',
  'Predictable routines',
  'Noise-canceling options'
];

export default function TripPlanning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editTripId = searchParams.get('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
    travel_type: '',
    budget_range: '',
    travel_companions: 1,
    accommodation_details: {
      room_type: '',
      noise_level: 'quiet',
      lighting_preferences: 'adjustable',
      floor_preferences: 'lower',
      special_requests: ''
    },
    transportation_details: {
      mode: '',
      seating_preference: 'window',
      assistance_needed: false,
      motion_sensitivity: 'low',
      early_boarding: false
    },
    accessibility_requirements: [],
    emergency_plan: {
      emergency_contacts: [{ name: '', phone: '', relationship: '' }],
      medical_conditions: '',
      medications: [],
      sensory_triggers: [],
      coping_strategies: []
    },
    backup_plans: {
      overwhelm_plan: '',
      quiet_spaces: '',
      emergency_exit_strategy: ''
    },
    itinerary_days: []
  });

  const totalSteps = 6;

  // Load existing trip data for editing
  useEffect(() => {
    if (editTripId && user) {
      loadTripForEditing(editTripId);
    }
  }, [editTripId, user]);

  const loadTripForEditing = async (tripId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .eq('id', tripId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setIsEditing(true);
        setFormData({
          title: data.title || '',
          destination: data.destination || '',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          travel_type: data.travel_type || '',
          budget_range: data.budget_range || '',
          travel_companions: data.travel_companions || 1,
          accommodation_details: data.accommodation_details || {
            room_type: '',
            noise_level: 'quiet',
            lighting_preferences: 'adjustable',
            floor_preferences: 'lower',
            special_requests: ''
          },
          transportation_details: data.transportation_details || {
            mode: '',
            seating_preference: 'window',
            assistance_needed: false,
            motion_sensitivity: 'low',
            early_boarding: false
          },
          accessibility_requirements: data.accessibility_requirements || [],
          emergency_plan: data.emergency_plan || {
            emergency_contacts: [{ name: '', phone: '', relationship: '' }],
            medical_conditions: '',
            medications: [],
            sensory_triggers: [],
            coping_strategies: []
          },
          backup_plans: data.backup_plans || {
            overwhelm_plan: '',
            quiet_spaces: '',
            emergency_exit_strategy: ''
          },
          itinerary_days: data.itinerary || []
        });
      }
    } catch (error) {
      console.error('Error loading trip for editing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate itinerary days based on date range
  const generateItineraryDays = () => {
    if (!formData.start_date || !formData.end_date) return;
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const days: ItineraryDay[] = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push({
        day_number: days.length + 1,
        date: d.toISOString().split('T')[0],
        morning_activities: [],
        afternoon_activities: [],
        evening_activities: [],
        break_times: ['10:00 AM', '3:00 PM'],
        sensory_breaks: ['After busy activities', 'Before crowds'],
        accessibility_notes: '',
        energy_level_required: 'moderate',
        estimated_crowds: 'moderate'
      });
    }
    
    setFormData(prev => ({ ...prev, itinerary_days: days }));
  };

  // Add activity to a specific day and time period
  const addActivity = (dayIndex: number, period: 'morning' | 'afternoon' | 'evening') => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: '',
      location: '',
      time: '',
      duration: '',
      sensory_considerations: '',
      accessibility_notes: '',
      backup_plan: ''
    };
    
    setFormData(prev => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((day, index) => 
        index === dayIndex ? {
          ...day,
          [`${period}_activities`]: [...day[`${period}_activities`], newActivity]
        } : day
      )
    }));
  };

  // Update activity
  const updateActivity = (dayIndex: number, period: 'morning' | 'afternoon' | 'evening', activityIndex: number, field: keyof Activity, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((day, dIndex) => 
        dIndex === dayIndex ? {
          ...day,
          [`${period}_activities`]: day[`${period}_activities`].map((activity, aIndex) => 
            aIndex === activityIndex ? { ...activity, [field]: value } : activity
          )
        } : day
      )
    }));
  };

  // Remove activity
  const removeActivity = (dayIndex: number, period: 'morning' | 'afternoon' | 'evening', activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((day, dIndex) => 
        dIndex === dayIndex ? {
          ...day,
          [`${period}_activities`]: day[`${period}_activities`].filter((_, aIndex) => aIndex !== activityIndex)
        } : day
      )
    }));
  };

  // Update day-level information
  const updateItineraryDay = (dayIndex: number, field: keyof ItineraryDay, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary_days: prev.itinerary_days.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const updateFormData = (section: keyof TripFormData, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const updateBasicField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergency_plan: {
        ...prev.emergency_plan,
        emergency_contacts: [...prev.emergency_plan.emergency_contacts, { name: '', phone: '', relationship: '' }]
      }
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency_plan: {
        ...prev.emergency_plan,
        emergency_contacts: prev.emergency_plan.emergency_contacts.map((contact, i) => 
          i === index ? { ...contact, [field]: value } : contact
        )
      }
    }));
  };

  const toggleAccessibilityRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      accessibility_requirements: prev.accessibility_requirements.includes(requirement)
        ? prev.accessibility_requirements.filter(r => r !== requirement)
        : [...prev.accessibility_requirements, requirement]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const tripData = {
        user_id: user.id,
        title: formData.title,
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        travel_type: formData.travel_type,
        budget_range: formData.budget_range,
        travel_companions: formData.travel_companions,
        accommodation_details: formData.accommodation_details,
        transportation_details: formData.transportation_details,
        accessibility_requirements: formData.accessibility_requirements,
        emergency_plan: formData.emergency_plan,
        backup_plans: formData.backup_plans,
        itinerary: formData.itinerary_days,
        status: 'planning'
      };

      let tripResult;
      
      if (isEditing && editTripId) {
        // Update existing trip
        const { data, error } = await supabase
          .from('travel_plans')
          .update(tripData)
          .eq('id', editTripId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        tripResult = data;
      } else {
        // Create new trip
        const { data, error } = await supabase
          .from('travel_plans')
          .insert(tripData)
          .select()
          .single();
        
        if (error) throw error;
        tripResult = data;
      }

      // Save itinerary days to separate table
      if (formData.itinerary_days.length > 0 && tripResult) {
        // First, delete existing itinerary days if editing
        if (isEditing) {
          await supabase
            .from('trip_itinerary_days')
            .delete()
            .eq('trip_id', tripResult.id);
        }
        
        // Insert new itinerary days
        const itineraryData = formData.itinerary_days.map(day => ({
          trip_id: tripResult.id,
          day_number: day.day_number,
          date: day.date,
          morning_activities: day.morning_activities,
          afternoon_activities: day.afternoon_activities,
          evening_activities: day.evening_activities,
          break_times: day.break_times,
          sensory_breaks: day.sensory_breaks,
          accessibility_notes: day.accessibility_notes,
          energy_level_required: day.energy_level_required,
          estimated_crowds: day.estimated_crowds
        }));
        
        await supabase
          .from('trip_itinerary_days')
          .insert(itineraryData);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep />;
      case 2:
        return <AccommodationStep />;
      case 3:
        return <TransportationStep />;
      case 4:
        return <AccessibilityStep />;
      case 5:
        return <ItineraryStep />;
      case 6:
        return <EmergencyPlanStep />;
      default:
        return <BasicDetailsStep />;
    }
  };

  const BasicDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Basic Details</h2>
        <p className="text-gray-600">Let's start with the essential information about your trip</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Trip Title</Label>
          <Input
            id="title"
            placeholder="e.g., Tokyo Adventure 2025"
            value={formData.title}
            onChange={(e) => updateBasicField('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="e.g., Tokyo, Japan"
            value={formData.destination}
            onChange={(e) => updateBasicField('destination', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => updateBasicField('start_date', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => updateBasicField('end_date', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="travel_type">Purpose of Travel</Label>
          <Select value={formData.travel_type} onValueChange={(value) => updateBasicField('travel_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select travel purpose" />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="budget_range">Budget Range</Label>
          <Select value={formData.budget_range} onValueChange={(value) => updateBasicField('budget_range', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map(budget => (
                <SelectItem key={budget.value} value={budget.value}>{budget.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="travel_companions">Number of Travel Companions</Label>
          <Input
            id="travel_companions"
            type="number"
            min="1"
            value={formData.travel_companions}
            onChange={(e) => updateBasicField('travel_companions', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
    </div>
  );

  const AccommodationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accommodation Preferences</h2>
        <p className="text-gray-600">Help us find the perfect sensory-friendly accommodations for you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="room_type">Room Type Preference</Label>
          <Select 
            value={formData.accommodation_details.room_type} 
            onValueChange={(value) => updateFormData('accommodation_details', 'room_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="double">Double Room</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="accessible">Accessible Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="noise_level">Noise Level Preference</Label>
          <Select 
            value={formData.accommodation_details.noise_level} 
            onValueChange={(value) => updateFormData('accommodation_details', 'noise_level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select noise preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-quiet">Very Quiet (away from elevators/street)</SelectItem>
              <SelectItem value="quiet">Quiet (minimal noise)</SelectItem>
              <SelectItem value="moderate">Moderate noise is okay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lighting_preferences">Lighting Preferences</Label>
          <Select 
            value={formData.accommodation_details.lighting_preferences} 
            onValueChange={(value) => updateFormData('accommodation_details', 'lighting_preferences', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lighting preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dim">Dim lighting preferred</SelectItem>
              <SelectItem value="adjustable">Adjustable lighting</SelectItem>
              <SelectItem value="bright">Bright lighting okay</SelectItem>
              <SelectItem value="blackout">Blackout curtains essential</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="floor_preferences">Floor Preference</Label>
          <Select 
            value={formData.accommodation_details.floor_preferences} 
            onValueChange={(value) => updateFormData('accommodation_details', 'floor_preferences', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select floor preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lower">Lower floors (easier access)</SelectItem>
              <SelectItem value="middle">Middle floors</SelectItem>
              <SelectItem value="higher">Higher floors (quieter)</SelectItem>
              <SelectItem value="no-preference">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="special_requests">Special Accommodation Requests</Label>
          <Textarea
            id="special_requests"
            placeholder="Any additional accommodation needs (e.g., specific textures, temperature control, etc.)"
            value={formData.accommodation_details.special_requests}
            onChange={(e) => updateFormData('accommodation_details', 'special_requests', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const TransportationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transportation Preferences</h2>
        <p className="text-gray-600">Configure your travel preferences for a comfortable journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transport_mode">Primary Transportation Mode</Label>
          <Select 
            value={formData.transportation_details.mode} 
            onValueChange={(value) => updateFormData('transportation_details', 'mode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transportation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flight">Flight</SelectItem>
              <SelectItem value="train">Train</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="car">Car/Drive</SelectItem>
              <SelectItem value="multiple">Multiple modes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seating_preference">Seating Preference</Label>
          <Select 
            value={formData.transportation_details.seating_preference} 
            onValueChange={(value) => updateFormData('transportation_details', 'seating_preference', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select seating preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="window">Window seat</SelectItem>
              <SelectItem value="aisle">Aisle seat</SelectItem>
              <SelectItem value="quiet-area">Quiet area/section</SelectItem>
              <SelectItem value="front">Front of vehicle</SelectItem>
              <SelectItem value="back">Back of vehicle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="motion_sensitivity">Motion Sensitivity</Label>
          <Select 
            value={formData.transportation_details.motion_sensitivity} 
            onValueChange={(value) => updateFormData('transportation_details', 'motion_sensitivity', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select motion sensitivity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High (need stable seating)</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low (motion doesn't bother me)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="assistance_needed"
              checked={formData.transportation_details.assistance_needed}
              onCheckedChange={(checked) => updateFormData('transportation_details', 'assistance_needed', checked)}
            />
            <Label htmlFor="assistance_needed">I may need assistance during travel</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="early_boarding"
              checked={formData.transportation_details.early_boarding}
              onCheckedChange={(checked) => updateFormData('transportation_details', 'early_boarding', checked)}
            />
            <Label htmlFor="early_boarding">Request early boarding when available</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const AccessibilityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accessibility Requirements</h2>
        <p className="text-gray-600">Select all accessibility features and accommodations you need</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACCESSIBILITY_OPTIONS.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox 
              id={option}
              checked={formData.accessibility_requirements.includes(option)}
              onCheckedChange={() => toggleAccessibilityRequirement(option)}
            />
            <Label htmlFor={option} className="text-sm">{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  const ItineraryStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Smart Itinerary Planning</h2>
        <p className="text-gray-600">Plan your daily activities with sensory considerations and accessibility in mind</p>
      </div>
      
      {formData.itinerary_days.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Generate your daily itinerary based on your travel dates</p>
          <Button onClick={generateItineraryDays} className="bg-blue-600 hover:bg-blue-700">
            Generate Itinerary Days
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.itinerary_days.map((day, dayIndex) => (
            <Card key={dayIndex} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Day {day.day_number} - {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Energy Level:</Label>
                      <Select 
                        value={day.energy_level_required} 
                        onValueChange={(value) => updateItineraryDay(dayIndex, 'energy_level_required', value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Expected Crowds:</Label>
                      <Select 
                        value={day.estimated_crowds} 
                        onValueChange={(value) => updateItineraryDay(dayIndex, 'estimated_crowds', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="very_busy">Very Busy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Morning Activities */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-green-700">Morning Activities</h4>
                    <Button 
                      size="sm" 
                      onClick={() => addActivity(dayIndex, 'morning')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Activity
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {day.morning_activities.map((activity, actIndex) => (
                      <div key={activity.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-green-50 rounded-lg">
                        <Input 
                          placeholder="Activity name"
                          value={activity.name}
                          onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'name', e.target.value)}
                        />
                        <Input 
                          placeholder="Location"
                          value={activity.location}
                          onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'location', e.target.value)}
                        />
                        <Input 
                          placeholder="Time (e.g., 9:00 AM)"
                          value={activity.time}
                          onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'time', e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Duration"
                            value={activity.duration}
                            onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'duration', e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeActivity(dayIndex, 'morning', actIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Sensory considerations (e.g., loud environment, bright lights)"
                            value={activity.sensory_considerations}
                            onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'sensory_considerations', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Backup plan if overwhelmed"
                            value={activity.backup_plan}
                            onChange={(e) => updateActivity(dayIndex, 'morning', actIndex, 'backup_plan', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Afternoon Activities */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-yellow-700">Afternoon Activities</h4>
                    <Button 
                      size="sm" 
                      onClick={() => addActivity(dayIndex, 'afternoon')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Activity
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {day.afternoon_activities.map((activity, actIndex) => (
                      <div key={activity.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Input 
                          placeholder="Activity name"
                          value={activity.name}
                          onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'name', e.target.value)}
                        />
                        <Input 
                          placeholder="Location"
                          value={activity.location}
                          onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'location', e.target.value)}
                        />
                        <Input 
                          placeholder="Time (e.g., 2:00 PM)"
                          value={activity.time}
                          onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'time', e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Duration"
                            value={activity.duration}
                            onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'duration', e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeActivity(dayIndex, 'afternoon', actIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Sensory considerations"
                            value={activity.sensory_considerations}
                            onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'sensory_considerations', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Backup plan if overwhelmed"
                            value={activity.backup_plan}
                            onChange={(e) => updateActivity(dayIndex, 'afternoon', actIndex, 'backup_plan', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Activities */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-purple-700">Evening Activities</h4>
                    <Button 
                      size="sm" 
                      onClick={() => addActivity(dayIndex, 'evening')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Activity
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {day.evening_activities.map((activity, actIndex) => (
                      <div key={activity.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-purple-50 rounded-lg">
                        <Input 
                          placeholder="Activity name"
                          value={activity.name}
                          onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'name', e.target.value)}
                        />
                        <Input 
                          placeholder="Location"
                          value={activity.location}
                          onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'location', e.target.value)}
                        />
                        <Input 
                          placeholder="Time (e.g., 7:00 PM)"
                          value={activity.time}
                          onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'time', e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Duration"
                            value={activity.duration}
                            onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'duration', e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => removeActivity(dayIndex, 'evening', actIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Sensory considerations"
                            value={activity.sensory_considerations}
                            onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'sensory_considerations', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Textarea 
                            placeholder="Backup plan if overwhelmed"
                            value={activity.backup_plan}
                            onChange={(e) => updateActivity(dayIndex, 'evening', actIndex, 'backup_plan', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Notes */}
                <div>
                  <Label className="text-sm font-semibold">Daily Accessibility Notes & Considerations</Label>
                  <Textarea 
                    placeholder="Any special notes for this day (break times, sensory considerations, backup plans)"
                    value={day.accessibility_notes}
                    onChange={(e) => updateItineraryDay(dayIndex, 'accessibility_notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const EmergencyPlanStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Preparedness</h2>
        <p className="text-gray-600">Ensure your safety and well-being with proper planning</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-lg font-semibold">Emergency Contacts</Label>
          {formData.emergency_plan.emergency_contacts.map((contact, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 border rounded-lg">
              <Input
                placeholder="Name"
                value={contact.name}
                onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Phone Number"
                value={contact.phone}
                onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
              />
              <Input
                placeholder="Relationship"
                value={contact.relationship}
                onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
              />
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={addEmergencyContact}
            className="mt-2"
          >
            Add Emergency Contact
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medical_conditions">Medical Conditions/Information</Label>
          <Textarea
            id="medical_conditions"
            placeholder="Any medical conditions, allergies, or health information that might be relevant during travel"
            value={formData.emergency_plan.medical_conditions}
            onChange={(e) => updateFormData('emergency_plan', 'medical_conditions', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="overwhelm_plan">Sensory Overload Management Plan</Label>
          <Textarea
            id="overwhelm_plan"
            placeholder="What helps you when feeling overwhelmed? (e.g., quiet space, specific items, coping strategies)"
            value={formData.backup_plans.overwhelm_plan}
            onChange={(e) => updateFormData('backup_plans', 'overwhelm_plan', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergency_exit_strategy">Emergency Exit Strategy</Label>
          <Textarea
            id="emergency_exit_strategy"
            placeholder="If you need to leave a situation quickly, what's your preferred approach?"
            value={formData.backup_plans.emergency_exit_strategy}
            onChange={(e) => updateFormData('backup_plans', 'emergency_exit_strategy', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Trip</h1>
            <p className="text-gray-600">Create a personalized, accessible travel experience</p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div 
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        {/* Form Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}