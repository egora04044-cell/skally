export type SocialLink = {
  id: string;
  label: string;
  href: string;
  /** Иконка-эмодзи или буква для кнопки (опционально) */
  shortLabel?: string;
};

export type Show = {
  id: string;
  dateLabel: string;
  city: string;
  club: string;
  /**
   * Ключ безопасного редиректа `/go/tickets/[ref]` (см. `src/content/ticket-destinations.ts`).
   * Без значения кнопка использует `site.ticketFallbackUrl`, если задан.
   */
  ticketRef?: string;
  /** Прямая HTTPS-ссылка на билеты (например из Google Таблицы). */
  ticketHref?: string;
  ticketLabel?: string;
};

export type FooterCredit = {
  text: string;
  href: string;
};

export type SiteConfig = {
  artistName: string;
  /** <title> и мета-описание */
  pageTitle: string;
  description: string;
  /** Open Graph / превью */
  ogImage?: string;
  /** Герой: десктоп — URL в `/public`; моб. макет задаётся в `hero-art.module.css`. */
  heroImage?: string;
  socials: SocialLink[];
  shows: Show[];
  /**
   * Ссылка для кнопки «Билеты», если у концерта нет `ticketRef` (ещё нет URL в ticket-destinations).
   * Обычно Telegram / агрегатор — одна общая точка входа.
   */
  ticketFallbackUrl?: string;
  footerCredit?: FooterCredit;
};
