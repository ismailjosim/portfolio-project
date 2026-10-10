import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/src/lib/dashboard-auth';

const PROTECTED = '/dashboard';
const LOGIN = '/login';

// Next.js 16: renamed from middleware.ts → proxy.ts
// Function export is also renamed from `middleware` → `proxy`
// Runs on Node.js runtime (not Edge) by default in Next.js 16
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /dashboard and its sub-routes
  if (!pathname.startsWith(PROTECTED)) return NextResponse.next();

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (verifySessionToken(session)) return NextResponse.next();

  // Not authenticated → redirect to /login, remembering the original destination
  const loginUrl = new URL(LOGIN, request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
