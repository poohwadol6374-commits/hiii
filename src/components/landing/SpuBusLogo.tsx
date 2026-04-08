"use client";

/* eslint-disable @next/next/no-img-element */

interface SpuBusLogoProps {
  height?: number;
  className?: string;
}

export default function SpuBusLogo({ height = 32, className = "" }: SpuBusLogoProps) {
  return (
    <img
      src="/spu-bus-logo.png"
      alt="SPU BUS - School of Business Administration, Sripatum University"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
    />
  );
}
