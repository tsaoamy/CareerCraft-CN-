"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle,
  Sparkles, Github, MessageCircle, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("请填写邮箱和密码");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "邮箱或密码错误，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* ===== Layered decorative background ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#0071e3]/10 to-[#5ac8fa]/5 blur-[140px] animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#8944ab]/10 to-[#bf5af2]/5 blur-[120px] animate-float-slow" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#34c759]/5 to-transparent blur-[100px]" />

        {/* Floating decorative shapes */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-[#0071e3]/20 animate-float-slow" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[20%] right-[15%] w-2.5 h-2.5 rounded-full bg-[#8944ab]/20 animate-float-slow" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-[25%] left-[20%] w-2 h-2 rounded-full bg-[#ff9f0a]/20 animate-float-slow" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[40%] right-[8%] w-3.5 h-3.5 rounded-full bg-[#5ac8fa]/15 animate-float-slow" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-[35%] right-[25%] w-2 h-2 rounded bg-[#bf5af2]/15 animate-spin-slow" />
        <div className="absolute top-[60%] left-[8%] w-4 h-4 rounded-full border-2 border-[#0071e3]/10 animate-spin-slow" style={{ animationDuration: "25s" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* ===== Main content ===== */}
      <div className={`w-full max-w-[440px] relative transition-all duration-800 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] text-apple-text-secondary hover:text-[#0071e3] dark:hover:text-[#0a84ff] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-[16px] h-[16px] group-hover:-translate-x-1 transition-transform duration-200" />
          返回首页
        </Link>

        {/* Header with animated icon */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0071e3] to-[#5ac8fa] opacity-20 blur-xl animate-float-slow" />
            <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#1c1c1e] shadow-sm border border-[#d2d2d7]/30 dark:border-[#38383a]/50 flex items-center justify-center group">
              <Sparkles className="w-8 h-8 text-[#0071e3] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <h1 className="text-[30px] font-bold tracking-tight text-apple-text dark:text-white mb-2.5">
            欢迎回来
          </h1>
          <p className="text-[15px] text-apple-text-secondary leading-relaxed">
            登录后继续管理你的职业档案
          </p>
        </div>

        {/* Card with inner glow */}
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-[22px] bg-gradient-to-br from-[#0071e3]/20 via-[#5ac8fa]/10 to-[#8944ab]/20 opacity-60 blur-sm" />
          <div className="relative apple-card p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error alert */}
              {error && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#ffebee] dark:bg-[#3d1111] border border-[#ff375f]/20 animate-scale-in">
                  <AlertCircle className="w-[17px] h-[17px] text-[#ff375f] shrink-0" />
                  <span className="text-[13px] text-[#ff375f]">{error}</span>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">
                  邮箱
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-apple-text-secondary group-focus-within:text-[#0071e3] transition-colors duration-200 z-10" />
                  <Input
                    type="text"
                    placeholder="your@email.com"
                    className="pl-11 h-[46px] rounded-xl text-[14px] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.1)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">
                  密码
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-apple-text-secondary group-focus-within:text-[#0071e3] transition-colors duration-200 z-10" />
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="输入密码"
                    className="pl-11 pr-11 h-[46px] rounded-xl text-[14px] transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(0,113,227,0.1)]"
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
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="apple-toggle scale-[0.65] origin-left"
                  />
                  <span className="text-[13px] text-apple-text-secondary group-hover:text-apple-text dark:group-hover:text-white transition-colors">
                    记住我
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-[#0071e3] dark:text-[#0a84ff] hover:underline transition-all"
                >
                  忘记密码？
                </Link>
              </div>

              {/* Submit button */}
              <Button
                className="w-full h-[48px] rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#0071e3] to-[#5ac8fa] hover:shadow-[0_6px_24px_rgba(0,113,227,0.35)] transition-all duration-300 active:scale-[0.98]"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    登录中...
                  </span>
                ) : (
                  "登录"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d2d2d7]/40 dark:border-[#38383a]/60" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-[12px] text-apple-text-secondary bg-white dark:bg-[#1c1c1e]">
                    或通过以下方式登录
                  </span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { icon: Github, label: "GitHub", color: "hover:bg-[#24292e]/10 dark:hover:bg-[#24292e]/30" },
                  { icon: MessageCircle, label: "微信", color: "hover:bg-[#07c160]/10 dark:hover:bg-[#07c160]/20" },
                  { icon: Shield, label: "SSO", color: "hover:bg-[#0071e3]/10 dark:hover:bg-[#0071e3]/20" },
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

              {/* Register link */}
              <p className="text-center text-[13px] text-apple-text-secondary pt-1">
                还没有账号？{" "}
                <Link
                  href="/register"
                  className="text-[#0071e3] dark:text-[#0a84ff] hover:text-[#0077ed] font-medium transition-colors hover:underline"
                >
                  立即注册
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-apple-text-secondary/60 mt-6">
          登录即表示同意{" "}
          <Link href="/terms" className="underline hover:text-apple-text dark:hover:text-white transition-colors">服务条款</Link>
          {" "}和{" "}
          <Link href="/privacy" className="underline hover:text-apple-text dark:hover:text-white transition-colors">隐私政策</Link>
        </p>
      </div>
    </div>
  );
}
