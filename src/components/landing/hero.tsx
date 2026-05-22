"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FileText, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: "-1.5s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            AI 驱动 · 中文优化
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
          <span className="block text-slate-900 dark:text-white">一个职业档案，</span>
          <span className="gradient-text">多岗位智能适配</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          只需录入一次经历，AI 自动为每个岗位生成专属简历。
          告别重复改简历的痛苦，让求职效率提升 10 倍。
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-base px-8">
              免费开始使用
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-base px-8">
              查看演示
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {[
            { value: "10x", label: "简历生成效率" },
            { value: "83%", label: "平均匹配度" },
            { value: "5min", label: "完成一份简历" },
            { value: "100+", label: "岗位类型支持" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
          {[
            {
              icon: FileText,
              title: "职业素材库",
              desc: "一次录入经历，永久保存。AI 自动用 STAR 格式拆解，让每个经历都有结构。",
            },
            {
              icon: Search,
              title: "JD 智能解析",
              desc: "粘贴岗位描述，秒级分析核心技能、关键词和匹配度，精准定位差距。",
            },
            {
              icon: MessageCircle,
              title: "AI 面试模拟",
              desc: "基于 JD 和你的简历，自动生成针对性面试问题并评分。",
            },
          ].map((feat, i) => (
            <div
              key={feat.title}
              className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feat.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
