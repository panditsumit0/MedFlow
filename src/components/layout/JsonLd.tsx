/**
 * JsonLd — renders structured data (JSON-LD) as a <script> tag.
 * Use in server components or layouts for rich search results.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Pre-built schema for the MedFlow web application */
export const medflowAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MedFlow',
  alternateName: 'MedFlow Regional Medicine Shortage Intelligence',
  url: 'https://medflow.panditsumit0.dev',
  description:
    'Monitors medicine inventory across Rajasthan healthcare facilities, predicts shortage risks before they spread, and recommends stock redistribution routes.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  creator: {
    '@type': 'Person',
    name: 'Sumit Kumar',
    url: 'https://github.com/panditsumit0',
  },
  keywords: [
    'medicine shortage prediction',
    'healthcare inventory',
    'Rajasthan',
    'drug supply chain',
    'shortage intelligence',
  ],
};
