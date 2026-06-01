import type { SiteConfig } from "@/lib/types";

/**
 * Единая точка правды: имя, афиша, ссылки. Меняйте здесь — не в разметке.
 */
export const site: SiteConfig = {
  artistName: "Scally Milano",
  pageTitle: "Scally Milano — концерты",
  description: "скалли я",
  /** Превью ссылки (Open Graph / мессенджеры / часть поисковиков). */
  ogImage: "/hero-main.png",
  /** Герой: десктоп из корня «комп new.webp» → `public/hero-desktop.webp`, мобила «моб новое решение.webp» → `hero-mobile.webp`. */
  heroImage: "/hero-desktop.webp",
  ticketFallbackUrl: "https://t.me/scallymilanogram",
  socials: [
    {
      id: "tg",
      label: "Telegram",
      shortLabel: "TG",
      href: "https://t.me/scallymilanogram",
    },
    {
      id: "vk",
      label: "ВКонтакте",
      shortLabel: "VK",
      href: "https://vk.com/scallymilano",
    },
    {
      id: "ig",
      label: "Instagram",
      shortLabel: "IG",
      href: "https://www.instagram.com/scallymilano",
    },
    {
      id: "tt",
      label: "TikTok",
      shortLabel: "TT",
      href: "https://www.tiktok.com/@scallymilano",
    },
    {
      id: "yt",
      label: "YouTube",
      shortLabel: "YT",
      href: "https://youtube.com/@scallymilano6716",
    },
  ],
  shows: [
    {
      id: "2026-05-07-blag",
      dateLabel: "07.05.2026",
      city: "БЛАГОВЕЩЕНСК",
      club: "СЛОТ",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-08-kra",
      dateLabel: "08.05.2026",
      city: "КРАСНОЯРСК",
      club: "ЭСТРАДА",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-10-irk-soprano",
      dateLabel: "10.05.2026",
      city: "ИРКУТСК",
      club: "SOPRANO",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-10-irk-ermitage",
      dateLabel: "10.05.2026",
      city: "ИРКУТСК",
      club: "ЭРМИТАЖ",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-15-kem",
      dateLabel: "15.05.2026",
      city: "КЕМЕРОВО",
      club: "СЕРВАНТ",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-16-tom",
      dateLabel: "16.05.2026",
      city: "ТОМСК",
      club: "—",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-16-khb",
      dateLabel: "16.05.2026",
      city: "ХАБАРОВСК",
      club: "LOONA",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-17-vld",
      dateLabel: "17.05.2026",
      city: "ВЛАДИВОСТОК",
      club: "MIX",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-05-29-msk-zav",
      dateLabel: "29.05.2026",
      city: "МОСКВА",
      club: "ЗАВАРКА",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-06-01-msk-base",
      dateLabel: "01.06.2026",
      city: "МОСКВА",
      club: "BASE",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-06-06-sol",
      dateLabel: "06.06.2026",
      city: "СОЛИКАМСК",
      club: "OTTO",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-06-12-msk-anim",
      dateLabel: "12.06.2026",
      city: "МОСКВА",
      club: "АНИМА",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-06-13-smo",
      dateLabel: "13.06.2026",
      city: "СМОЛЕНСК",
      club: "GOLD",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-06-20-iva",
      dateLabel: "20.06.2026",
      city: "ИВАНОВО",
      club: "ОБЛАКА",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-07-03-uln",
      dateLabel: "03.07.2026",
      city: "УЛЬЯНОВСК",
      club: "MAISON",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-07-04-kzn",
      dateLabel: "04.07.2026",
      city: "КАЗАНЬ",
      club: "WERK",
      ticketLabel: "БИЛЕТЫ",
    },
    {
      id: "2026-07-05-nkz",
      dateLabel: "05.07.2026",
      city: "НИЖНЕКАМСК",
      club: "Neftь",
      ticketLabel: "БИЛЕТЫ",
    },
  ],
  footerCredit: {
    text: "by trust above fame",
    href: "https://t.me/trustabovefame",
  },
};
