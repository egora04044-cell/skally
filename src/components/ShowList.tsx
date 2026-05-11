import type { Show } from "@/lib/types";

type Props = {
  shows: Show[];
  /** Внешняя ссылка, если у концерта ещё нет `ticketRef` */
  fallbackTicketHref?: string;
};

const linkClass =
  "inline-flex min-h-11 min-w-0 shrink-0 items-center justify-center rounded-lg border border-white/30 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:min-w-[10.5rem] sm:px-5 sm:py-3 sm:text-sm";

const disabledClass =
  "inline-flex min-h-11 min-w-0 shrink-0 cursor-default items-center justify-center rounded-lg border border-white/15 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-500 sm:min-w-[10.5rem] sm:px-5 sm:py-3 sm:text-sm";

export function ShowList({ shows, fallbackTicketHref }: Props) {
  if (shows.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">
        Даты мероприятий появятся здесь.
      </p>
    );
  }

  return (
    <ol className="mx-auto flex w-full max-w-5xl flex-col">
      {shows.map((show) => {
        const refHref = show.ticketRef
          ? `/go/tickets/${encodeURIComponent(show.ticketRef)}`
          : undefined;
        const fallback = !refHref && fallbackTicketHref ? fallbackTicketHref : undefined;
        const href = refHref ?? fallback;
        const external = Boolean(refHref || fallback);

        return (
          <li
            key={show.id}
            className="border-b border-white/10 py-5 first:pt-0 last:border-b-0 sm:py-7"
          >
            <div className="flex flex-row items-center justify-between gap-3 sm:gap-8">
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] uppercase leading-none tracking-[0.2em] text-zinc-500 sm:text-xs">
                  {show.dateLabel}
                </p>
                <h2 className="mt-1.5 font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                  {show.city}
                </h2>
                <p className="mt-0.5 text-xs uppercase leading-snug tracking-wide text-zinc-400 sm:mt-1 sm:text-sm">
                  {show.club}
                </p>
              </div>
              {href ? (
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={linkClass}
                >
                  {show.ticketLabel ?? "БИЛЕТЫ"}
                </a>
              ) : (
                <span
                  className={disabledClass}
                  aria-label="Ссылка на билеты не настроена"
                >
                  {show.ticketLabel ?? "БИЛЕТЫ"}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
