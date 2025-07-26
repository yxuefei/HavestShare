import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  readonly?: boolean;
  className?: string;
}

export function Map({
  latitude = 38.5,
  longitude = -122.8,
  onLocationSelect,
  readonly = false,
  className = "h-64 rounded-lg border border-gray-300",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS and JS if not already loaded
    if (!window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = window.L.map(mapRef.current).setView([latitude, longitude], 10);
      
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Add marker if coordinates are provided
      if (latitude && longitude) {
        markerRef.current = window.L.marker([latitude, longitude]).addTo(map);
      }

      // Add click handler if not readonly
      if (!readonly && onLocationSelect) {
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          
          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          // Add new marker
          markerRef.current = window.L.marker([lat, lng]).addTo(map);
          onLocationSelect(lat, lng);
        });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, onLocationSelect, readonly]);

  if (!window.L && typeof window !== "undefined") {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
