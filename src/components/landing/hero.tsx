"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Search, MessageCircle, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#0071e3]/10 to-[#5ac8fa]/5 blur-[120px] animate-float" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#8944ab]/10 to-[#bf5af2]/5 blur-[120px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#34c759]/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-24 pb-16 md:pt-40 md:pb-28 text-center">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8e8ed]/80 dark:bg-[#2c2c2e]/80 backdrop-blur-sm border border-[#d2d2d7]/60 dark:border-[#48484a]/60 mb-10 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span className="text-[13px] font-medium text-apple-text dark:text-white">
            AI 驱动 &middot; 中文优化
          </span>
        </div>

        {/* Hero heading */}
        <h1 className="text-hero mb-8 animate-fade-in-up delay-100">
          <span className="block text-apple-text dark:text-white">
            一个职业档案，
          </span>
          <span className="gradient-text">多岗位智能适配</span>
        </h1>

        {/* Subtitle */}
        <p className="text-hero-sub text-apple-text-secondary max-w-[640px] mx-auto mb-12 animate-fade-in-up delay-200">
          只需录入一次经历，AI 自动为每个岗位生成专属简历。
          告别重复改简历的痛苦，让求职效率提升 10 倍。
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20 animate-fade-in-up delay-300">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-apple-blue text-white text-[17px] font-medium hover:bg-[#0077ed] shadow-[0_2px_12px_rgba(0,113,227,0.35)] hover:shadow-[0_4px_20px_rgba(0,113,227,0.4)] transition-all duration-300 active:scale-[0.97]"
          >
            免费开始使用
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-transparent border border-[#d2d2d7] dark:border-[#48484a] text-apple-text dark:text-white text-[17px] font-medium hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-all duration-300 active:scale-[0.97]"
          >
            查看演示
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[720px] mx-auto animate-fade-in-up delay-400">
          {[
            { value: "10x", label: "简历生成效率" },
            { value: "83%", label: "平均匹配度" },
            { value: "5min", label: "完成一份简历" },
            { value: "100+", label: "岗位类型支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[40px] md:text-[48px] font-bold tracking-tight gradient-text-static leading-none">
                {stat.value}
              </div>
              <div className="text-[13px] text-apple-text-secondary mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards grid */}
      <div className="max-w-7xl mx-auto px-5 pb-16 md:pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: FileText,
              title: "职业素材库",
              desc: "一次录入经历，永久保存。AI 自动拆解 STAR 格式，让每段经历都有结构。",
              color: "from-[#0071e3]/10 to-[#0071e3]/5",
              iconColor: "text-apple-blue",
              iconBg: "bg-[#e8f4fd] dark:bg-[#003366]",
            },
            {
              icon: Search,
              title: "JD 智能解析",
              desc: "粘贴岗位描述，秒级分析核心技能、关键词和匹配度，精准定位差距。",
              color: "from-[#8944ab]/10 to-[#8944ab]/5",
              iconColor: "text-apple-purple",
              iconBg: "bg-[#f4f1fa] dark:bg-[#2d1445]",
            },
            {
              icon: MessageCircle,
              title: "AI 面试模拟",
              desc: "基于 JD 和简历自动生成针对性面试问题，模拟真实面试并评分。",
              color: "from-[#34c759]/10 to-[#34c759]/5",
              iconColor: "text-apple-green",
              iconBg: "bg-[#e8f8ee] dark:bg-[#0a3622]",
            },
          ].map((feat, i) => (
            <div
              key={feat.title}
              className="apple-card p-8 animate-fade-in-up"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center mb-5`}
              >
                <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
              </div>
              <h3 className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-[14px] text-apple-text-secondary leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
