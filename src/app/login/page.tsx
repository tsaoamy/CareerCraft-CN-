"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Smartphone, Eye, EyeOff, Lock, ScanLine, UserIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { QrCodePlatform } from "@/components/qr-code-platform";
import {
  AuthCampaignLayout, AuthPanel, AuthTabs, AuthErrorBanner,
} from "@/components/system/auth-layout";
import { SystemInput } from "@/components/system/system-input";
import { BrandButton } from "@/components/design-system/brand-button";

type TabType = "username" | "phone" | "wechat" | "qq";

const tabs: { key: TabType; label: string }[] = [
  { key: "username", label: "用户名" },
  { key: "phone", label: "手机号" },
  { key: "wechat", label: "微信" },
  { key: "qq", label: "QQ" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loginByPhone, loginByWechat, loginByQQ, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<TabType>("username");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [scanState, setScanState] = useState<"waiting" | "scanned" | "confirmed">("waiting");
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const switchTab = (t: TabType) => {
    setTab(t); setError(""); setUsername(""); setPhone(""); setPassword(""); setScanState("waiting");
  };

  // ── 用户名登录 ──
  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("请输入用户名和密码");
      return;
    }
    setLoading(true);
    console.info("[login] 开始用户名登录:", { username: username.trim() });
    const result = await login(username.trim(), password);
    if (result.success) {
      console.info("[login] ✅ 登录成功，跳转 dashboard");
      router.push("/dashboard");
    } else {
      console.error("[login] ❌ 登录失败:", result.error);
      setError(result.error || "登录失败，请重试");
    }
    setLoading(false);
  };

  // ── 手机号登录 ──
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim() || !password) {
      setError("请输入手机号和密码");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    setLoading(true);
    console.info("[login] 开始手机号登录:", { phone: phone.slice(0, 3) + '****' + phone.slice(-4) });
    const result = await loginByPhone(phone, password);
    if (result.success) {
      console.info("[login] ✅ 手机号登录成功，跳转 dashboard");
      router.push("/dashboard");
    } else {
      console.error("[login] ❌ 手机号登录失败:", result.error);
      setError(result.error || "登录失败，请重试");
    }
    setLoading(false);
  };

  const simulateQrScan = useCallback(async (provider: "wechat" | "qq") => {
    setError("");
    setScanState("scanned");
    await new Promise((r) => setTimeout(r, 800));
    setScanState("confirmed");
    await new Promise((r) => setTimeout(r, 400));
    setLoading(true);
    const openid = `${provider}_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const result = provider === "wechat" ? await loginByWechat(openid) : await loginByQQ(openid);
    if (result.success) router.push("/dashboard");
    else { setError(result.error || "登录失败，请重试"); setScanState("waiting"); }
    setLoading(false);
  }, [loginByWechat, loginByQQ, router]);

  return (
    <AuthCampaignLayout
      headline="WELCOME" headlineAccent="BACK"
      slogan="登录职航，继续你的 AI 求职旅程。精准匹配 · 策略投递 · 全链路智能辅助。"
    >
      <AuthPanel
        title="欢迎回来"
        subtitle="选择登录方式进入产品系统"
        footer={
          <p className="text-caption-md text-stone text-center">
            还没有账号？
            <Link href="/register" className="text-volt hover:underline ml-1 font-medium">立即注册</Link>
            <span className="mx-2 text-mute">·</span>
            <Link href="/forgot-password" className="text-stone hover:text-white transition-colors">忘记密码</Link>
          </p>
        }
      >
        <AuthTabs tabs={tabs} active={tab} onChange={switchTab} />
        {error && <AuthErrorBanner message={error} />}

        {/* ── 用户名登录 ── */}
        {tab === "username" && (
          <form onSubmit={handleUsernameLogin} className="space-y-5">
            <SystemInput
              label="用户名"
              type="text"
              placeholder="输入用户名"
              icon={<UserIcon className="w-4 h-4" />}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              state={loading ? "loading" : "default"}
            />
            <SystemInput
              label="密码"
              type={showPwd ? "text" : "password"}
              placeholder="输入密码"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-mute hover:text-white transition-colors" tabIndex={-1}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <BrandButton type="submit" variant="volt" size="lg" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </BrandButton>
          </form>
        )}

        {/* ── 手机号登录 ── */}
        {tab === "phone" && (
          <form onSubmit={handlePhoneLogin} className="space-y-5">
            <SystemInput
              label="手机号" type="tel" placeholder="输入手机号"
              icon={<Smartphone className="w-4 h-4" />}
              value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }}
              maxLength={11} state={loading ? "loading" : "default"}
            />
            <SystemInput
              label="密码" type={showPwd ? "text" : "password"} placeholder="输入密码"
              icon={<Lock className="w-4 h-4" />} value={password} onChange={(e) => setPassword(e.target.value)}
              suffix={
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-mute hover:text-white transition-colors" tabIndex={-1}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <BrandButton type="submit" variant="volt" size="lg" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </BrandButton>
          </form>
        )}

        {/* ── 微信/QQ 扫码 ── */}
        {(tab === "wechat" || tab === "qq") && (
          <div className="space-y-5 text-center">
            <QrCodePlatform platform={tab} refreshKey={refreshKey} scanState={scanState}
              onRefresh={() => { setRefreshKey((k) => k + 1); setScanState("waiting"); setError(""); }} />
            <p className="text-caption-md text-stone">{tab === "wechat" ? "微信扫一扫登录" : "QQ 扫一扫登录"}</p>
            {scanState === "waiting" && (
              <BrandButton variant="outline-dark" size="md" className="w-full" onClick={() => simulateQrScan(tab)} disabled={loading}>
                <ScanLine className="w-4 h-4" /> 模拟扫码成功
              </BrandButton>
            )}
          </div>
        )}

        <p className="text-center text-[11px] text-mute mt-8">
          登录即表示同意
          <Link href="/terms" className="underline hover:text-stone mx-1">服务条款</Link>和
          <Link href="/privacy" className="underline hover:text-stone ml-1">隐私政策</Link>
        </p>
      </AuthPanel>
    </AuthCampaignLayout>
  );
}
