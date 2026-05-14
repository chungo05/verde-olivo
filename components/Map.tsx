"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="material-icons text-mosque">map</span>
    </div>
  ) 
});

export default function Map({ location }: { location: string }) {
  return <MapComponent location={location} />;
}
