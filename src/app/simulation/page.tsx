'use client';

import React, { useState, useMemo } from 'react';
import { getEnrichedInventory } from '@/data/mockData';
import { runDemandSimulation } from '@/lib/riskEngine';

export default function SimulationPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const [demandIncrease, setDemandIncrease] = useState<number>(30);

  const simulation = useMemo(() => {
    return runDemandSimulation(inventory, demandIncrease);
  }, [inventory, demandIncrease]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
            What-If Demand Simulation
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
            Model regional consumption surges (+10% to +50%) in memory to forecast accelerated inventory depletion.
          </p>
        </div>

        {/* Demand Selector */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 rounded-md"
          style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          {[0, 10, 20, 30, 50].map((pct) => (
            <button
              key={pct}
              onClick={() => setDemandIncrease(pct)}
              className="px-2.5 sm:px-3 py-1 text-xs rounded font-medium transition-all"
              style={{
                backgroundColor: demandIncrease === pct ? 'var(--accent)' : 'transparent',
                color: demandIncrease === pct ? 'var(--accent-text)' : 'var(--text-2)',
                fontWeight: demandIncrease === pct ? 600 : 500,
              }}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>Newly Critical Shortages</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: '#dc2626' }}>+{simulation.newlyCriticalCount}</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>medicines drop to ≤ 3 days</span>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>Total Critical Facilities</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>{simulation.simulatedCriticalCount}</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>(baseline: {simulation.baselineCriticalCount})</span>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>Risk Tier Worsened</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ color: '#d97706' }}>{simulation.worsenedRiskCount}</span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>inventories affected</span>
          </div>
        </div>
      </div>

      {/* Before vs After Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Stress Test Results (+{demandIncrease}% Demand)
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>In-memory recalculation • No database changes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" style={{ minWidth: '700px' }}>
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
                <th className="py-2.5 px-4 text-right">Stock</th>
                <th className="py-2.5 px-4 text-center">Baseline Daily</th>
                <th className="py-2.5 px-4 text-center">Baseline Runway</th>
                <th className="py-2.5 px-4 text-center">Simulated Daily</th>
                <th className="py-2.5 px-4 text-center">Simulated Runway</th>
                <th className="py-2.5 px-4 text-center">Simulated Risk</th>
                <th className="py-2.5 px-4 text-center">Impact</th>
              </tr>
            </thead>
            <tbody>
              {simulation.results.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-2.5 px-4 font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.medicine.name}
                  </td>
                  <td className="py-2.5 px-4" style={{ color: 'var(--text-2)' }}>
                    {item.facility.city}
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.current_stock}
                  </td>
                  <td className="py-2.5 px-4 text-center" style={{ color: 'var(--text-3)' }}>
                    {item.baseline_consumption}/d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono" style={{ color: 'var(--text-2)' }}>
                    {item.baseline_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.simulated_consumption}/d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-medium" style={{ color: 'var(--text-1)' }}>
                    {item.simulated_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          item.simulated_risk === 'CRITICAL'
                            ? 'rgba(220,38,38,0.12)'
                            : item.simulated_risk === 'HIGH'
                            ? 'rgba(217,119,6,0.12)'
                            : 'rgba(22,163,74,0.12)',
                        color:
                          item.simulated_risk === 'CRITICAL'
                            ? '#dc2626'
                            : item.simulated_risk === 'HIGH'
                            ? '#d97706'
                            : '#16a34a',
                        border: `1px solid ${
                          item.simulated_risk === 'CRITICAL'
                            ? 'rgba(220,38,38,0.25)'
                            : item.simulated_risk === 'HIGH'
                            ? 'rgba(217,119,6,0.25)'
                            : 'rgba(22,163,74,0.25)'
                        }`,
                      }}
                    >
                      {item.simulated_risk}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.is_newly_critical ? (
                      <span className="text-[11px] font-semibold" style={{ color: '#dc2626' }}>
                        Newly Critical
                      </span>
                    ) : item.has_risk_worsened ? (
                      <span className="text-[11px]" style={{ color: '#d97706' }}>Worsened</span>
                    ) : (
                      <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{item.days_change}d</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
