// Catalog data model — maps the Aziral backend (/api/v1/search) onto the
// brand prototype's book shape, and derives the shelves the catalog screen
// renders. The backend has no genre/rating/source fields on search results,
// so those are derived deterministically (see notes per helper).

export interface CatalogBook {
  id: string;
  title: string;
  author: string;
  genre: string; // localized display name
  genreId: string;
  year: number | null;
  source: string; // "Wikisource" | "Project Gutenberg" | "Open Library" | …
  lang: string;
  blurb: string;
}

export interface AuthorCount {
  name: string;
  count: number;
}

export interface Genre {
  id: string;
  name: string;
  en: string;
  icon: string;
  c: string;
}

export const GENRES: Genre[] = [
  { id: 'classic', name: 'Классика', en: 'Classics', icon: '❦', c: '#8a3b2e' },
  { id: 'scifi', name: 'Фантастика', en: 'Sci-Fi', icon: '✦', c: '#27384f' },
  { id: 'fantasy', name: 'Фэнтези', en: 'Fantasy', icon: '♆', c: '#4a3b5c' },
  { id: 'mystery', name: 'Детектив', en: 'Mystery', icon: '✜', c: '#1f2a2a' },
  { id: 'nonfic', name: 'Нон-фикшн', en: 'Non-fiction', icon: '◈', c: '#2f4858' },
  { id: 'poetry', name: 'Поэзия', en: 'Poetry', icon: '❧', c: '#6b2740' },
  { id: 'bio', name: 'Биографии', en: 'Biography', icon: '✷', c: '#7a4a23' },
  { id: 'kids', name: 'Детям', en: 'Kids', icon: '★', c: '#2f4858' },
];

const GENRE_BY_ID: Record<string, Genre> = Object.fromEntries(GENRES.map((g) => [g.id, g]));

interface ApiBook {
  id: string;
  title: string;
  subtitle?: string | null;
  authors?: string[];
  description?: string | null;
  language?: string | null;
  publishYear?: number | null;
  subjects?: string[];
  license?: string | null;
  coverUrl?: string | null;
  popularity?: number | null;
}

// Map a book's subjects[] onto one of our display genres by keyword.
function deriveGenre(subjects: string[] = []): string {
  const s = subjects.join(' ').toLowerCase();
  if (/science fiction|scientifiction/.test(s)) return 'scifi';
  if (/fantasy|fairy/.test(s)) return 'fantasy';
  if (/detective|mystery|crime|thriller/.test(s)) return 'mystery';
  if (/poetry|poems|verse/.test(s)) return 'poetry';
  if (/biograph|autobiograph|memoir|correspondence/.test(s)) return 'bio';
  if (/juvenile|children|nursery/.test(s)) return 'kids';
  if (/philosophy|history|essay|science|economic|politic|religion|psycholog/.test(s))
    return 'nonfic';
  return 'classic';
}

// Backend search results don't carry the source; infer it from the cover host.
// Our Wikisource books (the Russian/Kazakh catalogue) carry no cover art, so a
// missing cover is the reliable signal for them.
function deriveSource(coverUrl?: string | null): string {
  const u = (coverUrl || '').toLowerCase();
  if (u.includes('gutenberg')) return 'Project Gutenberg';
  if (u.includes('archive.org')) return 'Internet Archive';
  if (!u) return 'Wikisource';
  return 'Open Library';
}

export function mapBook(b: ApiBook): CatalogBook {
  const genreId = deriveGenre(b.subjects);
  return {
    id: b.id,
    title: b.title,
    author: (b.authors && b.authors.length ? b.authors.join(', ') : 'Неизвестный автор').replace(
      /,\s*$/,
      '',
    ),
    genre: GENRE_BY_ID[genreId]?.name ?? 'Классика',
    genreId,
    year: b.publishYear ?? null,
    source: deriveSource(b.coverUrl),
    lang: (b.language || 'EN').toUpperCase(),
    blurb: b.description || '',
  };
}

const API = 'https://books.aziral.com/api/v1';

interface SearchResponse {
  data?: ApiBook[];
  meta?: { total?: number; facets?: { authors?: Record<string, number> } };
}

async function fetchSearch(params: string): Promise<CatalogBook[]> {
  const res = await fetch(`${API}/search?${params}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json: SearchResponse = await res.json();
  return (json.data || []).map(mapBook);
}

// Author categories with real counts (Meili facet) — powers the sidebar.
export async function loadAuthors(lang?: string): Promise<AuthorCount[]> {
  const p = new URLSearchParams({ q: '*', limit: '1', facets: 'authors' });
  if (lang) p.set('lang', lang);
  const res = await fetch(`${API}/search?${p}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json: SearchResponse = await res.json();
  const dist = json.meta?.facets?.authors ?? {};
  return Object.entries(dist)
    .map(([name, count]) => ({ name, count }))
    .filter((a) => a.name && a.name !== 'Неизвестный автор')
    .sort((a, b) => b.count - a.count);
}

export interface CatalogShelves {
  pool: CatalogBook[];
  featured: CatalogBook | null;
  popular: CatalogBook[];
  recommended: CatalogBook[];
  more: CatalogBook[];
  kazakh: CatalogBook[];
  gutenberg: CatalogBook[];
}

function dedup(list: CatalogBook[]): CatalogBook[] {
  const seen = new Set<string>();
  return list.filter((b) => {
    const k = b.title + b.author;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// The audience is Russian/Kazakh, so the catalogue leads with Russian works
// (the bulk of it — Wikisource) and keeps Kazakh and English shelves alongside.
// The search API caps `limit` at 50, so we page through ru (3×50 ≈ 150) to build
// the main pool and derive its shelves client-side; kk and en are single pulls.
export async function loadCatalog(): Promise<CatalogShelves> {
  const [ru1, ru2, ru3, kk, en] = await Promise.all([
    fetchSearch('q=*&lang=ru&limit=50&page=1'),
    fetchSearch('q=*&lang=ru&limit=50&page=2'),
    fetchSearch('q=*&lang=ru&limit=50&page=3'),
    fetchSearch('q=*&lang=kk&limit=24'),
    fetchSearch('q=*&limit=24&sort=popularity'), // global popularity ⇒ English Gutenberg
  ]);
  const pool = dedup([...ru1, ...ru2, ...ru3]);

  // Pick a "book of the week" that reads as a real headline: a short, standalone
  // title near the top of the pool (skip multi-volume / collected-works entries).
  const isHeadline = (b: CatalogBook) =>
    b.title.length <= 42 && !/(том|часть|собрание|\bvol|volume|\(of\s|part \d)/i.test(b.title);
  const featured = pool.find(isHeadline) || pool[0] || null;

  const rest = pool.filter((b) => b.id !== featured?.id);
  const popular = rest.slice(0, 18);
  const recommended = rest.slice(40, 58);
  const more = rest.slice(80, 98);
  const kazakh = dedup(kk).slice(0, 18);
  const gutenberg = dedup(en).slice(0, 18);

  return { pool, featured, popular, recommended, more, kazakh, gutenberg };
}

export async function searchCatalog(query: string): Promise<CatalogBook[]> {
  return dedup(await fetchSearch(`q=${encodeURIComponent(query)}&limit=50`));
}

// Literary-form sections (server-side `subject` filter; '' = all).
export const SECTIONS: { id: string; name: string }[] = [
  { id: '', name: 'Все разделы' },
  { id: 'Проза', name: 'Проза' },
  { id: 'Поэзия', name: 'Поэзия' },
  { id: 'Драматургия', name: 'Драматургия' },
];

// Server-side browse with any combination of language / author / form filters.
export async function browse(opts: {
  lang?: string;
  author?: string;
  subject?: string;
}): Promise<CatalogBook[]> {
  const p = new URLSearchParams({ q: '*', limit: '50' });
  if (opts.lang) p.set('lang', opts.lang);
  if (opts.author) p.set('author', opts.author);
  if (opts.subject) p.set('subject', opts.subject);
  return dedup(await fetchSearch(p.toString()));
}

// Cross-language author link: jump between an author's Russian works (our
// Wikisource catalogue) and their English translations (Project Gutenberg).
// Only authors that actually exist on BOTH sides of the catalogue are listed —
// `en` is the Gutenberg surname, used both to match English books and as the
// search term that surfaces them.
export interface CrossAuthor {
  ru: string;
  en: string;
}
export const CROSS_AUTHORS: CrossAuthor[] = [
  { ru: 'Фёдор Достоевский', en: 'Dostoyevsky' },
  { ru: 'Лев Толстой', en: 'Tolstoy' },
  { ru: 'Николай Гоголь', en: 'Gogol' },
  { ru: 'Иван Тургенев', en: 'Turgenev' },
];

export type CrossLink = { dir: 'toEn' | 'toRu'; ru: string; en: string };

// The counterpart-language navigation for a book, or null when none applies.
export function crossLang(book: CatalogBook): CrossLink | null {
  const isRu = book.lang === 'RU' || book.lang === 'KK';
  for (const c of CROSS_AUTHORS) {
    if (isRu && book.author === c.ru) return { dir: 'toEn', ...c };
    if (!isRu && book.author.toLowerCase().includes(c.en.toLowerCase())) {
      return { dir: 'toRu', ...c };
    }
  }
  return null;
}

// Deep-link into the existing (proven) OPDS browser pointed at this book's
// search feed, where the Download → Read flow already works for every platform.
export function readHref(book: CatalogBook): string {
  const feed = `${API}/opds/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`;
  return `/opds?url=${encodeURIComponent(feed)}&id=aziral-books-builtin`;
}
