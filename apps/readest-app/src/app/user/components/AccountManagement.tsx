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
import { AccountModal, ModalButton } from './AccountModal';

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

const LogoutModal: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({
  onClose,
  onConfirm,
}) => (
  <AccountModal
    icon={<PiSignOut size={21} />}
    title='Выйти из аккаунта?'
    sub='Локальный кэш сохранится. Вы сможете войти снова в любой момент.'
    width={420}
    onClose={onClose}
    footer={
      <>
        <ModalButton kind='ghost' onClick={onClose}>
          Остаться
        </ModalButton>
        <ModalButton onClick={onConfirm}>Выйти</ModalButton>
      </>
    }
  >
    <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-2)' }}>
      Сеанс на этом устройстве будет завершён.
    </div>
  </AccountModal>
);

const DeleteModal: React.FC<{ onClose: () => void; onConfirm: () => void }> = ({
  onClose,
  onConfirm,
}) => {
  const [text, setText] = useState('');
  const confirmed = text.trim().toUpperCase() === 'УДАЛИТЬ';
  return (
    <AccountModal
      icon={<PiTrash size={21} />}
      danger
      title='Удалить аккаунт'
      sub='Это действие необратимо. Профиль, библиотека, заметки и выделения будут удалены навсегда.'
      width={460}
      onClose={onClose}
      footer={
        <>
          <ModalButton kind='ghost' onClick={onClose}>
            Отмена
          </ModalButton>
          <ModalButton kind='danger' disabled={!confirmed} onClick={onConfirm}>
            Удалить навсегда
          </ModalButton>
        </>
      }
    >
      <ul
        style={{
          margin: '0 0 18px',
          paddingLeft: 18,
          fontSize: 13.5,
          lineHeight: 1.7,
          color: 'var(--text-2)',
        }}
      >
        <li>Все книги и документы в библиотеке</li>
        <li>Все заметки, закладки и выделения</li>
        <li>История чтения и синхронизация</li>
      </ul>
      <label style={{ display: 'block' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 7 }}>
          Введите «УДАЛИТЬ», чтобы подтвердить
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='УДАЛИТЬ'
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '12px 14px',
            borderRadius: 'var(--r-md)',
            background: 'var(--paper-sunk)',
            fontSize: 15,
            color: 'var(--text)',
            outline: 'none',
            border: '1px solid var(--border)',
          }}
        />
      </label>
    </AccountModal>
  );
};

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
  const [confirm, setConfirm] = useState<'logout' | 'delete' | null>(null);
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
      {confirm === 'logout' && (
        <LogoutModal
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null);
            onLogout();
          }}
        />
      )}
      {confirm === 'delete' && (
        <DeleteModal
          onClose={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null);
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
            onClick={() => setConfirm('logout')}
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
          onClick={() => setConfirm('delete')}
        />
      </div>
    </>
  );
};

export default AccountManagement;
