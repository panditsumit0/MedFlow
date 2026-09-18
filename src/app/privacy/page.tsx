import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'MedFlow privacy policy — how we handle data in the regional medicine shortage intelligence system.',
};

const LAST_UPDATED = 'September 18, 2026';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto pb-16">
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-3)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--text-2)' }}>Dashboard</Link>
        <span>/</span>
        <span>Privacy Policy</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
          Privacy Policy
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>1. Overview</h2>
          <p>
            MedFlow is a regional medicine shortage intelligence system built as a hackathon demonstration project.
            This privacy policy explains what data is processed by this application and how it is handled.
          </p>
          <p className="mt-2">
            This application operates entirely on <strong style={{ color: 'var(--text-1)' }}>simulated demo data</strong>.
            No real patient information, facility records, or personal health data is collected, stored, or processed.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>2. Data We Do Not Collect</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>No personal health records or patient data</li>
            <li>No names, addresses, or contact information</li>
            <li>No payment or financial information</li>
            <li>No biometric or sensitive health information</li>
            <li>No account credentials (there is no login system)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>3. Local Storage</h2>
          <p>
            MedFlow stores one item in your browser&apos;s <code style={{ backgroundColor: 'var(--surface-2)', padding: '1px 4px', borderRadius: 3 }}>localStorage</code>:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>
              <code style={{ backgroundColor: 'var(--surface-2)', padding: '1px 4px', borderRadius: 3 }}>medflow-theme</code>
              — your preferred colour theme (light, dark, or system). This value never leaves your device.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>4. Third-Party Services</h2>
          <p>This application uses the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>
              <strong style={{ color: 'var(--text-1)' }}>OpenStreetMap</strong> — map tiles are loaded from
              openstreetmap.org for the Regional Map page. OSM tile requests include your IP address.
              See the <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer"
                className="underline">OpenStreetMap Foundation Privacy Policy</a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>5. Demo Data Disclaimer</h2>
          <p>
            All facility names, inventory figures, consumption rates, and shortage alerts shown in this application
            are fictional and generated for demonstration purposes only. They do not represent real healthcare
            facilities, real medicine shortages, or actual health system data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>6. Contact</h2>
          <p>
            For questions about this privacy policy, contact the MedFlow team at{' '}
            <a href="mailto:contact@panditsumit0.dev" className="underline">contact@panditsumit0.dev</a>.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 flex gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}>
        <Link href="/terms" className="underline">Terms of Service</Link>
        <Link href="/" className="underline">Return to Dashboard</Link>
      </div>
    </div>
  );
}
