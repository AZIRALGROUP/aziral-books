'use client';

import type { Book } from '@/types/book';
import BookCover from '@/components/BookCover';
import './continue-reading.css';

interface ContinueReadingProps {
  book: Book;
  onOpen: (book: Book) => void;
}

// Page position + percentage from the book's [current, total] progress tuple.
function readingInfo(book: Book): { current: number; total: number; pct: number } | null {
  if (!book.progress || !book.progress[1]) return null;
  const [current, total] = book.progress;
  const pct = total === 1 ? 100 : Math.max(0, Math.min(100, Math.round((current / total) * 100)));
  return { current, total, pct };
}

// "Продолжаете читать" hero — surfaces the in-progress book above the grid as
// the primary one-click action of /library. Mirrors the brand mockup
// (library.jsx → ContinueReading). Self-contained: it only reads the book and
// calls onOpen, so it never touches the bookshelf's selection / DnD / sync.
export default function ContinueReading({ book, onOpen }: ContinueReadingProps) {
  const info = readingInfo(book);
  if (!info) return null;

  return (
    <div className='azb-continue-wrap'>
      <button type='button' className='azb-continue' onClick={() => onOpen(book)}>
        <span className='azb-continue-glow' aria-hidden='true' />
        <span className='azb-continue-row'>
          <span className='azb-continue-cover'>
            <BookCover book={book} />
          </span>
          <span className='azb-continue-body'>
            <span className='azb-continue-label'>✦ Продолжаете читать</span>
            <span className='azb-continue-title'>{book.title}</span>
            <span className='azb-continue-meta'>
              Страница {info.current} из {info.total} · осталось {info.total - info.current} стр.
            </span>
            <span className='azb-continue-progress'>
              <span className='azb-continue-track'>
                <span className='azb-continue-fill' style={{ width: `${info.pct}%` }} />
              </span>
              <span className='azb-continue-pct'>{info.pct}%</span>
            </span>
          </span>
          <span className='azb-continue-cta'>
            Продолжить <span aria-hidden='true'>→</span>
          </span>
        </span>
      </button>
    </div>
  );
}
