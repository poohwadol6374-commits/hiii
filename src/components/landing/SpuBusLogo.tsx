"use client";

interface SpuBusLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SpuBusLogo({ size = "md", className = "" }: SpuBusLogoProps) {
  const sizes = {
    sm: { main: "text-lg", sub: "text-[5px]", bar: "w-4 h-[2px]", gap: "gap-0.5" },
    md: { main: "text-2xl", sub: "text-[7px]", bar: "w-5 h-[3px]", gap: "gap-0.5" },
    lg: { main: "text-4xl", sub: "text-[9px]", bar: "w-7 h-1", gap: "gap-1" },
  };
  const s = sizes[size];

  return (
    <div className={`inline-flex items-end ${s.gap} ${className}`}>
      {/* SPU */}
      <div className="flex flex-col items-end">
        <span className={`${s.main} font-black text-lumina-900 leading-none tracking-tight`}>
          SPU
        </span>
        <div className={`${s.bar} bg-pink-500 rounded-sm mt-0.5 self-end`} />
      </div>

      {/* BUS + subtitle */}
      <div className="flex flex-col">
        <span className={`${s.main} font-extrabold leading-none tracking-tight`}
          style={{ background: "linear-gradient(135deg, #4FC3F7, #2196F3, #1565C0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          BUS
        </span>
        <div className="flex flex-col mt-0.5">
          <span className={`${s.sub} font-bold text-lumina-900 leading-tight tracking-wider`}>
            SCHOOL OF
          </span>
          <span className={`${s.sub} font-bold text-lumina-900 leading-tight tracking-wider`}>
            BUSINESS ADMINISTRATION
          </span>
        </div>
      </div>
    </div>
  );
}
