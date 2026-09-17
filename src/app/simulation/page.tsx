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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            What-If Demand Simulation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Model regional consumption surges (+10% to +50%) in memory to forecast accelerated inventory depletion.
          </p>
        </div>

        {/* Demand Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
          {[0, 10, 20, 30, 50].map((pct) => (
            <button
              key={pct}
              onClick={() => setDemandIncrease(pct)}
              className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                demandIncrease === pct
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              +{pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Newly Critical Shortages</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">+{simulation.newlyCriticalCount}</span>
            <span className="text-xs text-slate-400">medicines drop to ≤ 3 days</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Total Critical Facilities</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{simulation.simulatedCriticalCount}</span>
            <span className="text-xs text-slate-400">(baseline: {simulation.baselineCriticalCount})</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Risk Tier Worsened</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{simulation.worsenedRiskCount}</span>
            <span className="text-xs text-slate-400">inventories affected</span>
          </div>
        </div>
      </div>

      {/* Before vs After Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            Stress Test Results (+{demandIncrease}% Demand)
          </h3>
          <p className="text-xs text-slate-500">In-memory recalculation • No database changes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
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
            <tbody className="divide-y divide-slate-100">
              {simulation.results.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {item.medicine.name}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    {item.facility.city}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-900 font-medium">
                    {item.current_stock}
                  </td>
                  <td className="py-2.5 px-4 text-center text-slate-500">
                    {item.baseline_consumption}/d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-700">
                    {item.baseline_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center font-medium text-slate-900">
                    {item.simulated_consumption}/d
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-medium text-slate-900">
                    {item.simulated_days_remaining}d
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        item.simulated_risk === 'CRITICAL'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.simulated_risk === 'HIGH'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.simulated_risk}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {item.is_newly_critical ? (
                      <span className="text-[11px] text-red-700 font-semibold">
                        Newly Critical
                      </span>
                    ) : item.has_risk_worsened ? (
                      <span className="text-[11px] text-amber-700">Worsened</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">{item.days_change}d</span>
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
