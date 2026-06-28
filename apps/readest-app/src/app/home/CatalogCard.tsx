'use client';

import { useState } from 'react';

import { BookCover } from '../catalog/BookCover';
import { useBookOpener } from '../catalog/useBookOpener';
import { type CatalogBook } from '../catalog/catalogModel';

// Compact catalog card (procedural cover) shared by the discovery home and the
// library's "from the catalog" strip. Tapping it downloads + imports the exact
// book and opens it straight in the reader (no OPDS search detour).
export function CatalogCard({ book }: { book: CatalogBook }) {
  const [hov, setHov] = useState(false);
  const { open, openingId } = useBookOpener();
  const opening = openingId === book.id;
  return (
    <button
      type='button'
      onClick={() => open(book)}
      disabled={opening}
      className='azb-card'
      aria-busy={opening}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        transform: hov ? 'translateY(-4px)' : 'none',
        opacity: opening ? 0.65 : 1,
        cursor: opening ? 'default' : 'pointer',
        textAlign: 'left',
      }}
    >
      <div
        className='azb-card-cover'
        style={{ boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-md)' }}
      >
        <BookCover book={book} w={150} radius={8} />
      </div>
      <div className='azb-card-title'>{book.title}</div>
      <div className='azb-card-author'>{book.author}</div>
    </button>
  );
}
