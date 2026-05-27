"use client";

import { useState } from "react";
import { User, Shield, Bell, CreditCard, Settings, Palette, Briefcase, Trash2, LogOut, Camera, Check, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const THEMES = [
  { id: "system", name: "跟随系统", icon: "🖥️" },
  { id: "light", name: "浅色模式", icon: "☀️" },
  { id: "dark", name: "深色模式", icon: "🌙" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [activeTheme, setActiveTheme] = useState("system");
  const [username, setUsername] = useState(user?.username || "求职者");
  const [email, setEmail] = useState(user?.email || "user@example.com");
  const [bio, setBio] = useState("3年互联网产品经验，专注于AI产品方向");
  const [phone, setPhone] = useState("138-0000-0000");
  const [location, setLocation] = useState("北京市");
  const [targetRole, setTargetRole] = useState("高级产品经理");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[720px] mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      {/* Header with Avatar — Starry Sky */}
      <div className="relative overflow-hidden rounded-3xl nebula-hero border border-white/10 p-6 md:p-8 mb-10">
        <div className="shooting-star" /><div className="shooting-star" />
        <div className="constellation-dot" style={{top:'10%',left:'8%'}} />
        <div className="constellation-dot" style={{top:'20%',left:'25%'}} />
        <div className="constellation-dot" style={{top:'12%',left:'50%'}} />
        <div className="constellation-dot" style={{top:'18%',left:'75%'}} />
        <div className="constellation-dot" style={{top:'30%',left:'88%'}} />
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[28px] font-bold shadow-lg shadow-purple-500/30">
              {(username || "求")[0]}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[12px] text-purple-200">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              星河账户 · PRO
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-white">
              个人中心
            </h1>
            <p className="text-[15px] text-blue-100/70 mt-1">
              管理你的账号信息和偏好设置
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "素材库", value: "5段", color: "text-apple-blue", bg: "bg-[#e8f4fd] dark:bg-[#003366]" },
          { label: "简历版本", value: "4个", color: "text-apple-purple", bg: "bg-[#f4f1fa] dark:bg-[#2d1445]" },
          { label: "面试练习", value: "3次", color: "text-apple-green", bg: "bg-[#e8f8ee] dark:bg-[#0a3622]" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
            <div className={`text-[22px] font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-[11px] ${stat.color}/70 mt-0.5`}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <User className="w-[18px] h-[18px] text-apple-blue" />
              <CardTitle>基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">用户名</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">邮箱</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">手机号</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-apple-text dark:text-white">所在地</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">个人简介</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[80px] p-3.5 rounded-xl border border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[14px] text-apple-text dark:text-white resize-y focus:outline-none focus:ring-2 focus:ring-apple-blue/40 focus:border-apple-blue"
                rows={3}
              />
            </div>
            <Button onClick={handleSave} className="gap-2">
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "已保存" : "保存修改"}
            </Button>
          </CardContent>
        </Card>

        {/* Career Goal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-[18px] h-[18px] text-apple-purple" />
              <CardTitle>求职偏好</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">目标岗位</label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="如：高级产品经理" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">期望城市</label>
              <div className="flex flex-wrap gap-2">
                {["北京", "上海", "深圳", "杭州", "广州", "成都"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setLocation(city)}
                    className={`text-[13px] px-3.5 py-1.5 rounded-full transition-all ${
                      location.includes(city)
                        ? "bg-apple-blue text-white"
                        : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-apple-text-secondary hover:bg-[#e8e8ed] dark:hover:bg-[#3a3a3c]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">期望薪资范围</label>
              <div className="flex items-center gap-3">
                <Input placeholder="最低 (K)" className="max-w-[120px]" />
                <span className="text-apple-text-secondary">-</span>
                <Input placeholder="最高 (K)" className="max-w-[120px]" />
                <span className="text-[13px] text-apple-text-secondary">K/月</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Palette className="w-[18px] h-[18px] text-apple-orange" />
              <CardTitle>外观设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    activeTheme === theme.id
                      ? "border-apple-blue bg-[#e8f4fd] dark:bg-[#003366]"
                      : "border-[#d2d2d7] dark:border-[#38383a] hover:border-apple-blue/30"
                  }`}
                >
                  <span className="text-[24px]">{theme.icon}</span>
                  <span className="text-[13px] font-medium text-apple-text dark:text-white">{theme.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-[18px] h-[18px] text-apple-purple" />
              <CardTitle>会员计划</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-[12px]">免费版</Badge>
                <span className="text-[13px] text-apple-text-secondary">
                  3/10 简历生成次数
                </span>
              </div>
            </div>
            <div className="h-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full mb-4 overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-apple-blue to-apple-purple rounded-full" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {["无限简历生成", "高级JD分析", "AI面试深度反馈", "简历模板库"].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-[13px] text-apple-text-secondary">
                  <Check className="w-3.5 h-3.5 text-apple-green" />
                  {feat}
                </div>
              ))}
            </div>
            <Button variant="secondary" className="bg-gradient-to-r from-apple-purple/10 to-apple-purple/5">
              升级到专业版 · ¥29.9/月
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Bell className="w-[18px] h-[18px] text-apple-orange" />
              <CardTitle>通知设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "简历生成完成", desc: "当AI简历生成完毕时通知", checked: true },
                { label: "JD 分析完成", desc: "当JD分析结果就绪时通知", checked: true },
                { label: "面试评分出炉", desc: "当面试评分报告生成时通知", checked: false },
                { label: "产品更新", desc: "接收新功能和版本更新通知", checked: true },
                { label: "行业资讯", desc: "接收AI职业发展相关的行业动态", checked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-start justify-between cursor-pointer gap-4">
                  <div>
                    <span className="text-[14px] text-apple-text dark:text-white block">{item.label}</span>
                    <span className="text-[12px] text-apple-text-secondary">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="apple-toggle mt-1"
                  />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Settings className="w-[18px] h-[18px] text-apple-text-secondary" />
              <CardTitle>安全设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-apple-text dark:text-white">修改密码</p>
                <p className="text-[12px] text-apple-text-secondary">建议每 90 天更换一次密码</p>
              </div>
              <Button variant="outline" size="sm">修改</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-apple-text dark:text-white">两步验证</p>
                <p className="text-[12px] text-apple-text-secondary">增加账号安全性</p>
              </div>
              <Button variant="outline" size="sm">开启</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-apple-text dark:text-white">登录设备</p>
                <p className="text-[12px] text-apple-text-secondary">当前：Windows · Chrome · 北京</p>
              </div>
              <Button variant="outline" size="sm">管理</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-900/30">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Shield className="w-[18px] h-[18px] text-apple-red" />
              <CardTitle className="text-apple-red">账号管理</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-medium text-apple-text dark:text-white">删除账号</p>
                <p className="text-[13px] text-apple-text-secondary mt-1">
                  删除账号及其所有数据（素材库、简历、面试记录等），此操作不可撤销。
                </p>
              </div>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                删除账号
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
