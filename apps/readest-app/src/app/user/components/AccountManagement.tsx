import { useState } from 'react';
import {
  PiArrowsClockwise,
  PiCreditCard,
  PiEnvelopeSimple,
  PiHardDrives,
  PiKey,
  PiLinkSimple,
  PiSignOut,
  PiTrash,
} from 'react-icons/pi';
import { useEnv } from '@/context/EnvContext';
import type { UserPlan } from '@/types/quota';

interface AccountManagementProps {
  userPlan: UserPlan;
  iapAvailable: boolean;
  userEmail: string;
  onManageSync: () => void;
  onManageStorage: () => void;
  onManageSharedLinks: () => void;
  onResetPassword: () => void;
  onUpdateEmail: () => void;
  onLogout: () => void;
  onConfirmDelete: () => void;
  onManageSubscription: () => void;
  onRestorePurchase: () => void;
}

interface ActionRowProps {
  icon: React.ReactNode;
  label: string;
  desc?: string;
  danger?: boolean;
  last?: boolean;
  onClick: () => void;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon, label, desc, danger, last, onClick }) => {
  const tint = danger ? 'var(--clay)' : 'var(--accent)';
  return (
    <button
      type='button'
      onClick={onClick}
      className='azb-row'
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        padding: '15px 18px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        transition: 'background .14s',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: 'var(--r-sm)',
          display: 'grid',
          placeItems: 'center',
          color: tint,
          background: danger
            ? 'color-mix(in oklab, var(--clay) 12%, transparent)'
            : 'color-mix(in oklab, var(--accent) 12%, transparent)',
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: 14.5,
            fontWeight: 600,
            color: danger ? 'var(--clay)' : 'var(--text)',
          }}
        >
          {label}
        </span>
        {desc && (
          <span style={{ display: 'block', fontSize: 12.5, color: 'var(--text-3)', marginTop: 1 }}>
            {desc}
          </span>
        )}
      </span>
      <span
        className='azb-row-chev'
        style={{
          flexShrink: 0,
          color: 'var(--text-3)',
          fontSize: 18,
          transition: 'transform .14s',
        }}
      >
        ›
      </span>
    </button>
  );
};

const ActionGroup: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <div className='mono-lab' style={{ marginBottom: 11, paddingLeft: 4 }}>
      {title}
    </div>
    <div
      style={{
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </div>
  </div>
);

const DeleteModal: React.FC<{ onCancel: () => void; onConfirm: () => void }> = ({
  onCancel,
  onConfirm,
}) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'grid',
      placeItems: 'center',
      padding: 16,
      background: 'oklch(0 0 0 / 0.5)',
    }}
    onClick={onCancel}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: 420,
        borderRadius: 'var(--r-lg)',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        padding: 26,
      }}
    >
      <h3
        style={{
          margin: '0 0 10px',
          fontFamily: 'var(--serif)',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--text)',
        }}
      >
        Удалить аккаунт?
      </h3>
      <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.5, color: 'var(--text-2)' }}>
        Это действие необратимо. Профиль, библиотека и заметки в облаке будут удалены навсегда.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type='button'
          onClick={onCancel}
          style={{
            all: 'unset',
            flex: 1,
            textAlign: 'center',
            cursor: 'pointer',
            padding: '11px 16px',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text)',
            background: 'var(--paper-sunk)',
            border: '1px solid var(--line-strong)',
          }}
        >
          Отмена
        </button>
        <button
          type='button'
          onClick={onConfirm}
          style={{
            all: 'unset',
            flex: 1,
            textAlign: 'center',
            cursor: 'pointer',
            padding: '11px 16px',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            background: 'var(--clay)',
          }}
        >
          Удалить навсегда
        </button>
      </div>
    </div>
  </div>
);

const AccountManagement: React.FC<AccountManagementProps> = ({
  userPlan,
  iapAvailable,
  userEmail,
  onManageSync,
  onManageStorage,
  onManageSharedLinks,
  onResetPassword,
  onUpdateEmail,
  onLogout,
  onConfirmDelete,
  onManageSubscription,
  onRestorePurchase,
}) => {
  const { appService } = useEnv();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isIAP = !!(appService?.hasIAP && iapAvailable);
  const showSubscription = isIAP || userPlan !== 'free';

  const manageRows: ActionRowProps[] = [
    {
      icon: <PiArrowsClockwise size={19} />,
      label: 'Синхронизация',
      desc: 'Устройства и резервные копии',
      onClick: onManageSync,
    },
    {
      icon: <PiHardDrives size={19} />,
      label: 'Хранилище',
      desc: 'Управление файлами в облаке',
      onClick: onManageStorage,
    },
    {
      icon: <PiLinkSimple size={19} />,
      label: 'Привязанные сервисы',
      desc: 'Общие ссылки и переводчики',
      onClick: onManageSharedLinks,
    },
    ...(showSubscription
      ? [
          {
            icon: <PiCreditCard size={19} />,
            label: isIAP ? 'Восстановить покупки' : 'Подписка',
            desc: 'Тариф и оплата',
            onClick: isIAP ? onRestorePurchase : onManageSubscription,
          },
        ]
      : []),
  ];

  return (
    <>
      {confirmDelete && (
        <DeleteModal
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            onConfirmDelete();
          }}
        />
      )}

      <div className='azb-manage-grid' style={{ marginBottom: 30 }}>
        <ActionGroup title='Управление'>
          {manageRows.map((row, i) => (
            <ActionRow key={row.label} {...row} last={i === manageRows.length - 1} />
          ))}
        </ActionGroup>

        <ActionGroup title='Аккаунт и безопасность'>
          <ActionRow
            icon={<PiKey size={19} />}
            label='Сбросить пароль'
            desc='Сменить пароль входа'
            onClick={onResetPassword}
          />
          <ActionRow
            icon={<PiEnvelopeSimple size={19} />}
            label='Обновить почту'
            desc={userEmail}
            onClick={onUpdateEmail}
          />
          <ActionRow
            icon={<PiSignOut size={19} />}
            label='Выйти'
            desc='Завершить сеанс на этом устройстве'
            onClick={onLogout}
            last
          />
        </ActionGroup>
      </div>

      <div
        style={{
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          background: 'color-mix(in oklab, var(--clay) 6%, var(--surface))',
          border: '1px solid color-mix(in oklab, var(--clay) 28%, var(--border))',
          marginBottom: 34,
        }}
      >
        <ActionRow
          icon={<PiTrash size={19} />}
          label='Удалить аккаунт'
          desc='Безвозвратно удалить профиль, библиотеку и заметки'
          danger
          last
          onClick={() => setConfirmDelete(true)}
        />
      </div>
    </>
  );
};

export default AccountManagement;
