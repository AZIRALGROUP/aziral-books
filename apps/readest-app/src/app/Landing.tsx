'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { useLegalLang, type LegalLang } from './legal/useLegalLang';
import LegalLangToggle from './legal/LegalLangToggle';
import { AziralMark, AziralWordmark } from '@/components/brand/AziralMark';
import './landing.css';

interface CatalogueMeta {
  total: number;
}

const GITHUB_URL = 'https://github.com/AZIRALGROUP/aziral-books';

// Opens the built-in Aziral OPDS catalogue in the in-app browser. Mirrors the
// link CatalogManager builds (url + stable id) so anonymous visitors land on
// the ~hundreds of public-domain books, not their empty personal library.
const CATALOGUE_HREF = `/opds?url=${encodeURIComponent(
  'https://books.aziral.com/api/v1/opds',
)}&id=aziral-books-builtin`;

interface Copy {
  navFeatures: string;
  navFormats: string;
  navLanguages: string;
  signIn: string;
  getStarted: string;
  heroBadge: string;
  heroPre: string;
  heroAccent: string;
  heroSub: string;
  heroPrimary: string;
  heroSecondary: string;
  heroMeta: string;
  catalogue: (n: string) => string;
  formatsLabel: string;
  featuresHeading: string;
  featuresSub: string;
  features: { icon: string; title: string; body: string }[];
  langLabel: string;
  langHeading: string;
  langBody: string;
  ctaHeading: string;
  ctaSub: string;
  ctaPrimary: string;
  ctaGithub: string;
  footerLinks: { label: string; href: string; external?: boolean }[];
}

const COPY: Record<LegalLang, Copy> = {
  ru: {
    navFeatures: 'Возможности',
    navFormats: 'Форматы',
    navLanguages: 'Языки',
    signIn: 'Войти',
    getStarted: 'Начать',
    heroBadge: 'Тихая читалка для любых книг',
    heroPre: 'Место, где хорошо ',
    heroAccent: 'читается',
    heroSub:
      'EPUB, PDF и заметки в одной тёплой библиотеке. Синхронизация прогресса, закладок и выделений — на всех ваших устройствах.',
    heroPrimary: 'Открыть каталог',
    heroSecondary: 'Создать бесплатный аккаунт',
    heroMeta: 'Бесплатно · открытый код · читается прямо в браузере',
    catalogue: (n) => `${n} книг общественного достояния в каталоге, пополняется каждую ночь.`,
    formatsLabel: 'Поддерживает',
    featuresHeading: 'Сделано для долгого чтения',
    featuresSub:
      'Никакой ленты и уведомлений. Только книга, ваш темп и аккуратные инструменты вокруг.',
    features: [
      {
        icon: '✎',
        title: 'Заметки и выделения',
        body: 'Цветные маркеры, сноски на полях и экспорт всех заметок в Markdown одним движением.',
      },
      {
        icon: '⟳',
        title: 'Сквозная синхронизация',
        body: 'Прогресс, закладки и библиотека всегда совпадают — продолжайте с любого устройства.',
      },
      {
        icon: '☾',
        title: 'Бережно для глаз',
        body: 'Тёплая бумажная тема, ночной режим и тонкая настройка шрифта, полей и интерлиньяжа.',
      },
      {
        icon: '⤓',
        title: 'Ваши файлы — ваши',
        body: 'Загружайте свои EPUB и PDF, читайте где угодно. Открытый формат, без замков.',
      },
    ],
    langLabel: 'Русский · English · Қазақша',
    langHeading: 'Читайте на своём языке',
    langBody:
      'Интерфейс и переносы для трёх письменностей. Полная поддержка кириллицы, латиницы и казахского — без сломанных шрифтов и кракозябр.',
    ctaHeading: 'Начните вечер с главы',
    ctaSub: 'Бесплатно, без рекламы и подписок. Ваша библиотека ждёт.',
    ctaPrimary: 'Открыть каталог',
    ctaGithub: 'Звёздочка на GitHub ☆',
    footerLinks: [
      { label: 'Условия', href: '/legal/terms' },
      { label: 'Конфиденциальность', href: '/legal/privacy' },
      { label: 'О проекте', href: '/legal/about' },
      { label: 'GitHub', href: GITHUB_URL, external: true },
    ],
  },
  en: {
    navFeatures: 'Features',
    navFormats: 'Formats',
    navLanguages: 'Languages',
    signIn: 'Sign in',
    getStarted: 'Get started',
    heroBadge: 'A quiet reader for any book',
    heroPre: 'A place made for ',
    heroAccent: 'reading',
    heroSub:
      'EPUB, PDF, and notes in one warm library. Your progress, bookmarks, and highlights sync across every device.',
    heroPrimary: 'Browse the catalogue',
    heroSecondary: 'Create a free account',
    heroMeta: 'Free · open-source · runs right in your browser',
    catalogue: (n) => `${n} public-domain books in the catalogue, growing nightly.`,
    formatsLabel: 'Supports',
    featuresHeading: 'Built for long reading',
    featuresSub:
      'No feed, no notifications. Just the book, your pace, and a few quiet tools around it.',
    features: [
      {
        icon: '✎',
        title: 'Notes & highlights',
        body: 'Colored markers, margin notes, and one-tap export of every note to Markdown.',
      },
      {
        icon: '⟳',
        title: 'Sync everywhere',
        body: 'Progress, bookmarks, and library always match — pick up on any device.',
      },
      {
        icon: '☾',
        title: 'Easy on the eyes',
        body: 'A warm paper theme, night mode, and fine control over font, margins, and line height.',
      },
      {
        icon: '⤓',
        title: 'Your files stay yours',
        body: 'Upload your own EPUB and PDF, read anywhere. Open format, no lock-in.',
      },
    ],
    langLabel: 'Русский · English · Қазақша',
    langHeading: 'Read in your own language',
    langBody:
      'Interface and hyphenation for three scripts. Full Cyrillic, Latin, and Kazakh support — no broken fonts, no mojibake.',
    ctaHeading: 'Start the evening with a chapter',
    ctaSub: 'Free, no ads, no subscriptions. Your library is waiting.',
    ctaPrimary: 'Browse the catalogue',
    ctaGithub: 'Star on GitHub ☆',
    footerLinks: [
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'About', href: '/legal/about' },
      { label: 'GitHub', href: GITHUB_URL, external: true },
    ],
  },
};

const READER_FORMATS = ['EPUB', 'PDF', 'MOBI', 'CBZ', 'FB2', 'TXT', 'Markdown'];

const LANG_SAMPLES = [
  { tag: 'RU', line: 'Все счастливые семьи похожи друг на друга.' },
  { tag: 'EN', line: 'Happy families are all alike; every unhappy family…' },
  { tag: 'KK', line: 'Барлық бақытты отбасылар бір-біріне ұқсайды.' },
];

/* ---------------- buttons ---------------- */
const btnBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '13px 24px',
  borderRadius: 999,
  fontFamily: 'var(--sans)',
  fontWeight: 600,
  fontSize: 15.5,
  textDecoration: 'none',
  cursor: 'pointer',
};

function primaryStyle(): CSSProperties {
  return {
    ...btnBase,
    background: 'var(--accent)',
    color: 'var(--paper-card)',
    border: 'none',
    boxShadow: 'var(--shadow-md)',
  };
}

function ghostStyle(): CSSProperties {
  return {
    ...btnBase,
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--line-strong)',
  };
}

/* ---------------- reader product shot ---------------- */
function ReaderMock() {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--paper-sunk)',
        }}
      >
        <div style={{ display: 'flex', gap: 7 }}>
          {['#e0685f', '#e3b341', '#5bba6f'].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: 99, background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--sans)',
            fontSize: 12.5,
            color: 'var(--text-3)',
            fontWeight: 600,
          }}
        >
          Лев Толстой · Анна Каренина
        </div>
        <div style={{ display: 'flex', gap: 12, color: 'var(--text-3)', fontSize: 14 }}>
          <span>Aa</span>
          <span>☾</span>
          <span>⤢</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '168px 1fr', minHeight: 360 }}>
        <div
          style={{
            borderRight: '1px solid var(--border)',
            padding: '18px 14px',
            background: 'var(--paper-sunk)',
          }}
        >
          <div className='mono-lab'>Оглавление</div>
          {[
            'Часть первая',
            'I. Всё смешалось',
            'II. Степан Аркадьич',
            'III. Кабинет',
            'IV. Долли',
          ].map((s, i) => (
            <div
              key={s}
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 14,
                padding: '7px 0',
                color: i === 2 ? 'var(--text)' : 'var(--text-3)',
                fontWeight: i === 2 ? 600 : 400,
                borderLeft: i === 2 ? '2px solid var(--accent)' : '2px solid transparent',
                paddingLeft: 10,
              }}
            >
              {s}
            </div>
          ))}
        </div>
        <div style={{ padding: '30px 40px', position: 'relative' }}>
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 19,
              lineHeight: 1.66,
              color: 'var(--text)',
              maxWidth: 460,
            }}
          >
            <span
              style={{
                float: 'left',
                fontSize: 58,
                lineHeight: 0.86,
                paddingRight: 10,
                fontWeight: 500,
                color: 'var(--accent)',
                fontFamily: 'var(--serif)',
              }}
            >
              В
            </span>
            се счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива
            по‑своему.
            <span
              style={{
                background: 'var(--ochre-soft)',
                borderRadius: 3,
                padding: '0 2px',
                boxShadow: 'inset 0 -2px 0 var(--accent)',
              }}
            >
              {' '}
              Всё смешалось в доме Облонских.
            </span>{' '}
            Жена узнала, что муж был в связи с бывшею в их доме француженкою-гувернанткой.
          </div>
          <div
            style={{
              position: 'absolute',
              left: 40,
              right: 40,
              bottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'var(--sans)',
              fontSize: 12,
              color: 'var(--text-3)',
            }}
          >
            <span>Глава III</span>
            <div
              style={{
                flex: 1,
                margin: '0 16px',
                height: 3,
                borderRadius: 99,
                background: 'var(--paper-sunk)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '38%',
                  borderRadius: 99,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <span>38%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: string; title: string; body: ReactNode }) {
  return (
    <div
      style={{
        padding: 26,
        borderRadius: 'var(--r-lg)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: 'var(--ochre-soft)',
          color: 'var(--ochre-deep)',
          marginBottom: 16,
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 21,
          fontWeight: 500,
          margin: '0 0 8px',
          color: 'var(--text)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--sans)',
          fontSize: 15,
          lineHeight: 1.55,
          color: 'var(--text-2)',
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

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
        // Best-effort — the static meta line is a fine fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const catalogueLine =
    catalogueSize !== null
      ? t.catalogue(catalogueSize.toLocaleString(lang === 'ru' ? 'ru' : 'en'))
      : null;

  return (
    <div className='azb-landing' style={{ minHeight: '100vh' }}>
      <div className='azb-paper-texture' />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1140,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '26px 0',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Link href='/' style={{ textDecoration: 'none' }}>
            <AziralWordmark size={22} mark={32} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <a
              href='#features'
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {t.navFeatures}
            </a>
            <a
              href='#formats'
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {t.navFormats}
            </a>
            <a
              href='#languages'
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {t.navLanguages}
            </a>
            <Link
              href='/auth'
              style={{
                fontSize: 14.5,
                fontWeight: 500,
                color: 'var(--text-2)',
                textDecoration: 'none',
              }}
            >
              {t.signIn}
            </Link>
            <Link href='/auth?screen=signup' style={primaryStyle()}>
              {t.getStarted}
            </Link>
            <LegalLangToggle />
          </div>
        </nav>

        {/* hero */}
        <header
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)',
            gap: 56,
            alignItems: 'center',
            padding: '48px 0 64px',
          }}
          className='azb-hero'
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'var(--ochre-soft)',
                color: 'var(--ochre-deep)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 22,
              }}
            >
              <span
                style={{ width: 7, height: 7, borderRadius: 99, background: 'var(--accent)' }}
              />
              {t.heroBadge}
            </div>
            <h1
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(40px, 5.2vw, 66px)',
                fontWeight: 500,
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                margin: '0 0 20px',
                color: 'var(--text)',
              }}
            >
              {t.heroPre}
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--accent)' }}>
                {t.heroAccent}
              </span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 20,
                lineHeight: 1.55,
                color: 'var(--text-2)',
                margin: '0 0 32px',
                maxWidth: 440,
              }}
            >
              {t.heroSub}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href={CATALOGUE_HREF} style={primaryStyle()}>
                {t.heroPrimary}
              </Link>
              <Link href='/auth?screen=signup' style={ghostStyle()}>
                {t.heroSecondary}
              </Link>
            </div>
            <div style={{ marginTop: 22, fontSize: 13.5, color: 'var(--text-3)' }}>
              {t.heroMeta}
            </div>
            {catalogueLine && (
              <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--text-3)' }}>
                {catalogueLine}
              </div>
            )}
          </div>
          <ReaderMock />
        </header>

        {/* formats strip */}
        <div
          id='formats'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '10px 0 64px',
            color: 'var(--text-3)',
          }}
        >
          <span className='mono-lab'>{t.formatsLabel}</span>
          {READER_FORMATS.map((f) => (
            <span
              key={f}
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontWeight: 500,
                color: 'var(--text-2)',
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* features */}
        <section id='features' style={{ padding: '20px 0 24px', scrollMarginTop: 80 }}>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(30px,3.4vw,42px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
              color: 'var(--text)',
            }}
          >
            {t.featuresHeading}
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-2)', margin: '0 0 36px', maxWidth: 520 }}>
            {t.featuresSub}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            {t.features.map((f) => (
              <Feature key={f.title} icon={f.icon} title={f.title} body={f.body} />
            ))}
          </div>
        </section>

        {/* multilingual */}
        <section
          id='languages'
          style={{
            margin: '72px 0',
            padding: 44,
            borderRadius: 'var(--r-xl)',
            background: 'var(--paper-sunk)',
            border: '1px solid var(--border)',
            scrollMarginTop: 80,
          }}
        >
          <div
            className='azb-lang-grid'
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)',
              gap: 44,
              alignItems: 'center',
            }}
          >
            <div>
              <div className='mono-lab' style={{ marginBottom: 14 }}>
                {t.langLabel}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(28px,3vw,38px)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  margin: '0 0 14px',
                  color: 'var(--text)',
                }}
              >
                {t.langHeading}
              </h2>
              <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'var(--text-2)', margin: 0 }}>
                {t.langBody}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LANG_SAMPLES.map((l) => (
                <div
                  key={l.tag}
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--sans)',
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--accent)',
                      width: 28,
                    }}
                  >
                    {l.tag}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--serif)', fontSize: 17.5, color: 'var(--text)' }}
                  >
                    {l.line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '40px 0 88px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AziralMark size={56} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(32px,4vw,52px)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              margin: '18px 0 14px',
              color: 'var(--text)',
            }}
          >
            {t.ctaHeading}
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text-2)', margin: '0 auto 30px', maxWidth: 440 }}>
            {t.ctaSub}
          </p>
          <div
            style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link href={CATALOGUE_HREF} style={primaryStyle()}>
              {t.ctaPrimary}
            </Link>
            <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer' style={ghostStyle()}>
              {t.ctaGithub}
            </a>
          </div>
        </section>
      </div>

      {/* footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border)',
          background: 'var(--paper-sunk)',
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '40px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AziralWordmark size={18} mark={26} color='var(--text-2)' />
          <div
            style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              fontSize: 14,
              color: 'var(--text-2)',
            }}
          >
            {t.footerLinks.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: 'var(--text-2)', textDecoration: 'none' }}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ color: 'var(--text-2)', textDecoration: 'none' }}
                >
                  {l.label}
                </Link>
              ),
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} Aziral Books
          </div>
        </div>
      </footer>
    </div>
  );
}
