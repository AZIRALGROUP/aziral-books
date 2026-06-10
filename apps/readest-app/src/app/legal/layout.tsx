import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LegalLangToggle from './LegalLangToggle';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <header className='border-b border-gray-200'>
        <div className='mx-auto flex max-w-3xl items-center justify-between px-6 py-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/icon.png' alt='Aziral Books' width={32} height={32} className='rounded' />
            <span className='font-semibold'>Aziral Books</span>
          </Link>
          <nav className='flex items-center gap-4 text-sm text-gray-600'>
            <Link href='/legal/terms' className='hover:text-gray-900'>
              Terms
            </Link>
            <Link href='/legal/privacy' className='hover:text-gray-900'>
              Privacy
            </Link>
            <Link href='/legal/about' className='hover:text-gray-900'>
              About
            </Link>
            <LegalLangToggle />
          </nav>
        </div>
      </header>
      <main className='mx-auto max-w-3xl px-6 py-12 leading-relaxed'>{children}</main>
      <footer className='border-t border-gray-200'>
        <div className='mx-auto max-w-3xl px-6 py-6 text-sm text-gray-500'>
          © {new Date().getFullYear()} Aziral · Almaty, Kazakhstan ·{' '}
          <a href='mailto:hello@aziral.com' className='underline hover:text-gray-900'>
            hello@aziral.com
          </a>
        </div>
      </footer>
    </div>
  );
}
