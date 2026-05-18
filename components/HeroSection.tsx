"use client";

import { useState } from "react";
import FilterModal from "./FilterModal";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/components/I18nProvider";

export default function HeroSection() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { dict } = useTranslation();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const currentType = searchParams.get("type") || "All";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString();
  };

  const chipBaseClasses = "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5 shadow-sm";
  const chipActiveClasses = "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10";
  const chipInactiveClasses = "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5 transition-all";

  const types = [
    { key: "All", label: dict.hero.allTypes },
    { key: "House", label: dict.hero.house },
    { key: "Apartment", label: dict.hero.apartment },
    { key: "Villa", label: dict.hero.villa },
    { key: "Condo", label: dict.hero.condo },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
          {dict.hero.titlePart1}{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">{dict.hero.titlePart2}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>
        <p className="text-lg text-nordic-muted/80">{dict.hero.subtitle}</p>
        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={dict.hero.searchPlaceholder}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-semibold rounded-lg transition-all flex items-center justify-center">
            {dict.common.search}
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {types.map((type) => (
            <Link
              key={type.key}
              href={`${pathname}?${createQueryString("type", type.key)}`}
              className={`${chipBaseClasses} ${currentType === type.key ? chipActiveClasses : chipInactiveClasses}`}
            >
              {type.label}
            </Link>
          ))}
          <div className="w-px h-6 bg-nordic-dark/10 mx-2"></div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base">tune</span> {dict.common.filters}
          </button>
        </div>
      </div>
      
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </section>
  );
}
