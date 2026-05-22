"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(result.error || "登录失败");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-52px)] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] text-apple-text-secondary hover:text-apple-text dark:hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          返回首页
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-[28px] font-bold tracking-tight text-apple-text dark:text-white mb-2">
            欢迎回来
          </h1>
          <p className="text-[15px] text-apple-text-secondary">
            登录后继续管理你的职业档案
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="apple-card p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#ffebee] dark:bg-[#3d1111]">
                <AlertCircle className="w-[18px] h-[18px] text-apple-red shrink-0" />
                <span className="text-[13px] text-apple-red">{error}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-apple-text dark:text-white">
                邮箱
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-apple-text-secondary" />
                <Input
                  type="text"
                  placeholder="your@email.com"
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-apple-text dark:text-white">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-apple-text-secondary" />
                <Input
                  type={showPwd ? "text" : "password"}
                  placeholder="输入密码"
                  className="pl-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-text-secondary hover:text-apple-text dark:hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>

            <p className="text-center text-[13px] text-apple-text-secondary">
              还没有账号？
              <Link href="/register" className="text-apple-blue hover:text-[#0077ed] ml-1 font-medium transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
