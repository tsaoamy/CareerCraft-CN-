"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("请输入用户名"); return; }
    if (!email.trim()) { setError("请输入邮箱"); return; }
    if (!password || password.length < 6) { setError("密码至少需要 6 位"); return; }
    setLoading(true);
    const result = await register(username, email, password);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "注册失败");
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
            创建账号
          </h1>
          <p className="text-[15px] text-apple-text-secondary">
            开始构建你的职业档案库
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="apple-card p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#ffebee] dark:bg-[#3d1111]">
                <AlertCircle className="w-[18px] h-[18px] text-apple-red shrink-0" />
                <span className="text-[13px] text-apple-red">{error}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <label className="text-[14px] font-medium text-apple-text dark:text-white">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-apple-text-secondary" />
                <Input
                  type="text"
                  placeholder="你的名字"
                  className="pl-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="至少6位密码"
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
              {loading ? "注册中..." : "创建账号"}
            </Button>

            <p className="text-center text-[13px] text-apple-text-secondary">
              已有账号？
              <Link href="/login" className="text-apple-blue hover:text-[#0077ed] ml-1 font-medium transition-colors">
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
