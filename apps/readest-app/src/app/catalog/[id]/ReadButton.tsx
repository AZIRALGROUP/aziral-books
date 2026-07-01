'use client';

import { useBookOpener } from '../useBookOpener';
import type { CatalogBook } from '../catalogModel';

// Thin client wrapper around the shared open-book flow (download → import →
// navigate to reader) so the surrounding detail page can stay a server
// component for SEO — only this button needs client interactivity.
export default function ReadButton({ book }: { book: CatalogBook }) {
  const { open, openingId, errorId } = useBookOpener();
  const opening = openingId === book.id;
  const failed = errorId === book.id;

  return (
    <button
      type='button'
      onClick={() => open(book)}
      disabled={opening}
      style={{
        all: 'unset',
        cursor: opening ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '13px 28px',
        borderRadius: 99,
        background: failed ? 'var(--ink-faint)' : 'var(--accent)',
        color: '#fff',
        fontFamily: 'var(--sans)',
        fontSize: 15,
        fontWeight: 700,
        opacity: opening ? 0.7 : 1,
      }}
    >
      {opening ? 'Открываем…' : failed ? 'Повторить' : 'Читать бесплатно'}
    </button>
  );
}
