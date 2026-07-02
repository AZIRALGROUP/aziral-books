'use client';

import { AziralMark } from '@/components/brand/AziralMark';
import './library-hero.css';

interface LibraryHeroProps {
  count: number;
  streak?: number;
}

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Доброй ночи';
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

// Russian plural of "день": 1 день, 2-4 дня, 5-20 дней, then cycles (21 день, 22 дня, 25 дней...).
function dayWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

// Branded header band for /library — book mark + a warm time-based greeting,
// "Моя библиотека", and the "Все книги · N" section bar. Purely presentational;
// the functional bookshelf grid renders below it untouched.
export default function LibraryHero({ count, streak = 0 }: LibraryHeroProps) {
  return (
    <div className='azb-libhero'>
      <div className='azb-libhero-inner'>
        <div className='azb-libhero-head'>
          <AziralMark size={36} />
          <div className='azb-libhero-titles'>
            <div className='azb-libhero-greeting'>{greetingForNow()}</div>
            <h1 className='azb-libhero-title'>Моя библиотека</h1>
          </div>
          {streak > 0 && (
            <div
              className='azb-libhero-streak'
              aria-label={`Серия чтения: ${streak} ${dayWord(streak)} подряд`}
            >
              <span className='azb-libhero-streak-flame' aria-hidden='true'>
                🔥
              </span>
              <span className='azb-libhero-streak-count'>{streak}</span>
              <span className='azb-libhero-streak-word'>{dayWord(streak)} подряд</span>
            </div>
          )}
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
