"use client";

import Image from "next/image";
import Link from "next/link";
import { forYouProperties } from "@/lib/mock-data";
import { useTranslation } from "./I18nProvider";
import { translateTag, formatArea } from "@/lib/i18n";

export default function ForYou() {
  const { dict, locale } = useTranslation();

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-light text-nordic-dark">{dict.forYou.title}</h2>
          <p className="text-nordic-muted mt-2 text-base">
            {dict.forYou.subtitle}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {forYouProperties.map((property) => (
          <Link
            href={`/${locale}/properties/${property.slug}`}
            key={property.id}
            className="block bg-white rounded-2xl overflow-hidden shadow-soft border border-nordic-dark/5 group cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={property.image_url[0]}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-nordic-dark">
                {translateTag(property.tag ?? "", dict)}
              </div>
              <button 
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all shadow-sm z-10"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <span className="material-icons text-xl">favorite_border</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-2xl font-semibold text-nordic-dark">{property.title}</h3>
                <span className="text-2xl font-bold text-mosque">{property.price}</span>
              </div>
              <p className="text-nordic-muted text-sm flex items-center gap-1 mb-6">
                <span className="material-icons text-sm">place</span> {property.location}
              </p>
              <div className="flex items-center gap-6 pt-6 border-t border-nordic-dark/5">
                <div className="flex items-center gap-2 text-nordic-dark font-medium">
                  <span className="material-icons text-mosque">king_bed</span> {property.beds} {dict.common.beds}
                </div>
                <div className="flex items-center gap-2 text-nordic-dark font-medium">
                  <span className="material-icons text-mosque">bathtub</span> {property.baths} {dict.common.baths}
                </div>
                <div className="flex items-center gap-2 text-nordic-dark font-medium">
                  <span className="material-icons text-mosque">square_foot</span> {formatArea(property.area, locale)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

