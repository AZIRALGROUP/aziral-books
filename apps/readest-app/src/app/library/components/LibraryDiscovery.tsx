'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { loadCatalog, readHref, type CatalogBook } from '@/app/catalog/catalogModel';
import { BookCover } from '@/app/catalog/BookCover';
import '@/app/catalog/catalog.css';
import './library-discover.css';

// "Подборка для вас" — shown on a sparse library to bridge into the catalog.
// Matches the brand mockup (library.jsx → DiscoverBlock): copy + two CTAs and
// a fan of catalog covers.
export default function LibraryDiscovery() {
  const router = useRouter();
  const [books, setBooks] = useState<CatalogBook[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((s) => {
        if (!cancelled) setBooks(s.popular);
      })
      .catch(() => {
        /* leave empty — the block simply doesn't render */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!books.length) return null;

  const fan = books.slice(0, 4);
  const openRandom = () => {
    const pick = books[Math.floor(Math.random() * books.length)];
    if (pick) router.push(readHref(pick));
  };

  return (
    <div className='azb-discover'>
      <div className='azb-discover-inner'>
        <div className='azb-discover-glow' aria-hidden='true' />
        <div className='azb-discover-row'>
          <div>
            <div className='azb-discover-eyebrow'>✦ Подборка для вас</div>
            <h2 className='azb-discover-title'>Не знаете, что почитать?</h2>
            <p className='azb-discover-text'>
              В вашей полке пока тихо. В каталоге — сотни бесплатных книг: классика, фантастика и
              нон‑фикшн из открытых библиотек.
            </p>
            <div className='azb-discover-actions'>
              <Link href='/catalog' className='azb-discover-cta'>
                Открыть каталог
              </Link>
              <button
                type='button'
                className='azb-discover-cta azb-discover-cta--ghost'
                onClick={openRandom}
              >
                ✦ Случайная книга
              </button>
            </div>
          </div>
          <div className='azb-discover-fan'>
            {fan.map((b, i) => (
              <div
                key={b.id}
                className='azb-discover-fan-item'
                style={{
                  marginLeft: i === 0 ? 0 : -34,
                  transform: `rotate(${(i - 1.5) * 5}deg) translateY(${Math.abs(i - 1.5) * 8}px)`,
                  zIndex: i,
                }}
              >
                <BookCover book={b} w={104} radius={7} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
