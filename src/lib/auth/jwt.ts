/**
 * JWT 认证工具
 * 使用 jose 库 - 兼容 Next.js Edge Runtime
 */

import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'careercraft-jwt-secret-key-change-in-production-2025'
);

const JWT_EXPIRES_IN = '7d';
const ADMIN_JWT_EXPIRES_IN = '24h';

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * 生成 JWT Token
 */
export async function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, isAdmin = false): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(isAdmin ? ADMIN_JWT_EXPIRES_IN : JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * 验证 JWT Token
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * 从请求头中提取 Token
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
