"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Search, MessageCircle, BarChart3, Users, Zap } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const duration = 1800;
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[40px] md:text-[48px] font-bold tracking-tight gradient-text-static leading-none">
        {count}{suffix}
      </div>
      <div className="text-[13px] text-apple-text-secondary mt-2 font-medium">{label}</div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 -z-10 grid-pattern opacity-60" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#0071e3]/15 to-[#5ac8fa]/8 blur-[140px] animate-float" />
        <div
          className="absolute bottom-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#8944ab]/15 to-[#bf5af2]/8 blur-[140px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-[35%] left-[45%] w-[350px] h-[350px] rounded-full bg-[#34c759]/8 blur-[100px] animate-float-slow"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute top-[60%] left-[15%] w-[250px] h-[250px] rounded-full bg-[#ff9f0a]/6 blur-[80px] animate-float"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-24 pb-16 md:pt-40 md:pb-28 text-center">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-10 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span className="text-[13px] font-medium text-apple-text dark:text-white">
            AI 驱动 &middot; 中文优化 &middot; 智能求职助手
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 h-[56px] px-9 rounded-full bg-apple-blue text-white text-[17px] font-medium hover:bg-[#0077ed] shadow-[0_4px_20px_rgba(0,113,227,0.4)] hover:shadow-[0_6px_28px_rgba(0,113,227,0.5)] transition-all duration-300 active:scale-[0.97]"
          >
            免费开始使用
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 h-[56px] px-9 rounded-full glass-btn text-[17px] text-apple-text dark:text-white font-medium active:scale-[0.97]"
          >
            查看演示
          </Link>
        </div>

        {/* Stats with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[760px] mx-auto animate-fade-in-up delay-400">
          <AnimatedStat value={10} suffix="x" label="效率提升" />
          <AnimatedStat value={83} suffix="%" label="平均匹配度" />
          <AnimatedStat value={5} label="分钟生成简历" />
          <AnimatedStat value={100} suffix="+" label="岗位类型支持" />
        </div>
      </div>

      {/* Feature cards grid */}
      <div className="max-w-7xl mx-auto px-5 pb-16 md:pb-28">
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="apple-badge mb-4">核心功能</span>
          <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-apple-text dark:text-white mt-4">
            AI 赋能的<span className="gradient-text-static">求职全流程</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: FileText,
              title: "职业素材库",
              desc: "一次录入经历，永久保存。AI 自动拆解 STAR 格式，让每段经历都有结构，随时调用。",
              color: "from-[#0071e3]/10 to-[#0071e3]/5",
              iconColor: "text-apple-blue",
              iconBg: "bg-[#e8f4fd] dark:bg-[#003366]",
              tag: "结构化存储",
            },
            {
              icon: Search,
              title: "JD 智能解析",
              desc: "粘贴岗位描述，秒级分析核心技能、关键需求和匹配度，精准定位你的优劣势。",
              color: "from-[#8944ab]/10 to-[#8944ab]/5",
              iconColor: "text-apple-purple",
              iconBg: "bg-[#f4f1fa] dark:bg-[#2d1445]",
              tag: "AI 分析",
            },
            {
              icon: MessageCircle,
              title: "AI 面试模拟",
              desc: "基于 JD 和简历自动生成针对性面试问题，模拟真实面试场景并智能评分反馈。",
              color: "from-[#34c759]/10 to-[#34c759]/5",
              iconColor: "text-apple-green",
              iconBg: "bg-[#e8f8ee] dark:bg-[#0a3622]",
              tag: "实战演练",
            },
          ].map((feat, i) => (
            <div
              key={feat.title}
              className="apple-card spotlight-card p-8 animate-fade-in-up group"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-12 h-12 rounded-2xl ${feat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feat.icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary font-medium">
                  {feat.tag}
                </span>
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
