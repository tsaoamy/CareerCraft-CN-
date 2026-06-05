"use client";

import { FileText, Search, MessageCircle, Target } from "lucide-react";
import { BrandSectionHeader } from "@/components/design-system/section-header";
import { Reveal, Stagger, StaggerItem } from "@/components/design-system/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function ValueProposition() {
  const { t } = useLocale();
  const hf = t.heroFeatures;

  const pillars = [
    {
      icon: FileText,
      tag: hf.tags[0],
      title: hf.materialTitle,
      desc: hf.materialDesc,
      tags: hf.tags,
    },
    {
      icon: Search,
      tag: "AI",
      title: hf.jdTitle,
      desc: hf.jdDesc,
    },
    {
      icon: MessageCircle,
      tag: "Live",
      title: hf.interviewTitle,
      desc: hf.interviewDesc,
    },
    {
      icon: Target,
      tag: "Match",
      title: "智能匹配引擎",
      desc: "量化技能差距，推荐最优投递策略与个人成长路径。",
    },
  ];

  const lead = pillars[0]!;

  return (
    <>
      <div className="landing-bridge-top" aria-hidden />
      <section id="value" className="brand-section landing-light-section">
        <div className="brand-editorial-width">
          <Reveal>
            <BrandSectionHeader
              label={hf.label}
              title={hf.title}
              titleAccent={hf.titleAccent}
              subtitle={hf.subtitle}
              className="mb-16 md:mb-20"
            />
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
            <Reveal className="lg:col-span-7">
              <div className="brand-card-flat p-8 md:p-12 h-full min-h-[360px] flex flex-col justify-end relative overflow-hidden">
                <div className="landing-deco-gradient" aria-hidden />
                <div className="relative z-10">
                  <span className="landing-tag mb-4">{lead.tag}</span>
                  <h3 className="text-heading-xl text-ink mb-4 max-w-[20ch] leading-snug">{lead.title}</h3>
                  <p className="text-body-md landing-body max-w-[420px] mb-6 leading-relaxed">
                    {lead.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-pill bg-[var(--surface-3)] border border-hairline-soft text-caption-sm text-stone"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Stagger className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
              {pillars.slice(1).map((item) => (
                <StaggerItem key={item.title}>
                  <div className="brand-card-flat p-6 md:p-8 h-full">
                    <div className="flex items-start gap-4">
                      <div className="landing-icon-box w-12 h-12 shrink-0">
                        <item.icon className="w-5 h-5" strokeWidth={1.25} />
                      </div>
                      <div className="min-w-0">
                        <span className="landing-tag text-[10px] py-0.5 px-2">{item.tag}</span>
                        <h3 className="text-heading-md text-ink mt-2 mb-2">{item.title}</h3>
                        <p className="text-caption-md landing-body leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
