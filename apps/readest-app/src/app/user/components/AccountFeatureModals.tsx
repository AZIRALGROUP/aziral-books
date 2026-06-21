import { useState } from 'react';
import { PiArrowsClockwise, PiHardDrives, PiLinkSimple, PiTrash } from 'react-icons/pi';
import { eventDispatcher } from '@/utils/event';
import { AccountModal, ModalButton } from './AccountModal';

// Faithful port of the prototype's feature modals (account-modals.jsx:
// SyncModal / StorageModal / ServicesModal). These are self-contained demo
// surfaces — the real cloud backend (R2) isn't wired yet, so until it is they
// present the designed UI rather than an erroring/​spinning real component.

const toast = (message: string) => {
  eventDispatcher.dispatch('toast', { type: 'info', message });
};

const ROW: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 13,
  padding: '13px 0',
  borderBottom: '1px solid var(--border)',
};

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    aria-pressed={on}
    style={{
      all: 'unset',
      cursor: 'pointer',
      flexShrink: 0,
      width: 44,
      height: 26,
      borderRadius: 99,
      padding: 3,
      background: on ? 'var(--accent)' : 'var(--line-strong)',
      transition: 'background .16s',
    }}
  >
    <span
      style={{
        display: 'block',
        width: 20,
        height: 20,
        borderRadius: 99,
        background: '#fff',
        transform: on ? 'translateX(18px)' : 'none',
        transition: 'transform .16s',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)',
      }}
    />
  </button>
);

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: 'var(--text-3)',
};

export const SyncModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [auto, setAuto] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [prog, setProg] = useState(0);
  const devices = [
    { name: 'MacBook Air', meta: 'Это устройство · сейчас', here: true },
    { name: 'iPhone 15', meta: 'Синхр. 12 минут назад' },
    { name: 'iPad (читалка)', meta: 'Синхр. вчера, 21:40' },
  ];
  const run = () => {
    setSyncing(true);
    setProg(0);
    const iv = setInterval(() => {
      setProg((p) => {
        if (p >= 100) {
          clearInterval(iv);
          setSyncing(false);
          toast('Всё синхронизировано');
          return 100;
        }
        return p + 10;
      });
    }, 90);
  };
  return (
    <AccountModal
      icon={<PiArrowsClockwise size={21} />}
      title='Синхронизация'
      sub='Библиотека, прогресс, заметки и выделения на всех устройствах.'
      onClose={onClose}
      footer={
        <ModalButton full onClick={run} disabled={syncing}>
          {syncing ? `Синхронизация… ${prog}%` : 'Синхронизировать сейчас'}
        </ModalButton>
      }
    >
      {syncing && (
        <div
          style={{
            height: 6,
            borderRadius: 99,
            background: 'var(--paper-sunk)',
            overflow: 'hidden',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: `${prog}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width .09s linear',
            }}
          />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 'var(--r-md)',
          background: 'var(--paper-sunk)',
          border: '1px solid var(--border)',
          marginBottom: 18,
        }}
      >
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          Автосинхронизация
          <span style={{ display: 'block', fontSize: 12, fontWeight: 400, color: 'var(--text-3)' }}>
            Обновлять при каждом изменении
          </span>
        </span>
        <Toggle on={auto} onClick={() => setAuto((a) => !a)} />
      </div>
      <div style={{ ...SECTION_LABEL, marginBottom: 4 }}>Устройства</div>
      {devices.map((d, i) => (
        <div
          key={d.name}
          style={{ ...ROW, borderBottom: i === devices.length - 1 ? 'none' : ROW.borderBottom }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: 'grid',
              placeItems: 'center',
              background: 'var(--paper-sunk)',
              color: 'var(--accent)',
            }}
          >
            <PiArrowsClockwise size={16} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              {d.name}
            </span>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-3)' }}>{d.meta}</span>
          </span>
          {d.here ? (
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--sage)' }}>●</span>
          ) : (
            <button
              type='button'
              onClick={() => toast(`${d.name} отключено`)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-3)',
              }}
            >
              Отвязать
            </button>
          )}
        </div>
      ))}
    </AccountModal>
  );
};

interface StorageItem {
  id: string;
  name: string;
  size: number; // KB
  kind: string;
}

export const StorageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [items, setItems] = useState<StorageItem[]>([
    { id: 'a', name: 'Допсоглашение №3.docx', size: 84, kind: 'DOCX' },
    { id: 'b', name: 'Война и мир (кэш).epub', size: 12 * 1024, kind: 'EPUB' },
    { id: 'c', name: 'Заметки и выделения', size: 320, kind: 'DATA' },
  ]);
  const usedMB = items.reduce((s, x) => s + x.size, 0) / 1024;
  const totalMB = 500;
  const pct = Math.min(100, Math.round((usedMB / totalMB) * 100));
  const fmt = (kb: number) =>
    kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${Math.round(kb)} КБ`;
  const remove = (id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    toast('Файл удалён из кэша');
  };
  return (
    <AccountModal
      icon={<PiHardDrives size={21} />}
      title='Хранилище'
      sub='Локальный кэш на этом устройстве. Облако освобождается автоматически.'
      onClose={onClose}
      footer={
        <ModalButton
          kind='ghost'
          full
          onClick={() => {
            setItems([]);
            toast('Кэш очищен');
          }}
        >
          Очистить весь кэш
        </ModalButton>
      }
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>
            {usedMB.toFixed(1)} МБ занято
          </span>
          <span style={{ color: 'var(--text-3)' }}>из {totalMB} МБ</span>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 99,
            background: 'var(--paper-sunk)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: `${Math.max(pct, 1)}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width .25s',
            }}
          />
        </div>
      </div>
      {items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '26px 0',
            fontFamily: 'var(--serif)',
            fontSize: 16,
            color: 'var(--text-3)',
          }}
        >
          Кэш пуст
        </div>
      ) : (
        items.map((it, i) => (
          <div
            key={it.id}
            style={{ ...ROW, borderBottom: i === items.length - 1 ? 'none' : ROW.borderBottom }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                display: 'grid',
                placeItems: 'center',
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: '.03em',
                background: 'var(--paper-sunk)',
                color: 'var(--accent-ink)',
              }}
            >
              {it.kind}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {it.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(it.size)}</span>
            </span>
            <button
              type='button'
              onClick={() => remove(it.id)}
              aria-label='Удалить'
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 30,
                height: 30,
                borderRadius: 8,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--text-3)',
              }}
            >
              <PiTrash size={16} />
            </button>
          </div>
        ))
      )}
    </AccountModal>
  );
};

interface ServiceItem {
  id: string;
  name: string;
  meta: string;
}

export const ServicesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [conn, setConn] = useState<Record<string, boolean>>({
    google: true,
    apple: false,
    deepl: true,
    azure: false,
  });
  const list: ServiceItem[] = [
    { id: 'google', name: 'Google', meta: 'Вход и переводчик' },
    { id: 'apple', name: 'Apple', meta: 'Вход через Apple ID' },
    { id: 'deepl', name: 'DeepL Pro', meta: 'Движок перевода' },
    { id: 'azure', name: 'Microsoft Azure', meta: 'Голоса озвучивания' },
  ];
  const toggle = (id: string, name: string) =>
    setConn((c) => {
      const next = !c[id];
      toast(`${name} ${next ? 'подключён' : 'отключён'}`);
      return { ...c, [id]: next };
    });
  return (
    <AccountModal
      icon={<PiLinkSimple size={21} />}
      title='Привязанные сервисы'
      sub='Управляйте входом и подключёнными API.'
      onClose={onClose}
    >
      {list.map((s, i) => {
        const on = conn[s.id];
        return (
          <div
            key={s.id}
            style={{ ...ROW, borderBottom: i === list.length - 1 ? 'none' : ROW.borderBottom }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'grid',
                placeItems: 'center',
                background: 'var(--paper-sunk)',
                fontFamily: 'var(--serif)',
                fontSize: 17,
                fontWeight: 700,
                color: 'var(--text-2)',
              }}
            >
              {s.name[0]}
            </span>
            <span style={{ flex: 1 }}>
              <span
                style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}
              >
                {s.name}
              </span>
              <span style={{ fontSize: 12, color: on ? 'var(--sage)' : 'var(--text-3)' }}>
                {on ? `Подключён · ${s.meta}` : s.meta}
              </span>
            </span>
            <ModalButton kind={on ? 'ghost' : 'primary'} onClick={() => toggle(s.id, s.name)}>
              {on ? 'Отключить' : 'Подключить'}
            </ModalButton>
          </div>
        );
      })}
    </AccountModal>
  );
};
