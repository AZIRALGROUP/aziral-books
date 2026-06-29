import * as React from 'react';
import { useEffect, useState } from 'react';

import { useEnv } from '@/context/EnvContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppRouter } from '@/hooks/useAppRouter';
import { navigateToLogin } from '@/utils/nav';
import { AziralMark } from '@/components/brand/AziralMark';
import { BookCover } from '@/app/catalog/BookCover';
import { loadCatalog, type CatalogBook } from '@/app/catalog/catalogModel';
import { useBookOpener } from '@/app/catalog/useBookOpener';
import './library-empty.css';

interface LibraryEmptyStateProps {
  onImport: () => void;
}

// Branded empty-library state — first thing a new user sees with zero books.
// Matches the Aziral Books brand (mark, serif heading, ochre CTA) instead of
// the generic daisyUI default.
const LibraryEmptyState: React.FC<LibraryEmptyStateProps> = ({ onImport }) => {
  const _ = useTranslation();
  const { appService } = useEnv();
  const { user } = useAuth();
  const router = useAppRouter();
  const isMobile = appService?.isMobile ?? false;

  const { open, openingId } = useBookOpener();
  const [picks, setPicks] = useState<CatalogBook[]>([]);
  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((shelves) => {
        if (!cancelled) setPicks(shelves.popular.slice(0, 6));
      })
      .catch(() => {
        /* leave empty — the picks row simply doesn't render */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='azb-empty'>
      <div className='azb-empty-inner'>
        <span className='azb-empty-mark'>
          <AziralMark size={56} />
        </span>
        <h1 className='azb-empty-title'>{_('Start your library')}</h1>
        <p className='azb-empty-sub'>
          {isMobile
            ? _('Browse our catalog of free books, or add your own from your device.')
            : _('Browse our catalog of free books, or add your own from your computer.')}
        </p>
        <div className='azb-empty-actions'>
          <button type='button' className='azb-empty-cta' onClick={() => router.push('/catalog')}>
            {_('Browse the catalog')}
          </button>
          <button type='button' className='azb-empty-cta-secondary' onClick={onImport}>
            {_('Import Books')}
          </button>
          {!user && (
            <button
              type='button'
              className='azb-empty-link'
              onClick={() => navigateToLogin(router)}
            >
              {_('Sign in to sync your library')}
            </button>
          )}
        </div>

        {picks.length > 0 && (
          <div className='azb-empty-picks'>
            <div className='azb-empty-picks-label'>{_('Popular in the catalog')}</div>
            <div className='azb-empty-picks-row'>
              {picks.map((book) => (
                <button
                  key={book.id}
                  type='button'
                  className='azb-empty-pick'
                  onClick={() => open(book)}
                  disabled={openingId === book.id}
                  aria-busy={openingId === book.id}
                  title={`${book.title} — ${book.author}`}
                >
                  <BookCover book={book} w={96} radius={7} />
                  <span className='azb-empty-pick-title'>{book.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryEmptyState;
