'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CatalogueMeta {
  total: number;
}

// Shown to unauthenticated visitors on the root URL. Logged-in users skip
// straight to the library — see page.tsx for the routing logic.
export default function Landing() {
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
      ? `${catalogueSize.toLocaleString('en')} public-domain books in the catalogue, growing nightly.`
      : 'A public-domain catalogue, growing nightly.';

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Header */}
      <header className='border-b border-gray-100'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/icon.png' alt='Aziral Books' width={32} height={32} className='rounded' />
            <span className='font-semibold tracking-tight'>Aziral Books</span>
          </Link>
          <nav className='flex items-center gap-6 text-sm text-gray-600'>
            <Link href='/legal/about' className='hidden sm:inline hover:text-gray-900'>
              About
            </Link>
            <Link href='/auth' className='hover:text-gray-900'>
              Sign in
            </Link>
            <Link
              href='/auth?screen=signup'
              className='rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700'
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-6xl px-6 py-20 sm:py-28'>
        <div className='max-w-3xl'>
          <p className='mb-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'>
            Open-source · Public-domain catalogue · Sync across devices
          </p>
          <h1 className='text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            Your library,
            <br />
            your books,
            <br />
            your pace.
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-gray-600'>
            Aziral Books is an online ebook reader on top of a curated public-domain catalogue —
            Project Gutenberg, Open Library, and friends. Read in your browser, sync your progress,
            and upload your own legally-acquired books.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link
              href='/library'
              className='rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700'
            >
              Browse the catalogue →
            </Link>
            <Link
              href='/auth?screen=signup'
              className='rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-900 hover:border-gray-900'
            >
              Create a free account
            </Link>
          </div>
          <p className='mt-6 text-sm text-gray-500'>{catalogueLabel}</p>
        </div>
      </section>

      {/* Features */}
      <section className='border-t border-gray-100 bg-gray-50'>
        <div className='mx-auto max-w-6xl px-6 py-20'>
          <h2 className='text-2xl font-semibold tracking-tight'>What you get</h2>
          <div className='mt-10 grid grid-cols-1 gap-8 md:grid-cols-3'>
            <Feature
              title='Curated public-domain catalogue'
              body='We aggregate Project Gutenberg, Open Library, and similar databases into one searchable index. Indexed nightly so new arrivals show up automatically.'
            />
            <Feature
              title='Sync across devices'
              body='Your library, progress, highlights, and notes follow you between web, desktop, and mobile clients. Built on CRDT replicas — no conflicts, no surprises.'
            />
            <Feature
              title='Upload your own books'
              body='Have your own EPUB or PDF collection? Drag and drop. Your files stay yours — we host them so you can read anywhere; we do not sell or train on them.'
            />
            <Feature
              title='Focused reader'
              body='Built on the open-source Readest project: clean typography, light and dark themes, highlights, bookmarks, notes, RSVP mode, dictionaries, TTS.'
            />
            <Feature
              title='OPDS-friendly'
              body='Prefer your own reader? Point KOReader, Foliate, or Calibre at https://books.aziral.com/api/v1/opds/popular — the catalogue speaks standard OPDS atom feeds.'
            />
            <Feature
              title='Open source'
              body={
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
              }
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto max-w-6xl px-6 py-20 text-center'>
        <h2 className='text-balance text-3xl font-semibold tracking-tight sm:text-4xl'>
          Start with one click. No card, no spam.
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-gray-600'>
          Free accounts get the full catalogue, web reader, and sync across devices. Paid features
          (extra storage, AI summaries, translation credits) ship later — opt-in, never required.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link
            href='/auth?screen=signup'
            className='rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-700'
          >
            Create your account
          </Link>
          <Link
            href='/library'
            className='rounded-md border border-gray-300 px-6 py-3 text-base font-medium text-gray-900 hover:border-gray-900'
          >
            Browse without signing up
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100'>
        <div className='mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between'>
          <div>© {new Date().getFullYear()} Aziral · Almaty, Kazakhstan</div>
          <div className='flex gap-5'>
            <Link href='/legal/about' className='hover:text-gray-900'>
              About
            </Link>
            <Link href='/legal/terms' className='hover:text-gray-900'>
              Terms
            </Link>
            <Link href='/legal/privacy' className='hover:text-gray-900'>
              Privacy
            </Link>
            <a href='mailto:hello@aziral.com' className='hover:text-gray-900'>
              Contact
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
