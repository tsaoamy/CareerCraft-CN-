/**
 * CloudBase Prompt 模板数据存储
 */

import { v4 as uuidv4 } from 'uuid';
import {
  COLLECTIONS,
  getDoc,
  upsertDoc,
  queryDocs,
  deleteDoc,
  deleteDocs,
  paginatedDocs,
} from './client';

interface PromptTemplateDoc {
  _id: string;
  name: string;
  category: string;
  model_type: string;
  current_version: number;
  system_prompt: string;
  user_prompt_template: string;
  variables: unknown;
  temperature: number;
  max_tokens: number;
  is_active: number;
  is_ab_test: number;
  ab_variant: string;
  ab_weight: number;
  call_count: number;
  created_at: string;
  updated_at: string;
}

interface PromptVersionDoc {
  _id: string;
  prompt_id: string;
  version: number;
  system_prompt: string;
  user_prompt_template: string;
  variables: unknown;
  change_log: string;
  created_at: string;
}

interface PromptCallLogDoc {
  _id: string;
  prompt_id: string;
  version: number;
  ab_variant: string;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  status: string;
  error_message: string;
  user_id: string;
  created_at: string;
}

interface PromptTestDoc {
  _id: string;
  prompt_id: string;
  version: number;
  test_input: string;
  test_output: string;
  score: number;
  created_by: string;
  created_at: string;
}

export class CloudPromptStore {
  /** 获取所有 Prompt */
  static async listAll(filters?: {
    category?: string;
    model_type?: string;
    is_active?: number;
  }): Promise<PromptTemplateDoc[]> {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.model_type) where.model_type = filters.model_type;
    if (filters?.is_active !== undefined) where.is_active = filters.is_active;
    return queryDocs<PromptTemplateDoc>(COLLECTIONS.promptTemplates, where, {
      limit: 200,
      orderBy: 'updated_at',
    });
  }

  /** 获取单个 */
  static async getById(id: string): Promise<PromptTemplateDoc | null> {
    return getDoc<PromptTemplateDoc>(COLLECTIONS.promptTemplates, id);
  }

  /** 创建 */
  static async create(data: {
    name: string;
    category?: string;
    model_type?: string;
    system_prompt: string;
    user_prompt_template: string;
    variables?: string[];
    temperature?: number;
    max_tokens?: number;
  }): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.promptTemplates, id, {
      _id: id,
      name: data.name,
      category: data.category || 'resume',
      model_type: data.model_type || 'gpt',
      current_version: 1,
      system_prompt: data.system_prompt,
      user_prompt_template: data.user_prompt_template,
      variables: data.variables || [],
      temperature: data.temperature ?? 0.7,
      max_tokens: data.max_tokens ?? 2048,
      is_active: 1,
      is_ab_test: 0,
      ab_variant: '',
      ab_weight: 50,
      call_count: 0,
      created_at: now,
      updated_at: now,
    });

    // Version record
    const vId = uuidv4();
    await upsertDoc(COLLECTIONS.promptVersions, vId, {
      _id: vId,
      prompt_id: id,
      version: 1,
      system_prompt: data.system_prompt,
      user_prompt_template: data.user_prompt_template,
      variables: data.variables || [],
      change_log: '初始版本',
      created_at: now,
    });

    return id;
  }

  /** 更新 */
  static async update(
    id: string,
    data: {
      name?: string;
      system_prompt?: string;
      user_prompt_template?: string;
      variables?: string[];
      model_type?: string;
      temperature?: number;
      max_tokens?: number;
      change_log?: string;
    }
  ): Promise<boolean> {
    const current = await this.getById(id);
    if (!current) return false;

    const newVersion = (current.current_version || 0) + 1;
    const now = new Date().toISOString();

    const updateData: Record<string, unknown> = {
      current_version: newVersion,
      updated_at: now,
    };
    if (data.name) updateData.name = data.name;
    if (data.system_prompt) updateData.system_prompt = data.system_prompt;
    if (data.user_prompt_template) updateData.user_prompt_template = data.user_prompt_template;
    if (data.variables) updateData.variables = data.variables;
    if (data.model_type) updateData.model_type = data.model_type;
    if (data.temperature !== undefined) updateData.temperature = data.temperature;
    if (data.max_tokens !== undefined) updateData.max_tokens = data.max_tokens;

    await upsertDoc(COLLECTIONS.promptTemplates, id, updateData);

    // Version record
    const vId = uuidv4();
    await upsertDoc(COLLECTIONS.promptVersions, vId, {
      _id: vId,
      prompt_id: id,
      version: newVersion,
      system_prompt: data.system_prompt || current.system_prompt,
      user_prompt_template: data.user_prompt_template || current.user_prompt_template,
      variables: data.variables || current.variables,
      change_log: data.change_log || '版本更新',
      created_at: now,
    });

    return true;
  }

  /** 版本回滚 */
  static async rollback(promptId: string, targetVersion: number): Promise<boolean> {
    const versions = await queryDocs<PromptVersionDoc>(
      COLLECTIONS.promptVersions,
      { prompt_id: promptId, version: targetVersion },
      { limit: 1 }
    );
    const version = versions[0];
    if (!version) return false;

    const variables = Array.isArray(version.variables) ? version.variables : [];
    return this.update(promptId, {
      system_prompt: version.system_prompt,
      user_prompt_template: version.user_prompt_template,
      variables,
      change_log: `回滚到版本 ${targetVersion}`,
    });
  }

  /** 获取版本历史 */
  static async getVersions(promptId: string): Promise<PromptVersionDoc[]> {
    return queryDocs<PromptVersionDoc>(
      COLLECTIONS.promptVersions,
      { prompt_id: promptId },
      { limit: 100, orderBy: 'version', orderDir: 'desc' }
    );
  }

  /** 切换启用状态 */
  static async toggleActive(id: string, isActive: boolean): Promise<boolean> {
    await upsertDoc(COLLECTIONS.promptTemplates, id, {
      is_active: isActive ? 1 : 0,
      updated_at: new Date().toISOString(),
    });
    return true;
  }

  /** 设置 AB 测试 */
  static async setABTest(
    id: string,
    config: { is_ab_test: boolean; ab_variant?: string; ab_weight?: number }
  ): Promise<boolean> {
    await upsertDoc(COLLECTIONS.promptTemplates, id, {
      is_ab_test: config.is_ab_test ? 1 : 0,
      ab_variant: config.ab_variant || '',
      ab_weight: config.ab_weight || 50,
      updated_at: new Date().toISOString(),
    });
    return true;
  }

  /** 记录调用 */
  static async logCall(data: {
    prompt_id: string;
    version?: number;
    ab_variant?: string;
    input_tokens?: number;
    output_tokens?: number;
    latency_ms?: number;
    status?: string;
    error_message?: string;
    user_id?: string;
  }): Promise<void> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.promptCallLogs, id, {
      _id: id,
      prompt_id: data.prompt_id,
      version: data.version || 0,
      ab_variant: data.ab_variant || '',
      input_tokens: data.input_tokens || 0,
      output_tokens: data.output_tokens || 0,
      latency_ms: data.latency_ms || 0,
      status: data.status || 'success',
      error_message: data.error_message || '',
      user_id: data.user_id || '',
      created_at: now,
    });
  }

  /** 获取调用统计 */
  static async getCallStats(
    promptId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Record<string, unknown>[]> {
    const where: Record<string, unknown> = {};
    if (promptId) where.prompt_id = promptId;

    const docs = await queryDocs<PromptCallLogDoc>(
      COLLECTIONS.promptCallLogs,
      where,
      { limit: 2000, orderBy: 'created_at', orderDir: 'desc' }
    );

    // Group by prompt_id
    const groups: Record<string, { total: number; success: number; inTokens: number; outTokens: number; latencies: number[] }> = {};
    for (const d of docs) {
      if (!groups[d.prompt_id]) groups[d.prompt_id] = { total: 0, success: 0, inTokens: 0, outTokens: 0, latencies: [] };
      groups[d.prompt_id].total++;
      if (d.status === 'success') groups[d.prompt_id].success++;
      groups[d.prompt_id].inTokens += d.input_tokens || 0;
      groups[d.prompt_id].outTokens += d.output_tokens || 0;
      if (d.latency_ms) groups[d.prompt_id].latencies.push(d.latency_ms);
    }

    return Object.entries(groups).map(([prompt_id, g]) => ({
      prompt_id,
      total_calls: g.total,
      success_calls: g.success,
      total_input_tokens: g.inTokens,
      total_output_tokens: g.outTokens,
      avg_latency_ms: g.latencies.length > 0 ? g.latencies.reduce((a, b) => a + b, 0) / g.latencies.length : 0,
    }));
  }

  /** 创建测试 */
  static async createTest(data: {
    prompt_id: string;
    version?: number;
    test_input: string;
    test_output: string;
    score?: number;
    created_by?: string;
  }): Promise<string> {
    const id = uuidv4();
    const now = new Date().toISOString();
    await upsertDoc(COLLECTIONS.promptTests, id, {
      _id: id,
      prompt_id: data.prompt_id,
      version: data.version || 0,
      test_input: data.test_input,
      test_output: data.test_output,
      score: data.score || 0,
      created_by: data.created_by || '',
      created_at: now,
    });
    return id;
  }

  /** 获取测试记录 */
  static async getTests(promptId: string): Promise<PromptTestDoc[]> {
    return queryDocs<PromptTestDoc>(
      COLLECTIONS.promptTests,
      { prompt_id: promptId },
      { limit: 50, orderBy: 'created_at', orderDir: 'desc' }
    );
  }

  /** 删除 */
  static async delete(id: string): Promise<boolean> {
    await deleteDocs(COLLECTIONS.promptVersions, { prompt_id: id });
    await deleteDocs(COLLECTIONS.promptTests, { prompt_id: id });
    await deleteDocs(COLLECTIONS.promptCallLogs, { prompt_id: id });
    return deleteDoc(COLLECTIONS.promptTemplates, id);
  }
}
