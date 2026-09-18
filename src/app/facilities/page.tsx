'use client';

import React, { useState, useMemo } from 'react';
import { SIMULATION_FACILITIES, getEnrichedInventory } from '@/data/mockData';
import { getFacilitySummaries } from '@/lib/riskEngine';
import { FacilitySummary, EnrichedInventoryItem } from '@/types';
import {
  Building2,
  Search,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Pill,
  Truck,
  ArrowRight
} from 'lucide-react';

export default function FacilitiesPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const facilitySummaries = useMemo(
    () => getFacilitySummaries(SIMULATION_FACILITIES, inventory),
    [inventory]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'SAFE'>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<FacilitySummary | null>(facilitySummaries[0]);

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilitySummaries.filter((f) => {
      if (selectedRiskFilter !== 'ALL' && f.overall_risk !== selectedRiskFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.facility.name.toLowerCase().includes(q);
        const matchCity = f.facility.city.toLowerCase().includes(q);
        const matchType = f.facility.facility_type.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchType) return false;
      }
      return true;
    });
  }, [facilitySummaries, selectedRiskFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
              Healthcare Facilities &amp; District Centers
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--border)',
              }}
            >
              10 Monitored Facilities
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            District-level healthcare network nodes across Rajasthan, monitoring stock depletion and local critical medicine buffers.
          </p>
        </div>
      </div>

      {/* Main Grid: Facilities Table (2 cols) & Facility Detail View (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 cols) */}
        <div
          className="lg:col-span-2 rounded-lg overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                <input
                  type="text"
                  placeholder="Search by facility name, city (e.g. Jaipur, Kota, Ajmer)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md focus:outline-none focus:ring-1"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-1)',
                  }}
                />
              </div>

              {/* Risk filters */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedRiskFilter('ALL')}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: selectedRiskFilter === 'ALL' ? 'var(--accent)' : 'var(--surface-2)',
                    color: selectedRiskFilter === 'ALL' ? 'var(--accent-text)' : 'var(--text-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  All ({facilitySummaries.length})
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('CRITICAL')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedRiskFilter === 'CRITICAL' ? '#dc2626' : 'rgba(220,38,38,0.1)',
                    color: selectedRiskFilter === 'CRITICAL' ? '#ffffff' : '#dc2626',
                    border: '1px solid rgba(220,38,38,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedRiskFilter === 'CRITICAL' ? '#ffffff' : '#dc2626' }} />
                  Critical
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('HIGH')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedRiskFilter === 'HIGH' ? '#d97706' : 'rgba(217,119,6,0.1)',
                    color: selectedRiskFilter === 'HIGH' ? '#ffffff' : '#d97706',
                    border: '1px solid rgba(217,119,6,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedRiskFilter === 'HIGH' ? '#ffffff' : '#d97706' }} />
                  High
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('SAFE')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedRiskFilter === 'SAFE' ? '#16a34a' : 'rgba(22,163,74,0.1)',
                    color: selectedRiskFilter === 'SAFE' ? '#ffffff' : '#16a34a',
                    border: '1px solid rgba(22,163,74,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedRiskFilter === 'SAFE' ? '#ffffff' : '#16a34a' }} />
                  Safe
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs" style={{ minWidth: '640px' }}>
              <thead
                className="font-bold uppercase tracking-wider text-[10px]"
                style={{
                  backgroundColor: 'var(--table-head)',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-3)',
                }}
              >
                <tr>
                  <th className="py-3 px-4">Facility &amp; City</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Monitored</th>
                  <th className="py-3 px-4 text-center">Critical</th>
                  <th className="py-3 px-4 text-center">At-Risk</th>
                  <th className="py-3 px-4 text-center">Overall Risk</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: 'var(--text-3)' }}>
                      No facilities match the filter.
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((item) => {
                    const isSelected = selectedFacility?.facility.id === item.facility.id;
                    const isCritical = item.overall_risk === 'CRITICAL';
                    const isHigh = item.overall_risk === 'HIGH';

                    return (
                      <tr
                        key={item.facility.id}
                        onClick={() => setSelectedFacility(item)}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: '1px solid var(--border)',
                          backgroundColor: isSelected ? 'var(--accent-bg)' : 'transparent',
                        }}
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold" style={{ color: 'var(--text-1)' }}>{item.facility.name}</div>
                          <span className="text-[10px] font-medium" style={{ color: 'var(--text-3)' }}>
                            {item.facility.city}, Rajasthan
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px]" style={{ color: 'var(--text-2)' }}>
                          {item.facility.facility_type}
                        </td>
                        <td className="py-3 px-4 text-center font-bold" style={{ color: 'var(--text-1)' }}>
                          {item.total_medicines_monitored}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.critical_medicines_count > 0 ? (
                            <span
                              className="font-extrabold px-2 py-0.5 rounded text-[11px]"
                              style={{
                                backgroundColor: 'rgba(220,38,38,0.1)',
                                color: '#dc2626',
                                border: '1px solid rgba(220,38,38,0.25)',
                              }}
                            >
                              {item.critical_medicines_count}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-3)' }}>0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.at_risk_medicines_count > 0 ? (
                            <span
                              className="font-bold px-2 py-0.5 rounded text-[11px]"
                              style={{
                                backgroundColor: 'rgba(217,119,6,0.1)',
                                color: '#d97706',
                                border: '1px solid rgba(217,119,6,0.25)',
                              }}
                            >
                              {item.at_risk_medicines_count}
                            </span>
                          ) : (
                            <span style={{ color: '#16a34a' }} className="text-[11px]">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase"
                            style={{
                              backgroundColor: isCritical
                                ? 'rgba(220,38,38,0.12)'
                                : isHigh
                                ? 'rgba(217,119,6,0.12)'
                                : 'rgba(22,163,74,0.12)',
                              color: isCritical ? '#dc2626' : isHigh ? '#d97706' : '#16a34a',
                              border: `1px solid ${
                                isCritical
                                  ? 'rgba(220,38,38,0.25)'
                                  : isHigh
                                  ? 'rgba(217,119,6,0.25)'
                                  : 'rgba(22,163,74,0.25)'
                              }`,
                            }}
                          >
                            {item.overall_risk}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacility(item);
                            }}
                            className="font-medium inline-flex items-center gap-0.5 text-xs hover:opacity-80"
                            style={{ color: 'var(--accent)' }}
                          >
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facility Detailed Inventory Panel (1 col) */}
        <div
          className="rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[480px] lg:h-[600px]"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {selectedFacility ? (
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                  {selectedFacility.facility.facility_type}
                </span>
                <h3 className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-1)' }}>
                  {selectedFacility.facility.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"
                    style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-2)' }}
                  >
                    <MapPin className="w-3 h-3" style={{ color: 'var(--text-3)' }} />
                    {selectedFacility.facility.city}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-bold uppercase"
                    style={{
                      backgroundColor:
                        selectedFacility.overall_risk === 'CRITICAL'
                          ? 'rgba(220,38,38,0.12)'
                          : selectedFacility.overall_risk === 'HIGH'
                          ? 'rgba(217,119,6,0.12)'
                          : 'rgba(22,163,74,0.12)',
                      color:
                        selectedFacility.overall_risk === 'CRITICAL'
                          ? '#dc2626'
                          : selectedFacility.overall_risk === 'HIGH'
                          ? '#d97706'
                          : '#16a34a',
                    }}
                  >
                    {selectedFacility.overall_risk} Status
                  </span>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block" style={{ color: 'var(--text-3)' }}>Critical Shortages</span>
                  <strong className="text-lg font-extrabold block mt-1" style={{ color: '#dc2626' }}>
                    {selectedFacility.critical_medicines_count}
                  </strong>
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>medicines ≤ 3 days</span>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block" style={{ color: 'var(--text-3)' }}>Safe Medicines</span>
                  <strong className="text-lg font-extrabold block mt-1" style={{ color: '#16a34a' }}>
                    {selectedFacility.safe_medicines_count}
                  </strong>
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>sufficient stock</span>
                </div>
              </div>

              {/* Detailed Inventory List for this Facility */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-2)' }}>
                  Inventory Stock Breakdown ({selectedFacility.inventory.length})
                </span>
                <div className="space-y-2">
                  {selectedFacility.inventory
                    .sort((a, b) => a.days_remaining - b.days_remaining)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg text-xs space-y-1.5"
                        style={{
                          backgroundColor: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <strong className="font-semibold" style={{ color: 'var(--text-1)' }}>{item.medicine.name}</strong>
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase"
                            style={{
                              backgroundColor:
                                item.risk_level === 'CRITICAL'
                                  ? 'rgba(220,38,38,0.12)'
                                  : item.risk_level === 'HIGH'
                                  ? 'rgba(217,119,6,0.12)'
                                  : item.risk_level === 'WARNING'
                                  ? 'rgba(234,179,8,0.12)'
                                  : 'rgba(22,163,74,0.12)',
                              color:
                                item.risk_level === 'CRITICAL'
                                  ? '#dc2626'
                                  : item.risk_level === 'HIGH'
                                  ? '#d97706'
                                  : item.risk_level === 'WARNING'
                                  ? '#b45309'
                                  : '#16a34a',
                            }}
                          >
                            {item.days_remaining}d remaining
                          </span>
                        </div>

                        <div
                          className="grid grid-cols-3 gap-1 text-[11px] pt-1"
                          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-2)' }}
                        >
                          <div>
                            <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>Stock:</span>
                            <strong style={{ color: 'var(--text-1)' }}>{item.current_stock}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>Usage:</span>
                            <strong style={{ color: 'var(--text-1)' }}>{item.daily_consumption}/day</strong>
                          </div>
                          <div>
                            <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>Incoming:</span>
                            <strong style={{ color: item.incoming_stock > 0 ? 'var(--accent)' : 'var(--text-3)' }}>
                              {item.incoming_stock > 0 ? `+${item.incoming_stock}` : '0'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs" style={{ color: 'var(--text-3)' }}>
              Select a facility to inspect its full inventory roster.
            </div>
          )}

          <div className="pt-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              MedFlow Facility Intelligence • Decision Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
