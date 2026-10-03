import { AnimatePresence, motion } from 'framer-motion';
import { useRef, type KeyboardEvent } from 'react';
import { districts, links, site } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useGame } from './GameContext';

export function PauseMenu() {
  const { overlay } = useGame();
  return <AnimatePresence>{overlay === 'pause' && <PausePanel />}</AnimatePresence>;
}

const CONTROLS: [string, string][] = [
  ['P', 'Phone'],
  ['M', 'Map'],
  ['ESC', 'Pause / back'],
  ['← →', 'Cycle projects'],
];

/** Up/Down arrows move between menu items, like a game menu. */
function onMenuKeys(e: KeyboardEvent<HTMLUListElement>) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a, button'));
  const i = items.indexOf(document.activeElement as HTMLElement);
  const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
  items[next]?.focus();
}

const itemCls =
  'group flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left font-ui text-xl font-bold uppercase tracking-[0.1em] text-off-white transition-colors hover:bg-yellow hover:text-black focus-visible:bg-yellow focus-visible:text-black sm:text-2xl';

function PausePanel() {
  const g = useGame();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  const current = districts.find((d) => d.id === g.activeSection) ?? districts[0];
  const pct = Math.round(g.progress * 100);

  const panelMotion = isDesktop
    ? { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

  return (
    <motion.div
      className="fixed inset-0 z-overlay flex items-end bg-black/55 backdrop-blur-md md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && g.closeOverlay()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        tabIndex={-1}
        data-lenis-prevent
        {...panelMotion}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border-t border-off-white/15 bg-black/95 p-5 pb-safe md:mx-auto md:grid md:max-h-none md:max-w-6xl md:grid-cols-[1.2fr_1fr] md:gap-16 md:rounded-none md:border-none md:bg-transparent md:p-10"
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-off-white/25 md:hidden" aria-hidden="true" />
        <div>
          <p className="hud-label text-yellow">{site.name}</p>
          <h2 id="pause-title" className="display text-6xl md:text-8xl">
            Paused
          </h2>

          <ul className="mt-6 space-y-1" onKeyDown={onMenuKeys}>
            <li>
              <button type="button" className={itemCls} onClick={g.closeOverlay}>
                Resume <span className="hud-label text-inherit opacity-60">Esc</span>
              </button>
            </li>
            <li>
              <button type="button" className={itemCls} onClick={() => g.toggleOverlay('map')}>
                Map <span className="hud-label text-inherit opacity-60">M</span>
              </button>
            </li>
            <li>
              <button type="button" className={itemCls} onClick={() => g.toggleOverlay('phone')}>
                Phone <span className="hud-label text-inherit opacity-60">P</span>
              </button>
            </li>
            <li>
              <a className={itemCls} href={links.resume} download>
                Download dossier <span className="hud-label text-inherit opacity-60">PDF</span>
              </a>
            </li>
            <li>
              <button type="button" className={itemCls} onClick={g.toggleMuted} aria-pressed={!g.muted}>
                Sound <span className="text-base">{g.muted ? 'Off' : 'On'}</span>
              </button>
            </li>
            <li>
              <button type="button" className={itemCls} onClick={() => g.setClassic(true)}>
                Classic view <span className="text-base">Off</span>
              </button>
            </li>
            <li>
              <button type="button" className={itemCls} onClick={g.replayIntro}>
                Replay intro
              </button>
            </li>
          </ul>
        </div>

        <aside className="mt-8 space-y-6 md:mt-24" aria-label="Session stats">
          <div className="panel p-5">
            <p className="hud-label">Current location</p>
            <p className="mt-1 font-ui text-2xl font-bold uppercase tracking-wide">
              {current.label} <span className="text-hud-gray">· {current.codename}</span>
            </p>
            <p className="hud-label mt-5">City explored</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="relative h-2 flex-1 overflow-hidden bg-off-white/10">
                <div className="absolute inset-0 origin-left bg-yellow" style={{ transform: `scaleX(${g.progress})` }} />
              </div>
              <span className="font-ui text-lg font-bold tabular-nums text-yellow">{pct}%</span>
            </div>
            <p className="hud-label mt-5">Motion</p>
            <p className="mt-1 font-ui text-lg uppercase tracking-wide">{reduced ? 'Reduced (system setting)' : 'Full'}</p>
          </div>

          <div className="panel hidden p-5 md:block">
            <p className="hud-label">Controls</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {CONTROLS.map(([key, action]) => (
                <div key={key} className="contents">
                  <dt>
                    <kbd className="inline-block min-w-[2.5rem] border border-off-white/25 px-1.5 py-0.5 text-center font-ui text-sm font-bold">
                      {key}
                    </kbd>
                  </dt>
                  <dd className="self-center font-ui text-base uppercase tracking-wide text-off-white/80">{action}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </motion.div>
    </motion.div>
  );
}
