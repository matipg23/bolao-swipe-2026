import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Public routes that don't require authentication
const publicRoutes = [
  '/api/register',
  '/api/login',
  '/api/logout',
  '/api/verify-email',
  '/api/forgot-password',
  '/api/reset-password',
  '/api/dashboard/stats',
  '/api/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // #region agent log
  if (pathname === '/api/register') {
    fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:18',message:'middleware entry for register',data:{pathname,method:request.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }
  // #endregion

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // #region agent log
  if (pathname === '/api/register') {
    fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:25',message:'public route check',data:{isPublicRoute,pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  }
  // #endregion

  if (isPublicRoute) {
    // #region agent log
    if (pathname === '/api/register') {
      fetch('http://127.0.0.1:7242/ingest/67e07f31-5f20-4cad-8505-575eeb9b160a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:29',message:'allowing public route',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion
    return NextResponse.next();
  }

  // Check for authentication on protected routes
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Attach user ID to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    // Add frontend protected routes here if needed
  ],
};
