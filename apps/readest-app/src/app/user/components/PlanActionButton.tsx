import { useTranslation } from '@/hooks/useTranslation';
import { PlanDetails } from '../utils/plan';

interface PlanActionButtonProps {
  plan: PlanDetails;
  isUserPlan: boolean;
  comingSoon?: boolean;
  upgradable?: boolean;
  onSubscribe: (priceId?: string) => void;
  onSelectPlan: (index: number) => void;
}

const PlanActionButton: React.FC<PlanActionButtonProps> = ({
  plan,
  isUserPlan,
  comingSoon,
  upgradable,
  onSubscribe,
  onSelectPlan,
}) => {
  const _ = useTranslation();

  if (upgradable && plan.plan !== 'free' && !isUserPlan) {
    if (comingSoon) {
      return (
        <button
          disabled
          className='w-full cursor-default rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-500'
        >
          {_('Coming Soon')}
        </button>
      );
    }
    return (
      <button
        onClick={() => onSubscribe(plan.productId)}
        className='azb-cta w-full rounded-lg px-6 py-3 font-semibold transition-colors'
      >
        {_('Upgrade to {{plan}}', { plan: _(plan.name) })}
      </button>
    );
  }

  if (plan.plan === 'free' && isUserPlan) {
    return (
      <button
        onClick={() => onSelectPlan(1)}
        className='azb-cta w-full rounded-lg px-6 py-3 font-semibold transition-colors'
      >
        {_('Upgrade to Plus or Pro')}
      </button>
    );
  }

  if (isUserPlan) {
    return (
      <button
        disabled
        className='azb-cta-current w-full cursor-default rounded-lg px-6 py-3 font-semibold'
      >
        {_('Current Plan')}
      </button>
    );
  }

  return null;
};

export default PlanActionButton;
