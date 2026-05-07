import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";

import { CookieNotice } from "@/components/CookieNotice";

import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

const base = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const metadata: Metadata = {
  title: { default: site.pageTitle, template: `%s | ${site.artistName}` },
  description: site.description,
  metadataBase: base,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: site.pageTitle,
    description: site.description,
    type: "website",
    locale: "ru_RU",
    images: site.ogImage ? [{ url: site.ogImage }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: site.pageTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
