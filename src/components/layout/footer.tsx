import Link from "next/link";

const footerLinks = {
  产品: [
    { label: "工作台", href: "/dashboard" },
    { label: "素材库", href: "/materials" },
    { label: "JD 分析", href: "/jd-analyzer" },
    { label: "简历定制", href: "/resume-builder" },
    { label: "AI 面试官", href: "/interview" },
  ],
  支持: [
    { label: "帮助中心", href: "/help" },
    { label: "隐私政策", href: "/privacy" },
    { label: "服务条款", href: "/terms" },
    { label: "联系我们", href: "/contact" },
  ],
  关于: [
    { label: "关于我们", href: "/about" },
    { label: "博客", href: "/blog" },
    { label: "更新日志", href: "/changelog" },
    { label: "加入我们", href: "/careers" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-black border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60">
      <div className="max-w-7xl mx-auto px-5">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-apple-blue to-apple-purple flex items-center justify-center text-white text-base font-bold shadow-sm group-hover:shadow-md transition-shadow">
                C
              </div>
              <span className="text-[19px] font-semibold tracking-tight text-apple-text dark:text-white">
                CareerCraft
              </span>
            </Link>
            <p className="text-[13px] text-apple-text-secondary leading-relaxed mt-3 max-w-[240px]">
              一个职业档案，多岗位智能适配。AI 驱动的新一代求职助手。
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[13px] font-semibold text-apple-text dark:text-white mb-4 tracking-wide">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[#d2d2d7]/60 dark:border-[#38383a]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-apple-text-secondary">
            &copy; 2026 CareerCraft. 保留所有权利。
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            >
              隐私政策
            </Link>
            <Link
              href="/terms"
              className="text-[12px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
            >
              服务条款
            </Link>
            <span className="text-[12px] text-apple-text-secondary">中文 (简体)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
