'use client';

/**
 * Prompt 管理中心 (Phase 3)
 * 管理 AI Prompt 模板：创建、编辑、版本管理、AB 测试、调用统计
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, History, Play, BarChart3, 
  Layers, ToggleLeft, ToggleRight, Beaker, X,
  ChevronDown, Search, RefreshCw
} from 'lucide-react';
import { AUTH_TOKEN_KEY } from '@/lib/auth/constants';

interface Prompt {
  id: string;
  name: string;
  category: string;
  model_type: string;
  current_version: number;
  system_prompt: string;
  user_prompt_template: string;
  variables: string;
  is_active: number;
  is_ab_test: number;
  ab_variant: string;
  ab_weight: number;
  temperature: number;
  max_tokens: number;
  call_count: number;
  avg_score: number;
  created_at: string;
  updated_at: string;
}

interface PromptVersion {
  id: string;
  prompt_id: string;
  version: number;
  system_prompt: string;
  user_prompt_template: string;
  variables: string;
  change_log: string;
  created_at: string;
}

const CATEGORIES = [
  { value: '', label: '全部' },
  { value: 'resume', label: '简历优化' },
  { value: 'interview', label: '面试' },
  { value: 'analysis', label: '分析' },
  { value: 'matching', label: '匹配' },
  { value: 'jd_parser', label: 'JD解析' },
  { value: 'talent_profile', label: '人才画像' },
  { value: 'other', label: '其他' },
];

const MODELS = [
  { value: '', label: '全部' },
  { value: 'gpt', label: 'GPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'hunyuan', label: '混元' },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showVersions, setShowVersions] = useState<string | null>(null);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [message, setMessage] = useState('');

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const params = new URLSearchParams();
      if (categoryFilter) params.set('category', categoryFilter);
      if (modelFilter) params.set('model_type', modelFilter);

      const res = await fetch(`/api/admin/prompts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPrompts(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, modelFilter]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleSave = async (formData: Record<string, unknown>) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const isEdit = !!editingPrompt;

    const url = isEdit ? '/api/admin/prompts' : '/api/admin/prompts';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isEdit ? { id: editingPrompt.id, ...formData } : formData),
    });

    const data = await res.json();
    if (data.success) {
      setShowEditor(false);
      setEditingPrompt(null);
      setMessage(isEdit ? 'Prompt 更新成功' : 'Prompt 创建成功');
      fetchPrompts();
      setTimeout(() => setMessage(''), 3000);
    } else {
      alert(data.error || '操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此 Prompt？该操作不可撤销。')) return;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch(`/api/admin/prompts?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) fetchPrompts();
    else alert(data.error);
  };

  const handleToggleActive = async (prompt: Prompt) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch('/api/admin/prompts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: prompt.id, is_active: prompt.is_active ? undefined : undefined }),
    });
  };

  const handleViewVersions = async (promptId: string) => {
    setShowVersions(promptId);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch(`/api/admin/prompts/${promptId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setVersions(data.data);
  };

  const handleRollback = async (promptId: string, version: number) => {
    if (!confirm(`确定回滚到版本 ${version}？`)) return;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const res = await fetch(`/api/admin/prompts/${promptId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ version }),
    });
    const data = await res.json();
    if (data.success) {
      setShowVersions(null);
      fetchPrompts();
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Prompt 管理中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            管理 AI Prompt 模板，支持版本回滚和 AB 测试
          </p>
        </div>
        <button
          onClick={() => { setEditingPrompt(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#5856d6] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          新建 Prompt
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm">
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#2c2c2e] text-sm border border-gray-200 dark:border-gray-700"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#2c2c2e] text-sm border border-gray-200 dark:border-gray-700"
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <button
          onClick={fetchPrompts}
          className="px-4 py-2 rounded-xl bg-white dark:bg-[#2c2c2e] text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#3a3a3c]"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Prompt List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : (
        <div className="grid gap-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-5 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-white">
                      {prompt.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      prompt.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {prompt.is_active ? '启用' : '禁用'}
                    </span>
                    {prompt.is_ab_test ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        AB测试
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      v{prompt.current_version}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                      {MODELS.find(m => m.value === prompt.model_type)?.label || prompt.model_type}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                      {CATEGORIES.find(c => c.value === prompt.category)?.label || prompt.category}
                    </span>
                    <span>调用 {prompt.call_count} 次</span>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-mono bg-gray-50 dark:bg-[#1c1c1e] rounded-lg p-2 max-h-20 overflow-y-auto">
                    <span className="text-gray-500">System:</span> {prompt.system_prompt?.substring(0, 120)}...
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => { setEditingPrompt(prompt); setShowEditor(true); }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleViewVersions(prompt.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="版本历史"
                  >
                    <History className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => {
                      handleToggleActive(prompt);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={prompt.is_active ? '禁用' : '启用'}
                  >
                    {prompt.is_active ? (
                      <ToggleRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(prompt.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {prompts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>暂无 Prompt 模板</p>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <PromptEditor
          prompt={editingPrompt}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditingPrompt(null); }}
        />
      )}

      {/* Version History Drawer */}
      {showVersions && (
        <VersionDrawer
          versions={versions}
          onRollback={(version) => handleRollback(showVersions, version)}
          onClose={() => setShowVersions(null)}
        />
      )}
    </div>
  );
}

// ============================================
// Prompt Editor Component
// ============================================
function PromptEditor({
  prompt,
  onSave,
  onClose,
}: {
  prompt: Prompt | null;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: prompt?.name || '',
    category: prompt?.category || 'resume',
    model_type: prompt?.model_type || 'gpt',
    system_prompt: prompt?.system_prompt || '',
    user_prompt_template: prompt?.user_prompt_template || '',
    variables: prompt?.variables ? (JSON.parse(prompt.variables) as string[]).join(', ') : '',
    temperature: prompt?.temperature ?? 0.7,
    max_tokens: prompt?.max_tokens ?? 2048,
    change_log: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      variables: form.variables.split(',').map((v: string) => v.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-inherit rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
            {prompt ? '编辑 Prompt' : '新建 Prompt'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">名称 *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
                placeholder="简历优化模板 v2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">模型</label>
              <select
                value={form.model_type}
                onChange={(e) => setForm({ ...form, model_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
              >
                {MODELS.filter(m => m.value).map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
              >
                {CATEGORIES.filter(c => c.value).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Tokens</label>
              <input
                type="number"
                value={form.max_tokens}
                onChange={(e) => setForm({ ...form, max_tokens: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              变量（逗号分隔）
            </label>
            <input
              value={form.variables}
              onChange={(e) => setForm({ ...form, variables: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
              placeholder="resume_content, target_position, industry"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              System Prompt *
            </label>
            <textarea
              value={form.system_prompt}
              onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm font-mono"
              placeholder="你是一位专业的简历优化顾问..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User Prompt Template *
            </label>
            <textarea
              value={form.user_prompt_template}
              onChange={(e) => setForm({ ...form, user_prompt_template: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm font-mono"
              placeholder="请优化以下简历：\n{resume_content}\n\n目标岗位：{target_position}"
            />
          </div>

          {prompt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                变更说明
              </label>
              <input
                value={form.change_log}
                onChange={(e) => setForm({ ...form, change_log: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1c1c1e] text-sm"
                placeholder="修改了什么内容..."
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-sm"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#5856d6] text-white text-sm font-medium hover:opacity-90"
            >
              {prompt ? '保存变更' : '创建 Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Version History Drawer
// ============================================
function VersionDrawer({
  versions,
  onRollback,
  onClose,
}: {
  versions: PromptVersion[];
  onRollback: (version: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white dark:bg-[#2c2c2e] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-inherit rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">版本历史</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {versions.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-[#1c1c1e] border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#1d1d1f] dark:text-white">版本 {v.version}</span>
                <span className="text-xs text-gray-400">{v.created_at}</span>
              </div>
              {v.change_log && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{v.change_log}</p>
              )}
              <button
                onClick={() => onRollback(v.version)}
                className="flex items-center gap-1 text-xs text-[#5856d6] hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                回滚到此版本
              </button>
            </div>
          ))}
          {versions.length === 0 && (
            <p className="text-center text-gray-400 py-8">暂无版本历史</p>
          )}
        </div>
      </div>
    </div>
  );
}
