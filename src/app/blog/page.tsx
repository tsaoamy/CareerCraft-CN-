import { LegalHero } from "@/components/legal/legal-hero";

const posts = [
  {
    date: "2026-05-18",
    category: "产品更新",
    title: "AI 面试官 2.0 上线：支持多轮追问与实时反馈",
    excerpt: "全新的 AI 面试官不仅会提问，还能根据你的回答进行追问，模拟真实面试的深度交流。面试结束后生成详细的评分报告和改进建议。",
    href: "#",
  },
  {
    date: "2026-05-10",
    category: "使用技巧",
    title: "5 个技巧让你的 AI 简历更出彩",
    excerpt: "素材库写得好，简历质量高。我们总结了 5 个关键技巧：描述具体成果、使用量化数据、突出项目角色……",
    href: "#",
  },
  {
    date: "2026-05-02",
    category: "行业洞察",
    title: "2026 求职趋势：AI 技能成简历标配",
    excerpt: "根据平台数据分析，提及 AI 工具使用经验的简历，面试邀约率提升 47%。哪些 AI 技能最受青睐？",
    href: "#",
  },
  {
    date: "2026-04-25",
    category: "产品更新",
    title: "JD 分析器升级：精准匹配你的职业档案",
    excerpt: "新版 JD 分析器支持一键对比职位要求与你的职业档案，自动标注匹配项和差距项，帮你找准提升方向。",
    href: "#",
  },
  {
    date: "2026-04-18",
    category: "使用技巧",
    title: "从一个素材到十份简历：高效求职的秘诀",
    excerpt: "CareerCraft 的核心价值在于「一次录入，多处适配」。本文分享如何充分利用素材库，实现高效批量投递。",
    href: "#",
  },
  {
    date: "2026-04-10",
    category: "团队故事",
    title: "CareerCraft 诞生记：为什么我们选择做 AI 简历？",
    excerpt: "从团队成员的亲身求职经历出发，我们发现了简历写作中最大的痛点，并决心用 AI 解决它。",
    href: "#",
  },
];

export const metadata = {
  title: "博客 — CareerCraft",
  description: "CareerCraft 官方博客，分享产品更新、求职技巧和行业洞察。",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="博客"
        subtitle="产品更新 · 使用技巧 · 行业洞察"
      />
      <section className="max-w-4xl mx-auto px-5 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.href}
              className="group bg-white dark:bg-[#1c1c1e] rounded-[20px] p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[12px] font-medium text-apple-blue bg-apple-blue/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-[12px] text-apple-text-secondary">{post.date}</span>
              </div>
              <h2 className="text-[17px] font-semibold text-apple-text dark:text-white mb-3 group-hover:text-apple-blue transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-[14px] text-apple-text-secondary leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
