'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getEnrichedInventory } from '@/data/mockData';
import {
  detectRegionalShortages,
  generateRedistributionRecommendations,
  generateAlerts
} from '@/lib/riskEngine';
import { AlertItem } from '@/types';
import {
  AlertTriangle,
  AlertOctagon,
  Radio,
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  ArrowRight,
  Search,
  Building2,
  Clock
} from 'lucide-react';

export default function AlertsPage() {
  const inventory = useMemo(() => getEnrichedInventory(), []);
  const regionalAlerts = useMemo(() => detectRegionalShortages(inventory), [inventory]);
  const recommendations = useMemo(() => generateRedistributionRecommendations(inventory), [inventory]);

  const allAlerts = useMemo(
    () => generateAlerts(inventory, regionalAlerts, recommendations),
    [inventory, regionalAlerts, recommendations]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (selectedCategory !== 'ALL' && alert.category !== selectedCategory) {
        return false;
      }
      if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMed = alert.medicine_name.toLowerCase().includes(q);
        const matchFac = alert.facility_name.toLowerCase().includes(q);
        const matchExp = alert.explanation.toLowerCase().includes(q);
        if (!matchMed && !matchFac && !matchExp) return false;
      }
      return true;
    });
  }, [allAlerts, selectedCategory, selectedSeverity, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
              Shortage Alerts &amp; Early Warnings
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(220,38,38,0.1)',
                color: '#dc2626',
                border: '1px solid rgba(220,38,38,0.25)',
              }}
            >
              {allAlerts.length} Active Operational Triggers
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            Automated notifications prioritized by shortage runway, multi-district vulnerability, and redistribution feasibility.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Critical Shortage', 'High Risk', 'Regional Shortage', 'Redistribution Opportunity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-2.5 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--surface-2)',
                color: selectedCategory === cat ? 'var(--accent-text)' : 'var(--text-2)',
                border: '1px solid var(--border)',
              }}
            >
              {cat === 'ALL' ? `All Alerts (${allAlerts.length})` : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-auto pl-9 pr-3 py-1.5 text-xs rounded focus:outline-none"
            style={{
              backgroundColor: 'var(--input-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
            }}
          />
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div
            className="rounded-lg p-10 text-center"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
          >
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#16a34a' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>No alerts match the selected criteria.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';
            const isRegional = alert.category === 'Regional Shortage';
            const isRedistribution = alert.category === 'Redistribution Opportunity';

            return (
              <div
                key={alert.id}
                className="rounded-lg p-4 sm:p-5 transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${
                    isCritical
                      ? 'rgba(220,38,38,0.3)'
                      : isHigh
                      ? 'rgba(217,119,6,0.3)'
                      : isRegional
                      ? 'rgba(234,179,8,0.3)'
                      : 'rgba(22,163,74,0.3)'
                  }`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Icon & Info */}
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded shrink-0"
                      style={{
                        backgroundColor: isCritical
                          ? 'rgba(220,38,38,0.15)'
                          : isHigh
                          ? 'rgba(217,119,6,0.15)'
                          : isRegional
                          ? 'rgba(234,179,8,0.15)'
                          : 'rgba(22,163,74,0.15)',
                        color: isCritical
                          ? '#dc2626'
                          : isHigh
                          ? '#d97706'
                          : isRegional
                          ? '#b45309'
                          : '#16a34a',
                      }}
                    >
                      {isCritical && <AlertOctagon className="w-4 h-4" />}
                      {isHigh && <AlertTriangle className="w-4 h-4" />}
                      {isRegional && <Radio className="w-4 h-4" />}
                      {isRedistribution && <ArrowLeftRight className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base" style={{ color: 'var(--text-1)' }}>
                          {alert.medicine_name}
                        </span>
                        <span
                          className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: isCritical
                              ? 'rgba(220,38,38,0.12)'
                              : isHigh
                              ? 'rgba(217,119,6,0.12)'
                              : isRegional
                              ? 'rgba(234,179,8,0.12)'
                              : 'rgba(22,163,74,0.12)',
                            color: isCritical
                              ? '#dc2626'
                              : isHigh
                              ? '#d97706'
                              : isRegional
                              ? '#b45309'
                              : '#16a34a',
                            border: `1px solid ${
                              isCritical
                                ? 'rgba(220,38,38,0.25)'
                                : isHigh
                                ? 'rgba(217,119,6,0.25)'
                                : isRegional
                                ? 'rgba(234,179,8,0.25)'
                                : 'rgba(22,163,74,0.25)'
                            }`,
                          }}
                        >
                          {alert.category}
                        </span>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
                          • {alert.facility_name}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                        {alert.explanation}
                      </p>

                      {/* Recommended Action */}
                      <div
                        className="mt-2 pt-2 flex flex-wrap items-start gap-1.5 text-xs"
                        style={{ borderTop: '1px solid var(--border)' }}
                      >
                        <strong className="shrink-0" style={{ color: 'var(--text-1)' }}>Recommended Action:</strong>
                        <span style={{ color: 'var(--text-2)' }}>{alert.recommended_action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Shortage Runway & Action Buttons */}
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-1)',
                      }}
                    >
                      {alert.projected_shortage}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={isRedistribution ? '/redistribution' : '/predictions'}
                        className="text-xs font-semibold px-3 py-1.5 rounded transition-opacity hover:opacity-85 flex items-center gap-1"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--accent-text)',
                        }}
                      >
                        <span>{isRedistribution ? 'View Recommendation' : 'View Predictions'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
