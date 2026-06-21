import { useEffect } from 'react';

interface AccountModalProps {
  title: string;
  sub?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  width?: number;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

// Branded modal shell ported from the Aziral Books prototype (account-modals.jsx
// `Modal`): blurred ink backdrop, rounded paper card, icon-chip header, scroll
// body, optional footer. Closes on Esc and on backdrop press.
export const AccountModal: React.FC<AccountModalProps> = ({
  title,
  sub,
  icon,
  danger,
  width = 480,
  onClose,
  children,
  footer,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const tint = danger ? 'var(--clay)' : 'var(--accent)';
  return (
    <div
      role='presentation'
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
        background: 'color-mix(in oklab, var(--ink) 42%, transparent)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: `min(94vw, ${width}px)`,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--r-xl)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            padding: '22px 24px 18px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {icon && (
            <span
              style={{
                flexShrink: 0,
                width: 42,
                height: 42,
                borderRadius: 'var(--r-md)',
                display: 'grid',
                placeItems: 'center',
                color: tint,
                background: danger
                  ? 'color-mix(in oklab, var(--clay) 13%, transparent)'
                  : 'color-mix(in oklab, var(--accent) 13%, transparent)',
              }}
            >
              {icon}
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--serif)',
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
              }}
            >
              {title}
            </h2>
            {sub && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: 'var(--text-3)',
                }}
              >
                {sub}
              </p>
            )}
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Закрыть'
            style={{
              all: 'unset',
              cursor: 'pointer',
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: 9,
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-3)',
              fontSize: 19,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
              background: 'var(--paper-sunk)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

type ModalButtonKind = 'primary' | 'ghost' | 'danger';

interface ModalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: ModalButtonKind;
  disabled?: boolean;
  full?: boolean;
}

const KIND_STYLES: Record<ModalButtonKind, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-sm)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--line-strong)',
  },
  danger: {
    background: 'var(--clay)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--shadow-sm)',
  },
};

export const ModalButton: React.FC<ModalButtonProps> = ({
  children,
  onClick,
  kind = 'primary',
  disabled,
  full,
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className='azb-cta'
    style={{
      all: 'unset',
      boxSizing: 'border-box',
      textAlign: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      width: full ? '100%' : 'auto',
      padding: '11px 22px',
      borderRadius: 99,
      fontSize: 14.5,
      fontWeight: 700,
      ...KIND_STYLES[kind],
    }}
  >
    {children}
  </button>
);
