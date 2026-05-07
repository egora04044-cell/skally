import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";
import { ShowList } from "@/components/ShowList";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <JsonLd config={site} />
      <div className="flex min-h-svh flex-col bg-zinc-950 text-zinc-100">
        <Hero
          config={{
            artistName: site.artistName,
            socials: site.socials,
          }}
        />
        <section
          className="flex flex-1 flex-col justify-center px-4 py-20 sm:py-28"
          aria-labelledby="shows-heading"
        >
          <h2
            id="shows-heading"
            className="sr-only"
          >
            Ближайшие выступления
          </h2>
          <ShowList
            shows={site.shows}
            fallbackTicketHref={site.ticketFallbackUrl}
          />
        </section>
        <footer className="border-t border-white/10 px-4 py-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <SocialLinks
              links={site.socials}
              variant="bar"
            />
            <LegalFooterLinks />
            {site.footerCredit ? (
              <a
                href={site.footerCredit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 transition hover:text-zinc-300"
              >
                {site.footerCredit.text}
              </a>
            ) : null}
          </div>
        </footer>
      </div>
    </>
  );
}
