import { NextRequest, NextResponse } from 'next/server';

function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false; // Not a JWT; treat as opaque, not expired
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Edge runtime supports atob
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const exp = typeof payload.exp === 'number' ? payload.exp : null;
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const protectedPrefixes = ['/dashboard', '/account', '/lesson'];
  const isProtected = protectedPrefixes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected) {
    const expired = isJwtExpired(token);
    if (!token || expired) {
      const url = new URL('/login', request.url);
      // Optionally pass state to show login tab
      url.searchParams.set('state', 'login');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/lesson/:path*'],
};
