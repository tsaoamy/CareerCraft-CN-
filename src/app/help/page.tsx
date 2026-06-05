import { LegalHero } from "@/components/legal/legal-hero";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

export const metadata = {
  title: "帮助中心 — CareerCraft",
  description: "CareerCraft 帮助中心，快速了解如何使用 AI 简历助手。",
};

const faqs = [
  {
    q: "如何开始使用 CareerCraft？",
    a: "注册账户后，进入「素材库」录入您的教育背景、工作经历、项目经验和技能信息。录入完成后，前往「简历定制」选择目标岗位，AI 将自动为您生成适配该岗位的专属简历。",
  },
  {
    q: "一份素材可以生成多少份不同的简历？",
    a: "无限制。您录入一次职业素材后，可以针对不同公司、不同岗位无限次生成不同的优化简历。AI 会根据每个岗位的要求自动调整内容侧重点和关键词。",
  },
  {
    q: "生成的简历可以直接用于投递吗？",
    a: "建议您在 AI 生成内容的基础上进行审阅和微调。AI 生成的简历质量很高，但我们始终推荐您根据实际情况做最终确认，确保信息准确无误。",
  },
  {
    q: "支持哪些格式的简历导出？",
    a: "目前支持导出为 PDF 格式，提供多种专业模板选择。未来将支持 Word (.docx) 格式导出。",
  },
  {
    q: "我的数据安全吗？",
    a: "非常安全。我们采用业界标准的加密技术保护您的数据，所有信息传输均通过 TLS 加密。您的简历内容不会与任何第三方共享。详情请参阅我们的隐私政策。",
  },
  {
    q: "免费版和付费版有什么区别？",
    a: "免费版每月可生成 3 份 AI 优化简历，使用基础模板。付费版不限次数，解锁全部高级模板、优先 AI 处理队列和 JD 匹配分析等高级功能。",
  },
  {
    q: "如何取消订阅？",
    a: "进入「设置」→「订阅管理」，点击「取消订阅」即可。取消后当前付费周期结束时生效，期间仍可继续使用付费功能。",
  },
  {
    q: "AI 面试官功能如何使用？",
    a: "在「AI 面试官」页面选择您面试的岗位方向，AI 会模拟真实面试场景进行提问。您可以通过语音或文字作答，AI 会给出实时反馈和改进建议。",
  },
  {
    q: "JD 分析功能是什么？",
    a: "在「JD 分析」页面粘贴职位描述（Job Description），AI 会自动提取关键技能要求、经验要求和文化关键词，并与您的职业档案进行匹配对比，找出差距和改进方向。",
  },
  {
    q: "遇到问题如何联系客服？",
    a: `您可以通过「联系我们」页面提交反馈，或直接发送邮件至 ${OFFICIAL_EMAIL}，我们通常在 24 小时内回复。`,
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="帮助中心"
        subtitle="快速了解如何使用 CareerCraft"
      />

      {/* Quick Start */}
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm mb-8">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-5">
            🚀 快速上手
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "录入素材", desc: "在「素材库」中录入您的教育、工作、项目和技能信息，建立完整的职业档案。" },
              { step: "02", title: "选择岗位", desc: "在「简历定制」中粘贴目标 JD 或选择岗位方向，AI 自动分析需求。" },
              { step: "03", title: "生成简历", desc: "点击生成，AI 为您量身打造适配岗位的专业简历，支持导出 PDF。" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="inline-block w-10 h-10 rounded-full bg-apple-blue text-white text-[13px] font-semibold leading-10 mb-3">
                  {item.step}
                </span>
                <h3 className="text-[15px] font-semibold text-apple-text dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] text-apple-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-8">
            ❓ 常见问题
          </h2>
          <div className="space-y-6 divide-y divide-[#d2d2d7]/40 dark:divide-[#38383a]/40">
            {faqs.map((faq, i) => (
              <details key={i} className="group pt-6 first:pt-0" open={i === 0}>
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="text-[15px] font-medium text-apple-text dark:text-white group-open:text-apple-blue transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-apple-text-secondary mt-0.5 shrink-0 transition-transform duration-200 group-open:rotate-45">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] text-apple-text-secondary leading-relaxed pl-0 pr-8">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40 text-center">
            <p className="text-[14px] text-apple-text-secondary mb-3">
              没找到想要的答案？
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-apple-blue text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
            >
              联系我们
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
