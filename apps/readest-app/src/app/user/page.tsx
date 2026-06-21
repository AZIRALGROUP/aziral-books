'use client';

import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEnv } from '@/context/EnvContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/themeStore';
import { useQuotaStats } from '@/hooks/useQuotaStats';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserActions } from '@/hooks/useUserActions';
import { useAvailablePlans } from '@/hooks/useAvailablePlans';
import type { PlanType } from '@/types/quota';
import { navigateToLibrary } from '@/utils/nav';
import { eventDispatcher } from '@/utils/event';
import { isTauriAppPlatform } from '@/services/environment';
import { Toast } from '@/components/Toast';
import {
  purchaseIAPProduct,
  restoreIAPPurchases,
  getSubscriptionSuccessUrl as getIAPSubscriptionSuccessUrl,
} from '@/libs/payment/iap/client';
import { isPurchaseProduct } from '@/libs/payment/iap/utils';
// getPlanDetails is consumed inside PlanGrid; the page only needs labels.
import {
  createStripeCheckoutSession,
  redirectToStripeCheckout,
  createStripePortalSession,
  redirectToStripePortal,
  handleStripeCheckoutError,
  getSubscriptionSuccessUrl as getStripeSubscriptionSuccessUrl,
  type StripeAvailablePlan,
} from '@/libs/payment/stripe/client';
import { PiArrowsClockwise, PiHardDrives, PiLinkSimple } from 'react-icons/pi';
import Spinner from '@/components/Spinner';
import Link from '@/components/Link';
import { AziralWordmark } from '@/components/brand/AziralMark';
import ProfileHeader from './components/Header';
import AccountHero from './components/AccountHero';
import PlanGrid from './components/PlanGrid';
import AccountManagement from './components/AccountManagement';
import { AccountModal } from './components/AccountModal';
import StorageManager from './components/StorageManager';
import SharedLinksSection from './components/SharedLinksSection';
import { SyncPassphraseSection } from './components/SyncPassphraseSection';
import { SyncCategoriesSection } from './components/SyncCategoriesSection';
import Checkout from './components/Checkout';
import './user.css';

const PLAN_LABEL: Record<string, string> = {
  free: 'Бесплатный план',
  plus: 'План Plus',
  pro: 'План Pro',
  purchase: 'Пожизненный план',
};

const MONTHS_GEN = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const joinedLabel = (createdAt?: string): string | undefined => {
  if (!createdAt) return undefined;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return undefined;
  return `В Aziral с ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
};

type CheckoutState = {
  clientSecret: string;
  sessionId: string;
  planName: string;
};

const ProfilePage = () => {
  const _ = useTranslation();
  const router = useRouter();
  const { appService } = useEnv();
  const { token, user, refresh } = useAuth();
  const { safeAreaInsets, isRoundedWindow } = useThemeStore();

  const [loading, setLoading] = useState(false);
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showSharedLinksManager, setShowSharedLinksManager] = useState(false);
  const searchParams = useSearchParams();
  const [showSyncManager, setShowSyncManager] = useState(
    () => searchParams?.get('section') === 'sync',
  );
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    clientSecret: '',
    sessionId: '',
    planName: '',
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthenticated = user && token && appService;
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      router.push('/auth?redirect=/library');
    }, 1000);

    return () => clearTimeout(timer);
  }, [mounted, user, token, appService, router]);

  useTheme({ systemUIVisible: false });

  const { quotas, userProfilePlan = 'free' } = useQuotaStats();
  const { handleLogout, handleResetPassword, handleUpdateEmail, handleConfirmDelete } =
    useUserActions();

  const { availablePlans, iapAvailable } = useAvailablePlans({
    hasIAP: appService?.hasIAP || false,
    onError: useCallback(
      (message: string) => {
        eventDispatcher.dispatch('toast', {
          type: 'info',
          message: _(message),
        });
      },
      [_],
    ),
  });

  const handleGoBack = () => {
    if (showEmbeddedCheckout) {
      setShowEmbeddedCheckout(false);
    } else if (showStorageManager) {
      setShowStorageManager(false);
      refresh();
    } else if (showSharedLinksManager) {
      setShowSharedLinksManager(false);
    } else if (showSyncManager) {
      setShowSyncManager(false);
    } else {
      navigateToLibrary(router);
    }
  };

  const handleStripeSubscribe = async (productId?: string, planType: PlanType = 'subscription') => {
    if (!productId) return;

    setLoading(true);
    try {
      const { sessionId, clientSecret, url } = await createStripeCheckoutSession(
        productId,
        planType,
      );

      const foundPlan = availablePlans.find((plan) => plan.productId === productId);

      if (!foundPlan) {
        throw new Error(`Plan not found for product ID: ${productId}`);
      }

      const selectedPlan = foundPlan as StripeAvailablePlan;
      const planName = selectedPlan.product?.name || selectedPlan.productName;

      const isEmbeddedCheckout = isTauriAppPlatform();
      if (isEmbeddedCheckout && sessionId && clientSecret) {
        setShowEmbeddedCheckout(true);
        setCheckoutState({
          planName,
          clientSecret,
          sessionId,
        });
      } else {
        await redirectToStripeCheckout(url);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      handleStripeCheckoutError(errorMessage);
      eventDispatcher.dispatch('toast', {
        type: 'info',
        message: _('Failed to create checkout session'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSuccess = useCallback(
    (sessionId: string) => {
      setShowEmbeddedCheckout(false);
      router.push(getStripeSubscriptionSuccessUrl(sessionId));
    },
    [router],
  );

  const handleIAPSubscribe = async (productId?: string) => {
    if (!productId) return;

    setLoading(true);
    try {
      const purchase = await purchaseIAPProduct(productId);
      if (purchase) {
        router.push(getIAPSubscriptionSuccessUrl(purchase));
      }
    } catch (error) {
      console.error('IAP purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIAPRestorePurchase = async () => {
    setLoading(true);
    try {
      const purchases = await restoreIAPPurchases();
      if (purchases.length > 0) {
        const restoredSubscriptions = purchases
          .filter((p) => !isPurchaseProduct(p.productId))
          .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
        const purchase = restoredSubscriptions[0];

        if (!purchase) {
          throw new Error('No subscription found in restored purchases');
        }
        router.push(getIAPSubscriptionSuccessUrl(purchase));
      } else {
        eventDispatcher.dispatch('toast', {
          type: 'info',
          message: _('No purchases found to restore.'),
        });
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      eventDispatcher.dispatch('toast', {
        type: 'info',
        message: _('Failed to restore purchases.'),
      });
    }
    setLoading(false);
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const url = await createStripePortalSession();
      await redirectToStripePortal(url);
    } catch (error) {
      console.error('Error creating portal session:', error);
      eventDispatcher.dispatch('toast', {
        type: 'info',
        message: _('Failed to manage subscription.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWithMessage = () => {
    handleConfirmDelete(_('Failed to delete user. Please try again later.'));
  };

  const handleManageStorage = () => {
    setShowStorageManager(true);
  };

  const handleManageSharedLinks = () => {
    setShowSharedLinksManager(true);
  };
  const handleManageSync = () => {
    setShowSyncManager(true);
  };

  if (!mounted) {
    return null;
  }

  if (!user || !token || !appService) {
    return (
      <div className='mx-auto max-w-4xl px-4 py-8'>
        <div className='overflow-hidden rounded-lg shadow-md'>
          <div className='flex min-h-[300px] items-center justify-center p-6'>
            <div className='text-base-content animate-pulse'>{_('Loading profile...')}</div>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = user?.user_metadata?.['picture'] || user?.user_metadata?.['avatar_url'];
  const userFullName = user?.user_metadata?.['full_name'] || '-';
  const userEmail = user?.email || '';
  const planLabel = PLAN_LABEL[userProfilePlan] ?? PLAN_LABEL['free']!;
  const joined = joinedLabel(user?.created_at);
  const termsUrl =
    appService?.isIOSApp || appService?.isMacOSApp
      ? 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
      : 'https://books.aziral.com/legal/terms';

  return (
    <div
      className={clsx(
        'azb-user full-height inset-0 select-none overflow-hidden',
        appService?.hasRoundedWindow && isRoundedWindow && 'window-border rounded-window',
      )}
    >
      <div
        className='flex h-full w-full flex-col overflow-y-auto'
        style={{ paddingTop: `${safeAreaInsets?.top || 0}px` }}
      >
        <ProfileHeader onGoBack={handleGoBack} />

        {loading && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <Spinner loading className='text-gray-900' />
          </div>
        )}

        {/* Centered wordmark just below the toolbar back/window controls */}
        <div className='flex w-full justify-center pb-2 pt-1'>
          <AziralWordmark size={19} mark={26} color='var(--text)' />
        </div>

        <div className='mx-auto w-full' style={{ maxWidth: 1080, padding: '20px 28px 72px' }}>
          {showEmbeddedCheckout ? (
            <div
              style={{
                borderRadius: 'var(--r-lg)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: 16,
              }}
            >
              <Checkout
                clientSecret={checkoutState.clientSecret}
                sessionId={checkoutState.sessionId}
                planName={checkoutState.planName}
                onSuccess={handleCheckoutSuccess}
              />
            </div>
          ) : (
            <>
              <AccountHero
                avatarUrl={avatarUrl}
                userFullName={userFullName}
                userEmail={userEmail}
                planLabel={planLabel}
                joinedLabel={joined}
                quotas={quotas}
              />
              <PlanGrid
                availablePlans={availablePlans}
                userPlan={userProfilePlan}
                onSubscribe={
                  appService.hasIAP && iapAvailable ? handleIAPSubscribe : handleStripeSubscribe
                }
              />
              <AccountManagement
                userPlan={userProfilePlan}
                iapAvailable={iapAvailable}
                userEmail={userEmail}
                onManageSync={handleManageSync}
                onManageStorage={handleManageStorage}
                onManageSharedLinks={handleManageSharedLinks}
                onResetPassword={handleResetPassword}
                onUpdateEmail={handleUpdateEmail}
                onLogout={handleLogout}
                onConfirmDelete={handleDeleteWithMessage}
                onManageSubscription={handleManageSubscription}
                onRestorePurchase={handleIAPRestorePurchase}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  fontSize: 13,
                  color: 'var(--text-3)',
                }}
              >
                <Link href={termsUrl} className='acc-link'>
                  Условия использования
                </Link>
                <span style={{ opacity: 0.5 }}>·</span>
                <Link href='https://books.aziral.com/legal/privacy' className='acc-link'>
                  Политика конфиденциальности
                </Link>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>Aziral Books</span>
              </div>
            </>
          )}
        </div>

        {showStorageManager && (
          <AccountModal
            icon={<PiHardDrives size={21} />}
            title='Хранилище'
            sub='Управление файлами и резервными копиями в облаке.'
            width={620}
            onClose={() => {
              setShowStorageManager(false);
              refresh();
            }}
          >
            <StorageManager />
          </AccountModal>
        )}

        {showSharedLinksManager && (
          <AccountModal
            icon={<PiLinkSimple size={21} />}
            title='Привязанные сервисы'
            sub='Общие ссылки и подключённые переводчики.'
            width={620}
            onClose={() => setShowSharedLinksManager(false)}
          >
            <SharedLinksSection />
          </AccountModal>
        )}

        {showSyncManager && (
          <AccountModal
            icon={<PiArrowsClockwise size={21} />}
            title='Синхронизация'
            sub='Библиотека, прогресс, заметки и выделения на всех устройствах.'
            width={620}
            onClose={() => setShowSyncManager(false)}
          >
            <div className='flex flex-col gap-y-6'>
              <SyncCategoriesSection />
              <SyncPassphraseSection />
            </div>
          </AccountModal>
        )}

        <Toast />
      </div>
    </div>
  );
};

export default ProfilePage;
