"use client";

import dynamic from "next/dynamic";

const AdminMapInner = dynamic(() => import("./AdminMapInner"), {
  ssr: false,
  loading: () => (
    <div className="pf-map-loading">
      <div className="pf-spinner" />
    </div>
  ),
});

interface Props {
  latitude: number;
  longitude: number;
  location: string;
}

export default function AdminMapPreview({ latitude, longitude, location }: Props) {
  return <AdminMapInner latitude={latitude} longitude={longitude} location={location} />;
}
