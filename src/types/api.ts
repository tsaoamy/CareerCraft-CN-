// ==========================================
// API 响应类型 - DTO 白名单模式
// 严禁前端暴露：userId/email/phone/token/system_log/database_id
// ==========================================

// ──── 公开 API 响应（所有用户可访问） ────
export interface PublicUserDTO {
  name: string;
  avatar?: string;
  resumeScore?: number;
  analysisResult?: string;
}

export interface PublicStatsDTO {
  totalResumesGenerated: number;
  totalAnalyses: number;
  platformUsers: number;
}

// ──── 用户 API 响应（仅本人） ────
export interface UserProfileDTO {
  displayName: string;
  avatar?: string;
  resumeScore: number;
  materialsCount: number;
  resumeCount: number;
  memberSince: string;
}

// ──── Admin API 响应 ────
// 注意：这些类型位于 src/types/admin.ts
// 此处仅定义 API 包装器

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}

// ──── 安全策略 ────
// 以下字段 NEVER 返回给前端：
export const FORBIDDEN_FIELDS = [
  "password",
  "passwordHash",
  "apiKey",
  "openaiKey",
  "jwtSecret",
  "dbConnection",
  "internalId",
  "serverPath",
  "logPath",
  "token",
  "refreshToken",
  "creditCardInfo",
  "idNumber",
  "phone",
  "email", // 仅在 admin 白名单中可见
  "userAgent",
  "ipAddress",
  "sessionToken",
] as const;

// Admin 白名单：仅管理员可见的字段
export const ADMIN_WHITELIST_FIELDS = [
  "email",
  "lastLoginAt",
  "createdAt",
  "status",
  "role",
] as const;
