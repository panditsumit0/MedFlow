'use client';

import React, { useState, useMemo } from 'react';
import { getEnrichedInventory } from '@/data/mockData';
import { generateRedistributionRecommendations } from '@/lib/riskEngine';
import { RedistributionRecommendation } from '@/types';
import { RefreshCw, HelpCircle, Truck, ArrowRight, X } from 'lucide-react';

export default function RedistributionPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<RedistributionRecommendation[]>(() =>
    generateRedistributionRecommendations(inventory)
  );
  const [selectedRec, setSelectedRec] = useState<RedistributionRecommendation | null>(null);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setRecommendations(generateRedistributionRecommendations(inventory));
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Stock Redistribution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated recommendations matching facilities facing shortages (≤ 7 days) with nearest surplus donors.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Recalculating...' : 'Refresh Recommendations'}</span>
        </button>
      </div>

      {/* Primary Highlight Transfer Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Primary Recommended Transfer
          </span>
          <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
            Immediate Feasibility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="text-slate-400 block text-[11px]">Donor Facility (Surplus)</span>
            <strong className="text-slate-900 block mt-0.5 text-sm">Kota Government Hospital</strong>
            <span className="text-slate-500">Stock: 1,500 units (50 days) • Surplus: +1,200 units</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-center items-center text-center">
            <span className="text-slate-400 text-[11px]">Recommended Transfer</span>
            <strong className="text-slate-900 text-lg font-bold">500 units Paracetamol</strong>
            <span className="text-slate-500 text-[11px]">~210 km highway distance</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="text-slate-400 block text-[11px]">Destination Facility (Critical)</span>
            <strong className="text-slate-900 block mt-0.5 text-sm">Jaipur Government Hospital</strong>
            <span className="text-slate-500">
              Current: 50 units (2 days) ➔ Post-Transfer: <strong>22 days (Safe)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Full Recommendations Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            Active Transfer Recommendations ({recommendations.length})
          </h3>
          <p className="text-xs text-slate-500">
            Decision-support suggestions — transfers require health authority approval
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4">Medicine</th>
                <th className="py-2.5 px-4">From (Donor)</th>
                <th className="py-2.5 px-4">To (Recipient)</th>
                <th className="py-2.5 px-4 text-right">Transfer Qty</th>
                <th className="py-2.5 px-4 text-center">Distance</th>
                <th className="py-2.5 px-4 text-center">Runway Impact</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommendations.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {rec.medicine.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{rec.source_facility.city}</div>
                    <span className="text-[11px] text-slate-400">{rec.source_stock} units ({rec.source_days_remaining}d)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div>{rec.destination_facility.city}</div>
                    <span className="text-[11px] text-red-600 font-medium">{rec.destination_days_remaining}d left</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
                    {rec.suggested_transfer_quantity} units
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    ~{rec.estimated_distance_km} km
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {rec.destination_days_remaining}d ➔ <strong className="text-emerald-700">{rec.destination_days_after_transfer}d</strong>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedRec(rec)}
                      className="text-slate-500 hover:text-slate-900 font-medium text-xs hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900">
                Transfer Recommendation Details
              </h4>
              <button
                onClick={() => setSelectedRec(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed">{selectedRec.reason}</p>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px]">Recipient:</span>
                  <strong>{selectedRec.destination_facility.name}</strong>
                  <span className="block mt-1">Runway: {selectedRec.destination_days_remaining}d ➔ {selectedRec.destination_days_after_transfer}d</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-400 block text-[10px]">Donor:</span>
                  <strong>{selectedRec.source_facility.name}</strong>
                  <span className="block mt-1">Buffer: {selectedRec.source_days_remaining}d ➔ {selectedRec.source_days_after_transfer}d</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Suggested quantity balances recipient need with donor safety buffer.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedRec(null)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
