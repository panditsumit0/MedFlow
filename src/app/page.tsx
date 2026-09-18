'use client';

import React, { useState } from 'react';
import StatCards from '@/components/dashboard/StatCards';
import RegionalStatusBanner from '@/components/dashboard/RegionalStatusBanner';
import ShortageTable from '@/components/dashboard/ShortageTable';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import ExplainRiskModal from '@/components/dashboard/ExplainRiskModal';
import { getEnrichedInventory, getDashboardStats } from '@/data/mockData';
import { detectRegionalShortages } from '@/lib/riskEngine';
import { EnrichedInventoryItem } from '@/types';

export default function DashboardPage() {
  const [inventory] = useState(() => getEnrichedInventory());
  const [stats] = useState(() => getDashboardStats());
  const [regionalAlerts] = useState(() => detectRegionalShortages(inventory));
  const [selectedExplainItem, setSelectedExplainItem] = useState<EnrichedInventoryItem | null>(null);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-1)' }}>
            Dashboard Overview
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
            Inventory depletion monitoring across 10 Rajasthan healthcare facilities
          </p>
        </div>
        <div
          className="self-start sm:self-auto text-[11px] font-medium px-2.5 py-1 rounded"
          style={{
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
          }}
        >
          Simulation Data · Sept 2026
        </div>
      </div>

      {/* Stats */}
      <StatCards stats={stats} />

      {/* Regional Alerts */}
      <RegionalStatusBanner alerts={regionalAlerts} />

      {/* Charts */}
      <DashboardCharts />

      {/* Table */}
      <ShortageTable
        items={inventory}
        onSelectForExplanation={(item) => setSelectedExplainItem(item)}
      />

      {/* Explainability Modal */}
      <ExplainRiskModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />
    </div>
  );
}
