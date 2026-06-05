"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrandButton } from "@/components/design-system/brand-button";
import { Stagger, StaggerItem, easeBrand } from "@/components/design-system/motion";
import { useLocale } from "@/lib/i18n/locale-context";
import { HeroMiddleware, HeroWorkflowPanel } from "./hero-visuals";
import { HeroHeadline } from "./hero-headline";

export function Hero() {
  const { t } = useLocale();
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 420], [1, 0]);
  const contentY = useTransform(scrollY, [0, 420], [0, -40]);

  return (
    <section className="brand-hero brand-hero-noise relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[5%] right-[5%] w-[480px] h-[480px] rounded-full bg-volt/[0.05] blur-[100px]" />
        <div className="absolute top-[35%] left-[40%] w-[320px] h-[320px] rounded-full bg-volt/[0.03] blur-[80px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--highlight-secondary)] blur-[90px]" />
      </div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="brand-editorial-width relative z-10 w-full flex-1 flex flex-col justify-center pt-[72px] pb-20 md:pt-24 md:pb-24 lg:pt-28 lg:pb-28"
      >
        <Stagger className="hero-three-col">
          {/* Left — narrative + CTA */}
          <div className="hero-col-left text-center lg:text-left min-w-0">
            <StaggerItem>
              <div className="inline-flex items-center gap-2 mb-5 md:mb-6 px-4 py-2 rounded-pill border border-hairline bg-[var(--card-bg)] text-caption-sm text-stone">
                <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
                {t.hero.badge}
              </div>
            </StaggerItem>

            <StaggerItem>
              <HeroHeadline />
            </StaggerItem>

            <StaggerItem>
              <p className="text-body-md text-stone max-w-[440px] mx-auto lg:mx-0 mb-7 md:mb-8 leading-relaxed">
                {t.hero.subtitle}
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-5">
                <BrandButton href="/register" variant="volt" size="lg">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="w-4 h-4" />
                </BrandButton>
                <BrandButton href="/talent/matching" variant="outline" size="lg">
                  {t.hero.ctaSecondary}
                </BrandButton>
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="text-caption-sm text-stone flex items-center justify-center lg:justify-start gap-2">
                {t.hero.trust}
              </p>
            </StaggerItem>
          </div>

          {/* Middle — floating hub (desktop lg+) */}
          <StaggerItem className="hero-col-mid min-w-0">
            <HeroMiddleware />
          </StaggerItem>

          {/* Right — workflow panel */}
          <StaggerItem className="hero-col-right min-w-0">
            <HeroWorkflowPanel />
          </StaggerItem>
        </Stagger>

        {/* Mobile / tablet metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.55, ease: easeBrand }}
          className="lg:hidden mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 py-6 border-t border-hairline-soft"
        >
          {[
            { v: "10×", l: t.hero.stat1 },
            { v: "83%", l: t.hero.stat2 },
            { v: "5m", l: t.hero.stat3 },
            { v: "100+", l: t.hero.stat4 },
          ].map(({ v, l }) => (
            <div key={l} className="text-center p-3 rounded-lg bg-[var(--card-bg)] border border-hairline-soft">
              <p className="font-display text-2xl text-ink tabular-nums">{v}</p>
              <p className="text-[11px] text-stone mt-1 leading-snug">{l}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#value"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone hover:text-volt transition-colors z-20"
        aria-label="Scroll"
      >
        <span className="text-caption-sm uppercase tracking-widest">Explore</span>
        <ChevronDown className="w-5 h-5 animate-scroll-hint" />
      </motion.a>
    </section>
  );
}
