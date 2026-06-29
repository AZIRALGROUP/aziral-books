'use client';

import { AziralMark } from '@/components/brand/AziralMark';
import './library-hero.css';

interface LibraryHeroProps {
  count: number;
}

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

// Branded header band for /library — book mark + a warm time-based greeting,
// "Моя библиотека", and the "Все книги · N" section bar. Purely presentational;
// the functional bookshelf grid renders below it untouched.
export default function LibraryHero({ count }: LibraryHeroProps) {
  return (
    <div className='azb-libhero'>
      <div className='azb-libhero-inner'>
        <div className='azb-libhero-head'>
          <AziralMark size={36} />
          <div className='azb-libhero-titles'>
            <div className='azb-libhero-greeting'>{greetingForNow()}</div>
            <h1 className='azb-libhero-title'>Моя библиотека</h1>
          </div>
        </div>

        <div className='azb-libhero-bar'>
          <h2 className='azb-libhero-count'>
            Все книги <span>· {count}</span>
          </h2>
          <div className='azb-libhero-sort'>
            Сортировка: <b>Недавние</b>
          </div>
        </div>
      </div>
    </div>
  );
}
