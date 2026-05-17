"use client";

import Image from "next/image";
import Link from "next/link";
import { getAllProperties, Property } from "@/lib/mock-data";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const type = searchParams.get("type") || "All";

  const filteredProperties = useMemo(() => {
    let properties = getAllProperties();

    if (query) {
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
      );
    }

    if (type !== "All") {
      // In a real app we'd filter by propertyType, but for mock data we check if the type is in the title.
      // e.g. "Apartment", "House", "Villa", "Penthouse"
      properties = properties.filter((p) =>
        p.title.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Deduplicate properties by ID in case they were duplicated in the mock lists
    const uniqueProps = new Map<string, Property>();
    properties.forEach((p) => uniqueProps.set(p.id, p));
    
    return Array.from(uniqueProps.values());
  }, [query, type]);

  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-light text-nordic-dark">Search Results</h2>
          <p className="text-nordic-muted mt-2 text-base">
            {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found.
          </p>
        </div>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-nordic-dark/5 rounded-2xl border border-nordic-dark/10">
          <span className="material-icons text-5xl text-nordic-muted mb-4 block">search_off</span>
          <h3 className="text-xl font-medium text-nordic-dark mb-2">No properties found</h3>
          <p className="text-nordic-muted">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProperties.map((property) => (
            <Link
              href={`/properties/${property.slug}`}
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
                {property.tag && (
                  <div className={`absolute top-4 left-4 ${property.tagColor === 'mosque' ? 'bg-mosque text-white' : 'bg-white/90 text-nordic-dark'} backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                    {property.tag}
                  </div>
                )}
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
                    <span className="material-icons text-mosque">king_bed</span> {property.beds} Beds
                  </div>
                  <div className="flex items-center gap-2 text-nordic-dark font-medium">
                    <span className="material-icons text-mosque">bathtub</span> {property.baths} Baths
                  </div>
                  <div className="flex items-center gap-2 text-nordic-dark font-medium">
                    <span className="material-icons text-mosque">square_foot</span> {property.area}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
