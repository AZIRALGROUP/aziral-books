'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLegalLang, type LegalLang } from './legal/useLegalLang';
import LegalLangToggle from './legal/LegalLangToggle';

interface CatalogueMeta {
  total: number;
}

// Per-language copy for the marketing landing. English and Russian are
// hand-written (not machine-keyed) — the same approach the legal pages use —
// so the two stay in sync via the shared `useLegalLang` hook.
const COPY: Record<
  LegalLang,
  {
    badge: string;
    heroLine1: string;
    heroLine2: string;
    heroLine3: string;
    intro: string;
    browse: string;
    createAccount: string;
    catalogue: (n: string) => string;
    catalogueFallback: string;
    about: string;
    signIn: string;
    getStarted: string;
    featuresHeading: string;
    features: { title: string; body: React.ReactNode }[];
    ctaHeading: string;
    ctaBody: string;
    ctaCreate: string;
    ctaBrowse: string;
    footerTerms: string;
    footerPrivacy: string;
    footerContact: string;
  }
> = {
  en: {
    badge: 'Open-source · Public-domain catalogue · Sync across devices',
    heroLine1: 'Your library,',
    heroLine2: 'your books,',
    heroLine3: 'your pace.',
    intro:
      'Aziral Books is an online ebook reader on top of a curated public-domain catalogue — Project Gutenberg, Open Library, and friends. Read in your browser, sync your progress, and upload your own legally-acquired books.',
    browse: 'Browse the catalogue →',
    createAccount: 'Create a free account',
    catalogue: (n) => `${n} public-domain books in the catalogue, growing nightly.`,
    catalogueFallback: 'A public-domain catalogue, growing nightly.',
    about: 'About',
    signIn: 'Sign in',
    getStarted: 'Get started',
    featuresHeading: 'What you get',
    features: [
      {
        title: 'Curated public-domain catalogue',
        body: 'We aggregate Project Gutenberg, Open Library, and similar databases into one searchable index. Indexed nightly so new arrivals show up automatically.',
      },
      {
        title: 'Sync across devices',
        body: 'Your library, progress, highlights, and notes follow you between web, desktop, and mobile clients. Built on CRDT replicas — no conflicts, no surprises.',
      },
      {
        title: 'Upload your own books',
        body: 'Have your own EPUB or PDF collection? Drag and drop. Your files stay yours — we host them so you can read anywhere; we do not sell or train on them.',
      },
      {
        title: 'Focused reader',
        body: 'Built on the open-source Readest project: clean typography, light and dark themes, highlights, bookmarks, notes, RSVP mode, dictionaries, TTS.',
      },
      {
        title: 'OPDS-friendly',
        body: 'Prefer your own reader? Point KOReader, Foliate, or Calibre at https://books.aziral.com/api/v1/opds/popular — the catalogue speaks standard OPDS atom feeds.',
      },
      {
        title: 'Open source',
        body: (
          <>
            Web and mobile clients are AGPLv3 forks of{' '}
            <a
              href='https://github.com/readest/readest'
              className='text-blue-600 underline hover:text-blue-800'
              rel='noopener'
            >
              Readest
            </a>
            . The backend (OPDS aggregator + API) is open-source too. No lock-in.
          </>
        ),
      },
    ],
    ctaHeading: 'Start with one click. No card, no spam.',
    ctaBody:
      'Free accounts get the full catalogue, web reader, and sync across devices. Paid features (extra storage, AI summaries, translation credits) ship later — opt-in, never required.',
    ctaCreate: 'Create your account',
    ctaBrowse: 'Browse without signing up',
    footerTerms: 'Terms',
    footerPrivacy: 'Privacy',
    footerContact: 'Contact',
  },
  ru: {
    badge: 'Открытый код · Каталог общественного достояния · Синхронизация между устройствами',
    heroLine1: 'Ваша библиотека,',
    heroLine2: 'ваши книги,',
    heroLine3: 'ваш темп.',
    intro:
      'Aziral Books — онлайн-читалка поверх тщательно собранного каталога книг общественного достояния: Project Gutenberg, Open Library и другие источники. Читайте в браузере, синхронизируйте прогресс и загружайте собственные легально приобретённые книги.',
    browse: 'Открыть каталог →',
    createAccount: 'Создать бесплатный аккаунт',
    catalogue: (n) => `${n} книг общественного достояния в каталоге, пополняется каждую ночь.`,
    catalogueFallback: 'Каталог общественного достояния, пополняется каждую ночь.',
    about: 'О проекте',
    signIn: 'Войти',
    getStarted: 'Начать',
    featuresHeading: 'Что вы получаете',
    features: [
      {
        title: 'Кураторский каталог общественного достояния',
        body: 'Мы объединяем Project Gutenberg, Open Library и похожие базы в один поисковый индекс. Индексация каждую ночь — новинки появляются автоматически.',
      },
      {
        title: 'Синхронизация между устройствами',
        body: 'Библиотека, прогресс чтения, выделения и заметки следуют за вами между веб-, десктоп- и мобильными клиентами. Построено на CRDT-репликах — без конфликтов и сюрпризов.',
      },
      {
        title: 'Загрузка своих книг',
        body: 'Есть своя коллекция EPUB или PDF? Просто перетащите файлы. Они остаются вашими — мы храним их, чтобы вы читали где угодно; мы не продаём их и не обучаем на них модели.',
      },
      {
        title: 'Читалка без отвлечений',
        body: 'На базе открытого проекта Readest: аккуратная типографика, светлая и тёмная темы, выделения, закладки, заметки, режим RSVP, словари, озвучивание (TTS).',
      },
      {
        title: 'Поддержка OPDS',
        body: 'Предпочитаете свою читалку? Укажите KOReader, Foliate или Calibre на https://books.aziral.com/api/v1/opds/popular — каталог отдаёт стандартные OPDS-фиды.',
      },
      {
        title: 'Открытый исходный код',
        body: (
          <>
            Веб- и мобильные клиенты — это форки{' '}
            <a
              href='https://github.com/readest/readest'
              className='text-blue-600 underline hover:text-blue-800'
              rel='noopener'
            >
              Readest
            </a>{' '}
            под лицензией AGPLv3. Бэкенд (OPDS-агрегатор + API) тоже с открытым кодом. Без привязки
            к вендору.
          </>
        ),
      },
    ],
    ctaHeading: 'Начните в один клик. Без карты, без спама.',
    ctaBody:
      'Бесплатные аккаунты дают полный каталог, веб-читалку и синхронизацию между устройствами. Платные функции (доп. хранилище, AI-резюме, кредиты на перевод) появятся позже — по желанию, никогда принудительно.',
    ctaCreate: 'Создать аккаунт',
    ctaBrowse: 'Смотреть без регистрации',
    footerTerms: 'Условия',
    footerPrivacy: 'Конфиденциальность',
    footerContact: 'Связаться',
  },
};

// Shown to unauthenticated visitors on the root URL. Logged-in users skip
// straight to the library — see page.tsx for the routing logic.
export default function Landing() {
  const { lang } = useLegalLang();
  const t = COPY[lang];
  const [catalogueSize, setCatalogueSize] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/search?q=*&limit=1', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { meta?: CatalogueMeta } | null) => {
        if (cancelled) return;
        const total = data?.meta?.total;
        if (typeof total === 'number') setCatalogueSize(total);
      })
      .catch(() => {
        // Best-effort — falling back to a static label is fine.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const catalogueLabel =
    catalogueSize !== null
      ? t.catalogue(catalogueSize.toLocaleString(lang === 'ru' ? 'ru' : 'en'))
      : t.catalogueFallback;

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Header */}
      <header className='border-b border-gray-100'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/icon.png' alt='Aziral Books' width={32} height={32} className='rounded' />
            <span className='font-semibold tracking-tight'>Aziral Books</span>
          </Link>
          <nav className='flex items-center gap-4 text-sm text-gray-600 sm:gap-6'>
            <Link href='/legal/about' className='hidden sm:inline hover:text-gray-900'>
              {t.about}
            </Link>
            <Link href='/auth' className='hover:text-gray-900'>
              {t.signIn}
            </Link>
            <Link
              href='/auth?screen=signup'
              className='rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700'
            >
              {t.getStarted}
            </Link>
            <LegalLangToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-6xl px-6 py-20 sm:py-28'>
        <div className='max-w-3xl'>
          <p className='mb-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>
            {t.badge}
          </p>
          <h1 className='text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            {t.heroLine1}
            <br />
            {t.heroLine2}
            <br />
            {t.heroLine3}
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-gray-600'>{t.intro}</p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              href='/library'
              className='rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700'
            >
              {t.browse}
            </Link>
            <Link
              href='/auth?screen=signup'
              className='rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-900 hover:border-gray-900'
            >
              {t.createAccount}
            </Link>
          </div>
          <p className='mt-6 text-sm text-gray-500'>{catalogueLabel}</p>
        </div>
      </section>

      {/* Features */}
      <section className='border-t border-gray-100 bg-gray-50'>
        <div className='mx-auto max-w-6xl px-6 py-20'>
          <h2 className='text-2xl font-semibold tracking-tight'>{t.featuresHeading}</h2>
          <div className='mt-10 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {t.features.map((f) => (
              <Feature key={f.title} title={f.title} body={f.body} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto max-w-6xl px-6 py-20 text-center'>
        <h2 className='text-balance text-3xl font-semibold tracking-tight sm:text-4xl'>
          {t.ctaHeading}
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-gray-600'>{t.ctaBody}</p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link
            href='/auth?screen=signup'
            className='rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700'
          >
            {t.ctaCreate}
          </Link>
          <Link
            href='/library'
            className='rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-900 hover:border-gray-900'
          >
            {t.ctaBrowse}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100'>
        <div className='mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between'>
          <div>© {new Date().getFullYear()} Aziral · Almaty, Kazakhstan</div>
          <div className='flex gap-5'>
            <Link href='/legal/about' className='hover:text-gray-900'>
              {t.about}
            </Link>
            <Link href='/legal/terms' className='hover:text-gray-900'>
              {t.footerTerms}
            </Link>
            <Link href='/legal/privacy' className='hover:text-gray-900'>
              {t.footerPrivacy}
            </Link>
            <a href='mailto:hello@aziral.com' className='hover:text-gray-900'>
              {t.footerContact}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div>
      <h3 className='text-base font-semibold tracking-tight text-gray-900'>{title}</h3>
      <p className='mt-2 text-sm leading-relaxed text-gray-600'>{body}</p>
    </div>
  );
}
