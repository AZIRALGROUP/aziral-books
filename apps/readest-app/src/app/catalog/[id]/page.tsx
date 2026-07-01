import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AziralMark } from '@/components/brand/AziralMark';
import { BookCover } from '../BookCover';
import { mapBook, type CatalogBook } from '../catalogModel';
import ReadButton from './ReadButton';
import '../catalog.css';

const API = 'https://books.aziral.com/api/v1';
const SITE = 'https://books.aziral.com';

interface BookDetail {
  id: string;
  title: string;
  subtitle: string | null;
  language: string | null;
  description: string | null;
  publishYear: number | null;
  publisher: string | null;
  coverUrl: string | null;
  license: string | null;
  formats: string[];
  authors: { id: string; name: string }[];
}

async function getBook(id: string): Promise<BookDetail | null> {
  try {
    const res = await fetch(`${API}/books/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

function toCatalogBook(book: BookDetail): CatalogBook {
  return mapBook({ ...book, authors: book.authors.map((a) => a.name) });
}

const LICENSE_LABEL: Record<string, string> = {
  public_domain: 'Общественное достояние',
};

// Required so this dynamic segment builds cleanly under the Tauri app's
// `output: 'export'` target (next.config.mjs sets it whenever
// NEXT_PUBLIC_APP_PLATFORM !== 'web'): static export requires every dynamic
// route to declare generateStaticParams, and an empty list means the route
// simply isn't part of that build (the native app has its own catalog UI via
// CatalogClient, it never needs this SEO-only page). On the web deployment
// (no `output: 'export'`, a normal Next.js server) an empty array is a no-op
// — dynamicParams defaults to true, so every id still renders on demand.
export async function generateStaticParams() {
  return [];
}

interface PageParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) return { title: 'Книга не найдена | Aziral Books' };

  const authorNames = book.authors.map((a) => a.name).join(', ');
  const title = authorNames
    ? `${book.title} — ${authorNames} | Aziral Books`
    : `${book.title} | Aziral Books`;
  const description = (
    book.description ||
    `Читать «${book.title}»${authorNames ? ` автора ${authorNames}` : ''} бесплатно онлайн — книга общественного достояния в каталоге Aziral Books.`
  ).slice(0, 300);
  const url = `${SITE}/catalog/${book.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'book',
      url,
      title: book.title,
      description,
      siteName: 'Aziral Books',
      ...(book.coverUrl ? { images: [{ url: book.coverUrl }] } : {}),
    },
    twitter: {
      card: book.coverUrl ? 'summary_large_image' : 'summary',
      title: book.title,
      description,
      ...(book.coverUrl ? { images: [book.coverUrl] } : {}),
    },
  };
}

export default async function BookDetailPage({ params }: PageParams) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const catalogBook = toCatalogBook(book);
  const authorNames = book.authors.map((a) => a.name).join(', ');
  const url = `${SITE}/catalog/${book.id}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    ...(authorNames
      ? { author: book.authors.map((a) => ({ '@type': 'Person', name: a.name })) }
      : {}),
    ...(book.description ? { description: book.description } : {}),
    ...(book.language ? { inLanguage: book.language } : {}),
    ...(book.publishYear ? { datePublished: String(book.publishYear) } : {}),
    ...(book.publisher ? { publisher: book.publisher } : {}),
    bookFormat: 'https://schema.org/EBook',
    url,
    isAccessibleForFree: true,
  };

  return (
    <div className='azb-catalog' style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        <Link
          href='/catalog'
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--text)',
          }}
        >
          <AziralMark size={26} />
          <span style={{ fontFamily: 'var(--serif)', fontSize: 16, fontWeight: 600 }}>
            Каталог Aziral Books
          </span>
        </Link>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40, alignItems: 'start' }}
        >
          <div style={{ filter: 'drop-shadow(0 16px 32px rgba(0,0,0,.28))' }}>
            <BookCover book={catalogBook} w={200} h={296} radius={10} />
          </div>
          <div>
            <h1
              style={{
                margin: '0 0 8px',
                fontFamily: 'var(--serif)',
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              {book.title}
            </h1>
            {book.subtitle && (
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: 'var(--text-2)',
                  marginBottom: 8,
                }}
              >
                {book.subtitle}
              </div>
            )}
            {authorNames && (
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 17,
                  color: 'var(--text-2)',
                  marginBottom: 20,
                }}
              >
                {authorNames}
                {book.publishYear ? ` · ${book.publishYear}` : ''}
              </div>
            )}

            <div style={{ marginBottom: 28 }}>
              <ReadButton book={catalogBook} />
            </div>

            {book.description && (
              <p
                style={{
                  margin: '0 0 24px',
                  fontFamily: 'var(--serif)',
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: 'var(--text-2)',
                  maxWidth: 620,
                }}
              >
                {book.description}
              </p>
            )}

            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '8px 16px',
                fontFamily: 'var(--sans)',
                fontSize: 13.5,
                color: 'var(--text-3)',
              }}
            >
              {book.language && (
                <>
                  <dt>Язык</dt>
                  <dd style={{ margin: 0 }}>{book.language.toUpperCase()}</dd>
                </>
              )}
              {book.formats.length > 0 && (
                <>
                  <dt>Формат</dt>
                  <dd style={{ margin: 0 }}>
                    {book.formats.map((f) => f.toUpperCase()).join(', ')}
                  </dd>
                </>
              )}
              {book.license && (
                <>
                  <dt>Лицензия</dt>
                  <dd style={{ margin: 0 }}>{LICENSE_LABEL[book.license] ?? book.license}</dd>
                </>
              )}
              {book.publisher && (
                <>
                  <dt>Издатель</dt>
                  <dd style={{ margin: 0 }}>{book.publisher}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
