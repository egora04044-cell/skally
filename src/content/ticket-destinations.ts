import { assertHttpsTicketUrl } from "@/lib/ticket-url";

/**
 * Белый список hostname билетных операторов и агрегаторов (без порта, в нижнем регистре в Set).
 * Перед добавлением URL ниже добавьте сюда соответствующий хост.
 */
export const TICKET_ALLOWED_HOSTS = new Set<string>([
  /* пример после согласования с партнёром: */
  // "tickets.example.com",
]);

/**
 * id → финальный HTTPS URL билетной площадки.
 * Сайт никуда не редиректит по произвольному query — только по зарегистрированным ref.
 *
 * Совпадает с желательным ключом билетной ссылки в `site.shows[].ticketRef`,
 * если используете тот же id концерта (но ref может быть и отдельной строкой).
 */
const RAW_TICKET_DESTINATIONS: Record<string, string> = {
  //
};

const validatedEntries: [string, string][] = [];
for (const [ref, href] of Object.entries(RAW_TICKET_DESTINATIONS)) {
  const url = assertHttpsTicketUrl(href, TICKET_ALLOWED_HOSTS);
  validatedEntries.push([ref, url.toString()]);
}

/** Проверенные редиректы (immutable). */
export const ticketRedirects = Object.freeze(
  Object.fromEntries(validatedEntries) as Record<string, string>,
);

export function resolveTicketHttpsUrl(ref: string): string | undefined {
  return ticketRedirects[ref];
}
