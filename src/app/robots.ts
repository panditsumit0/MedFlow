import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Internal dashboard — disallow all crawlers
        userAgent: '*',
        disallow: '/',
      },
    ],
    // sitemap is still declared so it can be submitted manually
    sitemap: 'https://medflow.panditsumit0.dev/sitemap.xml',
  };
}
