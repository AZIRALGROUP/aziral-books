import { useMemo, useState } from 'react';
import { getLocale } from '@/utils/misc';
import { getPlanDetails } from '../utils/plan';
import type { AvailablePlan, PlanInterval, PlanType, UserPlan } from '@/types/quota';
import BrandPlanCard, { type PlanFeature, type PlanView } from './BrandPlanCard';

interface PlanGridProps {
  availablePlans: AvailablePlan[];
  userPlan: UserPlan;
  onSubscribe: (productId?: string, planType?: PlanType) => void;
}

// Presentation metadata (kicker / display name / curated feature copy) keyed by
// plan id. Prices, productIds and current-plan come from real data below.
const META: Record<
  UserPlan,
  { kicker: string; name: string; featured: boolean; features: PlanFeature[] }
> = {
  free: {
    kicker: 'Старт',
    name: 'Бесплатный',
    featured: false,
    features: [
      {
        t: 'Кроссплатформенная синхронизация',
        d: 'библиотека, прогресс и заметки на всех устройствах',
      },
      { t: 'Настраиваемое чтение', d: 'шрифты, темы и макеты' },
      { t: 'Озвучивание ИИ', d: 'базовые голоса' },
      { t: 'Переводы ИИ', d: '10 000 символов в день' },
      { t: '500 МБ облачного хранилища' },
    ],
  },
  plus: {
    kicker: 'Больше',
    name: 'Plus',
    featured: false,
    features: [
      { t: 'Всё из бесплатного плана' },
      { t: 'Расширенные голоса озвучивания' },
      { t: '100 000 символов перевода в день' },
      { t: '5 ГБ облачного хранилища' },
      { t: 'Чтение без рекламы' },
    ],
  },
  pro: {
    kicker: 'Рекомендуем',
    name: 'Pro',
    featured: true,
    features: [
      { t: 'Всё из плана Plus' },
      { t: 'Неограниченное озвучивание ИИ', d: 'слушайте сколько угодно' },
      { t: 'Доступ к DeepL Pro', d: 'до 500 000 символов в день' },
      { t: '20 ГБ облачного хранилища' },
      { t: 'Приоритетная синхронизация' },
    ],
  },
  purchase: {
    kicker: 'Навсегда',
    name: 'Пожизненный',
    featured: false,
    features: [
      { t: 'Все возможности Pro навсегда' },
      { t: 'Все темы, шрифты и макеты' },
      { t: 'Все движки перевода', d: 'Google, Azure, DeepL Pro' },
      { t: 'Приоритетная поддержка' },
      { t: 'Один платёж — никаких подписок' },
    ],
  },
};

const ORDER: UserPlan[] = ['free', 'plus', 'pro', 'purchase'];

const PlanGrid: React.FC<PlanGridProps> = ({ availablePlans, userPlan, onSubscribe }) => {
  const hasYear = availablePlans.some((p) => p.interval === 'year');
  const [billing, setBilling] = useState<PlanInterval>('month');
  const interval: PlanInterval = hasYear ? billing : 'month';

  const formatPrice = (cents: number, currency: string) =>
    new Intl.NumberFormat(getLocale(), { style: 'currency', currency }).format(cents / 100);

  const plans = useMemo<(PlanView & { productId?: string; type: PlanType })[]>(() => {
    return ORDER.map((id) => {
      const meta = META[id];
      const isLifetime = id === 'purchase';
      const details = getPlanDetails(id, availablePlans, isLifetime ? 'month' : interval);
      const isFree = id === 'free';
      const current = id === userPlan;

      const per = isFree
        ? ''
        : isLifetime
          ? ' единоразово'
          : interval === 'year'
            ? ' /год'
            : ' /мес';
      const perMonth = !isFree && !isLifetime && interval === 'year' ? details.price / 12 : 0;
      const sub = isLifetime
        ? 'Один платёж — без подписки'
        : isFree
          ? 'Навсегда бесплатно'
          : interval === 'year'
            ? `≈ ${formatPrice(perMonth, details.currency)}/мес · 2 месяца в подарок`
            : 'Списание ежемесячно';
      const cta = current
        ? 'Ваш текущий план'
        : isFree
          ? 'Перейти на бесплатный'
          : isLifetime
            ? 'Купить навсегда'
            : 'Перейти';

      return {
        id,
        kicker: meta.kicker,
        name: meta.name,
        price: formatPrice(details.price, details.currency),
        per,
        sub,
        cta,
        featured: meta.featured && !current,
        current,
        features: meta.features,
        productId: details.productId,
        type: isLifetime ? 'purchase' : 'subscription',
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availablePlans, userPlan, interval]);

  return (
    <section style={{ marginBottom: 30 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: 22,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className='mono-lab' style={{ color: 'var(--accent-ink)', marginBottom: 8 }}>
            ✦ Тарифы
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--serif)',
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}
          >
            Откройте больше возможностей
          </h2>
        </div>
        {hasYear && (
          <div
            style={{
              display: 'inline-flex',
              padding: 4,
              borderRadius: 99,
              background: 'var(--paper-sunk)',
              border: '1px solid var(--border)',
            }}
          >
            {(
              [
                { id: 'month', l: 'Помесячно' },
                { id: 'year', l: 'Год · −17%' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type='button'
                onClick={() => setBilling(o.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 700,
                  color: billing === o.id ? '#fff' : 'var(--text-2)',
                  background: billing === o.id ? 'var(--accent)' : 'transparent',
                  boxShadow: billing === o.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'background .15s, color .15s',
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className='azb-plan-grid'>
        {plans.map((p) => (
          <BrandPlanCard
            key={p.id}
            plan={p}
            onSelect={() => {
              if (!p.current) onSubscribe(p.productId, p.type);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default PlanGrid;
