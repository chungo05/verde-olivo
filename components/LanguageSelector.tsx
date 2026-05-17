"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "./I18nProvider";

const LANGUAGES = [
  { code: "en", name: "EN", flag: "🇺🇸" },
  { code: "es", name: "ES", flag: "🇪🇸" },
  { code: "ko", name: "KO", flag: "🇰🇷" },
];

export default function LanguageSelector() {
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Replace the current locale in the pathname
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-nordic-dark hover:bg-black/5 rounded-md transition-colors"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <span className="material-icons text-sm">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-nordic-dark/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-mosque/10 transition-colors ${
                locale === lang.code ? "bg-mosque/5 text-mosque font-semibold" : "text-nordic-dark"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
