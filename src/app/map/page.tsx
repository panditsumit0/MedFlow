'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SIMULATION_FACILITIES, getEnrichedInventory } from '@/data/mockData';
import { getFacilitySummaries, detectRegionalShortages } from '@/lib/riskEngine';
import { MapPin, ShieldAlert } from 'lucide-react';

const RajasthanLeafletMap = dynamic(
  () => import('@/components/map/RajasthanLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-[540px] rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
            Loading map...
          </span>
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>
              Regional Healthcare Facility Map
            </h1>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--border)',
              }}
            >
              Interactive GIS
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Geographic overview of Rajasthan healthcare facilities, inventory depletion status, and shortage zones.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded text-xs shrink-0"
          style={{
            backgroundColor: 'rgba(217,119,6,0.08)',
            border: '1px solid rgba(217,119,6,0.25)',
            color: '#b45309',
          }}
        >
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Real coordinates, simulated inventory</span>
        </div>
      </div>

      <RajasthanLeafletMap
        facilities={facilitySummaries}
        regionalAlerts={regionalAlerts}
      />
    </div>
  );
}
