import type { MetadataRoute } from 'next';

const BASE = 'https://books.aziral.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static public surfaces only. The OPDS catalogue is browsed
  // programmatically via /api/v1/opds/* and need not appear here — search
  // engines should discover books through the public landing/library if/when
  // we ship one, not by crawling 30k atom feeds.
  const now = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/legal/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE}/legal/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE}/legal/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
