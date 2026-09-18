'use client';

import React from 'react';
import { AlertTriangle, Clock, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/themeContext';

const themeOptions: { value: 'light' | 'dark' | 'system'; icon: React.ElementType; label: string }[] = [
  { value: 'light',  icon: Sun,     label: 'Light'  },
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'dark',   icon: Moon,    label: 'Dark'   },
];

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="px-6 py-3 flex items-center justify-between sticky top-0 z-10"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.25s ease',
      }}
    >
      <div>
        <h1 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
          Regional Medicine Shortage Intelligence
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
          Rajasthan Healthcare Network — early-warning inventory monitoring
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Simulation badge */}
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span>Simulation Mode</span>
        </div>

        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
          <Clock className="w-3 h-3" />
          <span>Demo data</span>
        </div>

        {/* Theme toggle */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-1"
          style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
        >
          {themeOptions.map(({ value, icon: Icon, label }) => {
            const isActive = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                title={`${label} mode`}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--surface)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-3)',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
