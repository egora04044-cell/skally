import type { Metadata } from "next";

import { LegalPageShell } from "@/components/LegalPageShell";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Политика использования cookie",
  description: `Сведения о cookie на сайте ${site.artistName}`,
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Политика использования файлов cookie">
      <p>
        Настоящая политика описывает использование файлов cookie и аналогичных технологий на сайте {site.artistName}{" "}
        (далее — Сайт).
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold text-white">1. Что такое cookie</h2>
      <p>
        Cookie — небольшие фрагменты данных, которые браузер сохраняет на устройстве пользователя. Они помогают
        распознавать браузер, сохранять настройки или обеспечивать работу сессии.
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold text-white">2. Какие cookie используются</h2>
      <p>
        В текущей версии Сайта на стороне приложения могут использоваться строго необходимые (технические) cookie или
        локальное хранилище браузера для:
      </p>
      <ul className="list-inside list-disc space-y-2 text-zinc-300">
        <li>
          запоминания факта ознакомления с уведомлением о cookie (локальное хранилище, ключ хранения задаётся в коде
          компонента уведомления);
        </li>
        <li>
          иных функций, без которых показ страницы невозможен или существенно ухудшается (если будут добавлены).
        </li>
      </ul>
      <p>
        При подключении сервисов аналитики (например, Яндекс.Метрики, Google Analytics и т. п.) перечень cookie и сроки
        хранения необходимо дополнить и при необходимости запросить согласие пользователя в порядке, согласованном с
        юристом.
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold text-white">3. Управление cookie</h2>
      <p>
        Вы можете удалить или заблокировать cookie в настройках браузера. Отключение строго необходимых cookie может
        привести к некорректной работе отдельных элементов Сайта.
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold text-white">4. Иные технологии</h2>
      <p>
        Сайт может содержать встроенный контент сторонних сервисов (социальные сети, видеохостинги). Такие сервисы могут
        устанавливать собственные cookie в соответствии со своими политиками. Оператор Сайта не контролирует их объём;
        ознакомьтесь с правилами соответствующего сервиса.
      </p>

      <h2 className="mt-8 font-display text-lg font-semibold text-white">5. Контакты</h2>
      <p>
        Вопросы по настоящей политике:{" "}
        <strong className="text-zinc-200">
          {legal.contactEmail || "— укажите NEXT_PUBLIC_LEGAL_EMAIL —"}
        </strong>
        .
      </p>
    </LegalPageShell>
  );
}
