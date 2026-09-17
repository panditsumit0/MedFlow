import React from 'react';
import { RegionalShortageAlert } from '@/types';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RegionalStatusBannerProps {
  alerts: RegionalShortageAlert[];
}

export default function RegionalStatusBanner({ alerts }: RegionalStatusBannerProps) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: '#d97706' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Regional Health Status
          </h2>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: alerts.length > 0 ? 'rgba(217,119,6,0.12)' : 'rgba(22,163,74,0.12)',
            color: alerts.length > 0 ? '#b45309' : '#16a34a',
          }}
        >
          {alerts.length > 0 ? `${alerts.length} active regional alerts` : 'All clear'}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#16a34a' }}>
            <CheckCircle2 className="w-4 h-4" />
            No multi-facility shortages detected.
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.risk_severity === 'CRITICAL';
            return (
              <div
                key={alert.id}
                className="p-4 rounded-lg"
                style={{
                  border: `1px solid ${isCritical ? 'rgba(220,38,38,0.25)' : 'rgba(217,119,6,0.25)'}`,
                  backgroundColor: isCritical
                    ? 'rgba(220,38,38,0.06)'
                    : 'rgba(217,119,6,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                      {alert.medicine_name}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isCritical ? 'rgba(220,38,38,0.15)' : 'rgba(217,119,6,0.15)',
                        color: isCritical ? '#dc2626' : '#d97706',
                      }}
                    >
                      {alert.risk_severity} REGIONAL RISK
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {alert.affected_facilities_count} facilities
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>
                  {alert.explanation}
                </p>

                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2.5 text-xs"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium" style={{ color: 'var(--text-3)' }}>Depleting:</span>
                    {alert.facilities.map((f) => (
                      <span
                        key={f.facility_id}
                        className="px-2 py-0.5 rounded text-[11px]"
                        style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#dc2626' }}
                      >
                        {f.city} ({f.days_remaining}d)
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium" style={{ color: 'var(--text-3)' }}>Surplus:</span>
                    {alert.surplus_facilities.length > 0 ? (
                      alert.surplus_facilities.map((s) => (
                        <span
                          key={s.facility_id}
                          className="px-2 py-0.5 rounded text-[11px] font-medium"
                          style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#16a34a' }}
                        >
                          {s.city} (+{s.surplus_stock} units)
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-3)' }} className="text-[11px]">
                        No local surplus identified
                      </span>
                    )}
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
