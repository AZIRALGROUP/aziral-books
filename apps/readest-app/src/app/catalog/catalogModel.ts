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
  rating: number; // derived from popularity/id — cosmetic, stable per book
  source: string; // "Project Gutenberg" | "Open Library" | "Internet Archive"
  lang: string;
  blurb: string;
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

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
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

// Cosmetic, stable per-book rating in 3.9–4.9 derived from id (search has no
// rating). Public-domain classics, so a warm range reads honestly enough.
function deriveRating(id: string): number {
  return Math.round((3.9 + (hash(id) % 11) / 10) * 10) / 10;
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
    rating: deriveRating(b.id),
    source: deriveSource(b.coverUrl),
    lang: (b.language || 'EN').toUpperCase(),
    blurb: b.description || '',
  };
}

const API = 'https://books.aziral.com/api/v1';

interface SearchResponse {
  data?: ApiBook[];
  meta?: { total?: number };
}

async function fetchSearch(params: string): Promise<CatalogBook[]> {
  const res = await fetch(`${API}/search?${params}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json: SearchResponse = await res.json();
  return (json.data || []).map(mapBook);
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

// Deep-link into the existing (proven) OPDS browser pointed at this book's
// search feed, where the Download → Read flow already works for every platform.
export function readHref(book: CatalogBook): string {
  const feed = `${API}/opds/search?q=${encodeURIComponent(`${book.title} ${book.author}`)}`;
  return `/opds?url=${encodeURIComponent(feed)}&id=aziral-books-builtin`;
}
