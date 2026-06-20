'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useEnv } from '@/context/EnvContext';
import { useLibraryStore } from '@/store/libraryStore';
import { navigateToReader } from '@/utils/nav';
import { formatAuthors, formatTitle } from '@/utils/book';
import type { Book } from '@/types/book';

import { AziralWordmark } from '@/components/brand/AziralMark';
import { GENRES, loadCatalog, type CatalogShelves } from '../catalog/catalogModel';
import { CatalogCard } from './CatalogCard';
import '../catalog/catalog.css';
import './home.css';

// ── User book card (real cover + reading progress) ──────────────────────────
function UserBookCard({ book, onOpen }: { book: Book; onOpen: (b: Book) => void }) {
  const { appService } = useEnv();
  const [hov, setHov] = useState(false);
  const cover = appService ? appService.getCoverImageUrl(book) : '';
  const title = formatTitle(book.title);
  const author = formatAuthors(book.author, book.primaryLanguage);
  const pct =
    book.progress && book.progress[1] > 0
      ? Math.min(100, Math.round((book.progress[0] / book.progress[1]) * 100))
      : 0;
  return (
    <button
      type='button'
      onClick={() => onOpen(book)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className='azb-card'
      style={{ transform: hov ? 'translateY(-4px)' : 'none' }}
    >
      <div
        className='azb-card-cover azb-usercover'
        style={{ boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-md)' }}
      >
        {cover ? (
          <img src={cover} alt='' className='azb-usercover-img' />
        ) : (
          <div className='azb-usercover-fallback'>
            <span>{title}</span>
          </div>
        )}
        {pct > 0 && (
          <div className='azb-progress' aria-hidden='true'>
            <div className='azb-progress-fill' style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      <div className='azb-card-title'>{title}</div>
      <div className='azb-card-author'>{pct > 0 ? `${author} · ${pct}%` : author}</div>
    </button>
  );
}

// ── Horizontal shelf ────────────────────────────────────────────────────────
function Shelf({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 520, behavior: 'smooth' });
  return (
    <section className='azb-shelf'>
      <div className='azb-shelf-head'>
        <div>
          <h2 className='azb-shelf-title'>{title}</h2>
          {subtitle && <p className='azb-shelf-sub'>{subtitle}</p>}
        </div>
        <div className='azb-shelf-nav'>
          <button type='button' aria-label='Назад' onClick={() => scroll(-1)}>
            ‹
          </button>
          <button type='button' aria-label='Вперёд' onClick={() => scroll(1)}>
            ›
          </button>
        </div>
      </div>
      <div ref={ref} className='shelf-scroll azb-shelf-row'>
        {children}
      </div>
    </section>
  );
}

export default function HomeClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { appService } = useEnv();
  const { library, setLibrary } = useLibraryStore();
  const [shelves, setShelves] = useState<CatalogShelves | null>(null);

  // Seed the library store if this is a cold landing (Home doesn't run the
  // full library page machinery, so the store can be empty on first paint).
  useEffect(() => {
    if (!appService || library.length) return;
    let cancelled = false;
    appService
      .loadLibraryBooks()
      .then((books) => {
        if (!cancelled) setLibrary(books);
      })
      .catch(() => {
        /* library stays empty — the catalog shelves still render */
      });
    return () => {
      cancelled = true;
    };
  }, [appService, library.length, setLibrary]);

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((s) => {
        if (!cancelled) setShelves(s);
      })
      .catch(() => {
        /* leave shelves null — section simply doesn't render */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { continueList, continueTitle } = useMemo(() => {
    const active = library.filter((b) => !b.deletedAt);
    const reading = active
      .filter((b) => b.progress && b.progress[0] > 0)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    if (reading.length)
      return { continueList: reading.slice(0, 12), continueTitle: 'Продолжить чтение' };
    const recent = [...active].sort((a, b) => b.updatedAt - a.updatedAt);
    return { continueList: recent.slice(0, 12), continueTitle: 'Недавно добавленное' };
  }, [library]);

  const openBook = (book: Book) => navigateToReader(router, [book.hash]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return 'Доброй ночи';
    if (h < 12) return 'Доброе утро';
    if (h < 18) return 'Добрый день';
    return 'Добрый вечер';
  })();

  return (
    <div className='azb-catalog azb-home'>
      <header className='azb-home-bar'>
        <Link href='/' className='azb-home-brand' aria-label='Aziral Books'>
          <AziralWordmark size={17} mark={26} />
        </Link>
        <nav className='azb-home-nav'>
          <Link href='/catalog'>Каталог</Link>
          <Link href='/library'>Библиотека</Link>
          <Link href='/user' className='azb-home-avatar' aria-label='Аккаунт'>
            {(user?.email?.[0] ?? 'A').toUpperCase()}
          </Link>
        </nav>
      </header>

      <main className='azb-home-main'>
        <section className='azb-greeting'>
          <p className='azb-greeting-kicker'>{greeting}</p>
          <h1 className='azb-greeting-title'>
            Что почитаем <span>сегодня?</span>
          </h1>
          <p className='azb-greeting-sub'>
            Продолжите начатое или откройте что-то новое из каталога.
          </p>
        </section>

        {continueList.length > 0 && (
          <Shelf title={continueTitle}>
            {continueList.map((b) => (
              <UserBookCard key={b.hash} book={b} onOpen={openBook} />
            ))}
          </Shelf>
        )}

        {shelves && (
          <>
            <Shelf title='Популярное' subtitle='Самые читаемые во всех источниках'>
              {shelves.popular.map((b) => (
                <CatalogCard key={b.id} book={b} />
              ))}
            </Shelf>
            <Shelf title='Рекомендуем вам' subtitle='Подборка из каталога'>
              {shelves.recommended.map((b) => (
                <CatalogCard key={b.id} book={b} />
              ))}
            </Shelf>
            <Shelf
              title='Классика в общественном достоянии'
              subtitle='Бесплатно · Project Gutenberg'
            >
              {shelves.gutenberg.map((b) => (
                <CatalogCard key={b.id} book={b} />
              ))}
            </Shelf>
          </>
        )}

        <section className='azb-genres'>
          <h2 className='azb-shelf-title'>Жанры</h2>
          <div className='azb-genre-grid'>
            {GENRES.map((g) => (
              <Link
                key={g.id}
                href={`/catalog?genre=${g.id}`}
                className='azb-genre-tile'
                style={{ '--g': g.c } as CSSProperties}
              >
                <span className='azb-genre-icon' aria-hidden='true'>
                  {g.icon}
                </span>
                <span className='azb-genre-name'>{g.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className='azb-home-foot'>
          <Link href='/catalog' className='azb-home-cta'>
            Открыть весь каталог
          </Link>
          <Link href='/library' className='azb-home-link'>
            Перейти в библиотеку →
          </Link>
        </footer>
      </main>
    </div>
  );
}
