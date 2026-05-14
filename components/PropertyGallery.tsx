"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Mobile/Tablet Gallery with Swiper */}
      <div className="block lg:hidden rounded-xl overflow-hidden shadow-sm">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          className="aspect-[4/3] w-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:block space-y-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
          <Image
            src={images[selectedIndex]}
            alt="Main property image"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Premium</span>
            <span className="bg-white/90 backdrop-blur text-nordic-dark text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">New</span>
          </div>
          <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic-dark px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
            <span className="material-icons text-sm">grid_view</span>
            View All Photos
          </button>
        </div>
        
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedIndex(idx)}
                className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer snap-start transition-all ${idx === selectedIndex ? 'ring-2 ring-mosque ring-offset-2 ring-offset-background-light opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <div className="relative w-full h-full">
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
