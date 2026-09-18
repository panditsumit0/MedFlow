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
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
          Shortage Risk Predictions
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
          Calculated depletion dates based on on-hand stock and daily consumption rates
        </p>
      </div>

      {/* Next 7 Days Section */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
            Next 7 Days Depletion Window ({next7DaysItems.length} items)
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(220,38,38,0.1)',
              color: '#dc2626',
              border: '1px solid rgba(220,38,38,0.25)',
            }}
          >
            Immediate Monitoring
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {next7DaysItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded flex flex-col justify-between"
              style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs" style={{ color: 'var(--text-1)' }}>{item.medicine.name}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: '#dc2626' }}>
                    {item.days_remaining}d
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{item.facility.city}</p>
              </div>

              <div
                className="mt-2.5 pt-2 flex items-center justify-between text-[11px]"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span style={{ color: 'var(--text-3)' }}>Stock: {item.current_stock}</span>
                <button
                  onClick={() => setSelectedExplainItem(item)}
                  className="font-medium text-xs hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Explain
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div
          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            All Monitored Facilities (Ranked by Shortage Urgency)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-auto pl-8 pr-2.5 py-1 text-xs rounded"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-1)',
                }}
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-2.5 py-1 text-xs rounded"
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-1)',
              }}
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
          <table className="w-full text-left text-xs" style={{ minWidth: '640px' }}>
            <thead
              className="font-medium"
              style={{
                backgroundColor: 'var(--table-head)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-3)',
              }}
            >
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
            <tbody>
              {filteredPredictions.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-2.5 px-4 font-medium" style={{ color: 'var(--text-1)' }}>{item.medicine.name}</td>
                  <td className="py-2.5 px-4" style={{ color: 'var(--text-2)' }}>{item.facility.name} ({item.facility.city})</td>
                  <td className="py-2.5 px-4 text-right font-medium" style={{ color: 'var(--text-1)' }}>{item.current_stock}</td>
                  <td className="py-2.5 px-4 text-right" style={{ color: 'var(--text-2)' }}>{item.daily_consumption}/d</td>
                  <td className="py-2.5 px-4 text-center font-mono font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono" style={{ color: 'var(--text-3)' }}>
                    {item.projected_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          item.risk_level === 'CRITICAL'
                            ? 'rgba(220,38,38,0.12)'
                            : item.risk_level === 'HIGH'
                            ? 'rgba(217,119,6,0.12)'
                            : 'rgba(22,163,74,0.12)',
                        color:
                          item.risk_level === 'CRITICAL'
                            ? '#dc2626'
                            : item.risk_level === 'HIGH'
                            ? '#d97706'
                            : '#16a34a',
                        border: `1px solid ${
                          item.risk_level === 'CRITICAL'
                            ? 'rgba(220,38,38,0.25)'
                            : item.risk_level === 'HIGH'
                            ? 'rgba(217,119,6,0.25)'
                            : 'rgba(22,163,74,0.25)'
                        }`,
                      }}
                    >
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedExplainItem(item)}
                      className="font-medium text-xs hover:underline"
                      style={{ color: 'var(--accent)' }}
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
