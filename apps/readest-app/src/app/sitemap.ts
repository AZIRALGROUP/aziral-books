import type { MetadataRoute } from 'next';

const BASE = 'https://books.aziral.com';
const API = 'https://books.aziral.com/api/v1';
const PAGE_SIZE = 50;

// Regenerate once a day — walking the catalog via a 50-per-page search API
// is too expensive to redo on every sitemap request.
export const revalidate = 86400;

interface SearchBook {
  id: string;
}
interface SearchResponse {
  data?: SearchBook[];
  meta?: { total?: number };
}

// NOTE: Meili's default `pagination.maxTotalHits` (1000) currently caps how
// many hits `/api/v1/search` can return in total, regardless of pagination —
// so this only reaches the catalog's first ~1000 books until that setting is
// raised on the backend (tracked separately). Not a bug in this file: once
// the cap is lifted, the next daily revalidation picks up the rest with no
// code change here — `meta.total` naturally drives more pages.
async function fetchAllBookIds(): Promise<string[]> {
  const first = await fetch(`${API}/search?q=*&limit=${PAGE_SIZE}&page=1`, {
    next: { revalidate },
  });
  if (!first.ok) return [];
  const firstJson: SearchResponse = await first.json();
  const ids = (firstJson.data ?? []).map((b) => b.id);
  const totalPages = Math.ceil((firstJson.meta?.total ?? 0) / PAGE_SIZE);

  const restPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, async (_v, i) => {
      const res = await fetch(`${API}/search?q=*&limit=${PAGE_SIZE}&page=${i + 2}`, {
        next: { revalidate },
      });
      if (!res.ok) return [];
      const json: SearchResponse = await res.json();
      return (json.data ?? []).map((b) => b.id);
    }),
  );

  return [...ids, ...restPages.flat()];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/catalog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/legal/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/legal/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const bookIds = await fetchAllBookIds();
  const bookPages: MetadataRoute.Sitemap = bookIds.map((id) => ({
    url: `${BASE}/catalog/${id}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticPages, ...bookPages];
}
