// Procedural literary book covers — no images. Each cover is typographic, in a
// curated "book spine" palette, with a layout chosen deterministically from the
// title+author hash. Ported from the brand prototype (book-cover.jsx).
import type { CSSProperties } from 'react';
import type { CatalogBook } from './catalogModel';

const COVER_PALETTES = [
  { bg: '#3b4a3f', ink: '#f3ead9', accent: '#c9a24b' },
  { bg: '#8a3b2e', ink: '#f6e7d6', accent: '#e8c98f' },
  { bg: '#27384f', ink: '#eef1f4', accent: '#d98a4e' },
  { bg: '#c9a24b', ink: '#3a2e18', accent: '#5a3d1e' },
  { bg: '#6b2740', ink: '#f3dde4', accent: '#dfa6b6' },
  { bg: '#1f2a2a', ink: '#e7e0cf', accent: '#7fae9a' },
  { bg: '#e7ddc7', ink: '#3a3326', accent: '#9c5b34' },
  { bg: '#2f4858', ink: '#eaf0f0', accent: '#e6b35a' },
  { bg: '#4a3b5c', ink: '#efe7f3', accent: '#d6a85e' },
  { bg: '#7a4a23', ink: '#f6e9d6', accent: '#e8c98f' },
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

interface BookCoverProps {
  book: CatalogBook;
  w?: number | string;
  h?: number;
  radius?: number;
}

export function BookCover({ book, w = 150, h = 222, radius = 6 }: BookCoverProps) {
  const seed = hash(book.title + book.author);
  const pal = COVER_PALETTES[seed % COVER_PALETTES.length]!;
  const layout = seed % 5;
  const u = (px: number) => `${((px / 150) * 100).toFixed(2)}cqw`;
  const fs = u;
  const numW = typeof w === 'number';

  const frame: CSSProperties = {
    position: 'relative',
    width: numW ? w : '100%',
    height: numW ? h : 'auto',
    aspectRatio: numW ? undefined : '150 / 222',
    containerType: 'inline-size',
    borderRadius: radius,
    background: pal.bg,
    color: pal.ink,
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 1px 0 rgba(255,255,255,.10) inset, 0 10px 24px rgba(0,0,0,.28)',
    fontFamily: 'var(--serif)',
  };
  const spine = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: u(6),
        background: 'linear-gradient(90deg, rgba(0,0,0,.28), rgba(0,0,0,0))',
      }}
    />
  );
  const sheen = (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(125deg, rgba(255,255,255,.10), transparent 32%)',
      }}
    />
  );
  const author = (
    <div
      style={{
        fontFamily: 'var(--sans)',
        fontSize: fs(11),
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        opacity: 0.82,
        fontWeight: 600,
      }}
    >
      {book.author}
    </div>
  );
  const title = (size: number, weight = 500) => (
    <div
      style={{
        fontSize: fs(size),
        fontWeight: weight,
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        textWrap: 'balance',
      }}
    >
      {book.title}
    </div>
  );

  let body: React.ReactNode;
  if (layout === 0) {
    body = (
      <div
        style={{
          position: 'absolute',
          inset: fs(11),
          border: `1.5px solid ${pal.accent}`,
          borderRadius: u(4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: fs(10),
          padding: fs(12),
        }}
      >
        <div style={{ width: fs(26), height: u(2), background: pal.accent }} />
        {title(20)}
        <div style={{ width: fs(26), height: u(2), background: pal.accent }} />
        <div
          style={{
            fontFamily: 'var(--sans)',
            fontSize: fs(10.5),
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            opacity: 0.8,
            fontWeight: 600,
          }}
        >
          {book.author}
        </div>
      </div>
    );
  } else if (layout === 1) {
    body = (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: fs(16),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {author}
        <div>{title(26, 600)}</div>
      </div>
    );
  } else if (layout === 2) {
    const initial = (book.title || '•').trim()[0];
    body = (
      <>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            opacity: 0.16,
            fontSize: fs(170),
            fontWeight: 600,
            lineHeight: 1,
            color: pal.accent,
          }}
        >
          {initial}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: fs(16),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: fs(8),
          }}
        >
          {title(22, 600)}
          {author}
        </div>
      </>
    );
  } else if (layout === 3) {
    body = (
      <>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '38%',
            height: '30%',
            background: pal.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: fs(16),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {author}
          <div style={{ color: pal.bg, marginTop: fs(2) }}>{title(21, 700)}</div>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: fs(10),
              opacity: 0.7,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
            }}
          >
            {book.genre || ''}
          </div>
        </div>
      </>
    );
  } else {
    body = (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: fs(16),
          display: 'flex',
          flexDirection: 'column',
          gap: fs(12),
        }}
      >
        <div style={{ height: u(2), background: pal.accent, width: '100%' }} />
        {title(23, 600)}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: fs(8) }}>
          <span style={{ width: fs(18), height: u(2), background: pal.accent }} />
          {author}
        </div>
      </div>
    );
  }

  return (
    <div style={frame}>
      {spine}
      {body}
      {sheen}
    </div>
  );
}
