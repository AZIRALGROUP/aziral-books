import { PiCheck } from 'react-icons/pi';

export interface PlanFeature {
  t: string;
  d?: string;
}

export interface PlanView {
  id: string;
  kicker: string;
  name: string;
  price: string;
  per: string;
  sub: string;
  cta: string;
  featured: boolean;
  current: boolean;
  features: PlanFeature[];
}

interface BrandPlanCardProps {
  plan: PlanView;
  onSelect: () => void;
}

const BrandPlanCard: React.FC<BrandPlanCardProps> = ({ plan, onSelect }) => {
  const { featured, current } = plan;
  return (
    <div
      className={`azb-plan ${!featured && !current ? 'is-hoverable' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        background: 'var(--surface)',
        border: featured ? '1.5px solid var(--accent)' : '1px solid var(--border)',
        boxShadow: featured ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        padding: '26px 24px 24px',
      }}
    >
      {(featured || current) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '6px 14px 6px 16px',
            borderBottomLeftRadius: 'var(--r-md)',
            background: current ? 'var(--paper-sunk)' : 'var(--accent)',
            color: current ? 'var(--text-2)' : '#fff',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            border: current ? '1px solid var(--border)' : 'none',
            borderTop: 'none',
            borderRight: 'none',
          }}
        >
          {current ? 'Текущий' : 'Популярный'}
        </div>
      )}

      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: featured ? 'var(--accent-ink)' : 'var(--text-3)',
          marginBottom: 4,
        }}
      >
        {plan.kicker}
      </div>
      <h3
        style={{
          margin: '0 0 14px',
          fontFamily: 'var(--serif)',
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}
      >
        {plan.name}
      </h3>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {plan.price}
        </span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-3)' }}>{plan.per}</span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4, minHeight: 18 }}>
        {plan.sub}
      </div>

      <button
        type='button'
        onClick={onSelect}
        disabled={current}
        className='azb-cta'
        style={{
          all: 'unset',
          boxSizing: 'border-box',
          cursor: current ? 'default' : 'pointer',
          textAlign: 'center',
          marginTop: 20,
          padding: '12px 18px',
          borderRadius: 99,
          fontSize: 14.5,
          fontWeight: 700,
          background: current ? 'transparent' : featured ? 'var(--accent)' : 'var(--paper-sunk)',
          color: current ? 'var(--text-3)' : featured ? '#fff' : 'var(--text)',
          border: current
            ? '1px solid var(--border)'
            : featured
              ? 'none'
              : '1px solid var(--line-strong)',
          boxShadow: featured ? 'var(--shadow-sm)' : 'none',
        }}
      >
        {plan.cta}
      </button>

      <div style={{ height: 1, background: 'var(--border)', margin: '22px 0 18px' }} />

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 13,
        }}
      >
        {plan.features.map((f, i) => (
          <li key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span
              style={{
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: 99,
                marginTop: 1,
                display: 'grid',
                placeItems: 'center',
                background: 'color-mix(in oklab, var(--sage) 20%, transparent)',
              }}
            >
              <PiCheck size={13} color='var(--sage)' />
            </span>
            <span style={{ fontSize: 13.5, lineHeight: 1.45, color: 'var(--text-2)' }}>
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{f.t}</strong>
              {f.d ? <span style={{ color: 'var(--text-3)' }}> — {f.d}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandPlanCard;
