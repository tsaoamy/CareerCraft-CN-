"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { StatusPanel } from "@/components/system/status";
import { BrandButton } from "@/components/design-system/brand-button";
import { BrandLogo } from "@/components/brand-logo";
import { easeBrand } from "@/components/design-system/motion";
import { feedback } from "@/lib/feedback/messages";

type VerifyPhase = "loading" | "success" | "expired" | "error";

export default function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const forced = params.get("state") as VerifyPhase | null;
  const token = params.get("token");

  const [phase, setPhase] = useState<VerifyPhase>("loading");

  useEffect(() => {
    if (forced && ["loading", "success", "expired", "error"].includes(forced)) {
      if (forced === "loading") {
        const t = setTimeout(() => setPhase("success"), 2200);
        return () => clearTimeout(t);
      }
      setPhase(forced);
      return;
    }

    const t = setTimeout(() => {
      if (!token || token === "expired") {
        setPhase("expired");
      } else if (token === "error") {
        setPhase("error");
      } else {
        setPhase("success");
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [forced, token]);

  const content = useMemo(() => {
    switch (phase) {
      case "loading":
        return {
          variant: "loading" as const,
          title: "正在确认身份",
          description: "系统正在验证你的访问凭证，请稍候…",
        };
      case "success":
        return {
          variant: "success" as const,
          title: "系统已接入",
          description: feedback("verifySuccess"),
        };
      case "expired":
        return {
          variant: "warning" as const,
          title: "链接已失效",
          description: feedback("verifyExpired"),
        };
      case "error":
        return {
          variant: "error" as const,
          title: "验证中断",
          description: feedback("verifyError"),
        };
    }
  }, [phase]);

  return (
    <div className="verify-experience min-h-[calc(100vh-56px)] flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="verify-experience-glow" aria-hidden />
      <div className="verify-experience-noise" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeBrand }}
        className="relative z-10 mb-16"
      >
        <BrandLogo size="sm" />
      </motion.div>

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: easeBrand }}
            className="verify-experience-panel p-10 md:p-14"
          >
            <StatusPanel
              variant={content.variant}
              title={content.title}
              description={content.description}
            >
              {phase === "success" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <BrandButton variant="volt" size="md" onClick={() => router.push("/dashboard")}>
                    进入控制台
                  </BrandButton>
                  <BrandButton variant="outline-dark" size="md" onClick={() => router.push("/onboarding")}>
                    完成初始化
                  </BrandButton>
                </div>
              )}
              {phase === "expired" && (
                <BrandButton variant="volt" size="md" href="/login">
                  重新登录
                </BrandButton>
              )}
              {phase === "error" && (
                <BrandButton variant="volt" size="md" onClick={() => window.location.reload()}>
                  重试验证
                </BrandButton>
              )}
            </StatusPanel>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 mt-12 flex items-center gap-6 text-caption-sm text-mute uppercase tracking-[0.2em]"
      >
        {[
          { icon: Shield, label: "Secure" },
          { icon: phase === "success" ? CheckCircle2 : phase === "expired" ? Clock : AlertCircle, label: phase },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5" />
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
