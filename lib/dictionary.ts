import type { Locale } from "./i18n";

const dictionaries = {
  en: () => import("../locales/en.json").then((module) => module.default),
  es: () => import("../locales/es.json").then((module) => module.default),
  ko: () => import("../locales/ko.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en();
