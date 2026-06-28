'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/utils/supabase';
import { AziralWordmark } from '@/components/brand/AziralMark';
import '../auth.css';

export default function ResetPasswordPage() {
  const _ = useTranslation();
  const router = useRouter();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token && session.user && event === 'USER_UPDATED') {
        login(session.access_token, session.user);
        const redirectTo = new URLSearchParams(window.location.search).get('redirect');
        router.push(redirectTo ?? '/library');
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      // On success Supabase emits USER_UPDATED → the listener above logs the
      // user in and redirects. Show confirmation in case the redirect lags.
      setMessage(_('Your password has been updated'));
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : _('Failed to update password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='azb-auth'>
      <button
        type='button'
        className='azb-back'
        aria-label={_('Back')}
        onClick={() => router.back()}
      >
        ‹
      </button>
      <div className='azb-form-col'>
        <form className='azb-form' onSubmit={handleSubmit}>
          <div className='azb-form-brand'>
            <AziralWordmark size={22} mark={34} />
          </div>
          <h1 className='azb-form-title'>{_('Update password')}</h1>
          <div className='azb-fields'>
            <div>
              <label className='azb-field-label' htmlFor='password'>
                {_('New Password')}
              </label>
              <input
                id='password'
                className='azb-input'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={_('Your new password')}
                required
                disabled={loading}
                autoComplete='new-password'
              />
            </div>
            <button className='azb-submit' type='submit' disabled={loading || !password}>
              {loading ? _('Updating password ...') : _('Update password')}
            </button>
          </div>

          {error && <div className='azb-msg err'>{error}</div>}
          {message && <div className='azb-msg ok'>{message}</div>}
        </form>
      </div>
    </div>
  );
}
