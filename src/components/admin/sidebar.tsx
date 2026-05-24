"use client";

// ==========================================
// Admin Sidebar — Apple 极简侧边导航
// ==========================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  BarChart3,
  LogOut,
  ChevronLeft,
  Sparkles,
  Code2,
  TrendingUp,
  Building2,
  PieChart,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin/admin-auth-context";

const navItems = [
  {
    section: "核心管理",
    items: [
      { label: "数据总览", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "驾驶舱", href: "/admin/dashboard-enhanced", icon: PieChart },
      { label: "用户管理", href: "/admin/users", icon: Users },
      { label: "简历中心", href: "/admin/resumes", icon: FileText },
    ],
  },
  {
    section: "AI & 分析",
    items: [
      { label: "Prompt管理", href: "/admin/prompts", icon: Code2 },
      { label: "AI 监控", href: "/admin/ai-monitor", icon: Activity },
      { label: "行为分析", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "扩展功能",
    items: [
      { label: "人才画像", href: "/talent", icon: TrendingUp },
      { label: "职位匹配", href: "/talent/matching", icon: BarChart3 },
      { label: "企业版", href: "/enterprise", icon: Building2 },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, adminName } = useAdminAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#f5f5f7] dark:bg-[#1c1c1e] border-r border-[#e8e8ed] dark:border-[#38383a] flex flex-col z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#e8e8ed] dark:border-[#38383a]">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#0071e3] to-[#5ac8fa] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            CareerCraft
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-3 py-1 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              {section.section}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-white dark:bg-[#2c2c2e] text-[#0071e3] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                        : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-white/50 dark:hover:bg-[#2c2c2e]/50"
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0071e3] rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-[#e8e8ed] dark:border-[#38383a]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8944ab] to-[#ff375f] flex items-center justify-center text-white text-xs font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
              {adminName}
            </p>
            <p className="text-[11px] text-[#86868b]">Super Admin</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[12px] text-sm text-[#86868b] hover:text-[#ff375f] hover:bg-white/50 dark:hover:bg-[#2c2c2e] transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
