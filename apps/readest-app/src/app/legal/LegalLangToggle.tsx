'use client';

import { useLegalLang } from './useLegalLang';

export default function LegalLangToggle() {
  const { lang, setLang } = useLegalLang();
  return (
    <div className='flex overflow-hidden rounded border border-gray-300 text-xs'>
      <button
        type='button'
        onClick={() => setLang('en')}
        className={lang === 'en' ? 'bg-gray-900 px-2 py-1 text-white' : 'px-2 py-1 text-gray-600'}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <button
        type='button'
        onClick={() => setLang('ru')}
        className={lang === 'ru' ? 'bg-gray-900 px-2 py-1 text-white' : 'px-2 py-1 text-gray-600'}
        aria-pressed={lang === 'ru'}
      >
        RU
      </button>
    </div>
  );
}
