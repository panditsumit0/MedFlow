'use client';

import React, { useState, useMemo } from 'react';
import { SIMULATION_MEDICINES, getEnrichedInventory } from '@/data/mockData';
import { getMedicineSummaries, detectRegionalShortages } from '@/lib/riskEngine';
import { MedicineSummary } from '@/types';
import {
  Pill,
  Search,
  Filter,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  X,
  TrendingDown,
  Building2,
  Activity
} from 'lucide-react';

export default function MedicinesPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const regionalAlerts = useMemo(() => detectRegionalShortages(inventory), [inventory]);
  const medicineSummaries = useMemo(
    () => getMedicineSummaries(SIMULATION_MEDICINES, inventory, regionalAlerts),
    [inventory, regionalAlerts]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NONE'>('ALL');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineSummary | null>(medicineSummaries[0]);

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return medicineSummaries.filter((med) => {
      if (selectedFilter !== 'ALL' && med.regional_risk !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = med.medicine.name.toLowerCase().includes(q);
        const matchCat = med.medicine.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  }, [medicineSummaries, selectedFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
              Medicines Inventory &amp; Regional Vulnerability
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--accent-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--border)',
              }}
            >
              8 Life-Saving Formulations
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            Aggregate regional stock tracking, consumption rates, and multi-district shortage risk for each medicine.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Table, Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 cols) */}
        <div
          className="lg:col-span-2 rounded-lg overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* Controls */}
          <div className="p-4 sm:p-5 space-y-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                <input
                  type="text"
                  placeholder="Search medicine (e.g. Paracetamol, Insulin, Cefixime)..."
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

              {/* Risk filter buttons */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: selectedFilter === 'ALL' ? 'var(--accent)' : 'var(--surface-2)',
                    color: selectedFilter === 'ALL' ? 'var(--accent-text)' : 'var(--text-2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('CRITICAL')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedFilter === 'CRITICAL' ? '#dc2626' : 'rgba(220,38,38,0.1)',
                    color: selectedFilter === 'CRITICAL' ? '#ffffff' : '#dc2626',
                    border: '1px solid rgba(220,38,38,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedFilter === 'CRITICAL' ? '#ffffff' : '#dc2626' }} />
                  Critical
                </button>
                <button
                  onClick={() => setSelectedFilter('HIGH')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedFilter === 'HIGH' ? '#d97706' : 'rgba(217,119,6,0.1)',
                    color: selectedFilter === 'HIGH' ? '#ffffff' : '#d97706',
                    border: '1px solid rgba(217,119,6,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedFilter === 'HIGH' ? '#ffffff' : '#d97706' }} />
                  High
                </button>
                <button
                  onClick={() => setSelectedFilter('NONE')}
                  className="px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                  style={{
                    backgroundColor: selectedFilter === 'NONE' ? '#16a34a' : 'rgba(22,163,74,0.1)',
                    color: selectedFilter === 'NONE' ? '#ffffff' : '#16a34a',
                    border: '1px solid rgba(22,163,74,0.3)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedFilter === 'NONE' ? '#ffffff' : '#16a34a' }} />
                  Safe
                </button>
              </div>
            </div>
          </div>

          {/* Table with horizontal scroll */}
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
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Total Stock</th>
                  <th className="py-3 px-4 text-right">Avg Daily</th>
                  <th className="py-3 px-4 text-center">Facilities at Risk</th>
                  <th className="py-3 px-4 text-center">Regional Risk</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: 'var(--text-3)' }}>
                      No medicines match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((item) => {
                    const isSelected = selectedMedicine?.medicine.id === item.medicine.id;
                    const isCritical = item.regional_risk === 'CRITICAL';
                    const isHigh = item.regional_risk === 'HIGH';

                    return (
                      <tr
                        key={item.medicine.id}
                        onClick={() => setSelectedMedicine(item)}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: '1px solid var(--border)',
                          backgroundColor: isSelected ? 'var(--accent-bg)' : 'transparent',
                        }}
                      >
                        <td className="py-3 px-4 font-semibold" style={{ color: 'var(--text-1)' }}>
                          <div className="flex items-center gap-2">
                            <Pill className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
                            <span>{item.medicine.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4" style={{ color: 'var(--text-2)' }}>
                          {item.medicine.category}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--text-1)' }}>
                          {item.total_stock.toLocaleString()} units
                        </td>
                        <td className="py-3 px-4 text-right" style={{ color: 'var(--text-2)' }}>
                          {item.avg_daily_consumption}/day
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.facilities_at_risk_count > 0 ? (
                            <span
                              className="font-semibold px-2 py-0.5 rounded text-[11px]"
                              style={{
                                backgroundColor: 'rgba(220,38,38,0.1)',
                                color: '#dc2626',
                                border: '1px solid rgba(220,38,38,0.25)',
                              }}
                            >
                              {item.facilities_at_risk_count} Facilities
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded text-[11px]"
                              style={{
                                backgroundColor: 'rgba(22,163,74,0.1)',
                                color: '#16a34a',
                                border: '1px solid rgba(22,163,74,0.25)',
                              }}
                            >
                              0 at risk
                            </span>
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
                            {item.regional_risk === 'NONE' ? 'STABLE' : `${item.regional_risk} RISK`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMedicine(item);
                            }}
                            className="font-medium inline-flex items-center gap-0.5 text-xs hover:opacity-80"
                            style={{ color: 'var(--accent)' }}
                          >
                            <span>Inspect</span>
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

        {/* Right Medicine Detail Panel (1 col) */}
        <div
          className="rounded-lg p-4 sm:p-5 flex flex-col justify-between min-h-[480px] lg:h-[600px]"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {selectedMedicine ? (
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Header */}
              <div className="pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                  {selectedMedicine.medicine.category}
                </span>
                <h3 className="text-lg font-bold mt-0.5" style={{ color: 'var(--text-1)' }}>
                  {selectedMedicine.medicine.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ backgroundColor: 'var(--surface-2)', color: 'var(--text-2)' }}
                  >
                    Criticality: {selectedMedicine.medicine.criticality}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-bold uppercase"
                    style={{
                      backgroundColor:
                        selectedMedicine.regional_risk === 'CRITICAL'
                          ? 'rgba(220,38,38,0.12)'
                          : selectedMedicine.regional_risk === 'HIGH'
                          ? 'rgba(217,119,6,0.12)'
                          : 'rgba(22,163,74,0.12)',
                      color:
                        selectedMedicine.regional_risk === 'CRITICAL'
                          ? '#dc2626'
                          : selectedMedicine.regional_risk === 'HIGH'
                          ? '#d97706'
                          : '#16a34a',
                    }}
                  >
                    {selectedMedicine.regional_risk === 'NONE'
                      ? 'No Regional Shortage'
                      : `${selectedMedicine.regional_risk} Regional Risk`}
                  </span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block" style={{ color: 'var(--text-3)' }}>Total Regional Stock</span>
                  <strong className="text-base font-extrabold block mt-1" style={{ color: 'var(--text-1)' }}>
                    {selectedMedicine.total_stock.toLocaleString()}
                  </strong>
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>units across network</span>
                </div>

                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block" style={{ color: 'var(--text-3)' }}>Avg Consumption</span>
                  <strong className="text-base font-extrabold block mt-1" style={{ color: 'var(--text-1)' }}>
                    {selectedMedicine.avg_daily_consumption}
                  </strong>
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>units / facility / day</span>
                </div>
              </div>

              {/* Lowest Stock Facility Callout */}
              {selectedMedicine.lowest_stock_facility && (
                <div
                  className="p-3.5 rounded-lg text-xs space-y-1"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.06)',
                    border: '1px solid rgba(220,38,38,0.25)',
                  }}
                >
                  <span className="font-bold uppercase text-[10px] tracking-wide flex items-center gap-1" style={{ color: '#dc2626' }}>
                    <AlertOctagon className="w-3.5 h-3.5" /> Most Vulnerable Facility:
                  </span>
                  <p className="font-semibold" style={{ color: 'var(--text-1)' }}>
                    {selectedMedicine.lowest_stock_facility.facility_name} ({selectedMedicine.lowest_stock_facility.city})
                  </p>
                  <p style={{ color: 'var(--text-2)' }}>
                    Stock: <strong style={{ color: 'var(--text-1)' }}>{selectedMedicine.lowest_stock_facility.current_stock} units</strong> • Depletion in{' '}
                    <strong style={{ color: '#dc2626' }}>
                      {selectedMedicine.lowest_stock_facility.days_remaining} days
                    </strong>
                  </p>
                </div>
              )}

              {/* Highest Stock Surplus Facility Callout */}
              {selectedMedicine.highest_stock_facility && (
                <div
                  className="p-3.5 rounded-lg text-xs space-y-1"
                  style={{
                    backgroundColor: 'rgba(22,163,74,0.06)',
                    border: '1px solid rgba(22,163,74,0.25)',
                  }}
                >
                  <span className="font-bold uppercase text-[10px] tracking-wide flex items-center gap-1" style={{ color: '#16a34a' }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Primary Surplus Source:
                  </span>
                  <p className="font-semibold" style={{ color: 'var(--text-1)' }}>
                    {selectedMedicine.highest_stock_facility.facility_name} ({selectedMedicine.highest_stock_facility.city})
                  </p>
                  <p style={{ color: 'var(--text-2)' }}>
                    Stock: <strong style={{ color: 'var(--text-1)' }}>{selectedMedicine.highest_stock_facility.current_stock} units</strong> • Runway:{' '}
                    <strong style={{ color: '#16a34a' }}>
                      {selectedMedicine.highest_stock_facility.days_remaining} days
                    </strong>
                  </p>
                </div>
              )}

              {/* Facility-by-Facility Breakdown */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-2)' }}>
                  Distribution Across Facilities ({selectedMedicine.inventory.length})
                </span>
                <div className="space-y-1.5">
                  {selectedMedicine.inventory
                    .sort((a, b) => a.days_remaining - b.days_remaining)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-2 rounded-lg text-xs"
                        style={{
                          backgroundColor: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-1)' }}>{inv.facility.city}</strong>
                          <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>
                            {inv.current_stock} units ({inv.daily_consumption}/d)
                          </span>
                        </div>
                        <span
                          className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor:
                              inv.risk_level === 'CRITICAL'
                                ? 'rgba(220,38,38,0.12)'
                                : inv.risk_level === 'HIGH'
                                ? 'rgba(217,119,6,0.12)'
                                : inv.risk_level === 'WARNING'
                                ? 'rgba(234,179,8,0.12)'
                                : 'rgba(22,163,74,0.12)',
                            color:
                              inv.risk_level === 'CRITICAL'
                                ? '#dc2626'
                                : inv.risk_level === 'HIGH'
                                ? '#d97706'
                                : inv.risk_level === 'WARNING'
                                ? '#b45309'
                                : '#16a34a',
                          }}
                        >
                          {inv.days_remaining}d
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs" style={{ color: 'var(--text-3)' }}>
              Select a medicine to inspect regional stock details.
            </div>
          )}

          <div className="pt-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              MedFlow Shortage Intelligence • Rajasthan Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
