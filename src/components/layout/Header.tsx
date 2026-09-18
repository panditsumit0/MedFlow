'use client';

import React from 'react';
import { AlertTriangle, Clock, Sun, Moon, Monitor, Menu, Activity } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/lib/themeContext';
import { useNav } from '@/lib/navContext';

const themeOptions: { value: 'light' | 'dark' | 'system'; icon: React.ElementType; label: string }[] = [
  { value: 'light',  icon: Sun,     label: 'Light'  },
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'dark',   icon: Moon,    label: 'Dark'   },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleMobileMenu } = useNav();

  return (
    <header
      className="px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        transition: 'background-color 0.25s ease',
        minHeight: '56px',
      }}
    >
      {/* Left: hamburger (mobile) + brand (mobile only) */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only visible on mobile (< lg) */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded-md transition-colors"
          style={{ color: 'var(--text-2)' }}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand — only on mobile since desktop has the sidebar */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-bg)' }}
          >
            <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>
            MedFlow
          </span>
        </Link>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Regional Medicine Shortage Intelligence
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
            Rajasthan Healthcare Network — early-warning inventory monitoring
          </p>
        </div>
      </div>

      {/* Right: badges + theme toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simulation badge — hide label on very small screens */}
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="hidden xs:inline sm:inline">Simulation</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
          <Clock className="w-3 h-3" />
          <span>Demo</span>
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
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[11px] font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--surface)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-3)',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
