import { LegalHero } from "@/components/legal/legal-hero";

export const metadata = {
  title: "关于我们 — CareerCraft",
  description: "了解 CareerCraft 团队的使命 — 让每个人都能用 AI 展现最好的职业形象。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="关于我们"
        subtitle="让每个人都能用 AI 展现最好的职业形象"
      />

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm mb-8">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-5">
            我们的使命
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-apple-text-secondary dark:text-[#98989d]">
            <p>
              CareerCraft 诞生于一个简单的观察：大多数求职者并非缺乏能力，而是缺乏将自己最好的那一面呈现出来的方式。
            </p>
            <p>
              写简历是一件高度个性化且耗时的工作。面对不同公司的不同岗位，每次都需要重新调整表述、润色措辞、突出不同的亮点。这个过程冗长、重复，却容不得半点马虎——因为简历是面试的敲门砖。
            </p>
            <p>
              我们相信，<strong className="text-apple-text dark:text-white">AI 应该帮人们更高效地展现自己的职业价值</strong>，而不是替代人们的思考。CareerCraft 的核心理念是「一个职业档案，多岗位智能适配」——您只需录入一次真实的经历和技能，AI 帮您针对每个岗位生成最合适的表述。
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm mb-8">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-6">
            我们的价值观
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "用户至上",
                desc: "每一个功能的设计都以用户需求为出发点，追求极致的产品体验。",
              },
              {
                title: "AI 赋能而非替代",
                desc: "AI 是工具，用户是主人。我们帮你写得更好，但最终的决定权永远在你手中。",
              },
              {
                title: "隐私优先",
                desc: "简历是高度敏感的个人信息。我们以最高标准保护你的数据安全。",
              },
              {
                title: "持续进化",
                desc: "AI 技术在飞速发展，我们也在不断迭代，只为给你提供更好的服务。",
              },
            ].map((v) => (
              <div key={v.title} className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e]">
                <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-[14px] text-apple-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm mb-8">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-6">
            发展历程
          </h2>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-[#d2d2d7] dark:before:bg-[#38383a]">
            {[
              { date: "2025.11", text: "团队组建，确定「AI + 求职」方向，开始产品原型设计。" },
              { date: "2026.01", text: "完成核心 AI 简历生成引擎的研发，支持多岗位适配。" },
              { date: "2026.02", text: "内测版上线，邀请首批种子用户试用并收集反馈。" },
              { date: "2026.03", text: "上线 JD 分析和职位匹配功能，实现双向智能适配。" },
              { date: "2026.04", text: "AI 面试官功能上线，覆盖行为面、技术面等常见场景。" },
              { date: "2026.05", text: "正式版公测，持续优化 AI 模型效果和用户体验。" },
            ].map((item) => (
              <div key={item.date} className="flex gap-5 pl-2">
                <span className="relative z-10 w-[22px] h-[22px] rounded-full bg-apple-blue ring-4 ring-[#f5f5f7] dark:ring-[#1c1c1e] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[13px] font-semibold text-apple-blue">{item.date}</span>
                  <p className="text-[14px] text-apple-text-secondary mt-1 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-apple-blue to-apple-purple rounded-[24px] p-10 md:p-14 shadow-sm text-white">
          <h2 className="text-[24px] font-bold mb-3">开始你的职业升级之旅</h2>
          <p className="text-[15px] text-white/80 mb-6 max-w-md mx-auto">
            免费注册，体验 AI 为你量身定制专业简历。一个档案，无限可能。
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-apple-blue text-[15px] font-semibold hover:bg-white/90 transition-colors"
          >
            免费开始使用
          </a>
        </div>
      </section>
    </main>
  );
}
