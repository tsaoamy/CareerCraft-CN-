import { LegalHero } from "@/components/legal/legal-hero";

const changelog = [
  {
    version: "v2.0.0",
    date: "2026-05-20",
    tag: "最新",
    changes: [
      "全新后台管理系统：数据总览、用户分析、简历管理、AI 监控一应俱全",
      "API 安全升级：权限分级、DTO 敏感字段过滤、环境变量安全管理",
      "新增用户行为分析看板：访问路径、漏斗图、功能使用频率",
      "Apple 风格管理后台 UI 组件：Sidebar、StatCard、DataTable、Skeleton 加载态",
    ],
  },
  {
    version: "v1.6.0",
    date: "2026-05-10",
    changes: [
      "AI 面试官功能上线：支持行为面、技术面等多场景模拟面试",
      "面试后生成详细评分报告：语言表达、逻辑思维、专业匹配度",
      "新增语音输入支持，更加贴近真实面试场景",
    ],
  },
  {
    version: "v1.4.0",
    date: "2026-04-20",
    changes: [
      "简历导出功能上线，支持 PDF 格式，含多款专业模板",
      "新增「素材库」功能：集中管理教育、工作、项目经历和技能标签",
      "优化简历生成质量，增加行业关键词自动匹配算法",
    ],
  },
  {
    version: "v1.2.0",
    date: "2026-04-01",
    changes: [
      "JD 分析器正式上线：智能解析职位描述，提取关键技能要求",
      "职位匹配对比功能：标注用户技能与岗位需求的匹配度和差距",
      "全新注册登录流程，支持邮箱注册和第三方登录",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-03-15",
    changes: [
      "CareerCraft 首个正式版本发布",
      "核心功能：AI 简历智能生成与多岗位适配",
      "支持工作经历、教育背景、项目经验的基础录入",
      "Apple 风格极简界面设计",
    ],
  },
  {
    version: "v0.5.0",
    date: "2026-02-01",
    changes: [
      "内测版本上线，邀请首批种子用户",
      "基础简历生成引擎完成",
      "收集用户反馈，优化 AI 提示和输出质量",
    ],
  },
];

export const metadata = {
  title: "更新日志 — CareerCraft",
  description: "CareerCraft 产品更新日志，了解每个版本的新功能和改进。",
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] dark:bg-black">
      <LegalHero
        title="更新日志"
        subtitle="每一次改进，都为了让你的求职更轻松"
      />
      <section className="max-w-3xl mx-auto px-5 pb-20">
        <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-[#d2d2d7] dark:before:bg-[#38383a]">
          {changelog.map((entry) => (
            <div key={entry.version} className="flex gap-5 pl-2">
              {/* Timeline dot */}
              <span
                className={`relative z-10 w-[32px] h-[32px] rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold text-white ${
                  entry.tag ? "bg-apple-blue ring-4 ring-[#d2d2d7]/30 dark:ring-[#38383a]/30" : "bg-[#86868b]"
                }`}
              >
                {entry.version.split(".")[0] === "v2" ? "2" : "1"}
              </span>

              {/* Card */}
              <div className="flex-1 bg-white dark:bg-[#1c1c1e] rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[18px] font-semibold text-apple-text dark:text-white">
                    {entry.version}
                  </h2>
                  {entry.tag && (
                    <span className="text-[11px] font-semibold text-white bg-apple-blue px-2.5 py-0.5 rounded-full">
                      {entry.tag}
                    </span>
                  )}
                  <span className="text-[13px] text-apple-text-secondary ml-auto">
                    {entry.date}
                  </span>
                </div>
                <ul className="space-y-2">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-[14px] text-apple-text-secondary">
                      <span className="text-apple-blue mt-1.5 shrink-0">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
