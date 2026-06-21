import { useEffect, useState } from 'react';
import { PiCloud, PiTextT, PiUserCircle } from 'react-icons/pi';
import UserAvatar from '@/components/UserAvatar';
import type { QuotaType } from '@/types/quota';

interface AccountHeroProps {
  avatarUrl?: string;
  userFullName: string;
  userEmail: string;
  planLabel: string;
  joinedLabel?: string;
  quotas: QuotaType[];
}

interface MeterProps {
  icon: React.ReactNode;
  quota: QuotaType;
  now: number;
}

const resetNote = (resetAt: number, now: number): string => {
  const totalMinutes = Math.floor(Math.max(0, resetAt - now) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Сброс через ${hours} ч ${minutes} мин`;
};

const Meter: React.FC<MeterProps> = ({ icon, quota, now }) => {
  const ratio = quota.total > 0 ? quota.used / quota.total : 0;
  const pct = Math.round(Math.min(100, ratio * 100));
  const note = quota.resetAt ? resetNote(quota.resetAt, now) : 'из плана';
  const unit = quota.unit ? ` ${quota.unit}` : '';

  return (
    <div
      style={{
        flex: 1,
        minWidth: 240,
        padding: '16px 18px',
        borderRadius: 'var(--r-md)',
        background: 'var(--paper-sunk)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
          {icon}
        </span>
        <span
          style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}
          title={quota.tooltip}
        >
          {quota.name}
        </span>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: 'var(--text-2)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {quota.used}{' '}
          <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>
            / {quota.total}
            {unit}
          </span>
        </span>
      </div>
      <div
        style={{
          height: 7,
          borderRadius: 99,
          background: 'var(--paper-card)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.max(pct, 2)}%`,
            height: '100%',
            borderRadius: 99,
            background: 'var(--accent)',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 9,
          fontSize: 12,
          color: 'var(--text-3)',
        }}
      >
        <span>Использовано {pct}%</span>
        <span>{note}</span>
      </div>
    </div>
  );
};

const METER_ICONS: React.ReactNode[] = [
  <PiCloud key='cloud' size={17} />,
  <PiTextT key='type' size={17} />,
];

const AccountHero: React.FC<AccountHeroProps> = ({
  avatarUrl,
  userFullName,
  userEmail,
  planLabel,
  joinedLabel,
  quotas,
}) => {
  // Tick once a minute so the translation reset countdown stays fresh.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!quotas.some((q) => q.resetAt)) return;
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, [quotas]);

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        padding: '30px 32px',
        marginBottom: 26,
      }}
    >
      <div
        aria-hidden='true'
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(80% 120% at 92% 8%, var(--ochre-soft), transparent 56%)',
          opacity: 0.85,
        }}
      />
      <div
        className='azb-profile-row'
        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 22 }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 99,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--paper-card)',
            }}
          >
            {avatarUrl ? (
              <UserAvatar
                url={avatarUrl}
                size={84}
                DefaultIcon={PiUserCircle}
                className='h-full w-full'
                fillContainer
              />
            ) : (
              <PiUserCircle style={{ width: '100%', height: '100%', color: 'var(--text-3)' }} />
            )}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--serif)',
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
            }}
          >
            {userFullName}
          </h1>
          <div style={{ fontSize: 14.5, color: 'var(--text-2)', marginTop: 3 }}>{userEmail}</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 13,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 13px',
                borderRadius: 99,
                background: 'var(--ochre-soft)',
                border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--accent-ink)',
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--accent)' }}
              />
              {planLabel}
            </span>
            {joinedLabel && (
              <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{joinedLabel}</span>
            )}
          </div>
        </div>
      </div>

      {quotas.length > 0 && (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            marginTop: 26,
          }}
        >
          {quotas.map((quota, i) => (
            <Meter
              key={quota.name}
              icon={METER_ICONS[i] ?? METER_ICONS[0]}
              quota={quota}
              now={now}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AccountHero;
