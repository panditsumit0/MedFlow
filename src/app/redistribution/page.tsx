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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
            Stock Redistribution
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
            Automated recommendations matching facilities facing shortages (≤ 7 days) with nearest surplus donors.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="self-start sm:self-auto px-3.5 py-2 rounded text-xs font-medium flex items-center gap-2 transition-opacity hover:opacity-85 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Recalculating...' : 'Refresh Recommendations'}</span>
        </button>
      </div>

      {/* Primary Highlight Transfer Card */}
      <div
        className="rounded-lg p-4 sm:p-5 space-y-3"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
            Primary Recommended Transfer
          </span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded"
            style={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              border: '1px solid rgba(22,163,74,0.25)',
            }}
          >
            Immediate Feasibility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div
            className="p-3 rounded"
            style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span className="block text-[11px]" style={{ color: 'var(--text-3)' }}>Donor Facility (Surplus)</span>
            <strong className="block mt-0.5 text-sm" style={{ color: 'var(--text-1)' }}>Kota Government Hospital</strong>
            <span style={{ color: 'var(--text-2)' }}>Stock: 1,500 units (50 days) • Surplus: +1,200 units</span>
          </div>

          <div
            className="p-3 rounded flex flex-col justify-center items-center text-center"
            style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>Recommended Transfer</span>
            <strong className="text-base sm:text-lg font-bold" style={{ color: 'var(--accent)' }}>500 units Paracetamol</strong>
            <span className="text-[11px]" style={{ color: 'var(--text-2)' }}>~210 km highway distance</span>
          </div>

          <div
            className="p-3 rounded"
            style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span className="block text-[11px]" style={{ color: 'var(--text-3)' }}>Destination Facility (Critical)</span>
            <strong className="block mt-0.5 text-sm" style={{ color: 'var(--text-1)' }}>Jaipur Government Hospital</strong>
            <span style={{ color: 'var(--text-2)' }}>
              Current: 50 units (2 days) ➔ Post-Transfer: <strong style={{ color: '#16a34a' }}>22 days (Safe)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Full Recommendations Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Active Transfer Recommendations ({recommendations.length})
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Decision-support suggestions — transfers require health authority approval
          </p>
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
                <th className="py-2.5 px-4">From (Donor)</th>
                <th className="py-2.5 px-4">To (Recipient)</th>
                <th className="py-2.5 px-4 text-right">Transfer Qty</th>
                <th className="py-2.5 px-4 text-center">Distance</th>
                <th className="py-2.5 px-4 text-center">Runway Impact</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr
                  key={rec.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-1)' }}>
                    {rec.medicine.name}
                  </td>
                  <td className="py-3 px-4" style={{ color: 'var(--text-2)' }}>
                    <div>{rec.source_facility.city}</div>
                    <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>{rec.source_stock} units ({rec.source_days_remaining}d)</span>
                  </td>
                  <td className="py-3 px-4" style={{ color: 'var(--text-2)' }}>
                    <div>{rec.destination_facility.city}</div>
                    <span className="text-[11px] font-medium" style={{ color: '#dc2626' }}>{rec.destination_days_remaining}d left</span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: 'var(--text-1)' }}>
                    {rec.suggested_transfer_quantity} units
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: 'var(--text-3)' }}>
                    ~{rec.estimated_distance_km} km
                  </td>
                  <td className="py-3 px-4 text-center" style={{ color: 'var(--text-2)' }}>
                    {rec.destination_days_remaining}d ➔ <strong style={{ color: '#16a34a' }}>{rec.destination_days_after_transfer}d</strong>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedRec(rec)}
                      className="font-medium text-xs hover:underline"
                      style={{ color: 'var(--accent)' }}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="rounded-lg shadow-xl max-w-md w-full p-4 sm:p-5 space-y-4 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                Transfer Recommendation Details
              </h4>
              <button
                onClick={() => setSelectedRec(null)}
                className="p-1 rounded hover:opacity-70"
                style={{ color: 'var(--text-3)' }}
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="leading-relaxed" style={{ color: 'var(--text-2)' }}>{selectedRec.reason}</p>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className="p-2.5 rounded"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>Recipient:</span>
                  <strong style={{ color: 'var(--text-1)' }}>{selectedRec.destination_facility.name}</strong>
                  <span className="block mt-1" style={{ color: 'var(--text-2)' }}>Runway: {selectedRec.destination_days_remaining}d ➔ {selectedRec.destination_days_after_transfer}d</span>
                </div>
                <div
                  className="p-2.5 rounded"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <span className="block text-[10px]" style={{ color: 'var(--text-3)' }}>Donor:</span>
                  <strong style={{ color: 'var(--text-1)' }}>{selectedRec.source_facility.name}</strong>
                  <span className="block mt-1" style={{ color: 'var(--text-2)' }}>Buffer: {selectedRec.source_days_remaining}d ➔ {selectedRec.source_days_after_transfer}d</span>
                </div>
              </div>

              <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                Suggested quantity balances recipient need with donor safety buffer.
              </p>
            </div>

            <div className="pt-2 flex justify-end" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setSelectedRec(null)}
                className="px-4 py-2 rounded text-xs font-semibold hover:opacity-85 transition-opacity"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
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
