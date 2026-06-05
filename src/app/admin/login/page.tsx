'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { persistAdminLogin, useAdminAuth } from '@/lib/admin/admin-auth-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshSession } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'email',
          login: username.trim(),
          password,
          isAdmin: true,
        }),
      });
      const data = await res.json();

      if (data.success && data.data?.token) {
        persistAdminLogin(data.data.token);
        await refreshSession();
        router.replace('/admin/dashboard');
      } else {
        setError(data.error || '账号或密码错误，请重试');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-black/5 mb-5">
            <Shield className="w-8 h-8 text-[#0071e3]" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
            CareerCraft 管理中心
          </h1>
          <p className="text-sm text-[#86868b] mt-2">
            请输入管理员账号登录
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                管理员账号
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="123456"
                autoComplete="username"
                className="w-full h-12 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#aeaeb2] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入管理员密码"
                  autoComplete="current-password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] placeholder-[#aeaeb2] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#ff3b30] bg-[#ff3b30]/5 px-4 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#0071e3] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#0077ed] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  登录管理中心
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#aeaeb2] mt-6">
            此区域仅限授权管理员访问 · 演示账号 123456 / 123456
          </p>
        </div>
      </motion.div>
    </div>
  );
}
