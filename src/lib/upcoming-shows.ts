import type { Show } from "./types";

const MOSCOW_TZ = "Europe/Moscow";

/**
 * День концерта как YYYY-MM-DD (из `id`: `YYYY-MM-DD-...` или из `dateLabel` DD.MM.YYYY).
 */
function showDayKey(show: Show): string | null {
  const fromId = show.id.match(/^(\d{4}-\d{2}-\d{2})/);
  if (fromId) return fromId[1];

  const parts = show.dateLabel.split(".").map((p) => p.trim());
  if (parts.length !== 3) return null;
  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);
  if ([d, m, y].some((n) => Number.isNaN(n))) return null;

  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayKeyMoscow(now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: MOSCOW_TZ });
}

/**
 * Оставляет концерты, дата которых ещё не прошла по календарю Москвы: в день выступления
 * строка есть, начиная со следующего дня — убирается.
 */
export function filterUpcomingShows(shows: Show[], now: Date = new Date()): Show[] {
  const today = todayKeyMoscow(now);
  return shows.filter((show) => {
    const day = showDayKey(show);
    if (!day) return true;
    return day >= today;
  });
}
