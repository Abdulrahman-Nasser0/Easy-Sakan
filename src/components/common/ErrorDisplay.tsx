import React from 'react';
import { Button } from '@/components/common/Button';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

export default function ErrorDisplay({ 
  title = 'Something went wrong', 
  message, 
  type = 'error',
  showIcon = true,
  actionButton 
}: ErrorDisplayProps) {
  const colors = {
    error: {
      bg: 'bg-[#fff0f0]',
      border: 'border-[#f5c6c6]',
      iconBg: 'bg-[#fff0f0]',
      iconColor: 'text-[#cc0000]',
      titleColor: 'text-[#cc0000]',
      messageColor: 'text-[#cc0000]',
      buttonBg: 'bg-[#cc0000] hover:bg-[#aa0000]',
    },
    warning: {
      bg: 'bg-[#fff3e0]',
      border: 'border-[#f5d6a3]',
      iconBg: 'bg-[#fff3e0]',
      iconColor: 'text-[#b95000]',
      titleColor: 'text-[#b95000]',
      messageColor: 'text-[#b95000]',
      buttonBg: 'bg-[#b95000] hover:bg-[#9a4000]',
    },
    info: {
      bg: 'bg-[#ebf3ff]',
      border: 'border-[#b3d4f5]',
      iconBg: 'bg-[#ebf3ff]',
      iconColor: 'text-[#0071c2]',
      titleColor: 'text-[#0071c2]',
      messageColor: 'text-[#0071c2]',
      buttonBg: 'bg-[#0071c2] hover:bg-[#005999]',
    },
  };

  const colorScheme = colors[type];

  return (
    <div className={`${colorScheme.bg} border ${colorScheme.border} rounded-lg p-6 max-w-md mx-auto`}>
      <div className="flex items-start">
        {showIcon && (
          <div className={`shrink-0 ${colorScheme.iconBg} rounded-full p-2 mr-4`}>
            {type === 'error' && (
              <svg className={`w-6 h-6 ${colorScheme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {type === 'warning' && (
              <svg className={`w-6 h-6 ${colorScheme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {type === 'info' && (
              <svg className={`w-6 h-6 ${colorScheme.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        )}
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${colorScheme.titleColor} mb-2`}>
            {title}
          </h3>
          <p className={`text-sm ${colorScheme.messageColor} leading-relaxed`}>
            {message}
          </p>
          {actionButton && (
            <Button
              onClick={actionButton.onClick}
              className={`mt-4 ${colorScheme.buttonBg} text-white px-4 py-2 rounded-md text-sm font-medium`}
              style={{ minWidth: 120 }}
            >
              {actionButton.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
