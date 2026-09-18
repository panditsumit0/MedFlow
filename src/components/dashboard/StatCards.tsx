import React from 'react';
import { DashboardStats } from '@/types';
import { Building2, Pill, AlertTriangle, ShieldAlert, Radio } from 'lucide-react';

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Facilities',
      value: stats.totalFacilities,
      subtext: 'Monitored across Rajasthan',
      icon: Building2,
      accent: 'var(--accent)',
      accentBg: 'var(--accent-bg)',
    },
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      subtext: 'Essential drug catalog',
      icon: Pill,
      accent: '#16a34a',
      accentBg: 'rgba(22,163,74,0.1)',
    },
    {
      title: 'Critical',
      value: stats.criticalMedicinesCount,
      subtext: '3 days or less',
      icon: AlertTriangle,
      accent: '#dc2626',
      accentBg: 'rgba(220,38,38,0.1)',
      valueOverride: stats.criticalMedicinesCount > 0 ? '#dc2626' : undefined,
    },
    {
      title: 'At Risk',
      value: stats.facilitiesAtRiskCount,
      subtext: 'Shortage within 7d',
      icon: ShieldAlert,
      accent: '#d97706',
      accentBg: 'rgba(217,119,6,0.1)',
      valueOverride: stats.facilitiesAtRiskCount > 0 ? '#b45309' : undefined,
    },
    {
      title: 'Regional Alerts',
      value: stats.regionalShortageAlertsCount,
      subtext: 'Multi-district signal',
      icon: Radio,
      accent: '#7c3aed',
      accentBg: 'rgba(124,58,237,0.1)',
      valueOverride: stats.regionalShortageAlertsCount > 0 ? '#7c3aed' : undefined,
    },
  ];

  return (
    /* 2 cols on mobile (≥320px), 3 on sm, 5 on lg */
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        /* Last card spans full width when count is odd on smallest grid */
        const isLast = i === cards.length - 1;
        return (
          <div
            key={card.title}
            className={`rounded-lg p-3 sm:p-4${isLast ? ' col-span-2 sm:col-span-1' : ''}`}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-medium leading-tight" style={{ color: 'var(--text-2)' }}>
                {card.title}
              </span>
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: card.accentBg }}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" style={{ color: card.accent }} />
              </div>
            </div>

            <div className="text-xl sm:text-2xl font-bold" style={{ color: card.valueOverride ?? 'var(--text-1)' }}>
              {card.value}
            </div>
            <p className="text-[10px] sm:text-[11px] mt-0.5 leading-tight" style={{ color: 'var(--text-3)' }}>
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
