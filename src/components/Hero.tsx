import type { SiteConfig } from "@/lib/types";

import { HeroArtHeader } from "./HeroArtHeader";
import { SocialLinks } from "./SocialLinks";

type Props = {
  config: Pick<SiteConfig, "artistName" | "socials" | "heroImage">;
};

/**
 * Первый экран: при `heroImage` — макет (фон см. HeroArtHeader + hero-art.module.css); соцсети поверх внизу.
 * Без картинки — прежний вариант с типографикой.
 */
export function Hero({ config }: Props) {
  const { artistName, heroImage, socials } = config;

  const lines = artistName
    .trim()
    .split(/\s+/)
    .map((w) => w.toUpperCase())
    .filter(Boolean);

  if (heroImage) {
    return <HeroArtHeader artistName={artistName} socials={socials} />;
  }

  return (
    <header className="relative isolate flex min-h-[min(100svh,52rem)] flex-col overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute left-1/2 top-[10%] z-[5] h-[min(50vh,26rem)] w-[min(115vw,42rem)] -translate-x-1/2 rounded-full bg-white/[0.18] blur-[76px] sm:top-[8%]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 pt-[4vh] sm:px-4 sm:pt-[6vh]">
        <h1 className="w-full max-w-[100vw] text-center font-sans font-black uppercase leading-[0.74] tracking-[-0.04em] text-white">
          {lines.map((line, i) => (
            <span
              key={`${line}-${i}`}
              className="block text-[17.5vw] leading-none sm:text-[13.5vw] md:text-[min(5.85rem,11vw)] lg:text-[min(8rem,13.2vw)]"
            >
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[30] h-[38%] bg-gradient-to-t from-black via-black/45 to-transparent sm:h-[40%]"
        aria-hidden
      />

      <div className="relative z-40 mt-auto flex flex-col items-center px-4 pb-8 pt-10 sm:pb-12">
        <SocialLinks className="mt-2" links={socials} />
      </div>
    </header>
  );
}
