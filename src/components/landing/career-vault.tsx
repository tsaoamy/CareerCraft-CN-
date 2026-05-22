import { Database, Brain, Zap, Shield } from "lucide-react";

export function CareerVault() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">职业经历知识库</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            不再只是改简历——上传历年经历，构建你的专属职业档案库。每次求职，AI 从知识库检索最相关经历，生成真正贴合你的简历。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Database, title: "永久保存", desc: "历年项目、实习、竞赛经历一次录入，AI 自动分类归档" },
            { icon: Brain, title: "智能检索", desc: "基于 RAG 技术，从档案库精准匹配岗位最相关的经历" },
            { icon: Zap, title: "一键生成", desc: "选择岗位 → 系统检索 → 自动重写 → 专属简历完成" },
            { icon: Shield, title: "真实可信", desc: "所有内容基于你的真实经历，绝不编造，可追溯来源" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-2xl text-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-950 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-accent-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
