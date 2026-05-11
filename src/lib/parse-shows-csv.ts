import { assertHttpsTicketUrl } from "@/lib/ticket-url";
import type { Show } from "./types";
import { sortShowsByDateAsc } from "./upcoming-shows";

/** Простой RFC4180-подобный разбор строки CSV (как отдаёт Google Sheets). */
function splitCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");

  while (i < s.length) {
    const c = s[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      i++;
      continue;
    }
    field += c;
    i++;
  }
  row.push(field);
  if (row.some((cell) => cell.trim().length > 0)) {
    rows.push(row);
  }
  return rows;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, "_");
}

const HEADER_ALIASES: Record<string, keyof ParsedRow> = {
  date_iso: "dateRaw",
  date: "dateRaw",
  дата: "dateRaw",
  city: "city",
  город: "city",
  club: "club",
  venue: "club",
  площадка: "club",
  клуб: "club",
  ticket_ref: "ticketRef",
  ref: "ticketRef",
  билеты_ref: "ticketRef",
  ticket_label: "ticketLabel",
  label: "ticketLabel",
  ссылка_на_билеты: "ticketHrefRaw",
  ticket_url: "ticketHrefRaw",
  ticket_link: "ticketHrefRaw",
  url: "ticketHrefRaw",
  id: "id",
};

type ParsedRow = {
  dateRaw?: string;
  city?: string;
  club?: string;
  ticketRef?: string;
  ticketHrefRaw?: string;
  ticketLabel?: string;
  id?: string;
};

function mapHeaderToKey(h: string): keyof ParsedRow | undefined {
  const n = normalizeHeader(h);
  return HEADER_ALIASES[n];
}

/** DD.MM.YYYY или D.M.YYYY → YYYY-MM-DD и метка DD.MM.YYYY */
function parseRuDate(raw: string): { iso: string; label: string } | null {
  const t = raw.trim();
  const m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  if ([d, mo, y].some((n) => Number.isNaN(n))) return null;
  const iso = `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const label = `${String(d).padStart(2, "0")}.${String(mo).padStart(2, "0")}.${String(y).padStart(4, "0")}`;
  return { iso, label };
}

function parseIsoDate(raw: string): { iso: string; label: string } | null {
  const t = raw.trim();
  const m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if ([y, mo, d].some((n) => Number.isNaN(n))) return null;
  const label = `${String(d).padStart(2, "0")}.${String(mo).padStart(2, "0")}.${String(y).padStart(4, "0")}`;
  return { iso: t, label };
}

function parseDateCell(raw: string): { iso: string; label: string } | null {
  return parseIsoDate(raw) ?? parseRuDate(raw);
}

function slugPart(s: string, maxLen: number): string {
  const t = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLen);
  return t || "x";
}

function makeShowId(iso: string, city: string, club: string, explicit?: string): string {
  const ex = explicit?.trim();
  if (ex) {
    const safe = ex.replace(/[^a-z0-9._-]/gi, "-").replace(/-+/g, "-").slice(0, 120);
    if (safe) return safe;
  }
  return `${iso}-${slugPart(city, 24)}-${slugPart(club, 24)}`;
}

/**
 * Первая строка — заголовки. Ожидаемые колонки (любой регистр, синонимы в HEADER_ALIASES):
 * `date_iso` или `date` / `дата` (YYYY-MM-DD или DD.MM.YYYY), `city` / `город`, `club` / `площадка`,
 * опционально `ticket_ref`, колонка «Ссылка на билеты» / `ticket_url` (только HTTPS),
 * `ticket_label`, `id`.
 */
export function parseShowsCsv(csvText: string): Show[] {
  const matrix = splitCsvRows(csvText);
  if (matrix.length < 2) return [];

  const headerCells = matrix[0]!.map((h) => h.trim());
  const colIndex: Partial<Record<keyof ParsedRow, number>> = {};
  headerCells.forEach((h, idx) => {
    const key = mapHeaderToKey(h);
    if (key && colIndex[key] === undefined) {
      colIndex[key] = idx;
    }
  });

  const need: (keyof ParsedRow)[] = ["dateRaw", "city", "club"];
  for (const k of need) {
    if (colIndex[k] === undefined) {
      return [];
    }
  }

  const shows: Show[] = [];
  for (let r = 1; r < matrix.length; r++) {
    const cells = matrix[r]!;
    const get = (k: keyof ParsedRow): string | undefined => {
      const i = colIndex[k];
      if (i === undefined) return undefined;
      return cells[i]?.trim();
    };

    const dateRaw = get("dateRaw");
    const city = get("city");
    const club = get("club");
    if (!dateRaw || !city || !club) continue;

    const parsed = parseDateCell(dateRaw);
    if (!parsed) continue;

    const ticketRefRaw = get("ticketRef");
    const ticketRef = ticketRefRaw ? ticketRefRaw.trim() : undefined;
    const ticketHrefRaw = get("ticketHrefRaw");
    let ticketHref: string | undefined;
    if (ticketHrefRaw) {
      try {
        ticketHref = assertHttpsTicketUrl(ticketHrefRaw).toString();
      } catch {
        ticketHref = undefined;
      }
    }
    const ticketLabel = get("ticketLabel")?.trim();
    const explicitId = get("id");

    const show: Show = {
      id: makeShowId(parsed.iso, city, club, explicitId),
      dateLabel: parsed.label,
      city: city.trim(),
      club: club.trim(),
      ...(ticketRef ? { ticketRef } : {}),
      ...(ticketHref ? { ticketHref } : {}),
      ...(ticketLabel ? { ticketLabel } : {}),
    };
    shows.push(show);
  }

  return sortShowsByDateAsc(shows);
}
