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
  if (/philosophy|history|essay|science|economic|politic|religion|psycholog/.test(s)) return 'nonfic';
  return 'classic';
}

// Backend search results don't carry the source; infer it from the cover host.
function deriveSource(coverUrl?: string | null): string {
  const u = (coverUrl || '').toLowerCase();
  if (u.includes('gutenberg')) return 'Project Gutenberg';
  if (u.includes('archive.org')) return 'Internet Archive';
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

// The search API caps `limit` at 50 and only supports sort=popularity, so we
// page through it (3×50) to build a ~150-book pool and derive every shelf from
// it client-side.
export async function loadCatalog(): Promise<CatalogShelves> {
  const pages = await Promise.all([
    fetchSearch('q=*&limit=50&sort=popularity&page=1'),
    fetchSearch('q=*&limit=50&sort=popularity&page=2'),
    fetchSearch('q=*&limit=50&sort=popularity&page=3'),
  ]);
  const pool = dedup(pages.flat());

  // Pick a "book of the week" that reads as a real headline: fiction-ish, a
  // short standalone title (skip "Volume 3 (of 3)" academic tomes), near the
  // top of the popularity pool. (Search results carry no description, so we
  // can't rank on blurb here.)
  const FICTION = new Set(['classic', 'scifi', 'fantasy', 'mystery', 'poetry', 'kids']);
  const isHeadline = (b: CatalogBook) =>
    b.title.length <= 42 &&
    FICTION.has(b.genreId) &&
    !/(volume|vol\.|\(of\s|complete works|part \d)/i.test(b.title);
  const featured = pool.find(isHeadline) || pool[0] || null;

  const popular = pool.filter((b) => b.id !== featured?.id).slice(0, 18);
  const gutenberg = pool.filter((b) => b.source === 'Project Gutenberg').slice(0, 18);
  const recommended = pool.slice(50, 68);
  const more = pool.slice(100, 118);

  return { pool, featured, popular, recommended, more, gutenberg };
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
