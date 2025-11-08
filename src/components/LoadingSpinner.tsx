import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  overlay?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  message,
  className = '',
  variant = 'spinner',
  overlay = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const renderSpinner = () => {
    if (variant === 'dots') {
      return (
        <div className="flex space-x-1">
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`} style={{ animationDelay: '0ms' }}></div>
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`} style={{ animationDelay: '150ms' }}></div>
          <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`} style={{ animationDelay: '300ms' }}></div>
        </div>
      );
    }

    if (variant === 'pulse') {
      return (
        <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
      );
    }

    // Default spinner
    return (
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    );
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderSpinner()}
      {message && (
        <p className={`${textSizes[size]} text-gray-600 dark:text-gray-300 font-medium`}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

// Loading skeleton components
export function LoadingSkeleton({ className = '', rows = 3 }: { className?: string; rows?: number }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i === rows - 1 ? 'w-3/4' : 'w-full'}`}></div>
      ))}
    </div>
  );
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}