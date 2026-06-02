'use client';

import Link from 'next/link';

interface AccountDropdownProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export default function AccountDropdown({ isAuthenticated = false, userName = 'U', onLogout }: AccountDropdownProps) {
  if (!isAuthenticated) return null;

  return (
    <div className="relative group">
      <button className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-sky-600 transition-colors">
        {userName?.charAt(0)?.toUpperCase() || 'U'}
      </button>
      <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="px-4 py-3 border-b border-slate-700">
          <p className="text-sm font-medium text-white">{userName || 'User'}</p>
        </div>
        <div className="py-2">
          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
            👤 Profile
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
            ⚙️ Settings
          </Link>
          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-300 hover:bg-slate-700/50 hover:text-red-200 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
