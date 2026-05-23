'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, FileText, Sparkles, Clock, Eye } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { AdminSkeleton } from '@/components/admin/skeleton';
import { adminDataService } from '@/lib/admin/data-service';
import type { ResumeRecord } from '@/types/admin';

export default function ResumesPage() {
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminDataService.getResumes().then(data => {
      setResumes(data);
      setLoading(false);
    });
  }, []);

  const filtered = resumes.filter(r =>
    r.userName.includes(search) || r.fileName.includes(search)
  );

  if (loading) return <AdminSkeleton type="table" />;

  const columns = [
    { key: 'fileName' as const, label: '文件名', sortable: true },
    { key: 'userName' as const, label: '用户' },
    { key: 'type' as const, label: '类型' },
    { key: 'score' as const, label: 'ATS评分' },
    { key: 'generatedAt' as const, label: '生成时间' },
    { key: 'actions' as const, label: '操作' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
            简历管理
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            共 {resumes.length} 份简历记录
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-5 rounded-full border border-[#d2d2d7] bg-white text-sm text-[#1d1d1f] font-medium flex items-center gap-2 hover:bg-[#f5f5f7] active:scale-[0.98] transition-all duration-200">
            <Download className="w-4 h-4" />
            导出 CSV
          </button>
          <button className="h-10 px-5 rounded-full bg-[#0071e3] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#0077ed] active:scale-[0.98] transition-all duration-200">
            数据备份
          </button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '原始简历', value: resumes.filter(r => r.type === 'original').length, icon: FileText, color: '#0071e3' },
          { label: 'AI优化后', value: resumes.filter(r => r.type === 'optimized').length, icon: Sparkles, color: '#5856d6' },
          { label: '平均ATS评分', value: Math.round(resumes.reduce((s, r) => s + r.score, 0) / resumes.length), suffix: '分', icon: Eye, color: '#34c759' },
          { label: '今日生成', value: resumes.filter(r => new Date(r.generatedAt).toDateString() === new Date().toDateString()).length, icon: Clock, color: '#ff9500' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d1d1f]">{item.value}{item.suffix || ''}</p>
              <p className="text-xs text-[#86868b]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索 */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
        <input
          type="text"
          placeholder="搜索文件名或用户..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#d2d2d7] bg-white text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
        />
      </div>

      {/* 简历表格 */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered.map(r => ({
            ...r,
            fileName: (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#0071e3]" />
                </div>
                <span className="font-medium text-[#1d1d1f]">{r.fileName}</span>
              </div>
            ),
            type: (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                r.type === 'original' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#5856d6]/10 text-[#5856d6]'
              }`}>
                {r.type === 'original' ? '原始' : '优化版'}
              </span>
            ),
            score: (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-[#e8e8ed] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${r.score}%`,
                      backgroundColor: r.score >= 80 ? '#34c759' : r.score >= 60 ? '#ff9500' : '#ff3b30',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-[#1d1d1f]">{r.score}分</span>
              </div>
            ),
            actions: (
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#86868b] hover:text-[#0071e3] hover:bg-[#0071e3]/5 transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ),
          }))}
        />
      </div>
    </motion.div>
  );
}
