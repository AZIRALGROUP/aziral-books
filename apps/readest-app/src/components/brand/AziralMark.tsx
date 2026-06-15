// Aziral Books brand mark — Concept 1 "Open Book" / Variant A (baseline).
// Soft, asymmetric pages rising from a spine. Two inheritable colors:
//   fg   — book body (primary, ochre by default)
//   page — page-line accent (defaults to the warm ink tone)
// Scales cleanly from 16px favicons to hero sizes.

interface AziralMarkProps {
  size?: number;
  fg?: string;
  page?: string;
  className?: string;
}

export function AziralMark({
  size = 32,
  fg = 'var(--accent)',
  page = 'var(--ink)',
  className,
}: AziralMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      className={className}
    >
      {/* left page */}
      <path d='M50 30 C 39 24, 25 23, 15 28 L 15 72 C 25 67, 39 68, 50 74 Z' fill={fg} />
      {/* right page */}
      <path
        d='M50 30 C 61 24, 75 23, 85 28 L 85 72 C 75 67, 61 68, 50 74 Z'
        fill={fg}
        opacity='0.82'
      />
      {/* page lines (inner accent) */}
      <path
        d='M24 38 C 33 35, 42 36, 49 40 M24 50 C 33 47, 42 48, 49 52
           M76 38 C 67 35, 58 36, 51 40 M76 50 C 67 47, 58 48, 51 52'
        stroke={page}
        strokeWidth='2.4'
        strokeLinecap='round'
        fill='none'
        opacity='0.9'
      />
      {/* spine */}
      <path d='M50 30 V 74' stroke={fg} strokeWidth='2.6' strokeLinecap='round' opacity='0.55' />
    </svg>
  );
}

interface AziralWordmarkProps {
  size?: number;
  mark?: number;
  color?: string;
  className?: string;
}

// Lockup: open-book mark + "Aziral Books" wordmark (serif, italic "Books").
export function AziralWordmark({
  size = 22,
  mark = 32,
  color = 'var(--text)',
  className,
}: AziralWordmarkProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 11, color }}
    >
      <AziralMark size={mark} fg='var(--accent)' page='var(--ink)' />
      <span
        style={{
          fontFamily: 'var(--serif)',
          fontSize: size,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          color,
        }}
      >
        Aziral
        <span style={{ fontStyle: 'italic', fontWeight: 400, opacity: 0.78 }}> Books</span>
      </span>
    </span>
  );
}
