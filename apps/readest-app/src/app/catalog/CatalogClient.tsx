'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { AziralMark, AziralWordmark } from '@/components/brand/AziralMark';
import { BookCover } from './BookCover';
import {
  GENRES,
  loadCatalog,
  searchCatalog,
  readHref,
  type CatalogBook,
  type CatalogShelves,
} from './catalogModel';
import './catalog.css';

const navBtn: CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  width: 34,
  height: 34,
  borderRadius: 99,
  display: 'grid',
  placeItems: 'center',
  fontSize: 20,
  color: 'var(--text-2)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  transition: 'background .15s, color .15s',
};
const ctaBtn: CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  padding: '13px 26px',
  borderRadius: 99,
  fontFamily: 'var(--sans)',
  fontWeight: 700,
  fontSize: 15,
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center',
};

function Stars({ r, size = 13 }: { r: number; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: 'var(--accent)',
        fontSize: size,
        fontWeight: 600,
      }}
    >
      <span aria-hidden='true'>★</span>
      <span style={{ color: 'var(--text-2)', fontFamily: 'var(--sans)' }}>{r.toFixed(1)}</span>
    </span>
  );
}

function SourceTag({ s }: { s: string }) {
  const short =
    ({ 'Project Gutenberg': 'Gutenberg', 'Open Library': 'Open Library', 'Internet Archive': 'Archive' } as Record<
      string,
      string
    >)[s] || s;
  return (
    <span
      style={{
        fontFamily: 'var(--sans)',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '.04em',
        color: 'var(--text-3)',
        textTransform: 'uppercase',
      }}
    >
      {short}
    </span>
  );
}

function BookCard({
  book,
  onOpen,
  w = 152,
}: {
  book: CatalogBook;
  onOpen: (b: CatalogBook) => void;
  w?: number | string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onOpen(book)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        width: w,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'transform .18s ease',
        transform: hov ? 'translateY(-4px)' : 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 8,
          transition: 'box-shadow .18s',
          boxShadow: hov ? '0 14px 30px rgba(0,0,0,.32)' : '0 8px 18px rgba(0,0,0,.22)',
        }}
      >
        <BookCover book={book} w={w} radius={8} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            opacity: hov ? 1 : 0,
            transition: 'opacity .18s',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 12,
            background: 'linear-gradient(transparent 45%, rgba(0,0,0,.55))',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12.5,
              fontWeight: 700,
              color: '#fff',
              padding: '7px 14px',
              borderRadius: 99,
              background: 'var(--accent)',
            }}
          >
            Открыть
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.2,
            color: 'var(--text)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 12.5,
            color: 'var(--text-2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {book.author}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <Stars r={book.rating} />
          <SourceTag s={book.source} />
        </div>
      </div>
    </button>
  );
}

function Shelf({
  title,
  subtitle,
  books,
  onOpen,
  badge,
}: {
  title: string;
  subtitle?: string;
  books: CatalogBook[];
  onOpen: (b: CatalogBook) => void;
  badge?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 520, behavior: 'smooth' });
  if (!books.length) return null;
  return (
    <section style={{ marginBottom: 44 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 18,
          paddingRight: 4,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--serif)',
                fontSize: 25,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              {title}
            </h2>
            {badge && (
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-ink)',
                  background: 'var(--ochre-soft)',
                  padding: '3px 9px',
                  borderRadius: 99,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p
              style={{
                margin: '4px 0 0',
                fontFamily: 'var(--sans)',
                fontSize: 13.5,
                color: 'var(--text-3)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => scroll(-1)} style={navBtn} aria-label='Прокрутить влево'>
            ‹
          </button>
          <button onClick={() => scroll(1)} style={navBtn} aria-label='Прокрутить вправо'>
            ›
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className='shelf-scroll'
        style={{ display: 'flex', gap: 22, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x proximity' }}
      >
        {books.map((b) => (
          <div key={b.id} style={{ scrollSnapAlign: 'start' }}>
            <BookCard book={b} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Hero({ book, onOpen }: { book: CatalogBook; onOpen: (b: CatalogBook) => void }) {
  return (
    <section
      style={{
        position: 'relative',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        marginBottom: 48,
        background: 'var(--paper-sunk)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(120% 130% at 85% 20%, var(--ochre-soft), transparent 55%)',
          opacity: 0.9,
        }}
      />
      <div
        className='azb-hero'
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 44,
          padding: '44px 48px',
          alignItems: 'center',
        }}
      >
        <div style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.32))', transform: 'rotate(-3deg)' }}>
          <BookCover book={book} w={208} h={308} radius={10} />
        </div>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 13px',
              borderRadius: 99,
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--sans)',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              marginBottom: 18,
            }}
          >
            ✦ Книга недели
          </div>
          <h1
            style={{
              margin: '0 0 6px',
              fontFamily: 'var(--serif)',
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
            }}
          >
            {book.title}
          </h1>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: 20,
              color: 'var(--text-2)',
              marginBottom: 16,
            }}
          >
            {book.author}
            {book.year ? ` · ${book.year}` : ''}
          </div>
          {book.blurb && (
            <p
              style={{
                margin: '0 0 24px',
                maxWidth: 560,
                fontFamily: 'var(--serif)',
                fontSize: 17,
                lineHeight: 1.6,
                color: 'var(--text-2)',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {book.blurb}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link href={readHref(book)} style={{ ...ctaBtn, background: 'var(--accent)', color: '#fff' }}>
              Читать сейчас
            </Link>
            <button
              onClick={() => onOpen(book)}
              style={{ ...ctaBtn, background: 'transparent', color: 'var(--text)', border: '1px solid var(--line-strong)' }}
            >
              Подробнее
            </button>
            <div style={{ marginLeft: 6 }}>
              <Stars r={book.rating} size={15} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GenreGrid({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          margin: '0 0 18px',
          fontFamily: 'var(--serif)',
          fontSize: 25,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}
      >
        Жанры
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(184px, 1fr))', gap: 16 }}>
        {GENRES.map((g) => {
          const on = active === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onPick(g.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: 96,
                borderRadius: 'var(--r-md)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: g.c,
                color: '#fff',
                boxShadow: on ? '0 0 0 3px var(--accent), var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'transform .15s, box-shadow .15s',
                transform: on ? 'translateY(-2px)' : 'none',
              }}
            >
              <span
                style={{ position: 'absolute', right: -8, bottom: -16, fontSize: 78, opacity: 0.18, lineHeight: 1 }}
                aria-hidden='true'
              >
                {g.icon}
              </span>
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                }}
              >
                {g.en}
              </span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600 }}>{g.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ResultsGrid({
  books,
  onOpen,
  title,
}: {
  books: CatalogBook[];
  onOpen: (b: CatalogBook) => void;
  title: string;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          margin: '0 0 20px',
          fontFamily: 'var(--serif)',
          fontSize: 25,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}
      >
        {title} <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>· {books.length}</span>
      </h2>
      {books.length === 0 ? (
        <div
          style={{
            padding: '60px 0',
            textAlign: 'center',
            fontFamily: 'var(--serif)',
            fontSize: 18,
            color: 'var(--text-3)',
          }}
        >
          Ничего не найдено. Попробуйте другой запрос.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(152px, 1fr))', gap: '30px 22px' }}>
          {books.map((b) => (
            <BookCard key={b.id} book={b} onOpen={onOpen} w='100%' />
          ))}
        </div>
      )}
    </section>
  );
}

function Drawer({ book, onClose }: { book: CatalogBook | null; onClose: () => void }) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  useEffect(() => {
    setDownloadUrl(null);
    if (!book) return;
    let cancelled = false;
    fetch(`https://books.aziral.com/api/v1/books/${book.id}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        const detail = d.data || d;
        if (detail?.downloadUrl) setDownloadUrl(detail.downloadUrl);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [book]);
  if (!book) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,.45)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'azbFadeIn .2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 480,
          maxWidth: '92vw',
          height: '100%',
          background: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
          overflowY: 'auto',
          boxShadow: '-20px 0 60px rgba(0,0,0,.4)',
          animation: 'azbSlideIn .26s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div style={{ position: 'relative', padding: '40px 36px 0' }}>
          <button onClick={onClose} style={{ ...navBtn, position: 'absolute', right: 24, top: 24 }} aria-label='Закрыть'>
            ✕
          </button>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,.3))', flexShrink: 0 }}>
              <BookCover book={book} w={150} h={222} radius={9} />
            </div>
            <div style={{ paddingTop: 6 }}>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-ink)',
                  marginBottom: 8,
                }}
              >
                {book.genre}
              </div>
              <h2
                style={{
                  margin: '0 0 6px',
                  fontFamily: 'var(--serif)',
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                {book.title}
              </h2>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: 'var(--text-2)',
                  marginBottom: 12,
                }}
              >
                {book.author}
              </div>
              <Stars r={book.rating} size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, margin: '28px 0' }}>
            <Link href={readHref(book)} style={{ ...ctaBtn, flex: 1, background: 'var(--accent)', color: '#fff' }}>
              Читать
            </Link>
            <button
              onClick={() => downloadUrl && window.open(downloadUrl, '_blank', 'noopener')}
              style={{
                ...ctaBtn,
                background: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--line-strong)',
                opacity: downloadUrl ? 1 : 0.5,
                cursor: downloadUrl ? 'pointer' : 'default',
              }}
            >
              ⤓ Скачать
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 14,
              padding: '18px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              ['Год', book.year ? (book.year < 0 ? `${-book.year} до н.э.` : `${book.year}`) : '—'],
              ['Язык', book.lang],
              ['Источник', book.source.split(' ')[0]],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 11,
                    color: 'var(--text-3)',
                    textTransform: 'uppercase',
                    letterSpacing: '.06em',
                    marginBottom: 4,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>
          <p
            style={{
              margin: '22px 0 40px',
              fontFamily: 'var(--serif)',
              fontSize: 16.5,
              lineHeight: 1.62,
              color: 'var(--text-2)',
            }}
          >
            {book.blurb ||
              'Произведение из публичной коллекции. Откройте, чтобы читать в Aziral Books с заметками, закладками и настройкой шрифта под себя.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Toolbar({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link href='/' style={{ textDecoration: 'none', flexShrink: 0 }}>
        <AziralWordmark size={18} mark={28} />
      </Link>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 'min(620px, 70%)' }}>
          <span
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-3)',
              fontSize: 15,
            }}
          >
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Поиск книг, авторов, жанров…'
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 14px 10px 38px',
              borderRadius: 99,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'var(--sans)',
              fontSize: 14.5,
              outline: 'none',
            }}
          />
        </div>
      </div>
      <Link
        href='/auth'
        style={{
          flexShrink: 0,
          fontFamily: 'var(--sans)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-2)',
          textDecoration: 'none',
        }}
      >
        Войти
      </Link>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        padding: '8px 16px',
        borderRadius: 99,
        fontFamily: 'var(--sans)',
        fontSize: 14,
        fontWeight: 600,
        transition: 'background-color .15s, color .15s, border-color .15s',
        background: active ? 'var(--accent)' : 'var(--surface)',
        color: active ? '#fff' : 'var(--text-2)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      }}
    >
      {children}
    </button>
  );
}

const CHIPS = [{ id: 'all', name: 'Все' }, ...GENRES.map((g) => ({ id: g.id, name: g.name }))];

export default function CatalogClient() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [sel, setSel] = useState<CatalogBook | null>(null);
  const [shelves, setShelves] = useState<CatalogShelves | null>(null);
  const [searchResults, setSearchResults] = useState<CatalogBook[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadCatalog().then((s) => {
      if (!cancelled) setShelves(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim();
  // Server search when there's a query; otherwise client-side genre filter on the pool.
  useEffect(() => {
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      searchCatalog(q).then((r) => {
        if (!cancelled) setSearchResults(r);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  const genreName = GENRES.find((g) => g.id === genre)?.name;
  const browsing = genre !== 'all' || q.length >= 2;

  const filtered = useMemo(() => {
    if (q.length >= 2) return searchResults;
    if (genre !== 'all' && shelves) return shelves.pool.filter((b) => b.genreId === genre);
    return [];
  }, [q, searchResults, genre, shelves]);

  const onOpen = (b: CatalogBook) => setSel(b);

  return (
    <div className='azb-catalog' style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Toolbar query={query} setQuery={setQuery} />

      <div
        style={{
          position: 'sticky',
          top: 59,
          zIndex: 25,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 0',
        }}
      >
        <div
          style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 10, overflowX: 'auto' }}
          className='shelf-scroll'
        >
          {CHIPS.map((c) => (
            <Chip key={c.id} active={genre === c.id} onClick={() => setGenre(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 40px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 30 }}>
            <AziralMark size={34} />
            <div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--serif)',
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--text)',
                }}
              >
                Каталог
              </h1>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--text-3)' }}>
                Open Library · Project Gutenberg · Internet Archive
              </div>
            </div>
          </div>

          {!shelves ? (
            <div style={{ padding: '80px 0', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--text-3)' }}>
              Загружаем каталог…
            </div>
          ) : browsing ? (
            <ResultsGrid books={filtered} onOpen={onOpen} title={q.length >= 2 ? `Результаты «${query}»` : genreName || ''} />
          ) : (
            <>
              {shelves.featured && <Hero book={shelves.featured} onOpen={onOpen} />}
              <Shelf title='Популярное' subtitle='Самые читаемые во всех источниках' books={shelves.popular} onOpen={onOpen} badge='Топ' />
              <Shelf title='Рекомендуем вам' subtitle='Подборка из каталога' books={shelves.recommended} onOpen={onOpen} />
              <GenreGrid active={genre} onPick={setGenre} />
              <Shelf title='Ещё из каталога' subtitle='Загляните глубже в коллекцию' books={shelves.more} onOpen={onOpen} />
              <Shelf title='Классика в общественном достоянии' subtitle='Бесплатно · Project Gutenberg' books={shelves.gutenberg} onOpen={onOpen} badge='Free' />
            </>
          )}
        </div>
      </div>

      <Drawer book={sel} onClose={() => setSel(null)} />
    </div>
  );
}
