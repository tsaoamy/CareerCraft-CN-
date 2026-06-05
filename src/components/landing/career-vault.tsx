"use client";

import { Database, Brain, Zap, Shield, ArrowRight, CheckCircle2, ClipboardList, Search, FileCheck } from "lucide-react";
import { BrandSectionHeader } from "@/components/design-system/section-header";
import { BrandButton } from "@/components/design-system/brand-button";
import { Reveal, Stagger, StaggerItem } from "@/components/design-system/motion";

export function CareerVault() {
  return (
    <>
      {/* 独家能力 */}
      <div className="landing-bridge-bottom" aria-hidden />
      <section className="brand-section brand-surface">
        <div className="brand-editorial-width">
          <Reveal>
            <BrandSectionHeader
              label="独家能力"
              title="职业经历知识库"
              subtitle="上传历年经历，构建专属职业档案库。AI 从知识库检索最相关经历，生成真正贴合你的简历。"
              className="mb-16 md:mb-20"
            />
          </Reveal>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {[
              { icon: Database, title: "永久保存", desc: "历年项目、实习、竞赛经历一次录入，AI 自动分类归档。" },
              { icon: Brain, title: "智能检索", desc: "基于 RAG 技术，精准匹配岗位最相关的经历与技能点。" },
              { icon: Zap, title: "一键生成", desc: "选择岗位 → 检索 → 重写 → 专属简历，全程不到 5 分钟。" },
              { icon: Shield, title: "真实可信", desc: "所有内容基于真实经历，每段文本可追溯到原始素材。" },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="brand-card-flat p-8 h-full text-center">
                  <div className="w-14 h-14 mx-auto mb-5 landing-icon-box">
                    <item.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-heading-md text-ink mb-2">{item.title}</h3>
                  <p className="text-caption-md landing-body leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 三步上手 */}
      <section className="brand-section brand-bg-light">
        <div className="brand-editorial-width">
          <Reveal>
            <BrandSectionHeader
              label="三步上手"
              title="简单三步"
              titleAccent="搞定求职"
              subtitle="不需要复杂操作，三个步骤让 AI 为你量身定制简历"
              className="mb-16"
            />
          </Reveal>

          <Stagger className="grid md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
            {[
              { step: "01", title: "录入职业经历", desc: "项目、实习、竞赛录入素材库，AI 自动结构化", icon: ClipboardList },
              { step: "02", title: "粘贴目标岗位", desc: "复制 JD 到分析器，秒级解析核心要求", icon: Search },
              { step: "03", title: "一键生成简历", desc: "AI 匹配经历与岗位，生成定制化简历", icon: FileCheck },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-5 landing-icon-box">
                    <item.icon className="w-9 h-9" strokeWidth={1.25} />
                  </div>
                  <div className="text-caption-sm font-medium text-stone mb-2 tracking-widest uppercase">
                    Step {item.step}
                  </div>
                  <h3 className="text-heading-md text-ink mb-2">{item.title}</h3>
                  <p className="text-caption-md landing-body max-w-[240px] mx-auto leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={200} className="mt-20 max-w-[800px] mx-auto">
            <div className="border border-hairline bg-canvas overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline-soft">
                <div className="p-6 md:p-8">
                  <span className="text-caption-sm px-3 py-1 border border-hairline text-sale font-medium">
                    传统方式
                  </span>
                  <ul className="space-y-3 mt-4">
                    {[
                      "每个岗位手动重写整份简历",
                      "凭记忆拼凑过往经历",
                      "不了解 JD 核心关键词",
                      "一份简历海投所有岗位",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-caption-md landing-body">
                        <span className="text-sale shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 md:p-8 bg-solid text-solid-fg">
                  <span className="text-caption-sm px-3 py-1 border border-volt/50 text-volt font-medium">
                    职航
                  </span>
                  <ul className="space-y-3 mt-4">
                    {[
                      "AI 自动为每个岗位定制内容",
                      "经历永久保存在知识库中",
                      "智能解析 JD 核心关键词",
                      "精准匹配度高达 83%",
                    ].map((item) => (
                      <li key={item} className="flex gap-2 text-caption-md">
                        <CheckCircle2 className="w-4 h-4 text-volt shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 用户信任 */}
      <section className="brand-section brand-surface">
        <div className="brand-editorial-width">
          <Reveal>
            <BrandSectionHeader
              title="深受求职者信赖"
              subtitle="来自真实用户的使用反馈"
              className="mb-16"
            />
          </Reveal>

          <Stagger className="grid md:grid-cols-3 gap-3 max-w-[960px] mx-auto">
            {[
              { quote: "录一次经历，点几下就生成好了，真的太省事了！", name: "张同学", role: "应届毕业生" },
              { quote: "JD 分析能快速看出差距，面试通过率高了很多。", name: "李女士", role: "产品经理" },
              { quote: "职航帮我系统化管理了 8 年的所有工作经历。", name: "王先生", role: "技术总监" },
            ].map((item) => (
              <StaggerItem key={item.name}>
                <div className="brand-card-flat p-6 md:p-8 h-full flex flex-col">
                  <p className="text-body-md text-ink leading-relaxed flex-1 mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-hairline-soft">
                    <div className="text-caption-md font-medium text-ink">{item.name}</div>
                    <div className="text-caption-sm text-stone">{item.role}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 最终转化 */}
      <section className="brand-hero brand-hero-noise brand-section min-h-[60vh] flex items-center">
        <div className="brand-editorial-width relative z-10 text-center w-full">
          <Reveal>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-tight leading-[1.12] text-ink mb-5">
              准备好让 AI
              <br />
              <span className="text-volt">加速你的求职</span>
              了吗？
            </h2>
            <p className="text-body-md text-stone mb-10 max-w-[480px] mx-auto">
              免费注册，立即体验 AI 简历定制的强大能力
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <BrandButton href="/register" variant="volt" size="lg">
                免费开始使用
                <ArrowRight className="w-5 h-5" />
              </BrandButton>
              <BrandButton href="/dashboard" variant="outline" size="lg">
                先看演示
              </BrandButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
