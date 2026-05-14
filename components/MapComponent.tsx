"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for leaflet's default icon path issues in some environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background-color: #006655; color: white; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;">
          <span class="material-icons" style="font-size: 16px;">apartment</span>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapComponent({ location }: { location: string }) {
  // Using a fixed coordinate for the demo
  const position: [number, number] = [37.4419, -122.1430];

  return (
    <div className="w-full h-full min-h-[300px] z-0 relative rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full absolute inset-0 z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
