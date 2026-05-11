import { site } from "@/content/site";
import { fetchShowsFromPublishedCsv } from "./fetch-shows-from-sheet";
import type { Show } from "./types";

/** Публичная афиша по умолчанию, если `CONCERTS_SHEET_CSV_URL` не задан в окружении. */
const DEFAULT_CONCERTS_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1-J2ich8fjJeWoWNgREbfWJRV2ZjwwgvTUqcwfFO6ZaU/export?format=csv&gid=0";

/**
 * Афиша из Google CSV (кэш ~2 мин). URL: `CONCERTS_SHEET_CSV_URL` или значение по умолчанию выше.
 * При ошибке загрузки или пустом CSV — `site.shows` из `src/content/site.ts`.
 */
export async function getShowsForHome(): Promise<Show[]> {
  const url =
    process.env.CONCERTS_SHEET_CSV_URL?.trim() || DEFAULT_CONCERTS_SHEET_CSV_URL;

  const fromSheet = await fetchShowsFromPublishedCsv(url);
  return fromSheet ?? site.shows;
}
