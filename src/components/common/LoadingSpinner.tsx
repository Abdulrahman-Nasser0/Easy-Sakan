import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-4',
  };

  const containerClass = fullScreen
    ? "min-h-screen bg-white flex items-center justify-center"
    : "flex justify-center items-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-[#0071c2] mx-auto`}></div>
      </div>
    </div>
  );
}
