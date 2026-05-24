/**
 * Prompt 模板数据仓库 (Phase 3)
 */

import { getDb, queryAll, queryOne, execute } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class PromptRepository {
  /**
   * 获取所有 Prompt 模板
   */
  static async listAll(filters?: {
    category?: string;
    model_type?: string;
    is_active?: number;
  }): Promise<Record<string, unknown>[]> {
    await getDb();

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.category) {
      where += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters?.model_type) {
      where += ' AND model_type = ?';
      params.push(filters.model_type);
    }
    if (filters?.is_active !== undefined) {
      where += ' AND is_active = ?';
      params.push(filters.is_active);
    }

    return queryAll(
      `SELECT * FROM prompt_templates ${where} ORDER BY updated_at DESC`,
      params
    );
  }

  /**
   * 获取单个 Prompt
   */
  static async getById(id: string): Promise<Record<string, unknown> | null> {
    await getDb();
    return queryOne('SELECT * FROM prompt_templates WHERE id = ?', [id]);
  }

  /**
   * 创建 Prompt 模板
   */
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
    await getDb();

    const id = uuidv4();
    const variables = JSON.stringify(data.variables || []);

    execute(
      `INSERT INTO prompt_templates (id, name, category, model_type, current_version, system_prompt, user_prompt_template, variables, temperature, max_tokens)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.category || 'resume',
        data.model_type || 'gpt',
        data.system_prompt,
        data.user_prompt_template,
        variables,
        data.temperature ?? 0.7,
        data.max_tokens ?? 2048,
      ]
    );

    // 创建初始版本记录
    execute(
      `INSERT INTO prompt_versions (id, prompt_id, version, system_prompt, user_prompt_template, variables, change_log)
       VALUES (?, ?, 1, ?, ?, ?, '初始版本')`,
      [uuidv4(), id, data.system_prompt, data.user_prompt_template, variables]
    );

    return id;
  }

  /**
   * 更新 Prompt（自动创建新版本）
   */
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
    await getDb();

    const current = await this.getById(id);
    if (!current) return false;

    // 获取下一版本号
    const newVersion = ((current.current_version as number) || 0) + 1;

    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.name) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.system_prompt) {
      updates.push('system_prompt = ?');
      params.push(data.system_prompt);
    }
    if (data.user_prompt_template) {
      updates.push('user_prompt_template = ?');
      params.push(data.user_prompt_template);
    }
    if (data.variables) {
      updates.push('variables = ?');
      params.push(JSON.stringify(data.variables));
    }
    if (data.model_type) {
      updates.push('model_type = ?');
      params.push(data.model_type);
    }
    if (data.temperature !== undefined) {
      updates.push('temperature = ?');
      params.push(data.temperature);
    }
    if (data.max_tokens !== undefined) {
      updates.push('max_tokens = ?');
      params.push(data.max_tokens);
    }

    if (updates.length > 0) {
      updates.push('current_version = ?');
      params.push(newVersion);

      updates.push("updated_at = datetime('now')");
      params.push(id);

      execute(
        `UPDATE prompt_templates SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // 创建版本记录
    execute(
      `INSERT INTO prompt_versions (id, prompt_id, version, system_prompt, user_prompt_template, variables, change_log)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        id,
        newVersion,
        data.system_prompt || current.system_prompt,
        data.user_prompt_template || current.user_prompt_template,
        data.variables ? JSON.stringify(data.variables) : current.variables,
        data.change_log || '版本更新',
      ]
    );

    return true;
  }

  /**
   * 版本回滚
   */
  static async rollback(promptId: string, targetVersion: number): Promise<boolean> {
    await getDb();

    const version = queryOne(
      'SELECT * FROM prompt_versions WHERE prompt_id = ? AND version = ?',
      [promptId, targetVersion]
    );
    if (!version) return false;

    return this.update(promptId, {
      system_prompt: version.system_prompt as string,
      user_prompt_template: version.user_prompt_template as string,
      variables: JSON.parse((version.variables as string) || '[]'),
      change_log: `回滚到版本 ${targetVersion}`,
    });
  }

  /**
   * 获取版本历史
   */
  static async getVersions(promptId: string): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      'SELECT * FROM prompt_versions WHERE prompt_id = ? ORDER BY version DESC',
      [promptId]
    );
  }

  /**
   * 切换 Prompt 启用状态
   */
  static async toggleActive(id: string, isActive: boolean): Promise<boolean> {
    await getDb();
    const result = execute(
      "UPDATE prompt_templates SET is_active = ?, updated_at = datetime('now') WHERE id = ?",
      [isActive ? 1 : 0, id]
    );
    return result.changes > 0;
  }

  /**
   * 设置 AB 测试
   */
  static async setABTest(
    id: string,
    config: { is_ab_test: boolean; ab_variant?: string; ab_weight?: number }
  ): Promise<boolean> {
    await getDb();
    const result = execute(
      `UPDATE prompt_templates SET is_ab_test = ?, ab_variant = ?, ab_weight = ?, updated_at = datetime('now') WHERE id = ?`,
      [config.is_ab_test ? 1 : 0, config.ab_variant || '', config.ab_weight || 50, id]
    );
    return result.changes > 0;
  }

  /**
   * 记录 Prompt 调用
   */
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
    await getDb();

    execute(
      `INSERT INTO prompt_call_logs (id, prompt_id, version, ab_variant, input_tokens, output_tokens, latency_ms, status, error_message, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        data.prompt_id,
        data.version || 0,
        data.ab_variant || '',
        data.input_tokens || 0,
        data.output_tokens || 0,
        data.latency_ms || 0,
        data.status || 'success',
        data.error_message || '',
        data.user_id || '',
      ]
    );

    // 更新调用计数
    execute(
      'UPDATE prompt_templates SET call_count = call_count + 1 WHERE id = ?',
      [data.prompt_id]
    );
  }

  /**
   * 获取 Prompt 调用统计
   */
  static async getCallStats(
    promptId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Record<string, unknown>[]> {
    await getDb();

    let where = 'WHERE 1=1';
    const params: unknown[] = [];

    if (promptId) {
      where += ' AND prompt_id = ?';
      params.push(promptId);
    }
    if (startDate) {
      where += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND created_at <= ?';
      params.push(endDate);
    }

    return queryAll(
      `SELECT
         prompt_id,
         COUNT(*) as total_calls,
         SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_calls,
         SUM(input_tokens) as total_input_tokens,
         SUM(output_tokens) as total_output_tokens,
         AVG(latency_ms) as avg_latency_ms
       FROM prompt_call_logs ${where}
       GROUP BY prompt_id`,
      params
    );
  }

  /**
   * 创建 Prompt 测试记录
   */
  static async createTest(data: {
    prompt_id: string;
    version?: number;
    test_input: string;
    test_output: string;
    score?: number;
    created_by?: string;
  }): Promise<string> {
    await getDb();

    const id = uuidv4();
    execute(
      `INSERT INTO prompt_tests (id, prompt_id, version, test_input, test_output, score, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.prompt_id,
        data.version || 0,
        data.test_input,
        data.test_output,
        data.score || 0,
        data.created_by || '',
      ]
    );

    return id;
  }

  /**
   * 获取 Prompt 测试记录
   */
  static async getTests(promptId: string): Promise<Record<string, unknown>[]> {
    await getDb();
    return queryAll(
      'SELECT * FROM prompt_tests WHERE prompt_id = ? ORDER BY created_at DESC LIMIT 50',
      [promptId]
    );
  }

  /**
   * 删除 Prompt
   */
  static async delete(id: string): Promise<boolean> {
    await getDb();
    execute('DELETE FROM prompt_versions WHERE prompt_id = ?', [id]);
    execute('DELETE FROM prompt_tests WHERE prompt_id = ?', [id]);
    execute('DELETE FROM prompt_call_logs WHERE prompt_id = ?', [id]);
    const result = execute('DELETE FROM prompt_templates WHERE id = ?', [id]);
    return result.changes > 0;
  }
}
