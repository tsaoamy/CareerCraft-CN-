/**
 * CareerCraft 数据库 Schema
 * 覆盖所有 7 阶段的完整数据模型
 */

export const DB_SCHEMA = `
-- =====================================================
-- Phase 1: 核心用户 & 权限系统 (RBAC)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'super_admin')),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'banned')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT DEFAULT '',
  details TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- =====================================================
-- Phase 1: 简历数据
-- =====================================================

CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT DEFAULT 'pdf',
  original_content TEXT DEFAULT '',
  optimized_content TEXT DEFAULT '',
  score INTEGER DEFAULT 0,
  type TEXT DEFAULT 'original' CHECK(type IN ('original', 'optimized')),
  tags TEXT DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- Phase 2: 用户行为埋点系统
-- =====================================================

CREATE TABLE IF NOT EXISTS user_events (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  event_type TEXT NOT NULL,
  event_category TEXT DEFAULT 'general',
  event_data TEXT DEFAULT '{}',
  page_url TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  duration_ms INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_user ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON user_events(session_id);

CREATE TABLE IF NOT EXISTS daily_stats (
  id TEXT PRIMARY KEY,
  stat_date TEXT NOT NULL,
  dau INTEGER DEFAULT 0,
  mau INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  resume_generated INTEGER DEFAULT 0,
  resume_downloaded INTEGER DEFAULT 0,
  ai_calls INTEGER DEFAULT 0,
  avg_session_duration REAL DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  retention_rate_7d REAL DEFAULT 0,
  retention_rate_30d REAL DEFAULT 0,
  paying_users INTEGER DEFAULT 0,
  revenue REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_date ON daily_stats(stat_date);

-- =====================================================
-- Phase 3: AI Prompt 管理中心
-- =====================================================

CREATE TABLE IF NOT EXISTS prompt_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'resume' CHECK(category IN ('resume', 'interview', 'analysis', 'matching', 'jd_parser', 'talent_profile', 'other')),
  model_type TEXT DEFAULT 'gpt' CHECK(model_type IN ('gpt', 'claude', 'gemini', 'deepseek', 'hunyuan', 'other')),
  current_version INTEGER DEFAULT 1,
  system_prompt TEXT DEFAULT '',
  user_prompt_template TEXT DEFAULT '',
  variables TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  is_ab_test INTEGER DEFAULT 0,
  ab_variant TEXT DEFAULT '',
  ab_weight INTEGER DEFAULT 50,
  temperature REAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2048,
  call_count INTEGER DEFAULT 0,
  avg_score REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS prompt_versions (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  system_prompt TEXT DEFAULT '',
  user_prompt_template TEXT DEFAULT '',
  variables TEXT DEFAULT '[]',
  change_log TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (prompt_id) REFERENCES prompt_templates(id)
);

CREATE TABLE IF NOT EXISTS prompt_tests (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  version INTEGER DEFAULT 0,
  test_input TEXT DEFAULT '',
  test_output TEXT DEFAULT '',
  score REAL DEFAULT 0,
  feedback TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (prompt_id) REFERENCES prompt_templates(id)
);

CREATE TABLE IF NOT EXISTS prompt_call_logs (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  version INTEGER DEFAULT 0,
  ab_variant TEXT DEFAULT '',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  latency_ms INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT DEFAULT '',
  user_id TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- Phase 4: HR 人才画像
-- =====================================================

CREATE TABLE IF NOT EXISTS talent_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  skill_structure TEXT DEFAULT '{}',
  career_direction TEXT DEFAULT '',
  career_path TEXT DEFAULT '[]',
  job_match_score REAL DEFAULT 0,
  capability_tags TEXT DEFAULT '[]',
  growth_potential REAL DEFAULT 0,
  career_risk_score REAL DEFAULT 0,
  career_risk_factors TEXT DEFAULT '[]',
  education_level TEXT DEFAULT '',
  work_years INTEGER DEFAULT 0,
  industry TEXT DEFAULT '',
  analysis_raw TEXT DEFAULT '',
  analyzed_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- Phase 5: 招聘匹配引擎
-- =====================================================

CREATE TABLE IF NOT EXISTS job_positions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT DEFAULT '',
  department TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  job_level TEXT DEFAULT '',
  location TEXT DEFAULT '',
  salary_range TEXT DEFAULT '',
  jd_text TEXT NOT NULL,
  requirements TEXT DEFAULT '{}',
  keywords TEXT DEFAULT '[]',
  embedding TEXT DEFAULT '',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS job_matches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  position_id TEXT NOT NULL,
  match_score REAL DEFAULT 0,
  skill_gaps TEXT DEFAULT '[]',
  keyword_coverage REAL DEFAULT 0,
  competitiveness_score REAL DEFAULT 0,
  optimization_tips TEXT DEFAULT '[]',
  top5_positions TEXT DEFAULT '[]',
  top5_industries TEXT DEFAULT '[]',
  growth_path TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (position_id) REFERENCES job_positions(id)
);

-- =====================================================
-- Phase 7: 企业版
-- =====================================================

CREATE TABLE IF NOT EXISTS enterprise_users (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_name TEXT DEFAULT '',
  company_size TEXT DEFAULT '',
  subscription_tier TEXT DEFAULT 'trial' CHECK(subscription_tier IN ('trial', 'basic', 'pro', 'enterprise')),
  subscription_expires TEXT DEFAULT '',
  max_resumes INTEGER DEFAULT 100,
  resumes_processed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS enterprise_batches (
  id TEXT PRIMARY KEY,
  enterprise_user_id TEXT NOT NULL,
  batch_name TEXT DEFAULT '',
  total_resumes INTEGER DEFAULT 0,
  processed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  filters TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (enterprise_user_id) REFERENCES enterprise_users(id)
);

CREATE TABLE IF NOT EXISTS enterprise_resume_results (
  id TEXT PRIMARY KEY,
  batch_id TEXT NOT NULL,
  resume_content TEXT NOT NULL,
  parsed_data TEXT DEFAULT '{}',
  score REAL DEFAULT 0,
  rank INTEGER DEFAULT 0,
  tags TEXT DEFAULT '[]',
  recommendation TEXT DEFAULT '',
  interview_questions TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (batch_id) REFERENCES enterprise_batches(id)
);

-- =====================================================
-- 初始数据
-- =====================================================

-- 创建默认管理员 (密码: 123456)
INSERT OR IGNORE INTO users (id, username, email, password_hash, nickname, role, status)
VALUES ('admin-001', '123456@qq.com', '123456@qq.com', '$2b$10$sBfYfI3vujMfraTWZjO7fOzOyhRE7eXh8C0yPK76XeIrCKwBcn7T2', '系统管理员', 'super_admin', 'active');

-- 创建默认 Prompt 模板
INSERT OR IGNORE INTO prompt_templates (id, name, category, model_type, current_version, system_prompt, user_prompt_template, variables, is_active)
VALUES 
('prompt-resume-001', '简历优化模板', 'resume', 'gpt', 1, 
  '你是一位专业的简历优化顾问，拥有10年HR经验。请根据用户提供的简历内容，生成优化建议和改进后的简历。',
  '请优化以下简历：\n{resume_content}\n\n目标岗位：{target_position}\n行业：{industry}',
  '["resume_content", "target_position", "industry"]', 1),
('prompt-interview-001', '面试问题生成', 'interview', 'gpt', 1,
  '你是一位资深面试官，请根据简历内容和目标岗位生成专业的面试问题。',
  '简历：{resume_content}\n岗位：{position}\n难度：{difficulty}\n生成{count}道面试题',
  '["resume_content", "position", "difficulty", "count"]', 1),
('prompt-talent-001', '人才画像分析', 'talent_profile', 'gpt', 1,
  '你是一位人才评估专家。请分析候选人的能力结构和职业发展潜力。',
  '请分析以下简历的人才画像：\n{resume_content}\n\n输出：技能结构、职业方向、成长潜力、职业风险',
  '["resume_content"]', 1),
('prompt-match-001', '岗位匹配分析', 'matching', 'gpt', 1,
  '你是一位招聘专家。请分析候选人与岗位的匹配度，找出技能缺口。',
  '简历：{resume_content}\nJD：{jd_text}\n\n输出匹配度评分、技能缺口、优化建议',
  '["resume_content", "jd_text"]', 1),
('prompt-jd-001', 'JD解析器', 'jd_parser', 'deepseek', 1,
  '你是一位JD分析专家。请解析职位描述，提取关键信息。',
  '请解析以下JD：\n{jd_text}\n\n提取：岗位名称、职责、要求、技能、薪资范围',
  '["jd_text"]', 1);

-- 创建示例岗位数据
INSERT OR IGNORE INTO job_positions (id, title, company, department, industry, job_level, salary_range, jd_text, requirements, keywords)
VALUES 
('job-001', '前端开发工程师', '示例科技', '技术部', '互联网', '中级', '15k-25k',
  '负责公司核心产品的前端开发，使用React/TypeScript技术栈，参与架构设计和技术选型。',
  '{"skills":["React","TypeScript","Next.js","CSS"],"education":"本科","experience":3}',
  '["React","TypeScript","前端","Web"]'),
('job-002', '产品经理', '示例科技', '产品部', '互联网', '高级', '20k-35k',
  '负责产品规划和需求分析，推动产品迭代，协调研发、设计、运营团队。',
  '{"skills":["产品规划","数据分析","用户研究","PRD"],"education":"本科","experience":5}',
  '["产品经理","需求分析","数据分析"]'),
('job-003', '数据分析师', '示例数据', '数据部', '金融', '初级', '10k-18k',
  '负责业务数据分析，构建数据看板，输出分析报告，支持业务决策。',
  '{"skills":["SQL","Python","Excel","Tableau"],"education":"本科","experience":1}',
  '["数据分析","SQL","Python","BI"]'),
('job-004', '后端开发工程师', '示例云', '研发部', '云计算', '中级', '18k-30k',
  '负责后端服务开发，API设计，数据库优化，系统性能调优。',
  '{"skills":["Go","MySQL","Redis","Docker"],"education":"本科","experience":3}',
  '["后端","Go","API","微服务"]'),
('job-005', 'AI算法工程师', '示例AI', '算法部', '人工智能', '高级', '30k-50k',
  '负责NLP/CV算法研发，模型训练和部署，参与AI产品设计。',
  '{"skills":["Python","PyTorch","NLP","LLM"],"education":"硕士","experience":5}',
  '["AI","算法","深度学习","NLP"]');
`;

export type UserRole = 'user' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'inactive' | 'banned';
export type PromptCategory = 'resume' | 'interview' | 'analysis' | 'matching' | 'jd_parser' | 'talent_profile' | 'other';
export type ModelType = 'gpt' | 'claude' | 'gemini' | 'deepseek' | 'hunyuan' | 'other';
export type SubscriptionTier = 'trial' | 'basic' | 'pro' | 'enterprise';

// =====================================================
// TypeScript 类型定义
// =====================================================

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  nickname: string;
  avatar_url: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar_url: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  original_content: string;
  optimized_content: string;
  score: number;
  type: 'original' | 'optimized';
  tags: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserEvent {
  id: string;
  user_id: string;
  session_id: string;
  event_type: string;
  event_category: string;
  event_data: string;
  page_url: string;
  referrer: string;
  user_agent: string;
  ip_address: string;
  duration_ms: number;
  created_at: string;
}

export interface DailyStats {
  id: string;
  stat_date: string;
  dau: number;
  mau: number;
  new_users: number;
  active_users: number;
  total_events: number;
  resume_generated: number;
  resume_downloaded: number;
  ai_calls: number;
  avg_session_duration: number;
  conversion_rate: number;
  retention_rate_7d: number;
  retention_rate_30d: number;
  paying_users: number;
  revenue: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  model_type: ModelType;
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

export interface PromptVersion {
  id: string;
  prompt_id: string;
  version: number;
  system_prompt: string;
  user_prompt_template: string;
  variables: string;
  change_log: string;
  created_by: string;
  created_at: string;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  skill_structure: string;
  career_direction: string;
  career_path: string;
  job_match_score: number;
  capability_tags: string;
  growth_potential: number;
  career_risk_score: number;
  career_risk_factors: string;
  education_level: string;
  work_years: number;
  industry: string;
  analysis_raw: string;
  analyzed_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosition {
  id: string;
  title: string;
  company: string;
  department: string;
  industry: string;
  job_level: string;
  location: string;
  salary_range: string;
  jd_text: string;
  requirements: string;
  keywords: string;
  embedding: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface JobMatch {
  id: string;
  user_id: string;
  position_id: string;
  match_score: number;
  skill_gaps: string;
  keyword_coverage: number;
  competitiveness_score: number;
  optimization_tips: string;
  top5_positions: string;
  top5_industries: string;
  growth_path: string;
  created_at: string;
}
