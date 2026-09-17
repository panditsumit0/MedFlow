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
      accent: '#2563eb',
      accentBg: 'rgba(37,99,235,0.1)',
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
      title: 'Critical Medicines',
      value: stats.criticalMedicinesCount,
      subtext: '≤ 3 days remaining',
      icon: AlertTriangle,
      accent: '#dc2626',
      accentBg: 'rgba(220,38,38,0.1)',
      valueOverride: stats.criticalMedicinesCount > 0 ? '#dc2626' : undefined,
    },
    {
      title: 'Facilities At Risk',
      value: stats.facilitiesAtRiskCount,
      subtext: 'Shortage within 7 days',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
                {card.title}
              </span>
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: card.accentBg }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: card.accent }} />
              </div>
            </div>

            <div className="text-2xl font-bold" style={{ color: card.valueOverride ?? 'var(--text-1)' }}>
              {card.value}
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
