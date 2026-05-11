import { parseShowsCsv } from "./parse-shows-csv";
import type { Show } from "./types";

const REVALIDATE_SEC = 120;

/**
 * URL публичного CSV из Google Таблиц.
 * Получить: Файл → Поделиться → Опубликовать в интернете → лист → CSV,
 * либо экспорт: `https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=GID`
 */
export async function fetchShowsFromPublishedCsv(csvUrl: string): Promise<Show[] | null> {
  try {
    const res = await fetch(csvUrl, {
      next: { revalidate: REVALIDATE_SEC },
      headers: { Accept: "text/csv,*/*" },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const shows = parseShowsCsv(text);
    return shows.length > 0 ? shows : null;
  } catch {
    return null;
  }
}
