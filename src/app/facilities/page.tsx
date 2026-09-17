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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Healthcare Facilities &amp; District Centers
            </h1>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              10 Monitored Facilities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            District-level healthcare network nodes across Rajasthan, monitoring stock depletion and local critical medicine buffers.
          </p>
        </div>
      </div>

      {/* Main Grid: Facilities Table (2 cols) & Facility Detail View (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by facility name, city (e.g. Jaipur, Kota, Ajmer)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Risk filters */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedRiskFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedRiskFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({facilitySummaries.length})
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('CRITICAL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedRiskFilter === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Critical
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('HIGH')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedRiskFilter === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  High
                </button>
                <button
                  onClick={() => setSelectedRiskFilter('SAFE')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedRiskFilter === 'SAFE'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Safe
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-slate-200/80">
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
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
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{item.facility.name}</div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {item.facility.city}, Rajasthan
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {item.facility.facility_type}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          {item.total_medicines_monitored}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.critical_medicines_count > 0 ? (
                            <span className="font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                              {item.critical_medicines_count}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.at_risk_medicines_count > 0 ? (
                            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                              {item.at_risk_medicines_count}
                            </span>
                          ) : (
                            <span className="text-emerald-700 text-[11px]">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              isCritical
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : isHigh
                                ? 'bg-orange-100 text-orange-700 border-orange-200'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
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
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 text-xs"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-[600px]">
          {selectedFacility ? (
            <div className="space-y-4 overflow-y-auto pr-1">
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedFacility.facility.facility_type}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedFacility.facility.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {selectedFacility.facility.city}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      selectedFacility.overall_risk === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : selectedFacility.overall_risk === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedFacility.overall_risk} Status
                  </span>
                </div>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Critical Shortages</span>
                  <strong className="text-lg font-extrabold text-red-600 block mt-1">
                    {selectedFacility.critical_medicines_count}
                  </strong>
                  <span className="text-[10px] text-slate-400">medicines ≤ 3 days</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Safe Medicines</span>
                  <strong className="text-lg font-extrabold text-emerald-600 block mt-1">
                    {selectedFacility.safe_medicines_count}
                  </strong>
                  <span className="text-[10px] text-slate-400">sufficient stock</span>
                </div>
              </div>

              {/* Detailed Inventory List for this Facility */}
              <div>
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Inventory Stock Breakdown ({selectedFacility.inventory.length})
                </span>
                <div className="space-y-2">
                  {selectedFacility.inventory
                    .sort((a, b) => a.days_remaining - b.days_remaining)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-slate-900 font-bold">{item.medicine.name}</strong>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              item.risk_level === 'CRITICAL'
                                ? 'bg-red-100 text-red-700'
                                : item.risk_level === 'HIGH'
                                ? 'bg-orange-100 text-orange-700'
                                : item.risk_level === 'WARNING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {item.days_remaining}d remaining
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Stock:</span>
                            <strong>{item.current_stock}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Usage:</span>
                            <strong>{item.daily_consumption}/day</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Incoming:</span>
                            <strong className={item.incoming_stock > 0 ? 'text-blue-600' : 'text-slate-400'}>
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
            <div className="text-center py-16 text-slate-400 text-xs">
              Select a facility to inspect its full inventory roster.
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">
              MedFlow Facility Intelligence • Decision Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
