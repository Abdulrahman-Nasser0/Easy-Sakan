import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 shrink-0">
        <Image
          src="/Logo.png"
          alt=""
          width={40}
          height={40}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#1a1a2e]">Easy Sakan</span>
        <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Property Booking Platform</span>
      </div>
    </Link>
  );
}
