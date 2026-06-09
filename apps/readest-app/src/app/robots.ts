import type { MetadataRoute } from 'next';

const BASE = 'https://books.aziral.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/legal/', '/legal/terms', '/legal/privacy', '/legal/about'],
        // Authenticated areas, internal APIs, and the short-link / inbox
        // surfaces have nothing useful for search engines and may leak
        // signed URLs in the query string. Keep them out of the index.
        disallow: [
          '/api/',
          '/auth/',
          '/library',
          '/library/',
          '/reader',
          '/reader/',
          '/user',
          '/user/',
          '/send',
          '/s/',
          '/o/',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
