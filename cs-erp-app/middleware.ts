/**
 * Next.js Middleware - Route Protection
 *
 * Protects all routes except login and auth API endpoints
 * Redirects unauthenticated users to /login
 * Redirects authenticated users away from /login
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/me'];

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if user has valid session
 * We check for the session cookie existence
 */
function hasValidSession(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('cs_erp_session');
  return !!sessionCookie;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, Next.js internals, and API routes (except auth)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/trpc')
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = hasValidSession(request);
  const isPublic = isPublicRoute(pathname);

  // Case 1: Trying to access login page while authenticated
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Case 2: Trying to access protected route without authentication
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 3: Valid access - continue
  return NextResponse.next();
}

/**
 * Matcher configuration
 * Apply middleware to all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
