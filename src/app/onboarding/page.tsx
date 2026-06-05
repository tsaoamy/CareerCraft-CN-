"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, Sparkles, Zap, ArrowRight, Check } from "lucide-react";
import { BrandButton } from "@/components/design-system/brand-button";
import { BrandLogo } from "@/components/brand-logo";
import { SystemInput, SystemSelect } from "@/components/system/system-input";
import { easeBrand } from "@/components/design-system/motion";
import { useSystemFeedback } from "@/lib/feedback/use-system-feedback";

const STEPS = [
  { id: "identity", icon: User, title: "Identity", subtitle: "确认你的身份档案" },
  { id: "goal", icon: Target, title: "Goal", subtitle: "设定职业目标方向" },
  { id: "preference", icon: Sparkles, title: "AI Preference", subtitle: "定制 AI 协作偏好" },
  { id: "ready", icon: Zap, title: "System Ready", subtitle: "系统初始化完成" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const fb = useSystemFeedback();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [industry, setIndustry] = useState("tech");
  const [tone, setTone] = useState("balanced");

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canNext =
    step === 0 ? name.trim().length > 0 :
    step === 1 ? goal.trim().length > 0 :
    step === 2 ? true : true;

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    fb.success("onboardingComplete");
    router.push("/dashboard");
  }

  return (
    <div className="onboarding-experience min-h-[calc(100vh-56px)] relative overflow-hidden">
      <div className="onboarding-experience-glow" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-16">
          <BrandLogo size="sm" />
          <span className="text-caption-sm text-mute uppercase tracking-[0.2em]">
            Step {step + 1} / {STEPS.length}
          </span>
        </div>

        <div className="mb-12">
          <div className="h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-volt"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: easeBrand }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 text-caption-sm ${
                  i <= step ? "text-volt" : "text-mute"
                }`}
              >
                {i < step ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <s.icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -40, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: easeBrand }}
          >
            <p className="text-caption-sm uppercase tracking-[0.25em] text-volt mb-4">
              {current.title}
            </p>
            <h1 className="brand-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink leading-[0.95] mb-4">
              {current.subtitle}
            </h1>

            <div className="mt-12 space-y-6 max-w-md">
              {step === 0 && (
                <>
                  <SystemInput
                    label="姓名"
                    placeholder="你的称呼"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <SystemInput
                    label="当前身份"
                    placeholder="如：大三学生 / 产品经理"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </>
              )}
              {step === 1 && (
                <>
                  <SystemInput
                    label="目标岗位"
                    placeholder="如：数据分析师、产品运营"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <SystemSelect label="目标行业" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="tech">互联网 / 科技</option>
                    <option value="finance">金融</option>
                    <option value="consulting">咨询</option>
                    <option value="other">其他</option>
                  </SystemSelect>
                </>
              )}
              {step === 2 && (
                <>
                  <SystemSelect label="AI 反馈风格" value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="direct">直接高效</option>
                    <option value="balanced">平衡详略</option>
                    <option value="detailed">深度解析</option>
                  </SystemSelect>
                  <p className="text-body-md text-stone leading-relaxed">
                    AI 将根据你的偏好调整分析深度与建议粒度。
                  </p>
                </>
              )}
              {step === 3 && (
                <div className="system-card p-8 space-y-4">
                  <p className="text-body-md text-stone">档案已就绪，系统正在为你构建职业知识图谱。</p>
                  <ul className="space-y-2 text-caption-md text-stone">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-volt" /> 身份档案已同步</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-volt" /> 目标方向已锁定</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-volt" /> AI 偏好已配置</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center gap-4">
          {step > 0 && (
            <BrandButton variant="outline-dark" size="md" onClick={() => setStep((s) => s - 1)}>
              上一步
            </BrandButton>
          )}
          <BrandButton
            variant="volt"
            size="md"
            onClick={handleNext}
            disabled={!canNext}
          >
            {step === STEPS.length - 1 ? "进入系统" : "继续"}
            <ArrowRight className="w-4 h-4" />
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
