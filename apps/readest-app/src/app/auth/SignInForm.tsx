'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';

import { supabase } from '@/utils/supabase';
import { AziralWordmark } from '@/components/brand/AziralMark';
import './auth.css';

type Provider = 'google' | 'apple';
type Mode = 'signin' | 'signup';
type Msg = { kind: 'err' | 'ok'; text: string } | null;

interface SignInFormProps {
  redirectTo: string;
  onGoBack: () => void;
}

function getErrorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Что-то пошло не так. Попробуйте ещё раз.';
}

export default function SignInForm({ redirectTo, onGoBack }: SignInFormProps) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const oauth = async (provider: Provider) => {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setMsg({ kind: 'err', text: getErrorText(error) });
      setBusy(false);
    }
    // On success the browser is redirected to the provider; no further UI needed.
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setMsg(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        // Success → the page-level onAuthStateChange redirects to the library.
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
        setMsg({ kind: 'ok', text: 'Письмо с подтверждением отправлено — проверьте почту.' });
      }
    } catch (error) {
      setMsg({ kind: 'err', text: getErrorText(error) });
    } finally {
      setBusy(false);
    }
  };

  const magicLink = async () => {
    if (!email) {
      setMsg({ kind: 'err', text: 'Введите адрес электронной почты.' });
      return;
    }
    setMsg(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setMsg({ kind: 'ok', text: 'Магическая ссылка отправлена — проверьте почту.' });
    } catch (error) {
      setMsg({ kind: 'err', text: getErrorText(error) });
    } finally {
      setBusy(false);
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      setMsg({ kind: 'err', text: 'Введите адрес почты, чтобы сбросить пароль.' });
      return;
    }
    setMsg(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMsg({ kind: 'ok', text: 'Инструкция по сбросу пароля отправлена на почту.' });
    } catch (error) {
      setMsg({ kind: 'err', text: getErrorText(error) });
    } finally {
      setBusy(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className='azb-auth'>
      <button type='button' className='azb-back' aria-label='Назад' onClick={onGoBack}>
        <IoArrowBack />
      </button>

      <div className='azb-auth-grid'>
        {/* Aside — a quiet reading scene, desktop only */}
        <aside className='azb-aside'>
          <div className='azb-aside-grain' aria-hidden='true' />
          <div className='azb-aside-glow' aria-hidden='true' />
          <div className='azb-aside-brand'>
            <AziralWordmark size={22} mark={34} />
          </div>
          <div className='azb-aside-body'>
            <div className='azb-aside-kicker'>Из вашей библиотеки</div>
            <blockquote className='azb-aside-quote'>
              <span>«</span>Все счастливые семьи похожи друг на друга, каждая несчастливая семья
              несчастлива по‑своему.<span>»</span>
            </blockquote>
            <div className='azb-aside-by'>
              Лев Толстой <small>· Анна Каренина</small>
            </div>
          </div>
          <div className='azb-aside-feats'>
            {['Синхронизация на всех устройствах', 'Заметки и закладки', 'Без рекламы'].map((s) => (
              <span key={s}>
                <i aria-hidden='true' />
                {s}
              </span>
            ))}
          </div>
        </aside>

        {/* Form */}
        <div className='azb-form-col'>
          <div className='azb-form'>
            <div className='azb-form-brand'>
              <AziralWordmark size={22} mark={34} />
            </div>

            <h1 className='azb-form-title'>{isSignup ? 'Создать аккаунт' : 'С возвращением'}</h1>
            <p className='azb-form-sub'>
              {isSignup
                ? 'Зарегистрируйтесь, чтобы начать читать.'
                : 'Войдите, чтобы продолжить чтение.'}
            </p>

            <div className='azb-social-col'>
              <button
                type='button'
                className='azb-social'
                onClick={() => oauth('google')}
                disabled={busy}
              >
                <FcGoogle size={18} />
                Войти с помощью Google
              </button>
              <button
                type='button'
                className='azb-social'
                onClick={() => oauth('apple')}
                disabled={busy}
              >
                <FaApple size={18} />
                Войти с помощью Apple
              </button>
            </div>

            <div className='azb-divider'>
              <span />
              <em>или по почте</em>
              <span />
            </div>

            <form className='azb-fields' onSubmit={submit}>
              <label>
                <div className='azb-field-label'>
                  <span>Электронная почта</span>
                </div>
                <input
                  className='azb-input'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <div className='azb-field-label'>
                  <span>Пароль</span>
                  {!isSignup && (
                    <button type='button' className='azb-link' onClick={forgotPassword}>
                      Забыли пароль?
                    </button>
                  )}
                </div>
                <input
                  className='azb-input'
                  type='password'
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  placeholder='Ваш пароль'
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </label>

              <button type='submit' className='azb-submit' disabled={busy}>
                {busy ? 'Подождите…' : isSignup ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </form>

            {msg && <div className={`azb-msg ${msg.kind}`}>{msg.text}</div>}

            {!isSignup && (
              <div className='azb-magic'>
                <span aria-hidden='true'>✦</span>
                <button type='button' className='azb-link' onClick={magicLink}>
                  Прислать магическую ссылку на почту
                </button>
              </div>
            )}

            <div className='azb-foot'>
              {isSignup ? (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    type='button'
                    className='azb-link strong'
                    onClick={() => setMode('signin')}
                  >
                    Войти
                  </button>
                </>
              ) : (
                <>
                  Нет аккаунта?{' '}
                  <button
                    type='button'
                    className='azb-link strong'
                    onClick={() => setMode('signup')}
                  >
                    Зарегистрируйтесь
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
