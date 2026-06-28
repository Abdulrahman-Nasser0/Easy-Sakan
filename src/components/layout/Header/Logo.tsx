import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <Image
        src="/Logo.png"
        alt="Easy Sakan"
        width={140}
        height={48}
        className="h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}
