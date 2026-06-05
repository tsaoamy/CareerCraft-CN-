/**
 * 内存用户存储 — SQLite/CloudBase 均不可用时的兜底方案
 * 仅在当前进程内有效，重启后丢失
 */
export const memUsers = new Map<string, { username: string; phone: string; password: string; nickname: string }>();
