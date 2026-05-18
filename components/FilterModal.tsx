"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/components/I18nProvider";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AMENITIES_LIST = [
  { id: "pool", icon: "pool", label: "Swimming Pool" },
  { id: "gym", icon: "fitness_center", label: "Gym" },
  { id: "parking", icon: "local_parking", label: "Parking" },
  { id: "ac", icon: "ac_unit", label: "Air Conditioning" },
  { id: "wifi", icon: "wifi", label: "High-speed Wifi" },
  { id: "patio", icon: "deck", label: "Patio / Terrace" },
];

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict: t } = useTranslation();

  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("type") || "Any Type");
  const [bedrooms, setBedrooms] = useState(parseInt(searchParams.get("beds") || "0", 10));
  const [bathrooms, setBathrooms] = useState(parseInt(searchParams.get("baths") || "0", 10));
  
  // Amenities from URL if any, otherwise default to pool and wifi if no filters applied yet
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.get("amenities") 
      ? searchParams.get("amenities")!.split(",") 
      : (Array.from(searchParams.keys()).length === 0 ? ["pool", "wifi"] : [])
  );

  // Sync state when modal opens if URL changed externally
  useEffect(() => {
    if (isOpen) {
      setLocation(searchParams.get("location") || "");
      setMinPrice(searchParams.get("minPrice") || "");
      setMaxPrice(searchParams.get("maxPrice") || "");
      setPropertyType(searchParams.get("type") || "Any Type");
      setBedrooms(parseInt(searchParams.get("beds") || "0", 10));
      setBathrooms(parseInt(searchParams.get("baths") || "0", 10));
      setAmenities(
        searchParams.get("amenities") 
          ? searchParams.get("amenities")!.split(",") 
          : (Array.from(searchParams.keys()).length === 0 ? ["pool", "wifi"] : [])
      );
    }
  }, [isOpen, searchParams]);

  if (!isOpen) return null;

  const toggleAmenity = (amenityId: string) => {
    setAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleClearFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("Any Type");
    setBedrooms(0);
    setBathrooms(0);
    setAmenities([]);
    
    // Also clear from URL
    router.push("/");
    onClose();
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (location) params.set("location", location); else params.delete("location");
    if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
    if (propertyType !== "Any Type") params.set("type", propertyType); else params.delete("type");
    if (bedrooms > 0) params.set("beds", bedrooms.toString()); else params.delete("beds");
    if (bathrooms > 0) params.set("baths", bathrooms.toString()); else params.delete("baths");
    if (amenities.length > 0) params.set("amenities", amenities.join(",")); else params.delete("amenities");

    router.push(`/?${params.toString()}`);
    onClose();
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar for clean modal look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
      
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Container Wrapper for Centering */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        
        {/* Main Modal Container */}
        <main className="pointer-events-auto relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t.filters.title}</h1>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <span className="material-icons">close</span>
            </button>
          </header>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
            {/* Section 1: Location */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t.filters.location}</label>
              <div className="relative group">
                <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-nordic-light/30 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm" 
                  placeholder="City, neighborhood, or address" 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </section>
            
            {/* Section 2: Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.filters.priceRange}</label>
                <span className="text-sm font-medium text-mosque">
                  ${minPrice ? Number(minPrice).toLocaleString() : "0"} – ${maxPrice ? Number(maxPrice).toLocaleString() : t.filters.any}
                </span>
              </div>
              <div className="relative h-12 flex items-center mb-6">
                {/* Dynamic Slider Visual */}
                <div className="absolute w-full h-1.5 bg-nordic-light/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-mosque absolute transition-all duration-150"
                    style={{
                      left: `${Math.min(Math.max((parseInt(minPrice.toString().replace(/[^0-9]/g, '')) || 0) / 10000000 * 100, 0), 100)}%`,
                      width: `${Math.min(Math.max(((parseInt(maxPrice.toString().replace(/[^0-9]/g, '')) || 10000000) - (parseInt(minPrice.toString().replace(/[^0-9]/g, '')) || 0)) / 10000000 * 100, 0), 100)}%`
                    }}
                  ></div>
                </div>
                
                {/* Functional Range Inputs */}
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={parseInt(minPrice.toString().replace(/[^0-9]/g, '')) || 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const currentMax = parseInt(maxPrice.toString().replace(/[^0-9]/g, '')) || 10000000;
                    if (val <= currentMax) setMinPrice(val.toString());
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md z-20"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={parseInt(maxPrice.toString().replace(/[^0-9]/g, '')) || 10000000}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const currentMin = parseInt(minPrice.toString().replace(/[^0-9]/g, '')) || 0;
                    if (val >= currentMin) setMaxPrice(val.toString());
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md z-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nordic-light/30 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t.filters.minPrice}</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm" 
                      type="text" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>
                <div className="bg-nordic-light/30 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                  <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">{t.filters.maxPrice}</label>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <input 
                      className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm" 
                      type="text" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>
              </div>
            </section>
            
            {/* Section 3: Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.filters.propertyType}</label>
                <div className="relative">
                  <select 
                    className="w-full bg-nordic-light/30 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="Any Type">{t.filters.anyType}</option>
                    <option value="House">{t.filters.house}</option>
                    <option value="Apartment">{t.filters.apartment}</option>
                    <option value="Condo">{t.filters.condo}</option>
                    <option value="Townhouse">{t.filters.townhouse}</option>
                    <option value="Villa">{t.filters.villa}</option>
                    <option value="Penthouse">{t.filters.penthouse}</option>
                  </select>
                  <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                </div>
              </div>
              
              {/* Rooms */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t.filters.bedrooms}</span>
                  <div className="flex items-center space-x-3 bg-nordic-light/30 rounded-full p-1">
                    <button 
                      onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                      disabled={bedrooms === 0}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{bedrooms === 0 ? t.filters.any : `${bedrooms}+`}</span>
                    <button 
                      onClick={() => setBedrooms(bedrooms + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{t.filters.bathrooms}</span>
                  <div className="flex items-center space-x-3 bg-nordic-light/30 rounded-full p-1">
                    <button 
                      onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                      disabled={bathrooms === 0}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <span className="material-icons text-base">remove</span>
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{bathrooms === 0 ? t.filters.any : `${bathrooms}+`}</span>
                    <button 
                      onClick={() => setBathrooms(bathrooms + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <span className="material-icons text-base">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Section 4: Amenities */}
            <section>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t.filters.amenities}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES_LIST.map((amenity) => {
                  const isActive = amenities.includes(amenity.id);
                  const baseClasses = "h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all";
                  const activeClasses = "border-mosque bg-mosque/5 text-mosque font-medium hover:bg-mosque/10";
                  const inactiveClasses = "border-gray-200 bg-white text-gray-600 hover:border-gray-300";

                  return (
                    <label key={amenity.id} className="cursor-pointer group relative">
                      <input 
                        checked={isActive}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="sr-only" 
                        type="checkbox"
                      />
                      <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                        <span className={`material-icons text-lg ${isActive ? '' : 'text-gray-400 group-hover:text-gray-500'}`}>
                          {amenity.icon}
                        </span>
                        {t.filters.amenitiesList[amenity.id as keyof typeof t.filters.amenitiesList]}
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button 
              onClick={handleClearFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
            >
              {t.filters.clearAll}
            </button>
            <button 
              onClick={handleApplyFilters}
              className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
            >
              {t.filters.showProperties}
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
