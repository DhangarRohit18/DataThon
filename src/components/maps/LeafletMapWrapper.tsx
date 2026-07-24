'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MOCK_HOTSPOTS } from '../../utils/mockData';

export default function LeafletMapWrapper() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Only load leaflet on client-side
    if (typeof window === 'undefined') return;

    let activeInstance: any = null;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        // Import leaflet stylesheet dynamically
        await import('leaflet/dist/leaflet.css');

        if (!mapContainerRef.current) return;
        if ((mapContainerRef.current as any)._leaflet_id) return;

        // Initialize Map centered on Karnataka (approx. 15.3173° N, 75.7139° E)
        const map = L.map(mapContainerRef.current, {
          center: [15.1, 75.8],
          zoom: 7,
          zoomControl: true,
          layers: []
        });

        activeInstance = map;
        mapInstanceRef.current = map;

        // Add CartoDB Dark Matter tile layer for an extremely premium dark theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        // Add markers and circles representing crime hotspots
        MOCK_HOTSPOTS.forEach((hotspot) => {
          const color = hotspot.density === 'HIGH' ? '#ef4444' : hotspot.density === 'MEDIUM' ? '#f59e0b' : '#3b82f6';
          
          // Crime radius circle
          L.circle([hotspot.lat, hotspot.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.25,
            radius: hotspot.radius * 1.5
          }).addTo(map);

          // Marker pin
          const pinMarkup = `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-ping absolute" style="background-color: ${color}"></div>
                             <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center text-[8px] font-bold text-white" style="background-color: ${color}">!</div>`;

          const customIcon = L.divIcon({
            html: pinMarkup,
            className: 'custom-leaflet-pin',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          L.marker([hotspot.lat, hotspot.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-xs font-sans text-slate-100 p-1">
                <p class="font-bold border-b border-slate-700 pb-1 mb-1">${hotspot.station}</p>
                <p><span class="text-slate-400">District:</span> ${hotspot.district}</p>
                <p><span class="text-slate-400">Primary Incident:</span> ${hotspot.primaryCrime}</p>
                <p><span class="text-slate-400">Crime Density:</span> <span class="font-bold font-mono" style="color: ${color}">${hotspot.density}</span></p>
                <p><span class="text-slate-400">Active Cases:</span> ${hotspot.crimeCount}</p>
              </div>
            `, {
              className: 'custom-leaflet-popup-theme'
            });
        });

        setMapLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Leaflet Map:', err);
      }
    };

    initMap();

    return () => {
      if (activeInstance) {
        activeInstance.remove();
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-[500px] w-full">
      {/* Map header control panel */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>Karnataka State GIS Intelligence Map</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
              Live Feed
            </span>
          </h3>
          <p className="text-[10px] text-slate-400">Plotting active crime radii, station jurisdictions, and tactical heat zones</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>High Density (&gt;30 Cases)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Medium Density (15-30 Cases)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            Loading Geospatial GIS layers...
          </div>
        )}
      </div>

      {/* Pop-up customization stylesheet injected to ensure leaflet matches our dark UI */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: #0f172a !important; /* slate-900 */
          color: #f1f5f9 !important; /* slate-100 */
          border: 1px solid #334155 !important; /* slate-700 */
          border-radius: 6px !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
}
