import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/constants';
import { verifyToken, extractToken } from '@/lib/auth/jwt';

/** 需要管理员角色的路由前缀 */
const ADMIN_ROUTES = ['/admin'];

/** 无需登录即可访问的管理端路由（仅登录页） */
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

/**
 * 管理后台路由守卫
 * - /admin/login        → 公开访问
 * - /admin/*            → 需有效 admin 会话，否则重定向到登录页
 * - 普通用户即使持有 token 但没有 admin 角色，也会被拦截
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理 admin 路由
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (!isAdminRoute) return NextResponse.next();

  // 登录页公开访问
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname === r)) {
    return NextResponse.next();
  }

  // 检查会话 cookie（由 admin-auth-context 验证通过后设置）
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    // 回退：尝试从 Authorization header 校验 JWT
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    if (token) {
      const payload = await verifyToken(token);
      if (payload && (payload.role === 'admin' || payload.role === 'super_admin')) {
        // JWT 有效且有管理员角色，放行
        const response = NextResponse.next();
        response.cookies.set(ADMIN_SESSION_COOKIE, '1', {
          path: '/',
          maxAge: 86400,
          sameSite: 'lax',
        });
        return response;
      }
    }
    // 无有效会话，重定向到登录页
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
