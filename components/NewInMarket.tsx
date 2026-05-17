"use client";

import { newMarketProperties } from "@/lib/mock-data";
import PropertyCard from "./PropertyCard";
import { useTranslation } from "./I18nProvider";

export default function NewInMarket() {
  const { dict: t } = useTranslation();
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t.newInMarket.title}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t.newInMarket.subtitle}
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic-dark/5">
          <button className="px-4 py-1.5 rounded-md text-sm font-semibold bg-nordic-dark text-white shadow-sm">
            {t.common.all}
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-nordic-muted hover:text-nordic-dark">
            {t.common.buy}
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-semibold text-nordic-muted hover:text-nordic-dark">
            {t.common.rent}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newMarketProperties.map((property, index) => {
          let hiddenClass = "";
          if (index === 4) {
            hiddenClass = "hidden xl:flex";
          } else if (index === 5) {
            hiddenClass = "hidden lg:flex";
          }

          return (
            <PropertyCard
              key={property.id}
              property={property}
              hiddenClass={hiddenClass}
            />
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-semibold rounded-lg transition-all hover:shadow-md uppercase tracking-wider text-xs">
          {t.newInMarket.loadMore}
        </button>
      </div>
    </section>
  );
}
