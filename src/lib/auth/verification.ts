/**
 * 验证码服务（演示环境固定 123456，生产可接短信/邮件网关）
 */

export const DEMO_VERIFY_CODE = '123456';
const CODE_TTL_MS = 10 * 60 * 1000;
const SEND_COOLDOWN_MS = 60 * 1000;

export type VerifyPurpose = 'bind_phone' | 'bind_email';

interface CodeEntry {
  code: string;
  target: string;
  expiresAt: number;
}

const codeStore = new Map<string, CodeEntry>();
const lastSentAt = new Map<string, number>();

function storeKey(userId: string, purpose: VerifyPurpose, target: string): string {
  return `${userId}:${purpose}:${target}`;
}

export function issueVerificationCode(
  userId: string,
  purpose: VerifyPurpose,
  target: string
): { success: true } | { success: false; error: string; retryAfter?: number } {
  const key = storeKey(userId, purpose, target);
  const now = Date.now();
  const last = lastSentAt.get(key);

  if (last && now - last < SEND_COOLDOWN_MS) {
    return {
      success: false,
      error: '发送过于频繁，请稍后再试',
      retryAfter: Math.ceil((SEND_COOLDOWN_MS - (now - last)) / 1000),
    };
  }

  codeStore.set(key, {
    code: DEMO_VERIFY_CODE,
    target,
    expiresAt: now + CODE_TTL_MS,
  });
  lastSentAt.set(key, now);

  return { success: true };
}

export function checkVerificationCode(
  userId: string,
  purpose: VerifyPurpose,
  target: string,
  inputCode: string
): boolean {
  const key = storeKey(userId, purpose, target);
  const entry = codeStore.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    codeStore.delete(key);
    return false;
  }
  if (entry.target !== target) return false;
  if (inputCode.trim() !== entry.code) return false;
  codeStore.delete(key);
  return true;
}

export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
