import React from 'react';
import { Button } from '@/components/common/Button';

interface EmptyStateProps {
  icon?: 'search' | 'box' | 'alert';
  title: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  icon = 'box', 
  title, 
  message, 
  actionButton 
}: EmptyStateProps) {
  const icons = {
    search: (
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    box: (
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    alert: (
      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        {icons[icon]}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {message}
      </p>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          variant="primary"
          className="px-6 py-3 rounded-md font-medium"
        >
          {actionButton.text}
        </Button>
      )}
    </div>
  );
}
