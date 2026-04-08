"use client";

// Reusable skeleton primitives with shimmer animation

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn("h-3 bg-lumina-200/60 dark:bg-lumina-800/60 rounded-md animate-pulse", className)} />
  );
}

export function SkeletonCircle({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full bg-lumina-200/60 dark:bg-lumina-800/60 animate-pulse", className)} />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-100 dark:border-lumina-800 p-5 animate-pulse", className)}
      style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-3 mb-4">
        <SkeletonCircle className="w-8 h-8" />
        <SkeletonLine className="w-32 h-4" />
      </div>
      <div className="space-y-2.5">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-3/5" />
      </div>
    </div>
  );
}

export function SkeletonTaskCard() {
  return (
    <div className="bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-200/60 dark:border-lumina-800 p-4 animate-pulse"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-start gap-3">
        <SkeletonCircle className="w-2.5 h-2.5 mt-1.5" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-3/4 h-4" />
          <SkeletonLine className="w-1/2 h-3" />
          <div className="flex gap-2">
            <SkeletonLine className="w-12 h-5 rounded-md" />
            <SkeletonLine className="w-16 h-5 rounded-md" />
            <SkeletonLine className="w-10 h-5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SkeletonCircle className="w-10 h-10" />
        <div className="space-y-2">
          <SkeletonLine className="w-40 h-5" />
          <SkeletonLine className="w-56 h-3" />
        </div>
      </div>

      {/* Briefing card */}
      <div className="bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-100 dark:border-lumina-800 p-5 mb-5"
        style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-start gap-3 mb-4">
          <SkeletonCircle className="w-11 h-11" />
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-48 h-5" />
            <SkeletonLine className="w-72 h-3" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-lumina-50 dark:bg-lumina-800/50 rounded-xl p-3.5 space-y-2">
            <SkeletonLine className="w-24 h-3" />
            <SkeletonLine className="w-full h-3" />
            <SkeletonLine className="w-4/5 h-3" />
          </div>
          <div className="bg-lumina-50 dark:bg-lumina-800/50 rounded-xl p-3.5 space-y-2">
            <SkeletonLine className="w-24 h-3" />
            <SkeletonLine className="w-full h-3" />
            <SkeletonLine className="w-3/5 h-3" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SkeletonCard className="lg:col-span-2" />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function TasksSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <SkeletonLine className="w-24 h-6" />
          <SkeletonLine className="w-48 h-3" />
        </div>
        <SkeletonLine className="w-24 h-10 rounded-xl" />
      </div>
      <SkeletonLine className="w-full h-10 rounded-xl mb-4" />
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonLine key={i} className="w-20 h-9 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonTaskCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="flex flex-col h-full p-3 md:p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SkeletonLine className="w-16 h-8 rounded-lg" />
          <SkeletonLine className="w-8 h-8 rounded-lg" />
          <SkeletonLine className="w-8 h-8 rounded-lg" />
          <SkeletonLine className="w-40 h-6 ml-2" />
        </div>
        <SkeletonLine className="w-48 h-9 rounded-xl" />
      </div>
      <div className="flex-1 bg-white dark:bg-lumina-900 rounded-2xl border border-lumina-100 dark:border-lumina-800 p-4 animate-pulse">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <SkeletonLine key={i} className="h-8 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonLine key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
