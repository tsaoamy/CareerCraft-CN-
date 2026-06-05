import { LegalHero } from "@/components/legal/legal-hero";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

const positions = [
  {
    title: "前端开发工程师",
    type: "全职",
    location: "远程",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    desc: "参与 CareerCraft 用户端和后台管理系统的前端开发，打造极致的 Apple 风格用户体验。",
  },
  {
    title: "AI / NLP 工程师",
    type: "全职",
    location: "远程",
    tags: ["Python", "LLM", "Prompt Engineering", "LangChain"],
    desc: "负责 AI 简历生成和 JD 分析的核心算法优化，探索前沿大模型在求职场景中的应用。",
  },
  {
    title: "全栈开发工程师",
    type: "全职",
    location: "远程",
    tags: ["Node.js", "PostgreSQL", "Next.js", "CloudBase"],
    desc: "参与平台后端服务开发、数据库设计和 API 架构，保障系统稳定性和可扩展性。",
  },
  {
    title: "UI/UX 设计师",
    type: "兼职/实习",
    location: "远程",
    tags: ["Figma", "用户研究", "交互设计", "设计系统"],
    desc: "参与产品界面设计、用户流程优化和设计系统维护，与开发团队紧密协作。",
  },
  {
    title: "内容运营（实习）",
    type: "实习",
    location: "远程",
    tags: ["内容创作", "SEO", "社交媒体", "求职领域"],
    desc: "撰写求职技巧、产品教程等文章，运营社交媒体账号，参与用户社群建设。",
  },
];

export const metadata = {
  title: "加入我们 — CareerCraft",
  description: "加入 CareerCraft 团队，用 AI 重新定义求职体验。",
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="加入我们"
        subtitle="用 AI 重新定义求职体验"
      />

      {/* Team description */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm mb-8">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-5">
            为什么选择 CareerCraft
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "远程优先",
                desc: "我们相信优秀的人才遍布世界。全职远程办公文化，灵活安排工作时间，平衡工作与生活。",
              },
              {
                title: "AI 前沿实践",
                desc: "深度使用大语言模型解决真实用户问题，与 AI 共同成长，做有技术壁垒的产品。",
              },
              {
                title: "扁平 & 透明",
                desc: "小团队、大使命。每个人都有话语权，信息开放共享，直接参与重要决策。",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="text-[16px] font-semibold text-apple-text dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-apple-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 md:p-12 shadow-sm">
          <h2 className="text-[21px] font-semibold text-apple-text dark:text-white mb-6">
            开放职位
          </h2>
          <div className="space-y-4">
            {positions.map((pos) => (
              <div
                key={pos.title}
                className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-semibold text-apple-text dark:text-white">
                      {pos.title}
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
                      {pos.type}
                    </span>
                    <span className="text-[12px] text-apple-text-secondary">{pos.location}</span>
                  </div>
                  <p className="text-[14px] text-apple-text-secondary mb-2">{pos.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pos.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-apple-text-secondary bg-white dark:bg-[#1c1c1e] px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={`mailto:${OFFICIAL_EMAIL}?subject=应聘：${pos.title}`}
                  className="shrink-0 inline-flex items-center px-5 py-2.5 rounded-full bg-apple-blue text-white text-[13px] font-medium hover:opacity-90 transition-opacity self-start"
                >
                  投递简历
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#d2d2d7]/40 dark:border-[#38383a]/40">
            <p className="text-[14px] text-apple-text-secondary text-center">
              以上没有适合你的职位？欢迎自荐：{" "}
              <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-apple-blue hover:underline font-medium">
                {OFFICIAL_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
