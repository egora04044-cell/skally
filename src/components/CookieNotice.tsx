"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";

/**
 * Флаг закрытия баннера в localStorage; чувствительные данные и сессии сюда не записываются.
 * Политика: `/cookies`.
 */
const STORAGE_KEY = "scally_cookie_notice_v1";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !window.localStorage.getItem(STORAGE_KEY)) {
        startTransition(() => {
          setVisible(true);
        });
      }
    } catch {
      startTransition(() => {
        setVisible(true);
      });
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-notice-title"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-white/15 bg-zinc-950/95 px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:py-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 text-xs text-zinc-400 sm:text-sm">
          <p
            id="cookie-notice-title"
            className="font-medium text-zinc-200"
          >
            Файлы cookie
          </p>
          <p className="mt-1">
            Сайт использует локальное хранилище браузера для запоминания этого уведомления и может применять
            технические cookie для стабильной работы. Подробнее — в{" "}
            <Link
              href="/cookies"
              className="text-white underline decoration-white/30 underline-offset-2 hover:decoration-white/60"
            >
              политике cookie
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded border border-white/25 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white/45 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:text-sm"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
