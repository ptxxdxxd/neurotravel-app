import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TestTube, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

interface TestAccountCreatorProps {
  onAccountCreated?: (account: { email: string; password: string }) => void;
}

export default function TestAccountCreator({ onAccountCreated }: TestAccountCreatorProps) {
  const { createTestAccount, signIn } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [testAccounts, setTestAccounts] = useState<Array<{ email: string; password: string; created: Date }>>([]);
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const generateRandomAccount = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const email = `testuser${randomId}@gmail.com`;
    const password = `TestPass${randomId}123!`;
    return { email, password };
  };

  const createAccount = async (email: string, password: string, isCustom: boolean = false) => {
    setIsCreating(true);
    setMessage(null);

    try {
      console.log('Creating test account:', email);
      
      // Try the enhanced test account creation first
      const { data, error } = await createTestAccount(email, password);
      
      if (error) {
        console.warn('Enhanced creation failed, trying standard signup:', error);
        throw error;
      }

      console.log('Test account created successfully:', data);
      
      const newAccount = { email, password, created: new Date() };
      setTestAccounts(prev => [newAccount, ...prev]);
      
      setMessage({ 
        type: 'success', 
        text: `Test account created successfully! Email: ${email}` 
      });
      
      if (onAccountCreated) {
        onAccountCreated(newAccount);
      }
      
      // Clear custom fields if this was a custom account
      if (isCustom) {
        setCustomEmail('');
        setCustomPassword('');
      }
    } catch (error: any) {
      console.error('Error creating test account:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to create account: ${error.message || 'Unknown error'}. Try a different email.` 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickCreate = async () => {
    const account = generateRandomAccount();
    await createAccount(account.email, account.password);
  };

  const handleCustomCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customPassword) {
      setMessage({ type: 'error', text: 'Please enter both email and password' });
      return;
    }
    await createAccount(customEmail, customPassword, true);
  };

  const handleTestLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Successfully logged in!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Login failed: ${error.message}` });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TestTube className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Assistant Testing Tool
        </h2>
        <p className="text-gray-600">
          Create test accounts that bypass email verification for seamless AI testing
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Quick Account Creation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Quick Test Account
        </h3>
        <p className="text-gray-600 mb-4">
          Generate a random test account with instant activation
        </p>
        <button
          onClick={handleQuickCreate}
          disabled={isCreating}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </span>
          ) : (
            'Create Random Test Account'
          )}
        </button>
      </div>

      {/* Custom Account Creation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Custom Test Account
        </h3>
        <form onSubmit={handleCustomCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="testuser@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              type="password"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="Enter a secure password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Custom Account'}
          </button>
        </form>
      </div>

      {/* Created Accounts List */}
      {testAccounts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Created Test Accounts
          </h3>
          <div className="space-y-3">
            {testAccounts.map((account, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{account.email}</p>
                    <p className="text-sm text-gray-600">Password: {account.password}</p>
                    <p className="text-xs text-gray-500">
                      Created: {account.created.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTestLogin(account.email, account.password)}
                    className="ml-4 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Test Login
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Test accounts bypass email verification for immediate testing</li>
          <li>• Accounts work with all NeuroTravel features including AI Assistant</li>
          <li>• Use these accounts only for testing purposes</li>
          <li>• Save credentials if you need to test specific user journeys</li>
        </ul>
      </div>
    </div>
  );
}