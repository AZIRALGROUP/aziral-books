'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { loadCatalog, type CatalogBook } from '@/app/catalog/catalogModel';
import { CatalogCard } from '@/app/home/CatalogCard';
import '@/app/catalog/catalog.css';
import '@/app/home/home.css';

// Branded "from the catalog" strip shown on the library page when the user's
// shelf is sparse, so a near-empty grid still offers something to read.
export default function LibraryDiscovery() {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 520, behavior: 'smooth' });

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((s) => {
        if (!cancelled) setBooks(s.popular);
      })
      .catch(() => {
        /* leave empty — the strip simply doesn't render */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!books.length) return null;

  return (
    <div className='azb-catalog azb-libdisc'>
      <div className='azb-libdisc-inner'>
        <div className='azb-shelf-head'>
          <div>
            <h2 className='azb-shelf-title'>Не знаете, что почитать?</h2>
            <p className='azb-shelf-sub'>Бесплатные книги из каталога Aziral Books</p>
          </div>
          <div className='azb-libdisc-actions'>
            <Link href='/catalog' className='azb-home-cta'>
              Открыть каталог
            </Link>
            <div className='azb-shelf-nav'>
              <button type='button' aria-label='Назад' onClick={() => scroll(-1)}>
                ‹
              </button>
              <button type='button' aria-label='Вперёд' onClick={() => scroll(1)}>
                ›
              </button>
            </div>
          </div>
        </div>
        <div ref={ref} className='shelf-scroll azb-shelf-row'>
          {books.map((b) => (
            <CatalogCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
