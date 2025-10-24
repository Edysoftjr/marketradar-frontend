import Image from "next/image";
import Link from "next/link";

interface BrandHeaderProps {
  href?: string;
  className?: string;
}

export function BrandHeader({ href = "/", className = "" }: BrandHeaderProps) {
  return (
    <Link href={href} className={`flex items-center ${className}`}>
      <Image
        alt="MarketRadar App"
        src="/foodrlogo.png"
        width={120}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
      <span className="text-xl font-bold">MarketRadar</span>
    </Link>
  );
}
