import { FeaturePageRoot } from "@/components/layout/feature-page-shell";

function WorkspaceSkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-surface-2 border border-hairline-soft animate-pulse ${className ?? ""}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <FeaturePageRoot className="system-page">
      <div className="workspace-command">
        <div className="workspace-command-inner space-y-6">
          <WorkspaceSkeletonBlock className="min-h-[360px]" />
          <div className="grid xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 space-y-4">
              <WorkspaceSkeletonBlock className="min-h-[200px]" />
              <WorkspaceSkeletonBlock className="min-h-[160px]" />
              <WorkspaceSkeletonBlock className="min-h-[140px]" />
            </div>
            <div className="xl:col-span-4 space-y-4">
              <WorkspaceSkeletonBlock className="min-h-[180px]" />
              <WorkspaceSkeletonBlock className="min-h-[140px]" />
            </div>
          </div>
        </div>
      </div>
    </FeaturePageRoot>
  );
}
