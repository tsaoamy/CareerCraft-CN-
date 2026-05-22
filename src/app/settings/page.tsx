"use client";

import { User, Shield, Bell, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">个人中心</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary-500" />
              <CardTitle>基本信息</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">用户名</label>
              <Input defaultValue="求职者" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">邮箱</label>
              <Input defaultValue="user@example.com" className="mt-1" />
            </div>
            <Button>保存修改</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-500" />
              <CardTitle>会员计划</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="mb-3">免费版</Badge>
            <p className="text-sm text-slate-500 mb-4">升级到专业版，解锁无限简历生成和更多 AI 功能</p>
            <Button variant="secondary">升级到专业版</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <CardTitle>通知设置</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {["简历生成完成", "JD 分析完成", "面试评分出炉"].map((item) => (
              <label key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
