import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'MedFlow terms of service — conditions for using the regional medicine shortage intelligence demonstration system.',
};

const LAST_UPDATED = 'September 18, 2026';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto pb-16">
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-3)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--text-2)' }}>Dashboard</Link>
        <span>/</span>
        <span>Terms of Service</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
          Terms of Service
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>1. Nature of This Application</h2>
          <p>
            MedFlow is a hackathon demonstration project created to showcase predictive inventory monitoring
            for regional healthcare supply chains. It is not a production healthcare system and must not be
            used to make real clinical or procurement decisions.
          </p>
          <p className="mt-2">
            All data displayed is simulated. No real inventory, patient, or facility data is present.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>2. No Medical Advice</h2>
          <p>
            Nothing in MedFlow constitutes medical advice, clinical guidance, or official health system direction.
            Shortage risk calculations are estimations based on simulated data and must not be relied upon
            for any real-world health or procurement decision.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>3. Permitted Use</h2>
          <p>You may use MedFlow to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Evaluate the concept and technical architecture</li>
            <li>Demonstrate the shortage prediction methodology</li>
            <li>Test the user interface and data visualisations</li>
          </ul>
          <p className="mt-3">You may not use MedFlow to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>Make real procurement, clinical, or policy decisions</li>
            <li>Represent simulated data as factual health system records</li>
            <li>Attempt to extract, scrape, or misuse system data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>4. Intellectual Property</h2>
          <p>
            The MedFlow codebase is open-source and available at{' '}
            <a href="https://github.com/panditsumit0/MedFlow" target="_blank" rel="noopener noreferrer"
              className="underline">github.com/panditsumit0/MedFlow</a>.
            The shortage risk engine, redistribution algorithms, and simulation logic are original work by the MedFlow team.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>5. Disclaimer of Warranties</h2>
          <p>
            MedFlow is provided &ldquo;as is&rdquo; without warranty of any kind. The authors make no representations
            about accuracy, completeness, or fitness for any particular purpose. Use of this application is
            entirely at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, the MedFlow team shall not be liable for any direct,
            indirect, incidental, or consequential damages arising from the use or inability to use this application.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>7. Changes to These Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the application after changes constitutes
            acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>8. Contact</h2>
          <p>
            For questions about these terms, contact{' '}
            <a href="mailto:contact@panditsumit0.dev" className="underline">contact@panditsumit0.dev</a>.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 flex gap-4 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}>
        <Link href="/privacy" className="underline">Privacy Policy</Link>
        <Link href="/" className="underline">Return to Dashboard</Link>
      </div>
    </div>
  );
}
