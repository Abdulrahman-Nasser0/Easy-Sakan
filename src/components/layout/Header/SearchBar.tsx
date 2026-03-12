import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  isMobile?: boolean;
  placeholder?: string;
  onMenuClose?: () => void;
}

export default function SearchBar({ isMobile = false, placeholder = "Search properties, locations, amenities...", onMenuClose }: SearchBarProps) {
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      // Close mobile menu after search
      if (isMobile && onMenuClose) {
        onMenuClose();
      }
    }
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties..."
          className="w-full pl-4 pr-12 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
          onClick={() => {
            if (searchQuery.trim()) {
              handleSearch({ preventDefault: () => {} } as React.FormEvent);
            }
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 text-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </form>
    </div>
  );
}