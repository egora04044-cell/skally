import type { NextConfig } from "next";

/**
 * Домены, SSL и 301 www/apex — на стороне хостинга/CDN (Vercel, Cloudflare и т.д.).
 * Для единого канонического host в prod задайте CANONICAL_SITE_HOST (см. .env.example) — middleware выставит редирект.
 * Сертификат и автопродление — у провайдера (Let's Encrypt и аналоги).
 */

const isProd = process.env.NODE_ENV === "production";

const cspDirectives: string[] = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "object-src 'none'",
];

if (isProd) {
  cspDirectives.push(
    "script-src 'self'",
    "style-src 'self'",
    "connect-src 'self'",
    "upgrade-insecure-requests",
  );
} else {
  cspDirectives.push(
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' ws: wss:",
  );
}

const contentSecurityPolicy = cspDirectives.join("; ");

const securityHeaders: { key: string; value: string }[] = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

if (isProd) {
  securityHeaders.unshift({
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
