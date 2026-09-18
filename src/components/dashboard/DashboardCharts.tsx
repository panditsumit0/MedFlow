'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend,
} from 'recharts';

const consumptionTrendData = [
  { day: 'Mon', Paracetamol: 165, Insulin: 48, IVFluids: 70 },
  { day: 'Tue', Paracetamol: 172, Insulin: 52, IVFluids: 75 },
  { day: 'Wed', Paracetamol: 180, Insulin: 50, IVFluids: 82 },
  { day: 'Thu', Paracetamol: 195, Insulin: 55, IVFluids: 88 },
  { day: 'Fri', Paracetamol: 210, Insulin: 58, IVFluids: 94 },
  { day: 'Sat', Paracetamol: 220, Insulin: 61, IVFluids: 98 },
  { day: 'Sun', Paracetamol: 228, Insulin: 63, IVFluids: 105 },
];

const paracetamolRunwayData = [
  { facility: 'Jaipur',        days: 2.0,  fill: '#ef4444' },
  { facility: 'Ajmer',         days: 3.0,  fill: '#ef4444' },
  { facility: 'Alwar',         days: 6.0,  fill: '#f59e0b' },
  { facility: 'Jodhpur',       days: 21.4, fill: '#10b981' },
  { facility: 'Bikaner',       days: 25.0, fill: '#10b981' },
  { facility: 'Kota (Surplus)',days: 50.0, fill: '#3b82f6' },
];

/* Recharts tooltip needs a real background colour — we read the CSS var at runtime */
function getVar(name: string) {
  if (typeof window === 'undefined') return '#ffffff';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: getVar('--surface'),
        border: `1px solid ${getVar('--border')}`,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        color: getVar('--text-1'),
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {label && <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }}>
          {p.name}: <strong>{p.value}</strong>
          {p.unit ?? ''}
        </p>
      ))}
    </div>
  );
}

function RunwayTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: getVar('--surface'),
        border: `1px solid ${getVar('--border')}`,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        color: getVar('--text-1'),
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <p><strong>{payload[0].value} days</strong> runway</p>
    </div>
  );
}

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1 — Runway bar chart */}
      <div
        className="rounded-lg p-3.5 sm:p-5 flex flex-col justify-between"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Paracetamol Runway by Facility
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
            Days of stock remaining based on average daily consumption
          </p>
        </div>

        <div className="h-52 sm:h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={paracetamolRunwayData}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" unit="d" tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <YAxis
                type="category"
                dataKey="facility"
                width={85}
                tick={{ fontSize: 10, fill: 'var(--text-2)' }}
              />
              <Tooltip content={<RunwayTooltip />} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {paracetamolRunwayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}
        >
          <span>Shortage threshold: 7 days</span>
          <span>Red: Critical (&lt;4d) • Green: Safe</span>
        </div>
      </div>

      {/* Chart 2 — Trend line chart */}
      <div
        className="rounded-lg p-3.5 sm:p-5 flex flex-col justify-between"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Regional Daily Consumption Trend
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
            Total units consumed daily across all 10 facilities
          </p>
        </div>

        <div className="h-52 sm:h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={consumptionTrendData}
              margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: 'var(--text-2)' }}
                iconType="plainline"
              />
              <Line type="monotone" dataKey="Paracetamol" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="IVFluids" name="IV Fluids" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Insulin" stroke="#d97706" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}
        >
          <span>7-day aggregate tracking</span>
          <span>Simulation data</span>
        </div>
      </div>
    </div>
  );
}
