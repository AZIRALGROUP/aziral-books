'use client';

import { PiCloudSlash } from 'react-icons/pi';

import { AziralMark } from '@/components/brand/AziralMark';
import './library-hero.css';

interface LibraryHeroProps {
  count: number;
  // Cloud file-upload (R2) isn't configured yet, so book files stay on-device.
  cloudUnavailable?: boolean;
  onRetrySync?: () => void;
}

// Branded header band for /library — book mark + "Моя библиотека", an honest
// cloud-sync notice, and the "Все книги · N" section bar. Purely presentational;
// the functional bookshelf grid renders below it untouched.
export default function LibraryHero({ count, cloudUnavailable, onRetrySync }: LibraryHeroProps) {
  return (
    <div className='azb-libhero'>
      <div className='azb-libhero-inner'>
        <div className='azb-libhero-head'>
          <AziralMark size={36} />
          <div className='azb-libhero-titles'>
            <h1 className='azb-libhero-title'>Моя библиотека</h1>
            <div className='azb-libhero-sub'>
              Только ваши книги — загруженные и синхронизированные
            </div>
          </div>
        </div>

        {cloudUnavailable && (
          <div className='azb-libhero-banner'>
            <span className='azb-libhero-banner-ico'>
              <PiCloudSlash size={20} />
            </span>
            <div className='azb-libhero-banner-text'>
              <div className='azb-libhero-banner-title'>Облачная синхронизация недоступна</div>
              <div className='azb-libhero-banner-sub'>
                Книги сохранены на этом устройстве. Выгрузка в облако появится скоро.
              </div>
            </div>
            {onRetrySync && (
              <button type='button' className='azb-libhero-retry' onClick={onRetrySync}>
                Повторить
              </button>
            )}
          </div>
        )}

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
