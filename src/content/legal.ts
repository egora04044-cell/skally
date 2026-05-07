/**
 * Реквизиты оператора персональных данных и контакты по юр. страницам.
 * Заполните перед продакшеном. Тексты страниц — шаблоны, не замена консультации юриста.
 */

/** E-mail для политики ПДн, cookie и оферты, если не задан NEXT_PUBLIC_LEGAL_EMAIL. */
const DEFAULT_LEGAL_CONTACT_EMAIL = "business@trustabovefame.ru";

export const legal = {
  /** Наименование / ФИО оператора ПДн (как в реестре при необходимости регистрации) */
  operatorName: "Scally Milano",
  /**
   * E-mail для запросов субъекта ПДн и вопросов по политике.
   * По умолчанию — business@trustabovefame.ru; переопределите через NEXT_PUBLIC_LEGAL_EMAIL при необходимости.
   */
  contactEmail:
    typeof process.env.NEXT_PUBLIC_LEGAL_EMAIL === "string" &&
    process.env.NEXT_PUBLIC_LEGAL_EMAIL.trim() !== ""
      ? process.env.NEXT_PUBLIC_LEGAL_EMAIL.trim()
      : DEFAULT_LEGAL_CONTACT_EMAIL,
  /** Почтовый адрес оператора (если применимо) */
  postalAddress:
    typeof process.env.NEXT_PUBLIC_OPERATOR_ADDRESS === "string"
      ? process.env.NEXT_PUBLIC_OPERATOR_ADDRESS
      : "",
} as const;
