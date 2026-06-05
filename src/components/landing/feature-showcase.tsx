"use client";

import Link from "next/link";
import { ArrowRight, FileText, FileEdit, MessageCircle, Target } from "lucide-react";
import { BrandSectionHeader } from "@/components/design-system/section-header";
import { ProductCard } from "@/components/design-system/brand-card";
import { Reveal, Stagger, StaggerItem } from "@/components/design-system/motion";

const features = [
  {
    icon: FileText,
    title: "职业素材库",
    subtitle: "Material Library",
    desc: "结构化职业故事，一次录入永久调用",
    href: "/materials",
    badge: "Core",
  },
  {
    icon: FileEdit,
    title: "简历定制器",
    subtitle: "Resume Crafter",
    desc: "针对 JD 量身定制简历与求职信",
    href: "/resume-builder",
    badge: "AI",
  },
  {
    icon: MessageCircle,
    title: "AI 面试模拟",
    subtitle: "Interview Prep",
    desc: "真实场景交互 + 评分反馈",
    href: "/interview",
    badge: "Live",
  },
  {
    icon: Target,
    title: "智能匹配引擎",
    subtitle: "Smart Matching",
    desc: "量化技能差距，推荐投递策略",
    href: "/talent/matching",
    badge: "New",
  },
];

export function FeatureShowcase() {
  return (
    <section className="brand-section brand-surface">
      <div className="brand-editorial-width">
        <Reveal>
          <BrandSectionHeader
            label="核心模块"
            title="构建你的"
            titleAccent="求职故事"
            subtitle="不只是简历——AI 帮你梳理每段经历，为每个机会准备最好的自己"
            className="mb-14 md:mb-16"
          />
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feat) => (
            <StaggerItem key={feat.title}>
              <ProductCard
                href={feat.href}
                badge={feat.badge}
                title={feat.title}
                subtitle={feat.subtitle}
                meta={
                  <p className="text-caption-sm text-stone pt-1.5 leading-relaxed">{feat.desc}</p>
                }
                image={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[72%] max-w-[140px] aspect-square rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-3)]/80 shadow-[var(--shadow-card)] flex items-center justify-center group-hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] group-hover:bg-[var(--accent-soft)] transition-all duration-500">
                      <feat.icon className="w-12 h-12 sm:w-14 sm:h-14 text-volt/55 group-hover:text-volt transition-colors duration-500" strokeWidth={1.25} />
                    </div>
                  </div>
                }
              />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={200} className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-body-md font-medium text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink transition-colors"
          >
            查看全部功能
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
