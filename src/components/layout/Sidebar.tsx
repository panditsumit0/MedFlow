'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Pill,
  Building2,
  TrendingDown,
  ArrowLeftRight,
  Bell,
  SlidersHorizontal,
  Activity,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard',           href: '/',             icon: LayoutDashboard  },
  { name: 'Regional Map',        href: '/map',           icon: MapPin           },
  { name: 'Medicines',           href: '/medicines',     icon: Pill             },
  { name: 'Facilities',          href: '/facilities',    icon: Building2        },
  { name: 'Shortage Predictions',href: '/predictions',   icon: TrendingDown     },
  { name: 'Redistribution',      href: '/redistribution',icon: ArrowLeftRight,  badge: true },
  { name: 'Alerts',              href: '/alerts',        icon: Bell             },
  { name: 'What-If Simulation',  href: '/simulation',    icon: SlidersHorizontal},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex flex-col shrink-0 min-h-screen"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Brand */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">MedFlow</span>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--sidebar-text)' }}>
              Shortage Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p
          className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--sidebar-section)' }}
        >
          Operations
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sidebar-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? 'var(--sidebar-active-icon)' : 'var(--sidebar-icon)' }}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}
                >
                  ✦
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3.5 space-y-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
          <span className="text-[11px]" style={{ color: 'var(--sidebar-bottom)' }}>
            Rajasthan · 10 facilities · Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/privacy"
            className="text-[10px] hover:underline"
            style={{ color: 'var(--sidebar-section)' }}
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[10px] hover:underline"
            style={{ color: 'var(--sidebar-section)' }}
          >
            Terms
          </Link>
        </div>
      </div>
    </aside>
  );
}
