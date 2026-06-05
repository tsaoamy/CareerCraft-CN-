import { Hero } from "@/components/landing/hero";
import { ValueProposition } from "@/components/landing/value-proposition";
import { FeatureShowcase } from "@/components/landing/feature-showcase";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { CareerVault } from "@/components/landing/career-vault";

export default function HomePage() {
  return (
    <>
      {/* 第一屏 · 品牌冲击 */}
      <Hero />
      {/* 第二屏 · 核心价值 */}
      <ValueProposition />
      {/* 第三屏 · 产品能力 */}
      <FeatureShowcase />
      <DashboardPreview />
      {/* 第四屏 · 用户信任 + 第五屏 · 行动转化 */}
      <CareerVault />
    </>
  );
}
