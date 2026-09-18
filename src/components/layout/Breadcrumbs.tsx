'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

const ROUTE_LABELS: Record<string, string> = {
  '/':               'Dashboard',
  '/map':            'Regional Map',
  '/medicines':      'Medicines',
  '/facilities':     'Facilities',
  '/predictions':    'Shortage Predictions',
  '/redistribution': 'Redistribution',
  '/alerts':         'Alerts',
  '/simulation':     'What-If Simulation',
  '/privacy':        'Privacy Policy',
  '/terms':          'Terms of Service',
};

function buildCrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/' }];
  if (pathname === '/') return crumbs;

  const label = ROUTE_LABELS[pathname];
  if (label) crumbs.push({ label, href: pathname });

  return crumbs;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname);

  // Don't render on root
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 mb-4">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {i === 0 && (
              <Home className="w-3 h-3 shrink-0" style={{ color: 'var(--text-3)' }} />
            )}
            {isLast ? (
              <span className="text-xs font-medium" style={{ color: 'var(--text-1)' }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-xs hover:underline"
                style={{ color: 'var(--text-3)' }}
              >
                {crumb.label}
              </Link>
            )}
            {!isLast && (
              <ChevronRight className="w-3 h-3 shrink-0" style={{ color: 'var(--text-3)' }} />
            )}
          </span>
        );
      })}
    </nav>
  );
}
