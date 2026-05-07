import type { ComponentType, SVGProps } from "react";
import {
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiVk,
  SiYoutube,
} from "react-icons/si";

import type { SocialLink } from "@/lib/types";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconById: Record<string, IconComponent> = {
  tg: SiTelegram,
  vk: SiVk,
  ig: SiInstagram,
  tt: SiTiktok,
  yt: SiYoutube,
};

type Props = {
  links: SocialLink[];
  className?: string;
  /** Компактный ряд для футера */
  variant?: "default" | "bar";
};

export function SocialLinks({ links, className = "", variant = "default" }: Props) {
  if (links.length === 0) return null;

  const isBar = variant === "bar";

  return (
    <nav
      className={className}
      aria-label="Социальные сети"
    >
      <ul
        className={`flex flex-wrap items-center justify-center ${isBar ? "gap-2 sm:gap-3" : "gap-3 sm:gap-4"}`}
      >
        {links.map((s) => {
          const Icon = iconById[s.id];
          return (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isBar
                    ? "group inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-950 text-zinc-300 transition-[color,background-color,border-color] duration-300 ease-out hover:border-zinc-300 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:h-11 sm:w-11"
                    : "group inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-600 bg-zinc-950 text-zinc-300 transition-[color,background-color,border-color] duration-300 ease-out hover:border-zinc-300 hover:bg-zinc-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                }
              >
                {Icon ? (
                  <Icon
                    className={`${isBar ? "h-5 w-5" : "h-6 w-6"} text-inherit transition-[color,fill,opacity] duration-300 ease-out`}
                    aria-hidden
                  />
                ) : (
                  <span className="text-xs font-medium">{s.shortLabel ?? s.label}</span>
                )}
                <span className="sr-only">{s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
