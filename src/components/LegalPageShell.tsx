import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function LegalPageShell({ title, children }: Props) {
  return (
    <div className="min-h-svh bg-black text-zinc-100">
      <header className="border-b border-white/10 px-4 py-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            На главную
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10 pb-24 sm:py-14">
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-zinc-500">
          Документ носит информационный характер. При необходимости уточните формулировки с
          юристом с учётом вашей фактической деятельности и статуса оператора ПДн.
        </p>
        <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
          {children}
        </div>
      </main>
    </div>
  );
}
