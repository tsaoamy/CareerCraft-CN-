'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, ChevronDown, MapPin, Clock, Activity } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { AdminSkeleton } from '@/components/admin/skeleton';
import { adminDataService } from '@/lib/admin/data-service';
import type { UserRecord } from '@/types/admin';

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    adminDataService.getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <AdminSkeleton type="table" />;

  const columns = [
    { key: 'name' as const, label: '用户', sortable: true },
    { key: 'email' as const, label: '邮箱' },
    { key: 'status' as const, label: '状态' },
    { key: 'resumes' as const, label: '简历数' },
    { key: 'lastActive' as const, label: '最近活跃' },
    { key: 'joinedAt' as const, label: '注册时间' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
            用户管理
          </h1>
          <p className="text-sm text-[#86868b] mt-1">
            共 {users.length} 位注册用户
          </p>
        </div>
        <button className="h-10 px-5 rounded-full bg-[#0071e3] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#0077ed] active:scale-[0.98] transition-all duration-200">
          <Download className="w-4 h-4" />
          导出 CSV
        </button>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '活跃用户', value: users.filter(u => u.status === 'active').length, icon: Activity, color: '#34c759' },
          { label: '非活跃用户', value: users.filter(u => u.status === 'inactive').length, icon: Clock, color: '#ff9500' },
          { label: '今日在线', value: Math.floor(users.length * 0.3), icon: MapPin, color: '#0071e3' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#1d1d1f]">{item.value}</p>
              <p className="text-xs text-[#86868b]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#d2d2d7] bg-white text-sm text-[#1d1d1f] placeholder-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="appearance-none h-10 pl-4 pr-10 rounded-xl border border-[#d2d2d7] bg-white text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all cursor-pointer"
          >
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">非活跃</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2] pointer-events-none" />
        </div>
      </div>

      {/* 用户表格 */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredUsers.map(u => ({
            ...u,
            name: (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#5856d6] flex items-center justify-center text-white text-xs font-medium">
                  {u.name[0]}
                </div>
                <span className="font-medium text-[#1d1d1f]">{u.name}</span>
              </div>
            ),
            status: (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                u.status === 'active' ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff9500]/10 text-[#ff9500]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-[#34c759]' : 'bg-[#ff9500]'}`} />
                {u.status === 'active' ? '活跃' : '非活跃'}
              </span>
            ),
          }))}
        />
      </div>
    </motion.div>
  );
}
