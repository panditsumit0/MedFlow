import Link from 'next/link';
import { Activity } from 'lucide-react';

const footerNav = [
  {
    label: 'Operations',
    links: [
      { name: 'Dashboard',      href: '/' },
      { name: 'Regional Map',   href: '/map' },
      { name: 'Medicines',      href: '/medicines' },
      { name: 'Facilities',     href: '/facilities' },
    ],
  },
  {
    label: 'Tools',
    links: [
      { name: 'Predictions',    href: '/predictions' },
      { name: 'Redistribution', href: '/redistribution' },
      { name: 'Alerts',         href: '/alerts' },
      { name: 'Simulation',     href: '/simulation' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security Checklist', href: 'https://github.com/panditsumit0/MedFlow/blob/main/SECURITY_CHECKLIST.md' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top section: brand + nav columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-bg)' }}
              >
                <Activity className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>
                MedFlow
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
              Regional Medicine Shortage Intelligence System. Predicts shortage risks and recommends stock redistribution across Rajasthan healthcare facilities.
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#4ade80' }} />
              <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>
                Demo — simulation data only
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((group) => (
            <div key={group.label}>
              <h3
                className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: 'var(--text-3)' }}
              >
                {group.label}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs hover:underline transition-colors"
                      style={{ color: 'var(--text-2)' }}
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}
        >
          <span>
            MedFlow · MUJ Hackathon 2026 · Rajasthan, India
          </span>
          <span>
            All data is simulated. Not for clinical use.
          </span>
        </div>
      </div>
    </footer>
  );
}
