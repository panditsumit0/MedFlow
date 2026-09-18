import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-md w-full text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6"
          style={{ backgroundColor: 'var(--accent-bg)' }}
        >
          <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>404</span>
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/map"
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--text-1)',
              border: '1px solid var(--border)',
            }}
          >
            View Regional Map
          </Link>
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs mb-3" style={{ color: 'var(--text-3)' }}>
            Available pages
          </p>
          <nav className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Dashboard', href: '/' },
              { label: 'Map', href: '/map' },
              { label: 'Medicines', href: '/medicines' },
              { label: 'Facilities', href: '/facilities' },
              { label: 'Predictions', href: '/predictions' },
              { label: 'Redistribution', href: '/redistribution' },
              { label: 'Alerts', href: '/alerts' },
              { label: 'Simulation', href: '/simulation' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs px-2.5 py-1 rounded transition-colors"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
