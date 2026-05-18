"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const pinIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background:#006655;color:#fff;width:36px;height:36px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;">
           <span class="material-icons" style="font-size:18px;">place</span>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

/** Inner helper — updates map view when coords change */
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prev = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!prev.current || prev.current[0] !== lat || prev.current[1] !== lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
      prev.current = [lat, lng];
    }
  }, [lat, lng, map]);

  return null;
}

interface Props {
  latitude: number;
  longitude: number;
  location: string;
}

export default function AdminMapInner({ latitude, longitude, location }: Props) {
  const position: [number, number] = [latitude, longitude];

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%", minHeight: 220, zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={pinIcon}>
        <Popup>{location || "Property location"}</Popup>
      </Marker>
      <Recenter lat={latitude} lng={longitude} />
    </MapContainer>
  );
}
