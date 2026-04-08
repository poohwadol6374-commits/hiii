"use client";

interface SpuBusLogoProps {
  height?: number;
  className?: string;
}

export default function SpuBusLogo({ height = 32, className = "" }: SpuBusLogoProps) {
  const scale = height / 50;
  const w = Math.round(260 * scale);
  return (
    <svg width={w} height={height} viewBox="0 0 260 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bus-text-grad" x1="95" y1="0" x2="170" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="50%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      {/* SPU - black bold */}
      <text x="0" y="32" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="38" fill="#1A1F2B" letterSpacing="-2">
        SPU
      </text>
      {/* Pink underline bar under SPU */}
      <rect x="82" y="36" width="24" height="5" rx="1" fill="#E91E90" />
      {/* BUS - blue gradient */}
      <text x="88" y="32" fontFamily="Inter, Arial, sans-serif" fontWeight="800" fontSize="38" fill="url(#bus-text-grad)" letterSpacing="-1">
        BUS
      </text>
      {/* SCHOOL OF */}
      <text x="170" y="26" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" fill="#1A1F2B" letterSpacing="0.5">
        SCHOOL OF
      </text>
      {/* BUSINESS ADMINISTRATION */}
      <text x="170" y="38" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" fill="#1A1F2B" letterSpacing="0.5">
        BUSINESS ADMINISTRATION
      </text>
    </svg>
  );
}
