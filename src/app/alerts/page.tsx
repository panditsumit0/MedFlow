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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Shortage Alerts &amp; Early Warnings
            </h1>
            <span className="text-xs font-semibold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full border border-red-200">
              {allAlerts.length} Active Operational Triggers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications prioritized by shortage runway, multi-district vulnerability, and redistribution feasibility.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Critical Shortage', 'High Risk', 'Regional Shortage', 'Redistribution Opportunity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? `All Alerts (${allAlerts.length})` : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No alerts match the selected criteria.</p>
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
                className={`rounded-2xl border p-5 shadow-xs transition-all ${
                  isCritical
                    ? 'bg-red-50/40 border-red-200'
                    : isHigh
                    ? 'bg-orange-50/40 border-orange-200'
                    : isRegional
                    ? 'bg-purple-50/40 border-purple-200'
                    : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Icon & Info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isCritical
                          ? 'bg-red-600 text-white'
                          : isHigh
                          ? 'bg-orange-500 text-white'
                          : isRegional
                          ? 'bg-purple-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isCritical && <AlertOctagon className="w-5 h-5" />}
                      {isHigh && <AlertTriangle className="w-5 h-5" />}
                      {isRegional && <Radio className="w-5 h-5" />}
                      {isRedistribution && <ArrowLeftRight className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">
                          {alert.medicine_name}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            isCritical
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : isHigh
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : isRegional
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {alert.category}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          • {alert.facility_name}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {alert.explanation}
                      </p>

                      {/* Recommended Action */}
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-1.5 text-xs">
                        <strong className="text-slate-800 shrink-0">Recommended Action:</strong>
                        <span className="text-slate-600">{alert.recommended_action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Shortage Runway & Action Buttons */}
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-800 shadow-2xs">
                      {alert.projected_shortage}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={isRedistribution ? '/redistribution' : '/predictions'}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1"
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
