import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We can't reliably check the httpOnly refreshToken from the backend domain here 
  // because of cross-domain restrictions (Vercel vs Render).
  // We will let AuthProvider.tsx handle the "Protected Route" logic on the client-side.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
