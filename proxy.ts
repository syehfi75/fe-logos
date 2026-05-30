import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname === "/callback") {
    const tokenFromUrl = url.searchParams.get("token");

    if (tokenFromUrl) {
      const response = NextResponse.redirect(new URL("/callback", request.url));

      response.cookies.set("sso_token", tokenFromUrl, {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 5,
      });

      return response;
    }
  }

  const token = request.cookies.get("access_token")?.value;

  const isProtected = ["/dashboard", "/account"].some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const isProtectedMentor = ["/mentor/dashboard"].some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedMentor && !token) {
    return NextResponse.redirect(new URL("/mentor/login", request.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/mentor/:path*",
    "/callback",
  ],
};
