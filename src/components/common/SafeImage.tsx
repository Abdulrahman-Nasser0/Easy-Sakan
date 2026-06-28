'use client';

import { useState } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export default function SafeImage({ src, alt, className, fallbackClassName }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`${fallbackClassName ?? className ?? ''} flex items-center justify-center bg-gray-100 text-gray-300`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
        </svg>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
}
