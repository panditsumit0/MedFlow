'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { FacilitySummary, RegionalShortageAlert } from '@/types';
import { MapPin, AlertOctagon, AlertTriangle, ShieldCheck, Info, Layers, Eye } from 'lucide-react';

interface RajasthanLeafletMapProps {
  facilities: FacilitySummary[];
  regionalAlerts: RegionalShortageAlert[];
}

export default function RajasthanLeafletMap({
  facilities,
  regionalAlerts,
}: RajasthanLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      // Dynamically load Leaflet on client side
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Rajasthan center: ~26.6° N, 74.8° E with zoom 7
      const map = L.map(mapContainerRef.current, {
        center: [26.6, 74.8],
        zoom: 7,
        scrollWheelZoom: true,
      });

      mapInstanceRef.current = map;

      // Professional light tile layer (CartoDB Positron / OpenStreetMap)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // Add markers for all 10 facilities
      facilities.forEach((item) => {
        const { facility, overall_risk, critical_medicines_count, most_urgent_medicine } = item;

        // Color coding
        let pinColor = '#10b981'; // SAFE green
        let pulseClass = '';
        if (overall_risk === 'CRITICAL') {
          pinColor = '#ef4444'; // Red
          pulseClass = 'animate-ping opacity-75';
        } else if (overall_risk === 'HIGH') {
          pinColor = '#f97316'; // Orange
        } else if (overall_risk === 'WARNING') {
          pinColor = '#f59e0b'; // Amber
        }

        // Custom Leaflet DivIcon with pulse indicator
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              ${
                overall_risk === 'CRITICAL'
                  ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${pinColor}; opacity: 0.4;" class="${pulseClass}"></div>`
                  : ''
              }
              <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background-color: ${pinColor}; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
                ${critical_medicines_count > 0 ? critical_medicines_count : '✓'}
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -18],
        });

        // Popup HTML content matching requirements
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <div>
                <strong style="font-size: 13px; color: #0f172a; display: block;">${facility.name}</strong>
                <span style="font-size: 11px; color: #64748b;">${facility.city} • ${facility.facility_type}</span>
              </div>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background-color: ${
                overall_risk === 'CRITICAL'
                  ? '#fee2e2; color: #991b1b;'
                  : overall_risk === 'HIGH'
                  ? '#ffedd5; color: #9a3412;'
                  : overall_risk === 'WARNING'
                  ? '#fef3c7; color: #92400e;'
                  : '#dcfce7; color: #166534;'
              }">${overall_risk}</span>
            </div>

            <div style="margin-top: 8px; padding: 8px; background: #f8fafc; border-radius: 6px; font-size: 11px; line-height: 1.4;">
              <div style="margin-bottom: 4px;">
                <span style="color: #64748b;">Critical Medicines:</span> 
                <strong style="color: ${critical_medicines_count > 0 ? '#b91c1c' : '#15803d'}">${critical_medicines_count}</strong>
              </div>
              ${
                most_urgent_medicine
                  ? `<div>
                      <span style="color: #64748b;">Most Urgent:</span> 
                      <strong style="color: #0f172a;">${most_urgent_medicine.name}</strong>
                      <span style="display: block; color: #b91c1c; font-weight: 700; margin-top: 2px;">Only ${most_urgent_medicine.days_remaining} days left!</span>
                    </div>`
                  : `<div style="color: #15803d;">All monitored stock levels safe.</div>`
              }
            </div>

            <div style="margin-top: 8px; font-size: 10px; color: #94a3b8; text-align: right;">
              Coords: ${facility.latitude.toFixed(4)}°N, ${facility.longitude.toFixed(4)}°E
            </div>
          </div>
        `;

        const marker = L.marker([facility.latitude, facility.longitude], {
          icon: customIcon,
        })
          .addTo(map)
          .bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedFacilityId(facility.id);
        });

        markersRef.current.set(facility.id, marker);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [facilities]);

  // Handle focus from side facility cards
  const handleFocusFacility = (f: FacilitySummary) => {
    setSelectedFacilityId(f.facility.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([f.facility.latitude, f.facility.longitude], 10, {
        duration: 1.2,
      });
      const marker = markersRef.current.get(f.facility.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaflet Map Card (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Map Header */}
          <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">
                  Rajasthan Healthcare Facility Shortage Map
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time geographic risk classification across 10 monitored district hospitals &amp; PHCs
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical (0-3d)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (4-7d)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe (&gt;14d)
              </span>
            </div>
          </div>

          {/* Actual Map element */}
          <div
            ref={mapContainerRef}
            className="w-full h-[540px] z-0"
            style={{ background: '#f8fafc' }}
          />

          {/* Map Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Click any marker to inspect critical medicines, days remaining, and inventory status.</span>
            <span className="font-semibold text-slate-700">10 Facilities Monitored</span>
          </div>
        </div>

        {/* Right Sidebar: Facility Quick Navigator (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col h-[610px]">
          <div className="pb-3 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Facilities by Risk
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select facility to center on map
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-2 pr-1">
            {facilities
              .sort((a, b) => {
                const weight = { CRITICAL: 4, HIGH: 3, WARNING: 2, SAFE: 1 };
                return weight[b.overall_risk] - weight[a.overall_risk];
              })
              .map((item) => {
                const isSelected = selectedFacilityId === item.facility.id;
                const isCritical = item.overall_risk === 'CRITICAL';
                const isHigh = item.overall_risk === 'HIGH';

                return (
                  <button
                    key={item.facility.id}
                    onClick={() => handleFocusFacility(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-1 ring-blue-400'
                        : isCritical
                        ? 'border-red-200 bg-red-50/40 hover:bg-red-50'
                        : isHigh
                        ? 'border-orange-200 bg-orange-50/40 hover:bg-orange-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 w-full">
                      <div>
                        <strong className="text-slate-900 font-bold block">
                          {item.facility.city}
                        </strong>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                          {item.facility.name}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isCritical
                            ? 'bg-red-100 text-red-700'
                            : isHigh
                            ? 'bg-orange-100 text-orange-700'
                            : item.overall_risk === 'WARNING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.overall_risk}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        {item.critical_medicines_count > 0 ? (
                          <span className="text-red-600 font-semibold">
                            {item.critical_medicines_count} critical
                          </span>
                        ) : (
                          'Stock OK'
                        )}
                      </span>
                      <span className="text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                        <Eye className="w-3 h-3" /> Zoom
                      </span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Regional Shortage Clusters Overlay Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <strong className="text-sm font-bold">Active Regional Supply Clusters:</strong>
          </div>
          <p className="text-xs text-slate-300">
            MedFlow identified 3 regional supply risks (Paracetamol in Jaipur-Ajmer-Alwar, Insulin in Udaipur-Bhilwara, IV Fluids in Sikar-Bharatpur).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg font-semibold">
            Jaipur ⇄ Kota Donor Corridor Identified
          </span>
        </div>
      </div>
    </div>
  );
}
