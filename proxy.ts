import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/session-crypto";

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/session-setup",
  "/live-session",
  "/moderation",
  "/print-management",
  "/kiosk-management",
  "/activity-logs",
  "/analytics",
  "/reports",
  "/settings",
  "/checking-connections",
];

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isLoginRoute = pathname === "/login";

  const rawCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(rawCookie);
  const isAuthenticated = Boolean(session?.educatorId);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/checking-connections" && pathname !== "/dashboard") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (
    isLoginRoute &&
    isAuthenticated &&
    searchParams.get("choose") !== "1" &&
    searchParams.get("switch") !== "1"
  ) {
    const redirectParam = searchParams.get("redirect");
    const targetPath =
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//")
        ? redirectParam
        : "/dashboard";
    return applySecurityHeaders(
      NextResponse.redirect(new URL(targetPath, request.url))
    );
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|sw.js|pwa-icon|apple-icon|.*\\.(?:png|svg|apk|idsig|ico)$).*)",
  ],
};
