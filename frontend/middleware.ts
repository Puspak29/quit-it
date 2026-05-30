import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import Cookies from 'js-cookie';

const publicRoutes = ['/sign-in', '/sign-up', '/health'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const token = req.cookies.get('frontend-token')?.value;
  console.log('Middleware: Checking authentication for', pathname, 'Token:', token);

  if (!isPublicRoute && (!token || token === 'undefined' || token === 'null' || token === '')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (isPublicRoute && token && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/(api|trpc)(.*)',
  ],
};