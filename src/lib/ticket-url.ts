/**
 * Проверка URL билетов (редирект / JSON-LD / таблица): только валидный HTTPS.
 */

export const TICKET_REF_SAFE = /^[a-z0-9][a-z0-9._-]{0,191}$/i;

export function assertHttpsTicketUrl(raw: string): URL {
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

  return url;
}
