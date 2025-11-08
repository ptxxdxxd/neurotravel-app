import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../lib/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../lib/ui/card';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
  variant?: 'inline' | 'page' | 'toast';
}

export default function ErrorDisplay({
  error,
  onRetry,
  onGoHome,
  className = '',
  variant = 'inline'
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('fetch') ||
                        errorMessage.toLowerCase().includes('connection');
  
  const isAuthError = errorMessage.toLowerCase().includes('auth') ||
                     errorMessage.toLowerCase().includes('unauthorized') ||
                     errorMessage.toLowerCase().includes('login');

  if (variant === 'toast') {
    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md ${className}`}>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {errorMessage}
                </p>
                {onRetry && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRetry}
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-100"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6 ${className}`}>
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {isNetworkError ? 'Connection Problem' : 
               isAuthError ? 'Authentication Required' : 'Something Went Wrong'}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {isNetworkError ? 'Please check your internet connection and try again.' :
               isAuthError ? 'Please sign in to continue using NeuroTravel.' :
               'We encountered an unexpected error. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-mono">{errorMessage}</p>
            </div>
            
            <div className="flex space-x-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onGoHome && (
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              If this problem persists, please contact support at{' '}
              <a href="mailto:support@neurotravel.com" className="text-blue-600 hover:underline">
                support@neurotravel.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {isNetworkError ? 'Connection Error' : 
             isAuthError ? 'Authentication Error' : 'Error'}
          </p>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            {errorMessage}
          </p>
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="mt-2 text-red-600 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}