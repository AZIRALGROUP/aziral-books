import * as React from 'react';

import { useEnv } from '@/context/EnvContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppRouter } from '@/hooks/useAppRouter';
import { navigateToLogin } from '@/utils/nav';
import { AziralMark } from '@/components/brand/AziralMark';
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

  return (
    <div className='azb-empty'>
      <div className='azb-empty-inner'>
        <span className='azb-empty-mark'>
          <AziralMark size={56} />
        </span>
        <h1 className='azb-empty-title'>{_('Start your library')}</h1>
        <p className='azb-empty-sub'>
          {isMobile
            ? _('Pick a book from your device to add it to your library.')
            : _('Drop a book anywhere on this window, or pick one from your computer.')}
        </p>
        <div className='azb-empty-actions'>
          <button type='button' className='azb-empty-cta' onClick={onImport}>
            {_('Import Books')}
          </button>
          {/* TODO: add a 'Browse free catalogs' secondary action that opens the
              OPDS dialog (handleShowOPDSDialog) once we settle on placement. */}
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
      </div>
    </div>
  );
};

export default LibraryEmptyState;
