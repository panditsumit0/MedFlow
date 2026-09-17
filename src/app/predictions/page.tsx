'use client';

import React, { useState, useMemo } from 'react';
import { getEnrichedInventory } from '@/data/mockData';
import { EnrichedInventoryItem } from '@/types';
import ExplainRiskModal from '@/components/dashboard/ExplainRiskModal';
import { Search } from 'lucide-react';

export default function PredictionsPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const [selectedExplainItem, setSelectedExplainItem] = useState<EnrichedInventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const next7DaysItems = useMemo(() => {
    return inventory
      .filter((i) => i.days_remaining <= 7)
      .sort((a, b) => a.days_remaining - b.days_remaining);
  }, [inventory]);

  const filteredPredictions = useMemo(() => {
    return inventory
      .filter((item) => {
        if (filterRisk !== 'ALL' && item.risk_level !== filterRisk) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMed = item.medicine.name.toLowerCase().includes(q);
          const matchFac = item.facility.name.toLowerCase().includes(q);
          const matchCity = item.facility.city.toLowerCase().includes(q);
          if (!matchMed && !matchFac && !matchCity) return false;
        }
        return true;
      })
      .sort((a, b) => a.days_remaining - b.days_remaining);
  }, [inventory, filterRisk, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Shortage Risk Predictions
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculated depletion dates based on on-hand stock and daily consumption rates
        </p>
      </div>

      {/* Next 7 Days Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Next 7 Days Depletion Window ({next7DaysItems.length} items)
          </span>
          <span className="text-[11px] text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-medium">
            Immediate Monitoring
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {next7DaysItems.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs">{item.medicine.name}</span>
                  <span className="text-[10px] font-mono font-bold text-red-600">
                    {item.days_remaining}d
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.facility.city}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Stock: {item.current_stock}</span>
                <button
                  onClick={() => setSelectedExplainItem(item)}
                  className="text-slate-600 hover:text-slate-900 font-medium text-xs hover:underline"
                >
                  Explain
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">
            All Monitored Facilities (Ranked by Shortage Urgency)
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-2.5 py-1 text-xs rounded border border-slate-200 bg-white text-slate-700"
            >
              <option value="ALL">All Tiers</option>
              <option value="CRITICAL">Critical (0–3d)</option>
              <option value="HIGH">High (4–7d)</option>
              <option value="WARNING">Warning (8–14d)</option>
              <option value="SAFE">Safe (&gt;14d)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4">Medicine</th>
                <th className="py-2.5 px-4">Facility</th>
                <th className="py-2.5 px-4 text-right">Current Stock</th>
                <th className="py-2.5 px-4 text-right">Daily Usage</th>
                <th className="py-2.5 px-4 text-center">Days Remaining</th>
                <th className="py-2.5 px-4 text-center">Projected (+Delivery)</th>
                <th className="py-2.5 px-4 text-center">Risk</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPredictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-900">{item.medicine.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{item.facility.name} ({item.facility.city})</td>
                  <td className="py-2.5 px-4 text-right font-medium text-slate-900">{item.current_stock}</td>
                  <td className="py-2.5 px-4 text-right text-slate-600">{item.daily_consumption}/d</td>
                  <td className="py-2.5 px-4 text-center font-mono font-medium text-slate-900">
                    {item.days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-600">
                    {item.projected_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        item.risk_level === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.risk_level === 'HIGH'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedExplainItem(item)}
                      className="text-slate-500 hover:text-slate-900 font-medium text-xs hover:underline"
                    >
                      Explain
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExplainRiskModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />
    </div>
  );
}
