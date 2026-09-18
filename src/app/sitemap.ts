import type { MetadataRoute } from 'next';

const BASE_URL = 'https://medflow.panditsumit0.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '/',               priority: 1.0, changeFrequency: 'daily'   },
    { path: '/map',            priority: 0.9, changeFrequency: 'daily'   },
    { path: '/medicines',      priority: 0.8, changeFrequency: 'daily'   },
    { path: '/facilities',     priority: 0.8, changeFrequency: 'daily'   },
    { path: '/predictions',    priority: 0.8, changeFrequency: 'daily'   },
    { path: '/redistribution', priority: 0.7, changeFrequency: 'weekly'  },
    { path: '/alerts',         priority: 0.7, changeFrequency: 'daily'   },
    { path: '/simulation',     priority: 0.6, changeFrequency: 'weekly'  },
    { path: '/privacy',        priority: 0.2, changeFrequency: 'monthly' },
    { path: '/terms',          priority: 0.2, changeFrequency: 'monthly' },
  ] as const;

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
