import Link from "next/link";

const linkClass =
  "text-xs text-zinc-500 transition hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:text-sm";

export function LegalFooterLinks() {
  return (
    <nav
      aria-label="Юридическая информация"
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
    >
      <Link
        className={linkClass}
        href="/privacy"
      >
        Политика конфиденциальности
      </Link>
    </nav>
  );
}
