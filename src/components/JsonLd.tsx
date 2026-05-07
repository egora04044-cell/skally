import { resolveTicketHttpsUrl } from "@/content/ticket-destinations";
import type { SiteConfig } from "@/lib/types";
import { jsonLdSerialization } from "@/lib/jsonld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function JsonLd({ config }: { config: SiteConfig }) {
  const { artistName, description, shows, socials, ogImage } = config;

  const events = shows.map((s) => {
    const ticketPage = s.ticketRef ? resolveTicketHttpsUrl(s.ticketRef) : undefined;
    const fallbackPage = !ticketPage && config.ticketFallbackUrl ? config.ticketFallbackUrl : undefined;
    const eventObj: Record<string, unknown> = {
      "@type": "Event" as const,
      name: `${artistName} — ${s.city} — ${s.club}`,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode" as const,
      location: {
        "@type": "Place" as const,
        name: s.city,
      },
    };
    if (ticketPage) {
      eventObj.url = ticketPage;
    } else if (fallbackPage) {
      eventObj.url = fallbackPage;
    }
    return eventObj;
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artistName,
    description: description,
    image: ogImage,
    url: siteUrl,
    sameAs: socials.map((l) => l.href).filter((h) => Boolean(h) && !h.startsWith("#")),
    event: events,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdSerialization(data) }}
    />
  );
}
