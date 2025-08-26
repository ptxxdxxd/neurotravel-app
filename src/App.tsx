import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">
            NeuroTravel
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-Powered Travel Planning for Neurodivergent Travelers
          </p>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              ✈️ Sensory-friendly accommodations
            </p>
            <p className="text-lg text-gray-700">
              🧠 AI travel companion
            </p>
            <p className="text-lg text-gray-700">
              🗺️ Personalized itineraries
            </p>
          </div>
          <div className="mt-12">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
              Start Planning Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
