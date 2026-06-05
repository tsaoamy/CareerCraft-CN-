import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("system-skeleton", className)} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <div className="system-card p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="campaign-hero campaign-hero-workspace pb-6 pt-4">
      <div className="brand-editorial-width w-full space-y-3">
        <Skeleton className="h-6 w-32 rounded-pill" />
        <Skeleton className="h-10 w-48 max-w-lg" />
        <Skeleton className="h-4 w-64 max-w-md" />
      </div>
    </div>
  );
}

export function SkeletonMetric() {
  return (
    <div className="system-card p-5 space-y-3">
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonFeed({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="system-card p-4 flex gap-4">
          <Skeleton className="w-10 h-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
