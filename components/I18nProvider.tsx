"use client";

import React, { createContext, useContext } from "react";
import type { Locale } from "../lib/i18n";

type Dictionary = Record<string, any>;

const I18nContext = createContext<{ dict: Dictionary; locale: Locale } | null>(null);

export default function I18nProvider({
  children,
  dict,
  locale,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  locale: Locale;
}) {
  return <I18nContext.Provider value={{ dict, locale }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}
