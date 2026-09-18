'use client';

import React, { useState, useMemo } from 'react';
import { EnrichedInventoryItem } from '@/types';
import { Search } from 'lucide-react';

interface ShortageTableProps {
  items: EnrichedInventoryItem[];
  onSelectForExplanation: (item: EnrichedInventoryItem) => void;
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    CRITICAL: { bg: 'rgba(220,38,38,0.13)',  color: '#dc2626', label: 'Critical' },
    HIGH:     { bg: 'rgba(217,119,6,0.13)',  color: '#d97706', label: 'High'     },
    WARNING:  { bg: 'rgba(202,138,4,0.12)',  color: '#ca8a04', label: 'Warning'  },
    SAFE:     { bg: 'rgba(22,163,74,0.13)',  color: '#16a34a', label: 'Safe'     },
  };
  const s = styles[risk] || styles.SAFE;
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function DaysCell({ days, risk }: { days: number; risk: string }) {
  const color = risk === 'CRITICAL' ? '#dc2626' : risk === 'HIGH' ? '#d97706' : risk === 'WARNING' ? '#ca8a04' : '#16a34a';
  return <span className="font-mono font-semibold text-xs" style={{ color }}>{days}d</span>;
}

export default function ShortageTable({ items, onSelectForExplanation }: ShortageTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState('ALL');

  const facilities = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => map.set(i.facility.id, `${i.facility.city} — ${i.facility.name}`));
    return Array.from(map.entries());
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedRisk !== 'ALL' && item.risk_level !== selectedRisk) return false;
        if (selectedFacility !== 'ALL' && item.facility.id !== selectedFacility) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (
            !item.medicine.name.toLowerCase().includes(q) &&
            !item.facility.name.toLowerCase().includes(q) &&
            !item.facility.city.toLowerCase().includes(q)
          ) return false;
        }
        return true;
      })
      .sort((a, b) => a.days_remaining - b.days_remaining);
  }, [items, selectedRisk, selectedFacility, searchQuery]);

  const counts = useMemo(() => ({
    CRITICAL: items.filter((i) => i.risk_level === 'CRITICAL').length,
    HIGH: items.filter((i) => i.risk_level === 'HIGH').length,
  }), [items]);

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-1)',
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Facility Inventory &amp; Shortage Risks
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>
            Sorted by days remaining · {counts.CRITICAL} critical, {counts.HIGH} high risk
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input
              type="text"
              placeholder="Search medicine or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 text-xs rounded focus:outline-none focus:border-[var(--accent)]"
              style={inputStyle}
            />
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded focus:outline-none focus:border-[var(--accent)]"
            style={inputStyle}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">🔴 Critical (0–3d)</option>
            <option value="HIGH">🟡 High (4–7d)</option>
            <option value="WARNING">🟠 Warning (8–14d)</option>
            <option value="SAFE">🟢 Safe (&gt;14d)</option>
          </select>

          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded focus:outline-none focus:border-[var(--accent)]"
            style={inputStyle}
          >
            <option value="ALL">All Facilities</option>
            {facilities.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead style={{ backgroundColor: 'var(--table-head)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              {['Medicine', 'Facility', 'Stock', 'Daily Usage', 'Days Left', 'Incoming', 'Risk', 'Why?'].map((col, i) => (
                <th
                  key={col}
                  className={`py-2.5 px-4 text-[11px] font-semibold uppercase tracking-wider ${i >= 2 && i <= 5 ? 'text-right' : i === 6 || i === 7 ? 'text-center' : ''}`}
                  style={{ color: 'var(--text-3)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs" style={{ color: 'var(--text-3)' }}>
                  No records match your filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors"
                  style={{
                    borderBottom: '1px solid var(--border-2)',
                    backgroundColor: item.risk_level === 'CRITICAL' ? 'rgba(220,38,38,0.04)' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--table-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      item.risk_level === 'CRITICAL' ? 'rgba(220,38,38,0.04)' : '';
                  }}
                >
                  <td className="py-3 px-4">
                    <span className="font-medium" style={{ color: 'var(--text-1)' }}>{item.medicine.name}</span>
                    <span className="text-[10px] block" style={{ color: 'var(--text-3)' }}>{item.medicine.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span style={{ color: 'var(--text-1)' }}>{item.facility.name}</span>
                    <span className="text-[10px] block" style={{ color: 'var(--text-3)' }}>{item.facility.city}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.current_stock.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--text-2)' }}>
                    {item.daily_consumption}/day
                  </td>
                  <td className="py-3 px-4 text-center">
                    <DaysCell days={item.days_remaining} risk={item.risk_level} />
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: item.incoming_stock > 0 ? 'var(--accent)' : 'var(--text-3)' }}>
                    {item.incoming_stock > 0 ? `+${item.incoming_stock}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge risk={item.risk_level} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectForExplanation(item)}
                      className="text-xs font-medium hover:underline"
                      style={{ color: 'var(--accent)' }}
                    >
                      Explain
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className="px-5 py-2.5 text-[11px]"
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-3)',
        }}
      >
        Showing {filteredItems.length} of {items.length} records ·
        Formula: days_remaining = current_stock ÷ daily_consumption
      </div>
    </div>
  );
}
