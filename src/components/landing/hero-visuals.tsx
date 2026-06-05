"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  FileText,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { easeBrand } from "@/components/design-system/motion";
import { useLocale } from "@/lib/i18n/locale-context";

const FEED_KEYS = ["jdParsed", "profileSynced", "matchEngine"] as const;

export function HeroWorkflowPanel() {
  const { t } = useLocale();
  const h = t.hero;
  const [phase, setPhase] = useState<"processing" | "complete">("processing");
  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("complete"), 2800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((i) => (i + 1) % FEED_KEYS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const skills = [
    { label: "React", pct: 92 },
    { label: "TypeScript", pct: 85 },
    { label: "System Design", pct: 68 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.75, delay: 0.25, ease: easeBrand }}
      className="hero-workflow-panel w-full xl:-mt-32 xl:ml-32"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hero-workflow-panel-inner rounded-xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-hairline-soft">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="xs" />
            <div className="min-w-0">
              <p className="text-caption-sm font-medium text-ink truncate">{h.workflowTitle}</p>
              <p className="text-[11px] text-stone truncate">{h.previewRole}</p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill landing-tag text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
            {h.liveLabel}
          </span>
        </div>

        <div className="px-5 py-4 border-b border-hairline-soft">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-stone mb-1">{h.previewMatch}</p>
              <p className="font-display text-[3rem] leading-none text-volt tabular-nums">
                87<span className="text-xl text-ink">%</span>
              </p>
            </div>
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-right"
            >
              <p className="text-[11px] text-stone mb-0.5">{h.scanLabel}</p>
              <p className="text-caption-sm text-volt font-medium">
                {phase === "processing" ? h.processingInsight : h.analysisComplete}
              </p>
            </motion.div>
          </div>
          <div className="h-1 bg-hairline-soft relative overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: easeBrand }}
              className="absolute inset-y-0 left-0 bg-volt rounded-full"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-b border-hairline-soft">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-volt" />
            <p className="text-caption-sm font-medium text-ink">{h.skillMatch}</p>
          </div>
          <div className="space-y-2.5">
            {skills.map((skill, i) => (
              <div key={skill.label}>
                <div className="flex justify-between text-[11px] text-stone mb-1">
                  <span>{skill.label}</span>
                  <span>{skill.pct}%</span>
                </div>
                <div className="h-px bg-hairline-soft relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: easeBrand }}
                    className="absolute inset-y-0 left-0 bg-volt/80"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-hairline-soft border-b border-hairline-soft">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-3.5 h-3.5 text-volt" />
              <p className="text-[11px] text-stone">{h.interviewScore}</p>
            </div>
            <p className="font-display text-[2rem] leading-none text-ink tabular-nums">
              82<span className="text-sm text-stone">/100</span>
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-volt" />
              <p className="text-[11px] text-stone">{h.resumeAnalysis}</p>
            </div>
            <p className="font-display text-[2rem] leading-none text-ink tabular-nums">
              A<span className="text-sm text-volt">+</span>
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-hairline-soft space-y-2">
          {[h.starDetected, h.projectsMatched, h.analyzingGap].map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15, duration: 0.45, ease: easeBrand }}
              className="flex items-start gap-2 text-[11px] text-stone leading-relaxed"
            >
              <Sparkles className="w-3 h-3 text-volt shrink-0 mt-0.5" />
              <span>{line}</span>
            </motion.div>
          ))}
        </div>

        <div className="px-5 py-3.5 bg-[var(--accent-soft)]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-volt" />
            <p className="text-[10px] uppercase tracking-widest text-stone">{h.realtimeFeed}</p>
          </div>
          <motion.p
            key={feedIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] text-volt truncate"
          >
            &gt; {h[FEED_KEYS[feedIndex]]}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HeroMiddleware() {
  const { t } = useLocale();
  const h = t.hero;

  const metrics = [
    { icon: Zap, value: "10×", label: h.stat1 },
    { icon: Brain, value: "83%", label: h.stat2 },
    { icon: Target, value: "5m", label: h.stat3 },
  ];

  const orbitNodes = [
    { label: h.floatBadge1, duration: "32s", radius: "132px", delay: "0s", reverse: false },
    { label: h.floatBadge2, duration: "24s", radius: "98px", delay: "-11s", reverse: true },
    { label: "AI", duration: "28s", radius: "156px", delay: "-5s", reverse: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.12, ease: easeBrand }}
      className="hero-middleware relative w-full"
    >
      <div className="hero-orbit-cinematic">
        <div
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,260px)] aspect-square rounded-full bg-volt/[0.06] blur-[80px] pointer-events-none"
          aria-hidden
        />

        <div className="hero-orbit-stage hero-orbit-stage-open hero-orbit-stage-cinematic">
          <div className="hero-orbit-ring hero-orbit-ring-outer" aria-hidden />
          <div className="hero-orbit-ring hero-orbit-ring-mid" aria-hidden />
          <div className="hero-orbit-ring hero-orbit-ring-inner" aria-hidden />

          <svg
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30"
            width="240"
            height="240"
            viewBox="0 0 240 240"
            aria-hidden
          >
            <circle
              cx="120"
              cy="120"
              r="108"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-volt/40"
              strokeDasharray="4 8"
            />
            <circle
              cx="120"
              cy="120"
              r="76"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-volt/25"
              strokeDasharray="2 6"
            />
          </svg>

          <div className="hero-orbit-particles" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="hero-orbit-dot"
                style={{
                  ["--dot-angle" as string]: `${i * 30}deg`,
                  ["--dot-delay" as string]: `${i * 0.22}s`,
                }}
              />
            ))}
          </div>

          {orbitNodes.map((node) => (
            <div
              key={node.label}
              className={`hero-orbit-path${node.reverse ? " hero-orbit-path-reverse" : ""}`}
              style={{
                ["--orbit-duration" as string]: node.duration,
                ["--orbit-delay" as string]: node.delay,
              }}
            >
              <div
                className={`hero-orbit-satellite${node.reverse ? " hero-orbit-satellite-reverse" : ""}`}
                style={{ ["--orbit-radius" as string]: node.radius }}
              >
                <span className="hero-orbit-node">{node.label}</span>
              </div>
            </div>
          ))}

          <div className="hero-planet-core">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: easeBrand }}
              className="hero-scan-ring hero-scan-ring-lg"
            >
              <div className="hero-scan-orbit" aria-hidden />
              <motion.div
                className="hero-scan-pulse"
                animate={{ scale: [1, 1.14, 1], opacity: [0.45, 0.1, 0.45] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="hero-scan-sweep"
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
              <div className="hero-scan-ring-core">
                <Brain className="w-8 h-8 text-volt" strokeWidth={1.25} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hero-metrics-row">
          {metrics.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              className="hero-metric-cell"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: easeBrand }}
            >
              <Icon className="w-3.5 h-3.5 text-volt mx-auto mb-1.5" strokeWidth={1.5} />
              <p className="font-display text-lg leading-none text-ink tabular-nums">{value}</p>
              <p className="text-[10px] text-stone mt-1 leading-tight">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="hero-middleware-caption text-center mt-3 px-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone mb-2">{h.scanLabel}</p>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-pill text-[11px] text-stone border border-hairline-soft bg-[var(--surface-3)]/75 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
            {h.systemActive}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
