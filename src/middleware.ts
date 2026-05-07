import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Дополнение к редиректам на CDN: один канонический host (www ↔ apex).
 * В Vercel/Cloudflare часто настраивают без middleware; переменная опциональна.
 */
const CANONICAL_HOST = process.env.CANONICAL_SITE_HOST?.trim().toLowerCase();

export function middleware(request: NextRequest): NextResponse {
  if (!CANONICAL_HOST || process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const raw =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    request.headers.get("host") ??
    "";
  const hostname = raw.split(":")[0]?.toLowerCase() ?? "";

  if (!hostname || hostname === CANONICAL_HOST) {
    return NextResponse.next();
  }

  if (CANONICAL_HOST.startsWith("www.")) {
    const apex = CANONICAL_HOST.slice(4);
    if (hostname === apex) {
      const next = new URL(request.url);
      next.hostname = CANONICAL_HOST;
      return NextResponse.redirect(next, 301);
    }
  } else if (hostname === `www.${CANONICAL_HOST}`) {
    const next = new URL(request.url);
    next.hostname = CANONICAL_HOST;
    return NextResponse.redirect(next, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|.*\\.(?:ico|png|svg|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
