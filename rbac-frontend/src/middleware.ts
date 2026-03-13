import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  // 1. If trying to access dashboard routes without a session, redirect to login
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/users') || 
      pathname.startsWith('/permissions') || 
      pathname.startsWith('/audit') ||
      pathname.startsWith('/leads') ||
      pathname.startsWith('/tasks') ||
      pathname.startsWith('/reports') ||
      pathname.startsWith('/settings')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. If trying to access login page WITH a session, redirect to dashboard
  if (pathname === '/login') {
    if (refreshToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
