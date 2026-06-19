'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface AccountDropdownProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export default function AccountDropdown({ isAuthenticated = false, userName = 'U', onLogout }: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 bg-[#0071c2] rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-[#005999] transition-colors"
      >
        {userName?.charAt(0)?.toUpperCase() || 'U'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-[#1a1a2e]">{userName || 'User'}</p>
          </div>
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f2f6fc] hover:text-[#0071c2] transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f2f6fc] hover:text-[#0071c2] transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={() => { setOpen(false); onLogout?.(); }}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-[#cc0000] hover:bg-[#fff0f0] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
