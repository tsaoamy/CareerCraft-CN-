import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerCraft — 一个职业档案，多岗位智能适配",
  description:
    "只需录入一次经历，AI 自动为每个岗位生成专属简历。告别重复改简历的痛苦。",
  keywords: ["AI简历", "职业规划", "求职助手", "面试模拟", "JD分析"],
  openGraph: {
    title: "CareerCraft — AI 职业规划助手",
    description: "一个职业档案，多岗位智能适配。AI 驱动的新一代求职助手。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--apple-bg)] text-[var(--apple-text)] starry-overlay">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
