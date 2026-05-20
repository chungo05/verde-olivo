"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type Property } from "@/lib/mock-data";
import { formatArea, translateTag, type Locale } from "@/lib/i18n";
import FavoriteButton from "./FavoriteButton";

interface FavDict {
  favorites: {
    title: string;
    subtitlePlural: string;
    subtitleSingular: string;
    subtitleEmpty: string;
    bookVisit: string;
    scheduleTour: string;
    emptyTitle: string;
    emptySubtitle: string;
    browse: string;
    discoverMoreTitle: string;
    discoverMoreSub: string;
  };
  common: { mo: string; tags: Record<string, string> };
}

export default function FavoritesGrid({
  initialProperties,
  locale,
  dict,
}: {
  initialProperties: Property[];
  locale: string;
  dict: FavDict;
}) {
  const [properties, setProperties] = useState(initialProperties);
  const fav = dict.favorites;
  const count = properties.length;

  const subtitle =
    count === 0
      ? fav.subtitleEmpty
      : count === 1
        ? fav.subtitleSingular
        : fav.subtitlePlural.replace("{{count}}", String(count));

  return (
    <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-nordic-dark tracking-tight mb-2">
          {fav.title}
        </h1>
        <p className="text-nordic-dark/70">{subtitle}</p>
      </div>

      {count === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-hint-green flex items-center justify-center mb-6">
            <span className="material-icons text-mosque text-4xl">favorite_border</span>
          </div>
          <h2 className="text-2xl font-bold text-nordic-dark mb-3">{fav.emptyTitle}</h2>
          <p className="text-nordic-dark/60 mb-8 max-w-xs">{fav.emptySubtitle}</p>
          <Link
            href={`/${locale}`}
            className="px-6 py-3 bg-mosque text-white font-medium rounded-lg shadow-lg shadow-mosque/20 hover:shadow-mosque/40 transition-all"
          >
            {fav.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 border border-nordic-dark/5 flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={property.image_url[0]}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <FavoriteButton
                  propertyId={property.id}
                  className="absolute top-3 right-3 z-10"
                  initialFavorited={true}
                  onUnfavorite={() =>
                    setProperties((prev) => prev.filter((p) => p.id !== property.id))
                  }
                />
                {property.tag && (
                  <div
                    className={`absolute bottom-3 left-3 ${
                      property.tagColor === "mosque" ? "bg-mosque/90" : "bg-nordic-dark/90"
                    } text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10`}
                  >
                    {translateTag(property.tag, dict)}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-nordic-dark">
                    {property.price}
                    {property.isRent && (
                      <span className="text-sm font-normal text-nordic-dark/60">
                        {dict.common.mo}
                      </span>
                    )}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${
                      property.isRent
                        ? "bg-blue-50 text-blue-700"
                        : "bg-hint-green text-mosque"
                    }`}
                  >
                    {property.isRent ? dict.common.tags.forRent : dict.common.tags.forSale}
                  </span>
                </div>

                <p className="text-nordic-dark/60 text-sm mb-4 truncate">{property.location}</p>

                <div className="flex items-center justify-between text-nordic-dark/50 text-xs font-medium mb-6">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">king_bed</span>
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">bathtub</span>
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-mosque text-sm">square_foot</span>
                    <span>{formatArea(property.area, locale as Locale)}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/${locale}/properties/${property.slug}`}
                    className="w-full py-2.5 rounded-lg border border-mosque text-mosque font-medium text-sm hover:bg-mosque hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{property.isRent ? fav.scheduleTour : fav.bookVisit}</span>
                    <span className="material-icons text-base">
                      {property.isRent ? "calendar_today" : "arrow_forward"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <Link
            href={`/${locale}`}
            className="group bg-hint-green/30 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 border-2 border-dashed border-mosque/30 hover:border-mosque flex flex-col h-full items-center justify-center min-h-[400px] cursor-pointer text-center p-6"
          >
            <div className="w-16 h-16 rounded-full bg-hint-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="material-icons text-mosque text-3xl">add</span>
            </div>
            <h3 className="text-xl font-bold text-nordic-dark mb-2">{fav.discoverMoreTitle}</h3>
            <p className="text-nordic-dark/70 text-sm mb-6 max-w-[200px]">{fav.discoverMoreSub}</p>
            <span className="px-6 py-2.5 rounded-lg bg-mosque text-white font-medium text-sm shadow-lg shadow-mosque/30 group-hover:shadow-mosque/50 transition-all">
              {fav.browse}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
