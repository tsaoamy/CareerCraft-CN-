"use client";

// ==========================================
// Admin Skeleton — 骨架屏加载状态
// ==========================================

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-[#e8e8ed] dark:bg-[#2c2c2e] rounded-full animate-pulse ${className || ''}`} />;
}

export function AdminSkeleton({ type = 'dashboard' }: { type?: 'dashboard' | 'table' | 'card' }) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-48 h-8 bg-[#e8e8ed] rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-[20px] p-5 h-[140px]">
              <div className="flex justify-between mb-4">
                <SkeletonBlock className="w-20 h-4" />
                <SkeletonBlock className="w-9 h-9 !rounded-xl" />
              </div>
              <SkeletonBlock className="w-28 h-8 mb-3" />
              <SkeletonBlock className="w-24 h-3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-[20px] p-6 h-[300px]" />
          <div className="bg-white rounded-[20px] p-6 h-[300px]" />
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-48 h-8 bg-[#e8e8ed] rounded-full" />
        <div className="bg-white rounded-[20px] p-6 space-y-3">
          <SkeletonBlock className="w-full h-10 !rounded-xl" />
          {[1,2,3,4,5].map(i => (
            <SkeletonBlock key={i} className="w-full h-12 !rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 animate-pulse space-y-3">
      <SkeletonBlock className="w-36 h-5" />
      <SkeletonBlock className="w-full h-3" />
      <SkeletonBlock className="w-3/4 h-3" />
    </div>
  );
}

export function StatCardSkeleton() {
  return <AdminSkeleton type="card" />;
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="bg-white rounded-[20px] p-6 animate-pulse" style={{ height }}>
      <SkeletonBlock className="w-32 h-5 mb-4" />
      <div className="w-full h-[calc(100%-36px)] bg-[#e8e8ed] rounded-2xl" />
    </div>
  );
}

export function TableSkeleton({ rows: _rows = 5 }: { rows?: number }) {
  return <AdminSkeleton type="table" />;
}

export function SkeletonCard() {
  return <AdminSkeleton type="card" />;
}
