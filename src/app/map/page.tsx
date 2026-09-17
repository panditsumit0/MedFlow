'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SIMULATION_FACILITIES, getEnrichedInventory } from '@/data/mockData';
import { getFacilitySummaries, detectRegionalShortages } from '@/lib/riskEngine';
import { MapPin, ShieldAlert, Sparkles } from 'lucide-react';

// Dynamic import of Leaflet map with ssr disabled to prevent browser 'window' errors
const RajasthanLeafletMap = dynamic(
  () => import('@/components/map/RajasthanLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading Rajasthan Geographic Network...</span>
        </div>
      </div>
    ),
  }
);

export default function RegionalMapPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const regionalAlerts = useMemo(() => detectRegionalShortages(inventory), [inventory]);
  const facilitySummaries = useMemo(
    () => getFacilitySummaries(SIMULATION_FACILITIES, inventory),
    [inventory]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Regional Healthcare Facility Map
            </h1>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              Interactive GIS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Geographic visualization of Rajasthan healthcare facilities, critical inventory depletion days, and regional shortage zones.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Real Coordinates • Simulated Inventory</span>
        </div>
      </div>

      {/* Map Component */}
      <RajasthanLeafletMap
        facilities={facilitySummaries}
        regionalAlerts={regionalAlerts}
      />
    </div>
  );
}
