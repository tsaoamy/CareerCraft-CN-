import { LegalHero } from "@/components/legal/legal-hero";

export const metadata = {
  title: "联系我们 — CareerCraft",
  description: "联系 CareerCraft 团队，提交反馈、建议或合作咨询。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="联系我们"
        subtitle="我们期待听到您的声音"
      />
      <section className="max-w-4xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Methods */}
          <div className="space-y-6">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M2 7l10 7 10-7"/>
                  </svg>
                ),
                title: "邮件联系",
                detail: "1759486723@qq.com",
                desc: "一般咨询：24 小时内回复",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                ),
                title: "在线反馈",
                detail: "产品内「反馈」入口",
                desc: "功能建议 & Bug 报告",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                ),
                title: "商务合作",
                detail: "1759486723@qq.com",
                desc: "企业合作 & 渠道拓展",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white dark:bg-[#1c1c1e] rounded-[20px] p-6 shadow-sm flex items-start gap-4"
              >
                <span className="w-10 h-10 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] flex items-center justify-center text-apple-blue shrink-0">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-apple-text dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-apple-blue font-medium mb-0.5">{item.detail}</p>
                  <p className="text-[12px] text-apple-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Form (Static showcase) */}
          <div className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[19px] font-semibold text-apple-text dark:text-white mb-6">
              给我们留言
            </h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
                  您的邮箱
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white placeholder:text-apple-text-secondary/50 border border-transparent focus:border-apple-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
                  咨询类型
                </label>
                <select className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white border border-transparent focus:border-apple-blue focus:outline-none transition-colors appearance-none cursor-pointer">
                  <option>功能建议</option>
                  <option>Bug 报告</option>
                  <option>账户问题</option>
                  <option>付费咨询</option>
                  <option>商务合作</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-apple-text dark:text-white mb-2">
                  留言内容
                </label>
                <textarea
                  rows={4}
                  placeholder="请详细描述您的问题或建议……"
                  className="w-full px-4 py-3 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[15px] text-apple-text dark:text-white placeholder:text-apple-text-secondary/50 border border-transparent focus:border-apple-blue focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-apple-blue text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
              >
                发送留言
              </button>
              <p className="text-[12px] text-apple-text-secondary text-center">
                或者直接发送邮件至 1759486723@qq.com
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
