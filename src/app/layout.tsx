import type { Metadata } from "next";
import Script from "next/script";
import { AppProviders } from "@/components/app-providers";
import { fontSans, fontMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "职航 — AI 求职匹配智能体",
  description:
    "录入一次经历，AI 智能分析岗位匹配度，为每个岗位生成专属简历。精准匹配 · 策略投递 · AI 赋能求职全流程。",
  keywords: ["职航", "CareerVoyage", "求职匹配", "AI 简历", "智能体", "JD 分析", "校招"],
  icons: {
    icon: [{ url: "/images/brand-icon.png", type: "image/png" }],
    apple: [{ url: "/images/brand-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "职航 — AI 求职匹配智能体",
    description: "精准匹配岗位 · 策略投递 · AI 赋能求职全流程。",
    type: "website",
    images: [{ url: "/images/brand-icon.png", width: 512, height: 512, alt: "职航" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} min-h-screen flex flex-col antialiased font-sans bg-surface-1 text-ink`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement,t=localStorage.getItem('theme'),dark=false;if(t==='dark')dark=true;else if(t!=='light')dark=window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark){d.classList.add('dark');d.style.colorScheme='dark';}else{d.classList.remove('dark');d.style.colorScheme='light';}}catch(e){}})();`}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
