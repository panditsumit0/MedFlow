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
      className="text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function DaysCell({ days, risk }: { days: number; risk: string }) {
  const color = risk === 'CRITICAL' ? '#dc2626' : risk === 'HIGH' ? '#d97706' : risk === 'WARNING' ? '#ca8a04' : '#16a34a';
  return <span className="font-mono font-semibold text-xs whitespace-nowrap" style={{ color }}>{days}d</span>;
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
      {/* Header + Filters */}
      <div
        className="px-4 sm:px-5 py-3 sm:py-3.5 space-y-3"
        style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
              Facility Inventory &amp; Shortage Risks
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              Sorted by urgency &middot; {counts.CRITICAL} critical, {counts.HIGH} high risk
            </p>
          </div>
        </div>

        {/* Filter row — wraps on mobile */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input
              type="text"
              placeholder="Search medicine or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded focus:outline-none"
              style={{ ...inputStyle, minHeight: '36px' }}
            />
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded focus:outline-none"
            style={{ ...inputStyle, minHeight: '36px' }}
          >
            <option value="ALL">All Risks</option>
            <option value="CRITICAL">Critical (0–3d)</option>
            <option value="HIGH">High (4–7d)</option>
            <option value="WARNING">Warning (8–14d)</option>
            <option value="SAFE">Safe (&gt;14d)</option>
          </select>

          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded focus:outline-none flex-1 min-w-[140px]"
            style={{ ...inputStyle, minHeight: '36px' }}
          >
            <option value="ALL">All Facilities</option>
            {facilities.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table — horizontal scroll on mobile so no data is cut off */}
      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="w-full text-left text-xs" style={{ minWidth: '640px' }}>
          <thead style={{ backgroundColor: 'var(--table-head)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              {[
                { label: 'Medicine',   cls: '' },
                { label: 'Facility',   cls: '' },
                { label: 'Stock',      cls: 'text-right' },
                { label: 'Usage/Day',  cls: 'text-right' },
                { label: 'Days Left',  cls: 'text-center' },
                { label: 'Incoming',   cls: 'text-right' },
                { label: 'Risk',       cls: 'text-center' },
                { label: 'Why?',       cls: 'text-center' },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${col.cls}`}
                  style={{ color: 'var(--text-3)' }}
                >
                  {col.label}
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
                  <td className="py-3 px-3">
                    <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text-1)' }}>
                      {item.medicine.name}
                    </span>
                    <span className="text-[10px] block" style={{ color: 'var(--text-3)' }}>
                      {item.medicine.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="whitespace-nowrap" style={{ color: 'var(--text-1)' }}>
                      {item.facility.name}
                    </span>
                    <span className="text-[10px] block" style={{ color: 'var(--text-3)' }}>
                      {item.facility.city}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium whitespace-nowrap" style={{ color: 'var(--text-1)' }}>
                    {item.current_stock.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap" style={{ color: 'var(--text-2)' }}>
                    {item.daily_consumption}/d
                  </td>
                  <td className="py-3 px-3 text-center">
                    <DaysCell days={item.days_remaining} risk={item.risk_level} />
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap"
                    style={{ color: item.incoming_stock > 0 ? 'var(--accent)' : 'var(--text-3)' }}>
                    {item.incoming_stock > 0 ? `+${item.incoming_stock}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <RiskBadge risk={item.risk_level} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onSelectForExplanation(item)}
                      className="text-xs font-medium hover:underline whitespace-nowrap"
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

      {/* Footer */}
      <div
        className="px-4 sm:px-5 py-2.5 text-[11px]"
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-3)',
        }}
      >
        Showing {filteredItems.length} of {items.length} records &middot; days = stock &divide; daily consumption
      </div>
    </div>
  );
}
