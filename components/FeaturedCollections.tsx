"use client";

import Image from "next/image";
import Link from "next/link";
import { featuredProperties } from "@/lib/mock-data";

export default function FeaturedCollections() {
  const property = featuredProperties[0];
  
  if (!property) return null;

  return (
    <section className="mb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-light text-nordic-dark">Featured Collections</h2>
          <p className="text-nordic-muted mt-2 text-base">Curated properties for the discerning eye.</p>
        </div>
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-mosque hover:opacity-70 transition-opacity"
        >
          View all <span className="material-icons text-sm">arrow_forward</span>
        </Link>
      </div>
      
      <Link href={`/properties/${property.slug}`} className="block relative group h-[600px] rounded-2xl overflow-hidden shadow-premium">
        <Image
          src={property.image_url[0]}
          alt={property.title}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Navigation Arrows */}
        <button 
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-nordic-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <span className="material-icons">chevron_left</span>
        </button>
        <button 
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-nordic-dark hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <span className="material-icons">chevron_right</span>
        </button>
        
        {/* Transparent Information Overlay Card */}
        <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[480px] bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2 text-mosque mb-4">
            <span className="material-symbols-outlined text-sm font-bold">auto_awesome</span>
            <span className="text-xs font-bold uppercase tracking-[0.15em]">{property.tag}</span>
          </div>
          <h3 className="text-4xl font-light text-nordic-dark mb-2 leading-tight">
            {property.title}
          </h3>
          <p className="text-nordic-muted text-base flex items-center gap-2 mb-8">
            <span className="material-icons text-xl">place</span> {property.location}
          </p>
          
          <div className="flex items-center gap-10 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-nordic-muted uppercase font-bold tracking-widest mb-1">Beds</span>
              <div className="flex items-center gap-2">
                <span className="material-icons text-mosque text-lg">king_bed</span>
                <span className="text-xl font-medium text-nordic-dark">{property.beds}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-nordic-dark/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-nordic-muted uppercase font-bold tracking-widest mb-1">Baths</span>
              <div className="flex items-center gap-2">
                <span className="material-icons text-mosque text-lg">bathtub</span>
                <span className="text-xl font-medium text-nordic-dark">{property.baths}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-nordic-dark/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-nordic-muted uppercase font-bold tracking-widest mb-1">Area</span>
              <div className="flex items-center gap-2">
                <span className="material-icons text-mosque text-lg">square_foot</span>
                <span className="text-xl font-medium text-nordic-dark">{property.area.split(" ")[0]} <span className="text-xs">{property.area.split(" ")[1] || "m²"}</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-nordic-dark">{property.price}</span>
            <button className="px-6 py-3 bg-mosque text-white rounded-xl font-semibold text-sm hover:bg-mosque/90 transition-all uppercase tracking-wider">
              Explore
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
}
