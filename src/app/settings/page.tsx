"use client";

import { User, Shield, Bell, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10 md:py-14 animate-fade-in-up">
      <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-apple-text dark:text-white mb-10">
        个人中心
      </h1>

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
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">
                用户名
              </label>
              <Input defaultValue={user?.username || "求职者"} />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-apple-text dark:text-white">
                邮箱
              </label>
              <Input defaultValue={user?.email || "user@example.com"} />
            </div>
            <Button variant="secondary">保存修改</Button>
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
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="default" className="text-[12px]">免费版</Badge>
              <span className="text-[13px] text-apple-text-secondary">
                3/10 简历生成次数
              </span>
            </div>
            <div className="h-1.5 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-full mb-4 overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-apple-blue to-apple-purple rounded-full" />
            </div>
            <p className="text-[13px] text-apple-text-secondary mb-4">
              升级到专业版，解锁无限简历生成和更多 AI 功能
            </p>
            <Button variant="secondary" className="bg-gradient-to-r from-apple-purple/10 to-apple-purple/5">
              升级到专业版
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
                { label: "简历生成完成", checked: true },
                { label: "JD 分析完成", checked: true },
                { label: "面试评分出炉", checked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between cursor-pointer">
                  <span className="text-[14px] text-apple-text dark:text-white">{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="apple-toggle"
                  />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Shield className="w-[18px] h-[18px] text-apple-red" />
              <CardTitle>账号管理</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] text-apple-text-secondary mb-4">
              删除账号及其所有数据，此操作不可撤销。
            </p>
            <Button variant="destructive" size="sm">
              删除账号
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
