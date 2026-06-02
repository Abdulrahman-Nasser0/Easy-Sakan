'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/properties?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search properties..."
        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-colors text-sm"
      />
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg className="h-4 w-4 text-slate-400 group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
