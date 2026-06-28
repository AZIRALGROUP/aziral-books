'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/utils/supabase';
import { AziralWordmark } from '@/components/brand/AziralMark';
import '../auth.css';

export default function UpdateEmailPage() {
  const _ = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({ email });
      if (updateError) throw updateError;

      setMessage(
        _(
          'Confirmation email sent! Please check your old and new email addresses to confirm the change.',
        ),
      );
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : _('Failed to update email'));
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
          <h1 className='azb-form-title'>{_('Update email')}</h1>
          <div className='azb-fields'>
            <div>
              <label className='azb-field-label' htmlFor='email'>
                {_('New Email')}
              </label>
              <input
                id='email'
                className='azb-input'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={_('Your new email')}
                required
                disabled={loading}
              />
            </div>
            <button className='azb-submit' type='submit' disabled={loading || !email}>
              {loading ? _('Updating email ...') : _('Update email')}
            </button>
          </div>

          {error && <div className='azb-msg err'>{error}</div>}
          {message && <div className='azb-msg ok'>{message}</div>}

          {user?.email && (
            <div className='azb-foot'>
              {_('Current email')}: {user.email}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
