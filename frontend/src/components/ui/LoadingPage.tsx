import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: 'primary' | 'secondary' | 'white';
}

const LoadingPage = ({
  message = 'Loading...',
  spinnerSize = 'lg',
  spinnerColor = 'primary'
}: LoadingPageProps) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingPage; 