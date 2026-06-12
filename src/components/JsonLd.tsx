import { resolveTicketHttpsUrl } from "@/content/ticket-destinations";
import type { SiteConfig } from "@/lib/types";
import { jsonLdSerialization } from "@/lib/jsonld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function JsonLd({ config }: { config: SiteConfig }) {
  const { artistName, description, shows, socials, ogImage } = config;

  const imageUrl =
    ogImage && siteUrl ? `${siteUrl.replace(/\/$/, "")}${ogImage}` : undefined;

  const performer = { "@type": "MusicGroup", name: artistName };

  const events = shows.map((s) => {
    const ticketPage =
      s.ticketHref ?? (s.ticketRef ? resolveTicketHttpsUrl(s.ticketRef) : undefined);
    const fallbackPage = !ticketPage && config.ticketFallbackUrl ? config.ticketFallbackUrl : undefined;

    // id формат: YYYY-MM-DD-slug
    const startDate = s.id.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];

    const venueName = s.club && s.club !== "—" ? s.club : s.city;

    const eventObj: Record<string, unknown> = {
      "@type": "Event",
      name: `${artistName} — ${s.city}`,
      startDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: venueName,
        address: {
          "@type": "PostalAddress",
          addressLocality: s.city,
          addressCountry: "RU",
        },
      },
      performer,
    };

    if (imageUrl) eventObj.image = imageUrl;
    if (ticketPage) eventObj.url = ticketPage;
    else if (fallbackPage) eventObj.url = fallbackPage;

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
