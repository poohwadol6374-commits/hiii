"use client";

interface LumaLogoProps {
  size?: number;
  className?: string;
}

export default function LumaLogo({ size = 40, className = "" }: LumaLogoProps) {
  return (
    <div
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Gradient background with rounded corners */}
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="luma-bg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E91E90" />
            <stop offset="50%" stopColor="#C2185B" />
            <stop offset="100%" stopColor="#AD1457" />
          </linearGradient>
          <linearGradient id="luma-glow" x1="30" y1="30" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
          </linearGradient>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background rounded square */}
        <rect x="2" y="2" width="76" height="76" rx="18" fill="url(#luma-bg)" />

        {/* Robot head */}
        <ellipse cx="40" cy="40" rx="16" ry="13" fill="white" opacity="0.95" />

        {/* Eyes */}
        <circle cx="34" cy="39" r="3.5" fill="url(#luma-bg)" filter="url(#eye-glow)" opacity="0.8" />
        <circle cx="46" cy="39" r="3.5" fill="url(#luma-bg)" filter="url(#eye-glow)" opacity="0.8" />
        <circle cx="34" cy="38.5" r="1.2" fill="white" />
        <circle cx="46" cy="38.5" r="1.2" fill="white" />

        {/* Antennas */}
        <line x1="34" y1="28" x2="32" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <circle cx="32" cy="21" r="2.5" fill="white" opacity="0.9" />
        <line x1="46" y1="28" x2="48" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <circle cx="48" cy="21" r="2.5" fill="white" opacity="0.9" />

        {/* Ears */}
        <ellipse cx="22" cy="40" rx="3" ry="5" fill="white" opacity="0.8" />
        <ellipse cx="58" cy="40" rx="3" ry="5" fill="white" opacity="0.8" />

        {/* Chat bubble chin */}
        <path d="M34 52 Q40 58 46 52 L43 57 Q40 62 37 57 Z" fill="white" opacity="0.9" />

        {/* Sparkle */}
        <g opacity="0.9">
          <path d="M58 18 L59.5 22 L63 23.5 L59.5 25 L58 29 L56.5 25 L53 23.5 L56.5 22 Z" fill="white" />
          <path d="M62 28 L62.8 30 L64.5 30.8 L62.8 31.5 L62 33.5 L61.2 31.5 L59.5 30.8 L61.2 30 Z" fill="white" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
