"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle,
  Sparkles, Github, MessageCircle, Shield, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";

/* Password strength rules */
const strengthRules = [
  { test: (p: string) => p.length >= 6, label: "至少 6 个字符" },
  { test: (p: string) => p.length >= 10, label: "至少 10 个字符" },
  { test: (p: string) => /[A-Z]/.test(p), label: "包含大写字母" },
  { test: (p: string) => /[0-9]/.test(p), label: "包含数字" },
  { test: (p: string) => /[!@#$%^&*]/.test(p), label: "包含特殊字符" },
];

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  const passes = strengthRules.filter((r) => r.test(pwd)).length;
  if (!pwd) return { score: 0, label: "", color: "bg-[#d2d2d7]" };
  if (passes <= 2) return { score: 1, label: "较弱", color: "bg-[#ff375f]" };
  if (passes <= 3) return { score: 2, label: "中等", color: "bg-[#ff9f0a]" };
  if (passes <= 4) return { score: 3, label: "良好", color: "bg-[#5ac8fa]" };
  return { score: 4, label: "强", color: "bg-[#34c759]" };
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passedRules = strengthRules.filter((r) => r.test(password)).length;

  const canNextStep = () => {
    if (step === 1) return username.trim().length > 0 && email.trim().length > 0;
    if (step === 2) return password.length >= 6;
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("请输入用户名"); return; }
    if (!email.trim()) { setError("请输入邮箱"); return; }
    if (!password || password.length < 6) { setError("密码至少需要 6 位"); return; }
    if (!agreeTerms) { setError("请同意服务条款和隐私政策"); return; }
    setLoading(true);
    const result = await register(username, email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "注册失败，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* ===== Layered decorative background ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs - different from login */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8944ab]/10 to-[#bf5af2]/5 blur-[140px] animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#0071e3]/10 to-[#5ac8fa]/5 blur-[120px] animate-float-slow" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#ff9f0a]/5 to-transparent blur-[100px]" />

        {/* Floating shapes */}
        <div className="absolute top-[12%] right-[12%] w-3 h-3 rounded-full bg-[#8944ab]/20 animate-float-slow" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[25%] left-[8%] w-2.5 h-2.5 rounded-full bg-[#0071e3]/20 animate-float-slow" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-[20%] right-[18%] w-2 h-2 rounded-full bg-[#34c759]/20 animate-float-slow" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[50%] right-[5%] w-3.5 h-3.5 rounded-full bg-[#bf5af2]/15 animate-float-slow" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-[40%] left-[15%] w-2.5 h-2.5 rounded bg-[#ff9f0a]/15 animate-spin-slow" />
        <div className="absolute top-[70%] left-[5%] w-4 h-4 rounded-full border-2 border-[#8944ab]/10 animate-spin-slow" style={{ animationDuration: "25s" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* ===== Main content ===== */}
      <div className={`w-full max-w-[440px] relative transition-all duration-800 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] text-apple-text-secondary hover:text-[#8944ab] dark:hover:text-[#bf5af2] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-[16px] h-[16px] group-hover:-translate-x-1 transition-transform duration-200" />
          返回首页
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8944ab] to-[#bf5af2] opacity-20 blur-xl animate-float-slow" />
            <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#1c1c1e] shadow-sm border border-[#d2d2d7]/30 dark:border-[#38383a]/50 flex items-center justify-center group">
              <Sparkles className="w-8 h-8 text-[#8944ab] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <h1 className="text-[30px] font-bold tracking-tight text-apple-text dark:text-white mb-2.5">
            创建账号
          </h1>
          <p className="text-[15px] text-apple-text-secondary leading-relaxed">
            开始构建你的职业档案库
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-400
                ${s <= step
                  ? "bg-gradient-to-br from-[#8944ab] to-[#bf5af2] text-white shadow-[0_2px_8px_rgba(137,68,171,0.3)]"
                  : "bg-[#e8e8ed] dark:bg-[#2c2c2e] text-apple-text-secondary"
                }
              `}>
                {s < step ? <Check className="w-[14px] h-[14px]" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-[2px] rounded-full transition-all duration-400 ${
                  s < step ? "bg-[#8944ab]" : "bg-[#d2d2d7] dark:bg-[#38383a]"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card with inner glow */}
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-[22px] bg-gradient-to-br from-[#8944ab]/20 via-[#bf5af2]/10 to-[#0071e3]/20 opacity-60 blur-sm" />
          <div className="relative apple-card p-8">
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Error alert */}
              {error && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#ffebee] dark:bg-[#3d1111] border border-[#ff375f]/20 animate-scale-in">
                  <AlertCircle className="w-[17px] h-[17px] text-[#ff375f] shrink-0" />
                  <span className="text-[13px] text-[#ff375f]">{error}</span>
                </div>
              )}

              {/* Step 1: Username + Email */}
              {step <= 2 && (
                <>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-apple-text dark:text-white">
                      用户名
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-apple-text-secondary group-focus-within:text-[#8944ab] transition-colors duration-200 z-10" />
                      <Input
                        type="text"
                        placeholder="你的名字"
                        className="pl-11 h-[46px] rounded-xl text-[14px] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(137,68,171,0.1)]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-apple-text dark:text-white">
                      邮箱
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-apple-text-secondary group-focus-within:text-[#8944ab] transition-colors duration-200 z-10" />
                      <Input
                        type="text"
                        placeholder="your@email.com"
                        className="pl-11 h-[46px] rounded-xl text-[14px] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(137,68,171,0.1)]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Password with strength meter */}
              {step >= 2 && (
                <div className="space-y-2 animate-fade-in-up">
                  <label className="text-[13px] font-medium text-apple-text dark:text-white">
                    密码
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-apple-text-secondary group-focus-within:text-[#8944ab] transition-colors duration-200 z-10" />
                    <Input
                      type={showPwd ? "text" : "password"}
                      placeholder="至少6位密码"
                      className="pl-11 pr-11 h-[46px] rounded-xl text-[14px] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(137,68,171,0.1)]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPwd ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {password && (
                    <div className="mt-2 space-y-2 animate-scale-in">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[#e8e8ed] dark:bg-[#2c2c2e] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                            style={{ width: `${(passedRules / strengthRules.length) * 100}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-medium ${strength.score > 0 ? "text-apple-text dark:text-white" : "text-apple-text-secondary"}`}>
                          {strength.label}
                        </span>
                      </div>
                      {/* Rule checklist */}
                      <div className="grid grid-cols-1 gap-1">
                        {strengthRules.map((rule, i) => {
                          const passed = rule.test(password);
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${
                                passed ? "text-[#34c759]" : "text-apple-text-secondary"
                              }`}
                            >
                              {passed ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3 opacity-40" />
                              )}
                              {rule.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Terms + Submit */}
              {step >= 3 && (
                <div className="animate-fade-in-up space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 apple-toggle scale-[0.55] origin-left"
                    />
                    <span className="text-[13px] text-apple-text-secondary leading-relaxed group-hover:text-apple-text dark:group-hover:text-white transition-colors">
                      我已阅读并同意{" "}
                      <Link href="/terms" className="text-[#0071e3] dark:text-[#0a84ff] hover:underline">服务条款</Link>
                      {" "}和{" "}
                      <Link href="/privacy" className="text-[#0071e3] dark:text-[#0a84ff] hover:underline">隐私政策</Link>
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-1">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-[48px] rounded-xl text-[14px]"
                    onClick={() => setStep(step - 1)}
                  >
                    上一步
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    className="flex-1 h-[48px] rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#8944ab] to-[#bf5af2] hover:shadow-[0_6px_24px_rgba(137,68,171,0.35)] transition-all duration-300 active:scale-[0.98]"
                    onClick={() => setStep(step + 1)}
                    disabled={!canNextStep()}
                  >
                    继续
                  </Button>
                ) : (
                  <Button
                    className="flex-1 h-[48px] rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#8944ab] to-[#bf5af2] hover:shadow-[0_6px_24px_rgba(137,68,171,0.35)] transition-all duration-300 active:scale-[0.98]"
                    type="submit"
                    disabled={loading || !agreeTerms}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2.5">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        注册中...
                      </span>
                    ) : (
                      "创建账号"
                    )}
                  </Button>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d2d2d7]/40 dark:border-[#38383a]/60" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[12px] text-apple-text-secondary bg-white dark:bg-[#1c1c1e]">
                    或通过以下方式注册
                  </span>
                </div>
              </div>

              {/* Social register buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { icon: Github, label: "GitHub", color: "hover:bg-[#24292e]/10 dark:hover:bg-[#24292e]/30" },
                  { icon: MessageCircle, label: "微信", color: "hover:bg-[#07c160]/10 dark:hover:bg-[#07c160]/20" },
                  { icon: Shield, label: "SSO", color: "hover:bg-[#8944ab]/10 dark:hover:bg-[#8944ab]/20" },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    type="button"
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#d2d2d7]/30 dark:border-[#38383a]/50 text-[13px] text-apple-text-secondary transition-all duration-200 ${color}`}
                  >
                    <Icon className="w-[17px] h-[17px]" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Login link */}
              <p className="text-center text-[13px] text-apple-text-secondary pt-1">
                已有账号？{" "}
                <Link
                  href="/login"
                  className="text-[#0071e3] dark:text-[#0a84ff] hover:text-[#0077ed] font-medium transition-colors hover:underline"
                >
                  立即登录
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-apple-text-secondary/60 mt-6">
          注册即表示同意{" "}
          <Link href="/terms" className="underline hover:text-apple-text dark:hover:text-white transition-colors">服务条款</Link>
          {" "}和{" "}
          <Link href="/privacy" className="underline hover:text-apple-text dark:hover:text-white transition-colors">隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
