'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Activity } from 'lucide-react';
import {
  LayoutDashboard, MapPin, Pill, Building2,
  TrendingDown, ArrowLeftRight, Bell, SlidersHorizontal,
} from 'lucide-react';
import { useNav } from '@/lib/navContext';

const navItems = [
  { name: 'Dashboard',            href: '/',              icon: LayoutDashboard   },
  { name: 'Regional Map',         href: '/map',            icon: MapPin            },
  { name: 'Medicines',            href: '/medicines',      icon: Pill              },
  { name: 'Facilities',           href: '/facilities',     icon: Building2         },
  { name: 'Shortage Predictions', href: '/predictions',    icon: TrendingDown      },
  { name: 'Redistribution',       href: '/redistribution', icon: ArrowLeftRight, badge: true },
  { name: 'Alerts',               href: '/alerts',         icon: Bell              },
  { name: 'What-If Simulation',   href: '/simulation',     icon: SlidersHorizontal },
];

export default function MobileDrawer() {
  const { isMobileMenuOpen, closeMobileMenu } = useNav();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300 lg:hidden"
        style={{
          backgroundColor: 'rgba(0,0,0,0.55)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
        aria-label="Navigation menu"
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--sidebar-brand-bg)' }}
            >
              <Activity className="w-4 h-4" style={{ color: 'var(--sidebar-active-icon)' }} />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">MedFlow</span>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--sidebar-text)' }}>
                Shortage Intelligence
              </p>
            </div>
          </Link>

          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md transition-colors"
            style={{ color: 'var(--sidebar-text)' }}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" role="navigation">
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
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                }}
              >
                <div className="flex items-center gap-3">
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
                    Key Feature
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="p-4 space-y-2"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#4ade80' }} />
            <span className="text-[11px]" style={{ color: 'var(--sidebar-bottom)' }}>
              Rajasthan · 10 facilities · Demo
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              onClick={closeMobileMenu}
              className="text-[11px] hover:underline"
              style={{ color: 'var(--sidebar-section)' }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              onClick={closeMobileMenu}
              className="text-[11px] hover:underline"
              style={{ color: 'var(--sidebar-section)' }}
            >
              Terms
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
