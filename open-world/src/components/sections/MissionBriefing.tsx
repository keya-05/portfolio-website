import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ALL_PROJECTS, SECRET_INDEX, useGame } from '../shell/GameContext';
import { Button } from '../ui/Button';
import { ChipList } from '../ui/Chip';
import { CloseIcon } from '../ui/Icons';
import { StatBar } from '../ui/StatBar';
import { DocksMapArt } from './DocksMap';

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="hud-label text-yellow">{label}</h3>
      <div className="mt-1.5 font-body text-base leading-relaxed text-off-white/90">{children}</div>
    </div>
  );
}

const cameraPos = (i: number) => ({ xPercent: 50 - ALL_PROJECTS[i].pin.x, yPercent: 50 - ALL_PROJECTS[i].pin.y });

/**
 * Lazy-loaded full-screen MISSION BRIEFING.
 * Framer Motion: the dialog's enter/exit only.
 * GSAP: [data-briefing-camera] (pan/zoom) and [data-briefing-content] (fade) on project switch.
 */
export default function MissionBriefing() {
  const g = useGame();
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [shown, setShown] = useState(g.projectIndex);
  useFocusTrap(dialog);

  const p = ALL_PROJECTS[shown];
  const list = ALL_PROJECTS.map((_, i) => i).filter(g.matchesFilter);
  const pos = list.indexOf(shown);
  const prev = list.length > 1 ? ALL_PROJECTS[list[(pos - 1 + list.length) % list.length]] : null;
  const next = list.length > 1 ? ALL_PROJECTS[list[(pos + 1) % list.length]] : null;

  const { markDiscovered } = g;
  useEffect(() => markDiscovered(p.id), [p.id, markDiscovered]);

  // Initial camera framing.
  useGSAP(() => gsap.set('[data-briefing-camera]', cameraPos(shown)), { scope: stage });

  // Switch timeline: fade out 0.15s → camera pan/zoom 0.5s → reveal 0.4s.
  useGSAP(
    () => {
      const target = g.projectIndex;
      if (target === shown) return;
      tl.current?.progress(1).kill();

      if (reduced) {
        setShown(target);
        gsap.set('[data-briefing-camera]', cameraPos(target));
        gsap.fromTo('[data-briefing-content]', { opacity: 0 }, { opacity: 1, duration: 0.2 });
        return;
      }
      tl.current = gsap
        .timeline()
        .to('[data-briefing-content]', { opacity: 0, duration: 0.15, ease: 'power1.in', onComplete: () => setShown(target) })
        .to('[data-briefing-camera]', { ...cameraPos(target), duration: 0.5, ease: 'power3.inOut' })
        .to('[data-briefing-camera]', { scale: 1.18, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }, '<')
        .fromTo('[data-briefing-content]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    },
    { scope: stage, dependencies: [g.projectIndex, reduced] },
  );

  const isSecret = shown === SECRET_INDEX;

  return (
    <motion.div
      ref={stage}
      className="fixed inset-0 z-overlay overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* camera: the docks map, framed on the current pin */}
      <div data-briefing-camera className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] will-change-transform" aria-hidden="true">
        <DocksMapArt stretch />
        {ALL_PROJECTS.map((proj, i) =>
          g.isOnBoard(i) ? (
            <span
              key={proj.id}
              className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 ${
                i === shown ? 'border-off-white bg-yellow' : 'border-black bg-yellow/40'
              }`}
              style={{ left: `${proj.pin.x}%`, top: `${proj.pin.y}%` }}
            />
          ) : null,
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/75" aria-hidden="true" />

      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="briefing-title"
        tabIndex={-1}
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        exit={{ y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="absolute inset-0 flex flex-col"
      >
        <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 pb-10 pt-5 sm:px-8 lg:px-16">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="hud-label text-yellow">
            Mission briefing // {String(pos + 1).padStart(2, '0')} of {String(list.length).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={g.closeOverlay}
            aria-label="Close mission briefing"
            className="grid h-11 w-11 place-items-center border border-off-white/25 bg-black/60 hover:border-yellow hover:text-yellow"
          >
            <CloseIcon />
          </button>
        </header>

        <p className="sr-only" aria-live="polite">
          Now viewing: {p.title}
        </p>

        <div data-briefing-content className="mx-auto mt-6 grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="space-y-6">
            <div>
              <ul className="flex flex-wrap gap-2" aria-label="Mission tags">
                <li className="bg-yellow px-2 py-0.5 font-ui text-xs font-bold uppercase tracking-hud text-black">{p.type}</li>
                {isSecret && (
                  <li className="border border-yellow px-2 py-0.5 font-ui text-xs font-bold uppercase tracking-hud text-yellow">
                    Secret mission · {p.status}
                  </li>
                )}
              </ul>
              <h2 id="briefing-title" className="display mt-3 text-5xl sm:text-6xl lg:text-7xl">
                {p.title}
              </h2>
            </div>

            {/* Media loads only now that the briefing is open. */}
            {p.image && (
              <div className="aspect-video overflow-hidden border border-off-white/15 bg-off-white/5">
                <img
                  key={p.image}
                  src={p.image}
                  alt={`Screenshot of ${p.title}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            )}

            <Block label="Objective">{p.objective}</Block>
            <Block label="Problem">{p.problem}</Block>
          </div>

          <div className="space-y-6">
            <Block label="Approach">{p.approach}</Block>
            <Block label="Result">{p.result}</Block>
            <div>
              <h3 className="hud-label text-yellow">Tech loadout</h3>
              <div className="mt-2">
                <ChipList items={p.tech} label={`Tech used in ${p.title}`} />
              </div>
            </div>
            <ul aria-label="Scope">
              <StatBar name="Scope (complexity)" level={p.scope} />
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              {p.live ? (
                <Button href={p.live} external>
                  View project
                </Button>
              ) : (
                <span className="inline-flex min-h-[44px] items-center border border-off-white/15 px-5 font-ui text-sm font-bold uppercase tracking-hud text-off-white/70">
                  {isSecret ? 'Build in progress' : 'No public build'}
                </span>
              )}
              {p.github ? (
                <Button href={p.github} external variant="ghost">
                  Source code
                </Button>
              ) : (
                <span className="inline-flex min-h-[44px] items-center border border-off-white/15 px-5 font-ui text-sm font-bold uppercase tracking-hud text-off-white/70">
                  Source classified
                </span>
              )}
            </div>
          </div>
        </div>
        </div>

      {/* prev / next */}
      {list.length > 1 && (
        <nav
          aria-label="Switch mission"
          className="flex items-center justify-between gap-2 border-t border-off-white/10 bg-black/90 px-4 py-3 pb-safe sm:px-8"
        >
          <button
            type="button"
            onClick={() => g.cycleProject(-1)}
            className="flex min-h-[44px] min-w-0 items-center gap-2 font-ui text-sm font-bold uppercase tracking-hud hover:text-yellow"
          >
            <span aria-hidden="true">←</span>
            <span className="truncate">
              <span className="sr-only">Previous mission: </span>
              {prev?.title}
            </span>
          </button>
          <span className="hud-label hidden text-[0.65rem] md:block">← → switch · Esc close</span>
          <button
            type="button"
            onClick={() => g.cycleProject(1)}
            className="flex min-h-[44px] min-w-0 items-center gap-2 text-right font-ui text-sm font-bold uppercase tracking-hud hover:text-yellow"
          >
            <span className="truncate">
              <span className="sr-only">Next mission: </span>
              {next?.title}
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
      </motion.div>
    </motion.div>
  );
}
