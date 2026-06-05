"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import {
  AuthCampaignLayout,
  AuthPanel,
  AuthErrorBanner,
} from "@/components/system/auth-layout";
import { SystemInput } from "@/components/system/system-input";
import { BrandButton } from "@/components/design-system/brand-button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("请输入邮箱或手机号");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <AuthCampaignLayout
      headline="RESET"
      headlineAccent="ACCESS"
      slogan="找回账号访问权限。安全、快速、品牌化体验。"
    >
      <AuthPanel
        title="忘记密码"
        subtitle={sent ? "重置链接已发送" : "输入注册邮箱或手机号"}
        footer={
          <p className="text-caption-md text-stone text-center">
            想起密码了？
            <Link href="/login" className="text-volt hover:underline ml-1">
              返回登录
            </Link>
          </p>
        }
      >
        {error && <AuthErrorBanner message={error} />}
        {sent ? (
          <div className="system-card p-6 text-center">
            <p className="text-body-md text-white mb-2">请查收重置邮件</p>
            <p className="text-caption-md text-stone">
              演示环境：任意有效格式即可触发成功状态
            </p>
            <BrandButton href="/login" variant="volt" size="md" className="mt-6 w-full">
              返回登录
            </BrandButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <SystemInput
              label="邮箱 / 手机号"
              type="text"
              placeholder="you@email.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <BrandButton type="submit" variant="volt" size="lg" className="w-full">
              发送重置链接
            </BrandButton>
          </form>
        )}
      </AuthPanel>
    </AuthCampaignLayout>
  );
}
