"use client";

import Link from "next/link";
import { BrandSectionHeader } from "@/components/design-system/section-header";
import { BrandButton } from "@/components/design-system/brand-button";
import { Reveal } from "@/components/design-system/motion";
import { BrandLogo } from "@/components/brand-logo";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  LayoutDashboard, FileText, Briefcase, MessageCircle,
  Target, TrendingUp, Sparkles, ArrowRight, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const milestones = [
  { label: "完善档案", done: true },
  { label: "JD 分析", done: true },
  { label: "简历定制", done: false },
  { label: "模拟面试", done: false },
  { label: "投递追踪", done: false },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "工作台", active: true },
  { icon: FileText, label: "素材库", active: false },
  { icon: Briefcase, label: "JD 分析", active: false },
  { icon: Target, label: "智能匹配", active: false },
  { icon: MessageCircle, label: "AI 面试官", active: false },
];

export function DashboardPreview() {
  const { t } = useLocale();

  return (
    <section className="brand-section brand-bg-light">
      <div className="brand-editorial-width">
        <Reveal>
          <BrandSectionHeader
            label="产品预览"
            title="一站式"
            titleAccent="求职工作台"
            subtitle="从档案录入到拿到心仪 offer，全流程 AI 辅助。一个平台搞定所有求职环节。"
            className="mb-14 md:mb-16"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="preview-browser">
            <div className="preview-browser-bar flex items-center gap-2 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ash" />
                <div className="w-2.5 h-2.5 rounded-full bg-stone" />
                <div className="w-2.5 h-2.5 rounded-full bg-volt/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="preview-browser-url max-w-md mx-auto h-8 rounded-pill-md flex items-center justify-center text-caption-sm">
                  zhihang.ai/dashboard
                </div>
              </div>
            </div>

            <div className="flex min-h-[420px]">
              <div className="preview-sidebar hidden md:flex flex-col w-52 p-4 gap-1">
                <div className="flex items-center gap-2 px-3 py-2 mb-3">
                  <BrandLogo size="xs" />
                  <span className="text-caption-md font-medium text-ink">{t.brand}</span>
                </div>
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 text-caption-md rounded-md transition-colors cursor-default",
                      item.active
                        ? "preview-sidebar-item-active text-ink font-medium"
                        : "text-stone hover:text-ink hover:bg-[var(--surface-3)]/60"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", item.active ? "text-volt" : "text-stone")} />
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="preview-main flex-1 p-6 md:p-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <h3 className="text-heading-md text-ink mb-4">求职里程碑</h3>
                      <div className="flex flex-wrap gap-2">
                        {milestones.map((m) => (
                          <div
                            key={m.label}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 text-caption-sm font-medium",
                              m.done ? "preview-chip preview-chip-done" : "preview-chip"
                            )}
                          >
                            {m.done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-volt shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 border-2 border-stone/50 rounded-full shrink-0" />
                            )}
                            {m.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "匹配岗位", value: "12", icon: Target },
                        { label: "平均匹配度", value: "83%", icon: TrendingUp },
                        { label: "待投递", value: "5", icon: Briefcase },
                      ].map((stat) => (
                        <div key={stat.label} className="preview-card p-4">
                          <stat.icon className="w-4 h-4 text-volt mb-2" />
                          <div className="font-display text-[1.75rem] leading-none text-ink">
                            {stat.value}
                          </div>
                          <div className="text-caption-sm text-stone mt-1">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="preview-insight p-4">
                      <div className="text-caption-sm font-medium text-ink uppercase tracking-wider mb-2">
                        每日洞察
                      </div>
                      <p className="text-caption-md text-stone leading-relaxed italic">
                        &ldquo;你的独特视角是你最大的资产。不要只列任务，要展示你的影响力。&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="preview-chat-panel flex flex-col min-h-[280px]">
                    <div className="preview-chat-header px-4 py-3 flex items-center gap-2">
                      <div className="landing-icon-box w-7 h-7">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-caption-md font-medium text-ink">AI 求职导师</span>
                      <span className="ml-auto landing-tag text-[10px] py-0.5 px-2">Live</span>
                    </div>
                    <div className="preview-chat-body flex-1 p-4 space-y-3">
                      <div className="flex gap-2.5 items-start">
                        <div className="landing-icon-box w-7 h-7 shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="preview-bubble-ai flex-1 p-3 text-caption-sm leading-relaxed">
                          你好！我是 {t.brand} AI 导师。今天想聊什么？
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <div className="preview-bubble-user max-w-[88%] p-3 text-caption-sm leading-relaxed">
                          帮我分析前端开发岗位匹配度
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="text-center mt-12">
          <BrandButton href="/dashboard" variant="primary" size="lg">
            进入工作台
            <ArrowRight className="w-4 h-4" />
          </BrandButton>
        </Reveal>
      </div>
    </section>
  );
}
