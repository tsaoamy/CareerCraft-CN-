"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Check, X, ScanLine, Smartphone } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { QrCodePlatform } from "@/components/qr-code-platform";
import {
  AuthCampaignLayout, AuthPanel, AuthTabs, AuthErrorBanner,
} from "@/components/system/auth-layout";
import { SystemInput } from "@/components/system/system-input";
import { BrandButton } from "@/components/design-system/brand-button";

type TabType = "phone" | "wechat" | "qq";

const strengthRules = [
  { test: (p: string) => p.length >= 6, label: "至少 6 个字符" },
  { test: (p: string) => p.length >= 10, label: "至少 10 个字符" },
  { test: (p: string) => /[a-zA-Z]/.test(p), label: "包含字母" },
  { test: (p: string) => /[0-9]/.test(p), label: "包含数字" },
];

function getPasswordStrength(pwd: string) {
  const passes = strengthRules.filter((r) => r.test(pwd)).length;
  if (!pwd) return { label: "", color: "bg-white/10" };
  if (passes <= 1) return { label: "较弱", color: "bg-sale" };
  if (passes <= 2) return { label: "中等", color: "bg-volt/60" };
  if (passes <= 3) return { label: "良好", color: "bg-volt" };
  return { label: "强", color: "bg-volt" };
}

const tabs: { key: TabType; label: string }[] = [
  { key: "phone", label: "手机号" },
  { key: "wechat", label: "微信" },
  { key: "qq", label: "QQ" },
];

// 模拟验证码（开发阶段）
const SIMULATED_CODE = "888888";

export default function RegisterPage() {
  const router = useRouter();
  const { registerByPhone, loginByWechat, loginByQQ, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<TabType>("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [scanState, setScanState] = useState<"waiting" | "scanned" | "confirmed">("waiting");
  const [refreshKey, setRefreshKey] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (smsCountdown <= 0) return;
    const t = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
    return () => clearTimeout(t);
  }, [smsCountdown]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passedRules = strengthRules.filter((r) => r.test(password)).length;

  // ── 发送验证码 ──
  const handleSendCode = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号");
      return;
    }
    setError("");
    setSmsSent(true);
    setSmsCountdown(60);
    // 模拟：在控制台输出验证码，方便开发调试
    console.info(`[register] 📱 验证码已发送到 ${phone.slice(0, 3)}****${phone.slice(-4)}`);
    console.info(`[register] 🔑 模拟验证码: ${SIMULATED_CODE}`);
  };

  // ── 校验验证码 ──
  const handleVerifyCode = () => {
    setError("");
    if (smsCode === SIMULATED_CODE) {
      setSmsVerified(true);
      console.info("[register] ✅ 验证码校验通过");
    } else {
      setError("验证码错误，请重新输入（提示: 888888）");
    }
  };

  const canSubmit = () => {
    if (tab === "phone") {
      return /^1[3-9]\d{9}$/.test(phone) && smsVerified && password.length >= 6 && agreeTerms;
    }
    return agreeTerms;
  };

  // ── 手机号注册 ──
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreeTerms) { setError("请同意服务条款和隐私政策"); return; }
    if (!/^1[3-9]\d{9}$/.test(phone)) { setError("请输入正确的手机号"); return; }
    if (!smsVerified) { setError("请先完成短信验证"); return; }
    if (password.length < 6) { setError("密码至少 6 位"); return; }
    setLoading(true);
    console.info("[register] 开始手机号注册:", { phone: phone.slice(0, 3) + '****' + phone.slice(-4), passwordLength: password.length });
    const result = await registerByPhone(phone, password);
    if (result.success) {
      console.info("[register] ✅ 手机号注册成功，跳转 dashboard");
      router.push("/dashboard");
    } else {
      console.error("[register] ❌ 手机号注册失败:", result.error);
      setError(result.error || "注册失败，请重试");
    }
    setLoading(false);
  };

  const simulateQrScan = useCallback(async (provider: "wechat" | "qq") => {
    if (!agreeTerms) { setError("请同意服务条款和隐私政策"); return; }
    setError("");
    setScanState("scanned");
    await new Promise((r) => setTimeout(r, 800));
    setScanState("confirmed");
    await new Promise((r) => setTimeout(r, 400));
    setLoading(true);
    const openid = `${provider}_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const result = provider === "wechat" ? await loginByWechat(openid) : await loginByQQ(openid);
    if (result.success) router.push("/dashboard");
    else { setError(result.error || "注册失败"); setScanState("waiting"); }
    setLoading(false);
  }, [agreeTerms, loginByWechat, loginByQQ, router]);

  const switchTab = (t: TabType) => {
    setTab(t);
    setError("");
    setPhone("");
    setPassword("");
    setSmsCode("");
    setSmsSent(false);
    setSmsVerified(false);
    setScanState("waiting");
  };

  return (
    <AuthCampaignLayout
      headline="JOIN"
      headlineAccent="THE SYSTEM"
      slogan="创建账号，构建你的 AI 职业档案。一次录入，永久调用，为每个机会精准匹配。"
    >
      <AuthPanel
        title="创建账号"
        subtitle="选择注册方式，进入未来求职系统"
        footer={
          <p className="text-caption-md text-stone text-center">
            已有账号？
            <Link href="/login" className="text-volt hover:underline ml-1 font-medium">立即登录</Link>
          </p>
        }
      >
        <AuthTabs tabs={tabs} active={tab} onChange={switchTab} />
        {error && <AuthErrorBanner message={error} />}

        {/* ── 手机号注册（短信验证码流程）── */}
        {tab === "phone" && (
          <form onSubmit={handlePhoneRegister} className="space-y-5">
            {/* 步骤 1：输入手机号 & 发送验证码 */}
            <SystemInput
              label="手机号"
              type="tel"
              placeholder="输入手机号"
              icon={<Smartphone className="w-4 h-4" />}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); setSmsSent(false); setSmsVerified(false); }}
              maxLength={11}
              disabled={smsVerified}
            />

            {!smsVerified && (
              <div className="flex gap-2">
                <SystemInput
                  className="flex-1"
                  label="短信验证码"
                  type="text"
                  placeholder="输入 6 位验证码"
                  value={smsCode}
                  onChange={(e) => { setSmsCode(e.target.value); setError(""); }}
                  maxLength={6}
                />
                <div className="flex flex-col justify-end">
                  {smsCountdown > 0 ? (
                    <BrandButton type="button" variant="outline-dark" size="md" disabled className="whitespace-nowrap">
                      {smsCountdown}s 后重发
                    </BrandButton>
                  ) : (
                    <BrandButton type="button" variant="outline-dark" size="md" onClick={handleSendCode} className="whitespace-nowrap">
                      {smsSent ? "重新发送" : "获取验证码"}
                    </BrandButton>
                  )}
                </div>
              </div>
            )}

            {/* 验证码发送后显示校验按钮 */}
            {smsSent && !smsVerified && (
              <BrandButton type="button" variant="volt" size="md" onClick={handleVerifyCode} disabled={smsCode.length !== 6}>
                <Check className="w-4 h-4" /> 验证
              </BrandButton>
            )}

            {/* 校验通过提示 */}
            {smsVerified && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-volt/10 border border-volt/30">
                <Check className="w-4 h-4 text-volt" />
                <span className="text-sm text-volt">手机号 {phone.slice(0, 3)}****{phone.slice(-4)} 验证通过</span>
              </div>
            )}

            {/* 步骤 2：验证通过后设置密码 */}
            {smsVerified && (
              <>
                <SystemInput
                  label="设置密码"
                  type={showPwd ? "text" : "password"}
                  placeholder="至少 6 位"
                  icon={<Lock className="w-4 h-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  suffix={
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-mute hover:text-white" tabIndex={-1}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/10 overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(passedRules / strengthRules.length) * 100}%` }} />
                      </div>
                      <span className="text-caption-sm text-stone">{strength.label}</span>
                    </div>
                    {strengthRules.map((rule, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-caption-sm ${rule.test(password) ? "text-volt" : "text-mute"}`}>
                        {rule.test(password) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 accent-volt" />
              <span className="text-caption-md text-stone">
                我已阅读并同意
                <Link href="/terms" className="text-volt hover:underline mx-1">服务条款</Link>和
                <Link href="/privacy" className="text-volt hover:underline ml-1">隐私政策</Link>
              </span>
            </label>
            <BrandButton type="submit" variant="volt" size="lg" className="w-full" disabled={loading || !canSubmit()}>
              {loading ? "注册中..." : "手机号注册"}
            </BrandButton>
          </form>
        )}

        {/* ── 微信/QQ 扫码 ── */}
        {(tab === "wechat" || tab === "qq") && (
          <div className="space-y-5">
            <QrCodePlatform platform={tab} refreshKey={refreshKey} scanState={scanState} onRefresh={() => { setRefreshKey((k) => k + 1); setScanState("waiting"); }} />
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 accent-volt" />
              <span className="text-caption-md text-stone">同意服务条款与隐私政策</span>
            </label>
            {scanState === "waiting" && (
              <BrandButton variant="outline-dark" size="md" className="w-full" onClick={() => simulateQrScan(tab)} disabled={loading || !agreeTerms}>
                <ScanLine className="w-4 h-4" /> 模拟扫码成功
              </BrandButton>
            )}
          </div>
        )}
      </AuthPanel>
    </AuthCampaignLayout>
  );
}
