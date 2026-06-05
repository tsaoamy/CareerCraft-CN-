"use client";

import { StatusPanel, StatusBadge, ProcessingOverlay } from "@/components/system/status";
import { FeaturePageRoot, FeaturePageShell } from "@/components/layout/feature-page-shell";

const VARIANTS = [
  { variant: "loading" as const, title: "Processing", description: "系统正在处理你的请求…" },
  { variant: "success" as const, title: "Complete", description: "Analysis Complete — 洞察已就绪" },
  { variant: "warning" as const, title: "Attention", description: "部分数据尚未同步，建议稍后重试" },
  { variant: "error" as const, title: "Interrupted", description: "Operation Interrupted — 连接已中断" },
  { variant: "info" as const, title: "Ready", description: "Ready to Continue" },
];

export default function SystemStatusPage() {
  return (
    <FeaturePageRoot>
      <FeaturePageShell>
        <div className="mb-12">
          <p className="text-caption-sm uppercase tracking-[0.25em] text-volt mb-2">Design System</p>
          <h1 className="brand-display text-[clamp(2rem,5vw,3.5rem)] text-white">Status System</h1>
          <p className="text-body-md text-stone mt-4 max-w-xl">
            全站 loading / success / error / warning / processing 状态统一 motion 与 token。
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-16">
          {(["loading", "success", "error", "warning", "info"] as const).map((v) => (
            <StatusBadge key={v} variant={v} label={v} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {VARIANTS.map((v) => (
            <div key={v.variant} className="system-card p-10 relative min-h-[280px] flex items-center justify-center">
              {v.variant === "loading" && (
                <ProcessingOverlay label="Processing Insight…" />
              )}
              <StatusPanel
                variant={v.variant}
                title={v.title}
                description={v.description}
              />
            </div>
          ))}
        </div>
      </FeaturePageShell>
    </FeaturePageRoot>
  );
}
