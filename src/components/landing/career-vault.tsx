"use client";

import { Database, Brain, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/effects/scroll-reveal";

export function CareerVault() {
  return (
    <>
      {/* Career Vault Section */}
      <section className="relative py-24 md:py-32 bg-[#f5f5f7] dark:bg-[#0a0a0a] overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="max-w-7xl mx-auto px-5 relative">
          {/* Section header */}
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-20">
              <span className="apple-badge mb-4">独家能力</span>
              <h2 className="apple-section-title mt-4 mb-5">
                <span className="gradient-text">职业经历知识库</span>
              </h2>
              <p className="apple-section-subtitle mx-auto">
                不再只是改简历——上传历年经历，构建你的专属职业档案库。
                每次求职，AI 从知识库检索最相关经历，生成真正贴合你的简历。
              </p>
            </div>
          </ScrollReveal>

          {/* Feature items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                title: "永久保存",
                desc: "历年项目、实习、竞赛经历一次录入，AI 自动分类归档，永不丢失。",
                color: "text-apple-blue",
                bg: "bg-[#e8f4fd] dark:bg-[#003366]",
              },
              {
                icon: Brain,
                title: "智能检索",
                desc: "基于 RAG 技术，从档案库精准匹配岗位最相关的经历与技能点。",
                color: "text-apple-purple",
                bg: "bg-[#f4f1fa] dark:bg-[#2d1445]",
              },
              {
                icon: Zap,
                title: "一键生成",
                desc: "选择岗位 → 系统检索 → 自动重写 → 专属简历完成，全程不到 5 分钟。",
                color: "text-apple-orange",
                bg: "bg-[#fff5e5] dark:bg-[#3d2900]",
              },
              {
                icon: Shield,
                title: "真实可信",
                desc: "所有内容基于你的真实经历，绝不编造，每段文本可追溯到原始素材。",
                color: "text-apple-green",
                bg: "bg-[#e8f8ee] dark:bg-[#0a3622]",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100} direction="up">
                <div className="apple-card p-8 flex flex-col items-center text-center group">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-apple-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={200}>
            <div className="mt-20 text-center">
              <p className="text-[15px] text-apple-text-secondary mb-5">
                准备好构建你的职业知识库了吗？
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-apple-blue text-white text-[17px] font-medium hover:bg-[#0077ed] shadow-[0_2px_12px_rgba(0,113,227,0.35)] hover:shadow-[0_4px_20px_rgba(0,113,227,0.4)] transition-all duration-300 active:scale-[0.97]"
              >
                免费注册
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#0071e3]/6 to-transparent blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#8944ab]/6 to-transparent blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-5 relative">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="apple-badge mb-4">三步上手</span>
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-apple-text dark:text-white mt-4 mb-4">
                <span className="gradient-text-static">简单三步</span>，搞定求职
              </h2>
              <p className="text-[15px] text-apple-text-secondary max-w-[500px] mx-auto">
                不需要复杂操作，三个步骤让 AI 为你量身定制简历
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-[900px] mx-auto">
            {[
              {
                step: "01",
                title: "录入职业经历",
                desc: "把你的项目、实习、竞赛等经历录入素材库，AI 自动结构化整理",
                icon: "📝",
              },
              {
                step: "02",
                title: "粘贴目标岗位",
                desc: "复制岗位描述（JD）到分析器，AI 秒级解析核心要求与技能点",
                icon: "🎯",
              },
              {
                step: "03",
                title: "一键生成简历",
                desc: "AI 自动匹配经历与岗位，生成高度定制化的专属简历",
                icon: "🚀",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 150}>
                <div className="relative text-center">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-[40px] left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#0071e3]/30 to-[#8944ab]/30" />
                  )}
                  <div className="w-[80px] h-[80px] rounded-full bg-white dark:bg-[#1c1c1e] border-2 border-[#d2d2d7]/40 dark:border-[#38383a]/60 flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <span className="text-[32px]">{item.icon}</span>
                  </div>
                  <div className="text-[12px] font-bold text-apple-blue mb-2 tracking-wider">
                    步骤 {item.step}
                  </div>
                  <h3 className="text-[18px] font-semibold text-apple-text dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-apple-text-secondary leading-relaxed max-w-[240px] mx-auto">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Visual showcase - Before/After */}
          <ScrollReveal delay={200}>
            <div className="mt-20 max-w-[800px] mx-auto">
              <div className="apple-card overflow-hidden">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#d2d2d7]/60 dark:divide-[#38383a]/60">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#ffebee] dark:bg-[#3d1111] text-apple-red font-medium">
                        传统方式
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "每个岗位手动重写整份简历",
                        "凭记忆拼凑过往经历",
                        "不了解 JD 核心关键词",
                        "格式排版反复调整",
                        "一份简历海投所有岗位",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-apple-text-secondary">
                          <span className="text-apple-red mt-0.5 shrink-0">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 md:p-8 bg-[#f0faf4] dark:bg-[#0a1a12]">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#e8f8ee] dark:bg-[#0a3622] text-apple-green font-medium">
                        CareerCraft
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "AI 自动为每个岗位定制内容",
                        "经历永久保存在知识库中",
                        "智能解析 JD 核心关键词",
                        "一键生成排版精美的简历",
                        "精准匹配度高达 83%",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-apple-text dark:text-white">
                          <CheckCircle2 className="w-[16px] h-[16px] text-apple-green mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="py-20 md:py-28 bg-[#f5f5f7] dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-5">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-apple-text dark:text-white mb-4">
                深受求职者信赖
              </h2>
              <p className="text-[15px] text-apple-text-secondary max-w-[500px] mx-auto">
                来自真实用户的使用反馈
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {[
              {
                quote: "以前每次投简历都要花半天重新改，现在录一次经历，点几下就生成好了，真的太省事了！",
                name: "张同学",
                role: "应届毕业生",
                company: "拿到 3 个 offer",
                avatar: "张",
              },
              {
                quote: "JD 分析功能太实用了，能快速看出我和目标岗位的差距，有针对性地准备，面试通过率高了很多。",
                name: "李女士",
                role: "产品经理",
                company: "跳槽成功",
                avatar: "李",
              },
              {
                quote: "作为一个有 8 年工作经验的人，经历太多反而难整理。CareerCraft 帮我系统化地管理了所有经历。",
                name: "王先生",
                role: "技术总监",
                company: "入职独角兽",
                avatar: "王",
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="apple-card p-6 md:p-8 flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[#ff9f0a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[14px] text-apple-text dark:text-white leading-relaxed flex-1 mb-5">
                    &quot;{item.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/60">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white text-[13px] font-bold">
                      {item.avatar}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-apple-text dark:text-white">{item.name}</div>
                      <div className="text-[11px] text-apple-text-secondary">{item.role} · {item.company}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#0071e3]/10 via-[#8944ab]/8 to-[#34c759]/5 blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-5 relative text-center">
          <ScrollReveal>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white mb-5">
              准备好让 AI<span className="gradient-text-static">加速你的求职</span>了吗？
            </h2>
            <p className="text-[16px] text-apple-text-secondary mb-10 max-w-[480px] mx-auto">
              免费注册，立即体验 AI 简历定制的强大能力
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 h-[56px] px-9 rounded-full bg-apple-blue text-white text-[17px] font-medium hover:bg-[#0077ed] shadow-[0_4px_20px_rgba(0,113,227,0.4)] hover:shadow-[0_6px_28px_rgba(0,113,227,0.5)] transition-all duration-300 active:scale-[0.97]"
              >
                免费开始使用
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 h-[56px] px-9 rounded-full glass-btn text-[17px] text-apple-text dark:text-white font-medium active:scale-[0.97]"
              >
                先看演示
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
