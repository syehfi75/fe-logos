import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;  

  const isProtected = ['/dashboard', '/account'].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isProtectedMentor = ['/mentor/dashboard'].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // if (isProtectedMentor && !token) {
  //   return NextResponse.redirect(new URL('/mentor/login', request.url));
  // }

  // if (isProtected && !token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/mentor/:path*'],
};
