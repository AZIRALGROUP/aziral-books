'use client';

import { useState } from 'react';
import { LuBookOpen, LuMousePointerClick, LuSettings2 } from 'react-icons/lu';

import ModalPortal from '@/components/ModalPortal';
import { useEnv } from '@/context/EnvContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/store/settingsStore';

interface Step {
  icon: React.ReactNode;
  title: string;
  body: string;
}

/**
 * First-time reader tour: a few dismissable cards pointing out the core
 * reading gestures (page turn, tap to toggle controls, settings) so a new
 * reader isn't dropped into the reader with zero orientation. Shown once —
 * gated by `settings.readerTutorialDismissed` — then never again.
 */
export default function ReaderTutorial() {
  const _ = useTranslation();
  const { envConfig } = useEnv();
  const { settings } = useSettingsStore();
  const [step, setStep] = useState(0);

  const steps: Step[] = [
    {
      icon: <LuBookOpen size={22} strokeWidth={1.75} />,
      title: _('Turn pages'),
      body: _('Tap or swipe near the left or right edge of the page to move between pages.'),
    },
    {
      icon: <LuMousePointerClick size={22} strokeWidth={1.75} />,
      title: _('Show or hide controls'),
      body: _('Tap the middle of the page to bring up the toolbar, then tap again to hide it.'),
    },
    {
      icon: <LuSettings2 size={22} strokeWidth={1.75} />,
      title: _('Make it yours'),
      body: _('Open Settings to change the font, theme, and layout to how you like to read.'),
    },
  ];

  if (settings.readerTutorialDismissed) return null;

  const dismiss = async () => {
    const store = useSettingsStore.getState();
    const next = { ...store.settings, readerTutorialDismissed: true };
    store.setSettings(next);
    await store.saveSettings(envConfig, next);
  };

  const isLastStep = step === steps.length - 1;
  const current = steps[step]!;

  return (
    <ModalPortal>
      <dialog className='modal modal-open'>
        <div className='modal-box bg-base-100 w-[min(380px,calc(100vw-2rem))] rounded-2xl p-0'>
          <div className='flex flex-col items-center gap-3 px-6 pb-5 pt-7 text-center'>
            <div
              className='eink-bordered bg-base-200 text-base-content/80 flex h-12 w-12 items-center justify-center rounded-full'
              aria-hidden='true'
            >
              {current.icon}
            </div>
            <h3 className='text-base-content text-base font-semibold tracking-tight'>
              {current.title}
            </h3>
            <p className='text-base-content/65 text-[13px] leading-relaxed'>{current.body}</p>
          </div>

          <div className='flex items-center justify-center gap-1.5 pb-5'>
            {steps.map((s, i) => (
              <span
                key={s.title}
                className={
                  'h-1.5 w-1.5 rounded-full transition-colors ' +
                  (i === step ? 'bg-base-content' : 'bg-base-content/20')
                }
                aria-hidden='true'
              />
            ))}
          </div>

          <div className='border-base-content/10 flex flex-col gap-2 border-t px-6 py-4'>
            <button
              type='button'
              onClick={() => (isLastStep ? dismiss() : setStep((s) => s + 1))}
              className='btn btn-contrast h-10 min-h-0 rounded-xl text-sm font-medium'
            >
              {isLastStep ? _('Start reading') : _('Next')}
            </button>
            {!isLastStep && (
              <button
                type='button'
                onClick={dismiss}
                className='eink-bordered text-base-content hover:bg-base-200 h-10 rounded-xl border border-transparent text-sm font-medium transition-colors'
              >
                {_('Skip')}
              </button>
            )}
          </div>
        </div>
      </dialog>
    </ModalPortal>
  );
}
