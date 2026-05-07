/**
 * Единственная точка проверки URL билетных партнёров (редирект / JSON-LD).
 * Блокирует не-https и опасные схемы; хост допускается только из whitelist.
 */

export const TICKET_REF_SAFE = /^[a-z0-9][a-z0-9._-]{0,191}$/i;

export function assertHttpsTicketUrl(
  raw: string,
  allowedHosts: ReadonlySet<string>,
): URL {
  const trimmed = raw.trim();
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`Некорректный URL билетов: ${trimmed}`);
  }

  if (url.protocol !== "https:") {
    throw new Error("Разрешены только HTTPS-ссылки на билетные сервисы");
  }

  const host = url.hostname.toLowerCase();
  if (!allowedHosts.has(host)) {
    throw new Error(
      `Хост «${host}» не входит в TICKET_ALLOWED_HOSTS (ticket-destinations.ts)`,
    );
  }

  return url;
}
