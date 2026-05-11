"use client";

import type { MouseEvent } from "react";

import art from "./hero-art.module.css";

import type { SiteConfig } from "@/lib/types";

import { SocialLinks } from "./SocialLinks";

type Props = Pick<SiteConfig, "artistName" | "socials">;

/**
 * Макет героя: фон через CSS (нет <img>), правый клик на фон заблокирован.
 * Отключить копирование в веб принципиально нельзя (скрин, вкладка «Сеть» и т.д.).
 */
export function HeroArtHeader({ artistName, socials }: Props) {
  const blockMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <header
      className={`relative isolate flex min-h-[min(100svh,52rem)] flex-col overflow-hidden bg-black select-none ${art.shell}`}
    >
      <div
        className={art.backdrop}
        aria-hidden
        onContextMenu={blockMenu}
      />

      <h1 className="sr-only">{artistName}</h1>

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
