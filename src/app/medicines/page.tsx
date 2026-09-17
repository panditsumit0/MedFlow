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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Medicines Inventory &amp; Regional Vulnerability
            </h1>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              8 Life-Saving Formulations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate regional stock tracking, consumption rates, and multi-district shortage risk for each medicine.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Table, Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Controls */}
          <div className="p-5 border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicine (e.g. Paracetamol, Insulin, Cefixime)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Risk filter buttons */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('CRITICAL')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedFilter === 'CRITICAL'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Critical
                </button>
                <button
                  onClick={() => setSelectedFilter('HIGH')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedFilter === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  High
                </button>
                <button
                  onClick={() => setSelectedFilter('NONE')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedFilter === 'NONE'
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
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Total Stock</th>
                  <th className="py-3 px-4 text-right">Avg Daily</th>
                  <th className="py-3 px-4 text-center">Facilities at Risk</th>
                  <th className="py-3 px-4 text-center">Regional Risk</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
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
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 border-l-4 border-blue-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Pill className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.medicine.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {item.medicine.category}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {item.total_stock.toLocaleString()} units
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {item.avg_daily_consumption}/day
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.facilities_at_risk_count > 0 ? (
                            <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                              {item.facilities_at_risk_count} Facilities
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                              0 at risk
                            </span>
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
                            {item.regional_risk === 'NONE' ? 'STABLE' : `${item.regional_risk} RISK`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMedicine(item);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 text-xs"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-[600px]">
          {selectedMedicine ? (
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Header */}
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedMedicine.medicine.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedMedicine.medicine.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Criticality: {selectedMedicine.medicine.criticality}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      selectedMedicine.regional_risk === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : selectedMedicine.regional_risk === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedMedicine.regional_risk === 'NONE'
                      ? 'No Regional Shortage'
                      : `${selectedMedicine.regional_risk} Regional Risk`}
                  </span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Total Regional Stock</span>
                  <strong className="text-base font-extrabold text-slate-900 block mt-1">
                    {selectedMedicine.total_stock.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-slate-400">units across network</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Avg Consumption</span>
                  <strong className="text-base font-extrabold text-slate-900 block mt-1">
                    {selectedMedicine.avg_daily_consumption}
                  </strong>
                  <span className="text-[10px] text-slate-400">units / facility / day</span>
                </div>
              </div>

              {/* Lowest Stock Facility Callout */}
              {selectedMedicine.lowest_stock_facility && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-red-900 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-red-600" /> Most Vulnerable Facility:
                  </span>
                  <p className="font-semibold text-slate-900">
                    {selectedMedicine.lowest_stock_facility.facility_name} ({selectedMedicine.lowest_stock_facility.city})
                  </p>
                  <p className="text-slate-700">
                    Stock: <strong>{selectedMedicine.lowest_stock_facility.current_stock} units</strong> • Depletion in{' '}
                    <strong className="text-red-700">
                      {selectedMedicine.lowest_stock_facility.days_remaining} days
                    </strong>
                  </p>
                </div>
              )}

              {/* Highest Stock Surplus Facility Callout */}
              {selectedMedicine.highest_stock_facility && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wide flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Primary Surplus Source:
                  </span>
                  <p className="font-semibold text-slate-900">
                    {selectedMedicine.highest_stock_facility.facility_name} ({selectedMedicine.highest_stock_facility.city})
                  </p>
                  <p className="text-slate-700">
                    Stock: <strong>{selectedMedicine.highest_stock_facility.current_stock} units</strong> • Runway:{' '}
                    <strong className="text-blue-700">
                      {selectedMedicine.highest_stock_facility.days_remaining} days
                    </strong>
                  </p>
                </div>
              )}

              {/* Facility-by-Facility Breakdown */}
              <div>
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Distribution Across Facilities ({selectedMedicine.inventory.length})
                </span>
                <div className="space-y-1.5">
                  {selectedMedicine.inventory
                    .sort((a, b) => a.days_remaining - b.days_remaining)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white text-xs"
                      >
                        <div>
                          <strong className="text-slate-900">{inv.facility.city}</strong>
                          <span className="text-slate-400 block text-[10px]">
                            {inv.current_stock} units ({inv.daily_consumption}/d)
                          </span>
                        </div>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            inv.risk_level === 'CRITICAL'
                              ? 'bg-red-100 text-red-700'
                              : inv.risk_level === 'HIGH'
                              ? 'bg-orange-100 text-orange-700'
                              : inv.risk_level === 'WARNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {inv.days_remaining}d
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select a medicine to inspect regional stock details.
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">
              MedFlow Shortage Intelligence • Rajasthan Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
