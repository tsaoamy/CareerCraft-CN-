'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

type BindType = 'phone' | 'email';

interface ContactBindFieldProps {
  type: BindType;
  currentValue?: string | null;
}

export function ContactBindField({ type, currentValue }: ContactBindFieldProps) {
  const { sendBindCode, bindPhone, bindEmail } = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const label = type === 'phone' ? '手机号' : '邮箱';
  const placeholder = type === 'phone' ? '输入新手机号' : '输入新邮箱地址';
  const purpose = type === 'phone' ? 'bind_phone' as const : 'bind_email' as const;

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function resetPanel() {
    setValue('');
    setCode('');
    setCodeSent(false);
    setCountdown(0);
    setError('');
    setSuccess('');
  }

  function handleOpen() {
    resetPanel();
    setOpen(true);
  }

  function handleCancel() {
    setOpen(false);
    resetPanel();
  }

  async function handleSendCode() {
    setError('');
    setSuccess('');
    const target = type === 'email' ? value.trim().toLowerCase() : value.trim();
    if (!target) {
      setError(`请输入${label}`);
      return;
    }
    setSending(true);
    const result = await sendBindCode(type, target, purpose);
    setSending(false);
    if (result.success) {
      setCodeSent(true);
      setCountdown(60);
      setSuccess('验证码已发送（演示环境：123456）');
    } else {
      setError(result.error || '发送失败');
      if (result.retryAfter) setCountdown(result.retryAfter);
    }
  }

  async function handleConfirm() {
    setError('');
    setSuccess('');
    const target = type === 'email' ? value.trim().toLowerCase() : value.trim();
    if (!target) {
      setError(`请输入${label}`);
      return;
    }
    if (!code.trim()) {
      setError('请输入验证码');
      return;
    }
    if (!codeSent) {
      setError('请先获取验证码');
      return;
    }

    setLoading(true);
    const result = type === 'phone'
      ? await bindPhone(target, code.trim())
      : await bindEmail(target, code.trim());
    setLoading(false);

    if (result.success) {
      setSuccess(type === 'phone' ? '手机号换绑成功' : '邮箱换绑成功');
      setOpen(false);
      resetPanel();
    } else {
      setError(result.error || '换绑失败');
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-apple-text dark:text-white">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          value={currentValue || ''}
          disabled
          placeholder={type === 'phone' ? '未绑定手机号' : '未绑定邮箱'}
          type={type === 'email' ? 'email' : 'tel'}
          className="flex-1"
        />
        {!open && (
          <Button type="button" variant="outline" size="sm" onClick={handleOpen} className="shrink-0">
            {currentValue ? '换绑' : '绑定'}
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-2 p-4 rounded-xl border border-[#d2d2d7]/60 dark:border-[#48484a] bg-[#f5f5f7]/60 dark:bg-[#1c1c1e] space-y-3">
          <div className="flex items-center gap-2 text-[12px] text-apple-text-secondary">
            <ShieldCheck className="w-3.5 h-3.5 text-apple-blue" />
            验证后即可{currentValue ? '更换' : '绑定'}{label}
          </div>

          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            type={type === 'email' ? 'email' : 'tel'}
          />

          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="输入验证码"
              maxLength={6}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={sending || countdown > 0}
              className="shrink-0 min-w-[100px]"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : countdown > 0 ? (
                `${countdown}s`
              ) : (
                '获取验证码'
              )}
            </Button>
          </div>

          {error && <p className="text-[12px] text-apple-red">{error}</p>}
          {success && <p className="text-[12px] text-apple-green">{success}</p>}

          <div className="flex gap-2 pt-1">
            <Button type="button" onClick={handleConfirm} disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              确认换绑
            </Button>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              取消
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
