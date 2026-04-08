"use client";

interface SpuBusLogoProps {
  height?: number;
  className?: string;
}

export default function SpuBusLogo({ height = 28, className = "" }: SpuBusLogoProps) {
  const w = height * 3.2;
  return (
    <svg width={w} height={height} viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bus-grad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00BCD4" />
          <stop offset="50%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
      </defs>
      {/* SPU text */}
      <text x="0" y="32" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="34" fill="url(#bus-grad)" letterSpacing="-1">
        SPU
      </text>
      {/* Pink underline bar */}
      <rect x="72" y="36" width="22" height="5" rx="1" fill="#E91E90" />
      {/* BUS text */}
      <text x="72" y="32" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="34" fill="url(#bus-grad)" letterSpacing="-1">
        BUS
      </text>
      {/* Subtitle */}
      <text x="0" y="48" fontFamily="Inter, Arial, sans-serif" fontWeight="500" fontSize="7" fill="#9AA0A9" letterSpacing="0.5">
        SRIPATUM UNIVERSITY · BUSINESS
      </text>
    </svg>
  );
}
