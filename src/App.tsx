import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import TripPlanning from './components/TripPlanning';
import PricingPage from './components/PricingPage';
import TestAccountCreator from './components/TestAccountCreator';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutPage from './components/AboutPage';
import OnboardingTour, { useOnboarding } from './components/OnboardingTour';
import { useAuth } from './contexts/AuthContext';
import { initializeAnalytics, analytics } from './utils/analytics';
import { initializeErrorMonitoring, errorMonitor } from './utils/errorMonitoring';
import { registerServiceWorker } from './utils/performance';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Main App component with onboarding
function AppContent() {
  const { user, loading } = useAuth();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  useEffect(() => {
    // Set user for analytics and error monitoring
    if (user) {
      analytics.setUser(user.id, {
        userId: user.id,
        registrationDate: user.created_at
      });
      errorMonitor.setUser(user.id);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading NeuroTravel..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip-planning" element={<TripPlanning />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/test-accounts" element={<TestAccountCreator />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Onboarding tour for authenticated users */}
      {user && showOnboarding && (
        <OnboardingTour
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize monitoring and analytics
    initializeAnalytics();
    initializeErrorMonitoring();
    registerServiceWorker();
    
    // Set up global error handling
    window.addEventListener('error', (event) => {
      errorMonitor.reportError(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    console.log('NeuroTravel initialized with enhanced monitoring and analytics');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;