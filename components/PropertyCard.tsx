"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/lib/mock-data";
import { useTranslation } from "./I18nProvider";

type PropertyCardProps = {
  property: Property;
  hiddenClass?: string;
};

export default function PropertyCard({ property, hiddenClass = "" }: PropertyCardProps) {
  const { dict: t } = useTranslation();
  const tagBgClass = property.tagColor === "mosque" ? "bg-mosque/90" : "bg-nordic-dark/90";

  return (
    <Link href={`/properties/${property.slug}`} className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col border border-nordic-dark/5 ${hiddenClass}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image_url[0]}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark z-10"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <span className="material-icons text-lg">favorite_border</span>
        </button>
        {property.tag && (
          <div className={`absolute bottom-3 left-3 ${tagBgClass} text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10`}>
            {property.tag}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.price}
            {property.isRent && <span className="text-sm font-normal text-nordic-muted">{t.common.mo}</span>}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}
          </div>
        </div>
      </div>
    </Link>
  );
}
