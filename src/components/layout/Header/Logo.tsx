import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-4-4m0 0V5m4 4l4 4" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Easy Sakan
        </span>
        <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Property Booking Platform</span>
      </div>
    </Link>
  );
}