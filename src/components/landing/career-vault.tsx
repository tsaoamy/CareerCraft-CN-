import { Database, Brain, Zap, Shield } from "lucide-react";

export function CareerVault() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f5f7] dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="apple-section-title mb-5">
            <span className="gradient-text">职业经历知识库</span>
          </h2>
          <p className="apple-section-subtitle mx-auto">
            不再只是改简历——上传历年经历，构建你的专属职业档案库。
            每次求职，AI 从知识库检索最相关经历，生成真正贴合你的简历。
          </p>
        </div>

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
          ].map((item) => (
            <div
              key={item.title}
              className="apple-card p-8 flex flex-col items-center text-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-5`}
              >
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-apple-text dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-apple-text-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-[15px] text-apple-text-secondary mb-5">
            准备好构建你的职业知识库了吗？
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-apple-blue text-white text-[17px] font-medium hover:bg-[#0077ed] shadow-[0_2px_12px_rgba(0,113,227,0.35)] hover:shadow-[0_4px_20px_rgba(0,113,227,0.4)] transition-all duration-300 active:scale-[0.97]"
          >
            免费注册
          </a>
        </div>
      </div>
    </section>
  );
}
