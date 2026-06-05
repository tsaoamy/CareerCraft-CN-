'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  User, Shield, Bell, Palette, Briefcase,
  Trash2, Camera, Save, Monitor, Sun, Moon, Lightbulb,
  MapPin, Target, Wallet, Sparkles, FileText, Send,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, SystemTextarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notification-context';
import { useUserProfile } from '@/lib/user-profile-context';
import { useMaterials } from '@/lib/material-context';
import { buildProfileHints } from '@/lib/profile-hints';
import { ArrowRight } from 'lucide-react';
import { ContactBindField } from '@/components/settings/contact-bind-field';
import { UserAvatar } from '@/components/ui/user-avatar';
import { processAvatarFile } from '@/lib/avatar-utils';
import { useLocale } from '@/lib/i18n/locale-context';
import { useToast } from '@/components/system/toast';
import { GlassPageHero } from '@/components/ui/glass-page-hero';
import { FeaturePageRoot, FeaturePageShell } from '@/components/layout/feature-page-shell';
import { FilterChip } from '@/components/system/system-card';
import { BrandButton } from '@/components/design-system/brand-button';
import { SystemDialog } from '@/components/system/dialog';
import type { NotificationPreferences } from '@/types/notification';

const THEMES = [
  { id: 'system', name: '跟随系统', icon: Monitor },
  { id: 'light', name: '浅色', icon: Sun },
  { id: 'dark', name: '深色', icon: Moon },
];

const SECTIONS = [
  { id: 'profile', label: '基本信息', icon: User },
  { id: 'career', label: '求职偏好', icon: Briefcase },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'notifications', label: '通知', icon: Bell },
  { id: 'security', label: '安全', icon: Shield },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, isLoaded, saveProfile } = useUserProfile();
  const { materials } = useMaterials();
  const { preferences, updatePreferences } = useNotifications();
  const { theme, setTheme } = useTheme();
  const { locale } = useLocale();
  const { success } = useToast();
  const [section, setSection] = useState<SectionId>('profile');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [form, setForm] = useState({
    displayName: '',
    avatarUrl: '',
    bio: '',
    location: '',
    targetRole: '',
    salaryMin: '',
    salaryMax: '',
  });

  const hints = useMemo(() => buildProfileHints(materials), [materials]);

  useEffect(() => {
    if (!isLoaded) return;
    setForm({
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl || '',
      bio: profile.bio,
      location: profile.location,
      targetRole: profile.targetRole,
      salaryMin: profile.salaryMin,
      salaryMax: profile.salaryMax,
    });
  }, [isLoaded, profile]);

  const displayName = form.displayName || user?.username || '用户';
  const avatarPreview = {
    avatarUrl: form.avatarUrl,
    avatarChar: displayName.charAt(0).toUpperCase(),
    avatarGradient: profile.avatarGradient,
  };

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const name = form.displayName.trim();
    saveProfile({
      displayName: name,
      avatarUrl: form.avatarUrl,
      avatarChar: name.charAt(0).toUpperCase() || '用',
      bio: form.bio.trim(),
      location: form.location.trim(),
      targetRole: form.targetRole.trim(),
      salaryMin: form.salaryMin.trim(),
      salaryMax: form.salaryMax.trim(),
    });
    success('设置已保存');
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError('');
    try {
      const dataUrl = await processAvatarFile(file);
      setForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
      saveProfile({ avatarUrl: dataUrl });
      success('头像已更新');
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : '上传失败');
    }
    e.target.value = '';
  }

  return (
    <FeaturePageRoot>
      <GlassPageHero
        compact
        className="mx-0 rounded-none border-x-0 border-t-0"
        title="偏好设置"
        subtitle="管理账户、求职目标与系统体验"
        badge="Preferences"
      />

      <FeaturePageShell>
        <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14">
          <nav className="hidden lg:flex flex-col gap-1 sticky top-24 self-start">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={`settings-nav-item ${section === id ? 'settings-nav-item-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="lg:hidden flex flex-wrap gap-2 mb-6">
            {SECTIONS.map(({ id, label }) => (
              <FilterChip key={id} active={section === id} onClick={() => setSection(id)}>
                {label}
              </FilterChip>
            ))}
          </div>

          <div className="min-w-0 space-y-8">
            {section === 'profile' && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <label className="relative group cursor-pointer shrink-0">
                        <UserAvatar profile={avatarPreview} displayName={displayName} locale={locale} className="w-20 h-20" textClassName="text-2xl" />
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
                      </label>
                      <div>
                        <CardTitle>个人资料</CardTitle>
                        <p className="text-caption-sm text-stone mt-1">点击头像上传 · 完善资料让 AI 更懂你</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-caption-md text-stone flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> 显示名称
                        </label>
                        <Input value={form.displayName} onChange={(e) => updateField('displayName', e.target.value)} placeholder="你的名称" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-caption-md text-stone flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> 所在地
                        </label>
                        <Input value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="如：深圳" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-caption-md text-stone flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> 登录账号
                        </label>
                        <Input value={user?.username || ''} disabled placeholder="登录账号" />
                      </div>
                    </div>
                    {user && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <ContactBindField type="email" currentValue={user.email} />
                        <ContactBindField type="phone" currentValue={user.phone} />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-caption-md text-stone flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> 个人简介
                      </label>
                      <SystemTextarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} rows={3} placeholder="简要介绍你的背景与优势，让 AI 为你生成更精准的简历和面试方案" />
                    </div>
                    {avatarError && <p className="text-caption-sm text-sale">{avatarError}</p>}
                    <BrandButton variant="volt" size="md" onClick={handleSave}>
                      <Save className="w-4 h-4" /> 保存修改
                    </BrandButton>
                  </CardContent>
                </Card>

                {hints.hasData && (
                  <Card className="border-volt/20">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-volt" />
                        <CardTitle className="text-base">AI 参考建议</CardTitle>
                      </div>
                      <p className="text-caption-sm text-stone mt-1">基于素材库分析，以下建议可一键采用</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {hints.bioSuggestion && (
                        <div className="p-3.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]">
                          <p className="text-[11px] font-semibold text-volt mb-1">参考建议 · 个人简介</p>
                          <p className="text-[12px] text-apple-text-secondary leading-relaxed">{hints.bioSuggestion}</p>
                          <button type="button" onClick={() => updateField('bio', hints.bioSuggestion!)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-volt hover:underline">
                            采用此建议 <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {hints.targetRoleSuggestion && (
                        <div className="p-3.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]">
                          <p className="text-[11px] font-semibold text-volt mb-1">参考建议 · 目标岗位</p>
                          <p className="text-[12px] text-apple-text-secondary leading-relaxed">{hints.targetRoleSuggestion}</p>
                          <button type="button" onClick={() => updateField('targetRole', hints.targetRoleSuggestion!)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-volt hover:underline">
                            采用此建议 <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {hints.locationSuggestion && (
                        <div className="p-3.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--chip-selected-border)]">
                          <p className="text-[11px] font-semibold text-volt mb-1">参考建议 · 所在地</p>
                          <p className="text-[12px] text-apple-text-secondary leading-relaxed">{hints.locationSuggestion}</p>
                          <button type="button" onClick={() => updateField('location', hints.locationSuggestion!)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-volt hover:underline">
                            采用此建议 <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {section === 'career' && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-volt" />
                      <CardTitle>求职目标</CardTitle>
                    </div>
                    <p className="text-caption-sm text-stone mt-1">设定你的职业方向，AI 将据此优化简历与面试</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-caption-md text-stone flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> 目标岗位
                      </label>
                      <Input value={form.targetRole} onChange={(e) => updateField('targetRole', e.target.value)} placeholder="如：前端开发工程师、产品经理" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption-md text-stone flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> 期望城市
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['北京', '上海', '深圳', '杭州', '广州', '成都'].map((city) => (
                          <FilterChip key={city} active={form.location.includes(city)} onClick={() => updateField('location', city)}>
                            {city}
                          </FilterChip>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-caption-md text-stone flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5" /> 期望薪资
                      </label>
                      <div className="flex items-end gap-3">
                        <Input placeholder="最低 K" className="max-w-[120px]" value={form.salaryMin} onChange={(e) => updateField('salaryMin', e.target.value)} />
                        <span className="text-stone pb-3">—</span>
                        <Input placeholder="最高 K" className="max-w-[120px]" value={form.salaryMax} onChange={(e) => updateField('salaryMax', e.target.value)} />
                      </div>
                    </div>

                    <BrandButton variant="volt" size="md" onClick={handleSave}>
                      <Save className="w-4 h-4" /> 保存求职偏好
                    </BrandButton>
                  </CardContent>
                </Card>

                {hints.hasData && hints.topSkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-volt" />
                        <CardTitle className="text-base">技能画像</CardTitle>
                      </div>
                      <p className="text-caption-sm text-stone mt-1">基于素材库识别的核心技能</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {hints.topSkills.map((s) => (
                          <span key={s} className="text-[12px] px-3 py-1.5 rounded-full bg-[var(--accent-soft)] text-volt font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                      {hints.experienceTitles.length > 0 && (
                        <p className="text-[12px] text-apple-text-secondary mt-3">
                          相关经历：{hints.experienceTitles.join('、')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {section === 'appearance' && (
              <Card>
                <CardHeader><CardTitle>外观设置</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setTheme(th.id)}
                        className={`flex flex-col items-center gap-2 p-5 border transition-all duration-300 ${
                          theme === th.id ? 'border-volt bg-volt/5' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <th.icon className="w-6 h-6 text-volt" />
                        <span className="text-caption-md text-white">{th.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {section === 'notifications' && (
              <Card>
                <CardHeader><CardTitle>通知设置</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  {(
                    [
                      { key: 'resumeComplete' as const, label: '简历生成完成', desc: 'AI 简历生成完毕时通知' },
                      { key: 'jdAnalysis' as const, label: 'JD 分析完成', desc: '分析结果就绪时通知' },
                      { key: 'interviewScore' as const, label: '面试评分出炉', desc: '评分报告生成时通知' },
                      { key: 'productUpdates' as const, label: '产品更新', desc: '新功能与版本通知' },
                    ] as { key: keyof NotificationPreferences; label: string; desc: string }[]
                  ).map((item) => (
                    <label key={item.key} className="settings-row cursor-pointer">
                      <div>
                        <span className="text-body-md text-white block">{item.label}</span>
                        <span className="text-caption-sm text-stone">{item.desc}</span>
                      </div>
                      <input type="checkbox" checked={preferences[item.key]} onChange={(e) => updatePreferences({ [item.key]: e.target.checked })} className="apple-toggle" />
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {section === 'security' && (
              <>
                <Card>
                  <CardHeader><CardTitle>安全设置</CardTitle></CardHeader>
                  <CardContent className="space-y-0">
                    <div className="settings-row">
                      <div>
                        <p className="text-body-md text-white">修改密码</p>
                        <p className="text-caption-sm text-stone">建议每 90 天更换</p>
                      </div>
                      <BrandButton href="/forgot-password" variant="outline-dark" size="sm">修改</BrandButton>
                    </div>
                    <div className="settings-row">
                      <div>
                        <p className="text-body-md text-white">会员计划</p>
                        <p className="text-caption-sm text-stone">当前：免费版</p>
                      </div>
                      <Badge variant="default">Free</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-sale/20">
                  <CardHeader>
                    <CardTitle className="text-sale">账号管理</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="settings-row border-none pt-0">
                      <p className="text-caption-md text-stone max-w-md">删除账号及所有数据，不可撤销。</p>
                      <BrandButton variant="primary" size="sm" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="w-3.5 h-3.5" /> 删除
                      </BrandButton>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </FeaturePageShell>

      <SystemDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="确认删除账号？"
        description="此操作将永久删除你的素材库、简历与面试记录，无法恢复。"
        variant="destructive"
        confirmLabel="确认删除"
        onConfirm={() => success('演示环境：账号删除已模拟')}
      />
    </FeaturePageRoot>
  );
}
