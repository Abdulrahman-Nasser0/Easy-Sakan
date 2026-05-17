'use client';

import React, { ReactNode } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * Client-side layout wrapper that provides error boundary coverage
 * for the entire app. Must be a client component since ErrorBoundary
 * uses React lifecycle methods.
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
