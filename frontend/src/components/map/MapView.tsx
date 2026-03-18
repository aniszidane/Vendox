// VendoX Frontend — components/map/MapView.tsx
'use client';

import { useEffect, useRef } from 'react';

interface Store {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  category?: { name: string; emoji?: string; color?: string };
  verificationStatus: string;
  status: string;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  stores: Store[];
  onStoreSelect: (store: Store) => void;
}

export default function MapView({ center, zoom = 13, stores, onStoreSelect }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapContainerRef.current!, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      // Zoom control (bottom-right)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;

      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;border-radius:50%;background:#0D7490;border:3px solid white;box-shadow:0 0 0 4px rgba(13,116,144,0.2);position:relative;">
                <div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(13,116,144,0.15);animation:pulse 2s ease infinite;"></div>
               </div>`,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker(center, { icon: userIcon }).addTo(map);

      // Add store markers
      stores.forEach((store) => {
        if (!store.lat || !store.lng) return;

        const color = store.category?.color || '#0D7490';
        const emoji = store.category?.emoji || '🏪';
        const isOpen = store.status === 'OPEN';
        const isVerified = store.verificationStatus === 'VERIFIED';

        const icon = L.divIcon({
          html: `<div style="
            width: 44px; height: 44px;
            background: white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid ${color};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex; align-items: center; justify-content: center;
            position: relative;
          ">
            <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">${emoji}</span>
            ${isOpen ? `<span style="position:absolute;bottom:0;right:0;width:10px;height:10px;background:#22C55E;border-radius:50%;border:2px solid white;transform:rotate(45deg);"></span>` : ''}
            ${isVerified ? `<span style="position:absolute;top:0;right:0;width:12px;height:12px;background:#0D7490;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1.5px solid white;transform:rotate(45deg);font-size:7px;color:white;">✓</span>` : ''}
          </div>`,
          className: '',
          iconSize: [44, 44],
          iconAnchor: [22, 44],
          popupAnchor: [0, -44],
        });

        const marker = L.marker([store.lat, store.lng], { icon })
          .addTo(map)
          .on('click', () => onStoreSelect(store));

        markersRef.current.push(marker);
      });
    })();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when stores change
  useEffect(() => {
    if (!mapRef.current) return;
    // In production: diff and update markers
  }, [stores]);

  return (
    <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
  );
}
