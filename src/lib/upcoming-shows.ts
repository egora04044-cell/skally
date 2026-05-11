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

function compareShowsChronologically(a: Show, b: Show): number {
  const da = showDayKey(a);
  const db = showDayKey(b);
  if (da && db) {
    const byDate = da.localeCompare(db);
    if (byDate !== 0) return byDate;
  } else if (da && !db) {
    return -1;
  } else if (!da && db) {
    return 1;
  }
  const byCity = a.city.localeCompare(b.city, "ru");
  if (byCity !== 0) return byCity;
  const byClub = a.club.localeCompare(b.club, "ru");
  if (byClub !== 0) return byClub;
  return a.id.localeCompare(b.id);
}

/** Сверху вниз: сначала более ранняя дата; в один день — город, площадка, id. */
export function sortShowsByDateAsc(shows: Show[]): Show[] {
  return [...shows].sort(compareShowsChronologically);
}

/**
 * Оставляет концерты, дата которых ещё не прошла по календарю Москвы: в день выступления
 * строка есть, начиная со следующего дня — убирается. Результат отсортирован по дате (раньше — выше).
 */
export function filterUpcomingShows(shows: Show[], now: Date = new Date()): Show[] {
  const today = todayKeyMoscow(now);
  const filtered = shows.filter((show) => {
    const day = showDayKey(show);
    if (!day) return true;
    return day >= today;
  });
  return sortShowsByDateAsc(filtered);
}
