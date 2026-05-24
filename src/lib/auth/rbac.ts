/**
 * RBAC 权限控制
 */

export type Role = 'user' | 'admin' | 'super_admin' | 'enterprise';

export type Permission =
  | 'dashboard:view'        // 查看工作台
  | 'resume:create'         // 创建简历
  | 'resume:view_own'       // 查看自己的简历
  | 'resume:download'       // 下载简历
  | 'settings:edit_own'     // 编辑个人设置
  | 'users:view'            // 查看用户列表（管理员）
  | 'users:manage'          // 管理用户（管理员）
  | 'resume:view_all'       // 查看所有简历（管理员）
  | 'analytics:view'        // 查看分析数据（管理员）
  | 'prompts:view'          // 查看 Prompt（管理员）
  | 'prompts:manage'        // 管理 Prompt（管理员）
  | 'prompts:ab_test'       // AB 测试 Prompt（超级管理员）
  | 'system:logs'           // 查看系统日志
  | 'ai:monitor'            // AI 调用监控
  | 'enterprise:access'     // 企业版访问
  | 'enterprise:manage';    // 企业版管理

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: [
    'dashboard:view',
    'resume:create',
    'resume:view_own',
    'resume:download',
    'settings:edit_own',
  ],
  admin: [
    'dashboard:view',
    'resume:create',
    'resume:view_own',
    'resume:view_all',
    'resume:download',
    'settings:edit_own',
    'users:view',
    'users:manage',
    'analytics:view',
    'prompts:view',
    'prompts:manage',
    'system:logs',
    'ai:monitor',
    'enterprise:access',
  ],
  super_admin: [
    'dashboard:view',
    'resume:create',
    'resume:view_own',
    'resume:view_all',
    'resume:download',
    'settings:edit_own',
    'users:view',
    'users:manage',
    'analytics:view',
    'prompts:view',
    'prompts:manage',
    'prompts:ab_test',
    'system:logs',
    'ai:monitor',
    'enterprise:access',
    'enterprise:manage',
  ],
  enterprise: [
    'dashboard:view',
    'enterprise:access',
    'enterprise:manage',
    'users:view',
    'analytics:view',
  ],
};

/**
 * 检查角色是否拥有指定权限
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * 检查角色是否拥有任一权限
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * 检查角色是否拥有所有权限
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * 检查是否为管理员角色
 */
export function isAdminRole(role: string): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * 检查是否为超级管理员
 */
export function isSuperAdmin(role: string): boolean {
  return role === 'super_admin';
}

/**
 * 获取角色所有权限
 */
export function getRolePermissions(role: Role): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

/**
 * 获取角色对应的页面路径列表
 */
export function getRolePages(role: Role): string[] {
  const pages: string[] = ['/dashboard', '/resume-builder', '/settings'];
  
  if (isAdminRole(role)) {
    pages.push(
      '/admin/dashboard',
      '/admin/users',
      '/admin/resumes',
      '/admin/analytics',
      '/admin/ai-monitor',
      '/admin/prompts',
      '/admin/events',
      '/talent',
      '/talent/matching'
    );
  }
  
  if (role === 'enterprise' || hasPermission(role as Role, 'enterprise:access')) {
    pages.push('/enterprise');
  }
  
  return pages;
}
