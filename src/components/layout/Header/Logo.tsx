import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 bg-[#0071c2] rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-4-4m0 0V5m4 4l4 4" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#1a1a2e]">Easy Sakan</span>
        <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Property Booking Platform</span>
      </div>
    </Link>
  );
}
