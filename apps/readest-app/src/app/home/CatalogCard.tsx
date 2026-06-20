'use client';

import { useState } from 'react';
import Link from 'next/link';

import { BookCover } from '../catalog/BookCover';
import { readHref, type CatalogBook } from '../catalog/catalogModel';

// Compact catalog card (procedural cover) shared by the discovery home and the
// library's "from the catalog" strip. Links straight into the OPDS read flow.
export function CatalogCard({ book }: { book: CatalogBook }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={readHref(book)}
      className='azb-card'
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ transform: hov ? 'translateY(-4px)' : 'none' }}
    >
      <div
        className='azb-card-cover'
        style={{ boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-md)' }}
      >
        <BookCover book={book} w={150} radius={8} />
      </div>
      <div className='azb-card-title'>{book.title}</div>
      <div className='azb-card-author'>{book.author}</div>
    </Link>
  );
}
