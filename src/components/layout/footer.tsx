import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">CareerCraft CN</span>
            <span className="text-xs text-slate-400">· 一个职业档案，多岗位智能适配</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-primary-500 transition-colors">关于</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">帮助</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">隐私</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">条款</Link>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; 2026 CareerCraft CN. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
