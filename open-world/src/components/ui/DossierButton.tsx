import { AnimatePresence, animate, motion, type AnimationPlaybackControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { links } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { play } from '../../lib/sounds';
import { CheckIcon, DownloadIcon, ExternalIcon } from './Icons';

type State = 'idle' | 'downloading' | 'complete';

function triggerDownload() {
  const a = document.createElement('a');
  a.href = links.resume;
  a.download = 'KC-Dossier.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** "DOWNLOAD DOSSIER" → "DOSSIER DOWNLOADING… 63%" → "DOWNLOAD COMPLETE", then the real download. */
export function DossierButton() {
  const [state, setState] = useState<State>('idle');
  const [pct, setPct] = useState(0);
  const reduced = useReducedMotion();
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const resetTimer = useRef<number>();

  useEffect(
    () => () => {
      controls.current?.stop();
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const start = () => {
    if (state !== 'idle') return;
    play('click');
    setState('downloading');
    controls.current = animate(0, 100, {
      duration: reduced ? 0.2 : 1.4,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => {
        triggerDownload();
        setState('complete');
        play('toast');
        resetTimer.current = window.setTimeout(() => {
          setState('idle');
          setPct(0);
        }, 2800);
      },
    });
  };

  const label =
    state === 'idle' ? 'Download dossier' : state === 'downloading' ? `Dossier downloading… ${pct}%` : 'Download complete';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.button
        type="button"
        onClick={start}
        aria-busy={state === 'downloading'}
        aria-label={state === 'idle' ? 'Download dossier (résumé PDF)' : label}
        whileHover={state === 'idle' ? { y: -2 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
        className={`relative inline-flex min-h-[52px] min-w-[17rem] items-center justify-center gap-2 overflow-hidden px-6 font-ui text-base font-bold uppercase tracking-hud ${
          state === 'complete' ? 'bg-green text-black' : 'bg-yellow text-black'
        }`}
      >
        {/* progress fill (value driven by Framer's animate) */}
        <span
          className="absolute inset-0 origin-left bg-off-white"
          style={{ transform: `scaleX(${state === 'downloading' ? pct / 100 : 0})` }}
          aria-hidden="true"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="relative flex items-center gap-2 tabular-nums"
          >
            {state === 'complete' ? <CheckIcon /> : <DownloadIcon />}
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <a
        href={links.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-1 font-ui text-sm font-semibold uppercase tracking-hud text-off-white/80 underline-offset-4 hover:text-yellow hover:underline"
      >
        View PDF <ExternalIcon width={14} height={14} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      <span className="sr-only" aria-live="polite">
        {state === 'downloading' ? 'Dossier downloading' : state === 'complete' ? 'Download complete' : ''}
      </span>
    </div>
  );
}
