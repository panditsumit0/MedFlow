'use client';

import React from 'react';
import { EnrichedInventoryItem } from '@/types';
import { X } from 'lucide-react';

interface ExplainRiskModalProps {
  item: EnrichedInventoryItem | null;
  onClose: () => void;
}

export default function ExplainRiskModal({ item, onClose }: ExplainRiskModalProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
              Shortage Risk Breakdown
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>
              Transparent inventory calculation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-3)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span
              className="text-[11px] uppercase font-medium tracking-wider"
              style={{ color: 'var(--text-3)' }}
            >
              Target Medicine
            </span>
            <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-1)' }}>
              {item.medicine.name}
            </p>
            <p style={{ color: 'var(--text-2)' }}>
              {item.facility.name} ({item.facility.city})
            </p>
          </div>

          {/* Formula box */}
          <div
            className="p-3 rounded-lg space-y-2"
            style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span className="font-semibold block" style={{ color: 'var(--text-2)' }}>Formula:</span>
            <div className="font-mono" style={{ color: 'var(--text-1)' }}>
              days_remaining = {item.current_stock} ÷ {item.daily_consumption} ={' '}
              <strong>{item.days_remaining} days</strong>
            </div>
            <div
              className="text-[11px] pt-1"
              style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}
            >
              Current stock: {item.current_stock} units · Consumption: {item.daily_consumption} units/day
            </div>
          </div>

          {item.incoming_stock > 0 && (
            <div style={{ color: 'var(--text-2)' }}>
              Incoming shipment of{' '}
              <strong style={{ color: '#2563eb' }}>{item.incoming_stock} units</strong>{' '}
              extends projected buffer to{' '}
              <strong style={{ color: '#2563eb' }}>{item.projected_days_remaining} days</strong>.
            </div>
          )}

          {/* Summary box */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <span className="font-semibold block mb-1" style={{ color: 'var(--text-1)' }}>
              Summary:
            </span>
            <p style={{ color: 'var(--text-2)' }}>{item.explanation.summary}</p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex justify-end"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
