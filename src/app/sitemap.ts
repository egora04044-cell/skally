import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  if (!base) {
    return [{ url: "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
  }

  const routes = ["/", "/privacy", "/cookies", "/offer"] as const;

  return routes.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.3,
  }));
}

export const dynamic = "force-static";
