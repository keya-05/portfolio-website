import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { projects, type ProjectFilter } from '../../data/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { ALL_PROJECTS, SECRET_INDEX, useGame } from '../shell/GameContext';
import { CheckIcon } from '../ui/Icons';
import { useToast } from '../ui/Toast';
import { DistrictSection } from './DistrictSection';
import { DocksMapArt } from './DocksMap';

const STATIONS: { value: ProjectFilter; label: string; freq: string }[] = [
  { value: 'All', label: 'All', freq: '88.1' },
  { value: 'AI', label: 'AI', freq: '92.4' },
  { value: 'Backend', label: 'Backend', freq: '95.7' },
  { value: 'Full Stack', label: 'Full Stack', freq: '99.3' },
  { value: 'DevOps', label: 'DevOps', freq: '101.9' },
  { value: 'Experimental', label: 'Experimental', freq: '104.5' },
];

function RadioFilters() {
  const { filter, setFilter, isOnBoard } = useGame();
  const count = (f: ProjectFilter) =>
    ALL_PROJECTS.filter((p, i) => isOnBoard(i) && (f === 'All' || p.type === f)).length;

  return (
    <fieldset>
      <legend className="hud-label mb-3">Radio // Tune to a mission type</legend>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {STATIONS.map((s) => (
          <label key={s.value} className="shrink-0 cursor-pointer">
            <input
              type="radio"
              name="mission-filter"
              value={s.value}
              checked={filter === s.value}
              onChange={() => setFilter(s.value)}
              className="peer sr-only"
            />
            <span className="flex min-h-[48px] flex-col justify-center border border-off-white/20 bg-black/60 px-3 py-1.5 transition-colors hover:border-yellow peer-checked:border-yellow peer-checked:bg-yellow peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-yellow">
              <span className="font-ui text-sm font-bold uppercase tracking-[0.14em]">{s.label}</span>
              <span className="font-ui text-[0.7rem] tabular-nums tracking-wider opacity-80">
                {s.freq} FM · {count(s.value)}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function NoSignal() {
  const { filter } = useGame();
  const station = STATIONS.find((s) => s.value === filter);
  return (
    <p className="font-ui text-lg uppercase tracking-hud text-off-white/85" role="status">
      No signal on {station?.freq} FM. Try another station.
    </p>
  );
}

export function Projects() {
  const g = useGame();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const notify = useToast();
  const wasUnlocked = useRef(g.secretUnlocked);
  useScrollParallax(root);

  const boardIndices = ALL_PROJECTS.map((_, i) => i).filter(g.isOnBoard);
  const anyMatch = boardIndices.some(g.matchesFilter);
  const discoveredCount = projects.filter((p) => g.discovered.includes(p.id)).length;

  // Pins drop onto the board when it scrolls into view (GSAP owns [data-pin-pop]).
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('[data-pin-pop]', {
        scale: 0,
        opacity: 0,
        y: -20,
        duration: 0.55,
        stagger: 0.09,
        ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '[data-board]', start: 'top 75%', once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  // Arrow-key selection follows focus while the player is on the board.
  useEffect(() => {
    if (g.overlay !== 'none' || !root.current?.contains(document.activeElement)) return;
    const id = ALL_PROJECTS[g.projectIndex].id;
    const target = Array.from(root.current.querySelectorAll<HTMLElement>(`[data-pin-id="${id}"]`)).find(
      (el) => el.offsetParent !== null,
    );
    target?.focus({ preventScroll: true });
  }, [g.projectIndex, g.overlay]);

  // All missions discovered → secret mission.
  useEffect(() => {
    if (g.secretUnlocked && !wasUnlocked.current) {
      notify({ title: 'All missions discovered', subtitle: 'Secret mission unlocked on the board' });
    }
    wasUnlocked.current = g.secretUnlocked;
  }, [g.secretUnlocked, notify]);

  return (
    <DistrictSection
      ref={root}
      id="projects"
      title="Mission select"
      intro="Every build is a pin on the Workshop Docks. Tune the radio to filter, open a pin for the full briefing."
      backdrop={
        <span data-speed="-0.3" className="display text-outline absolute -right-6 top-10 select-none text-[clamp(8rem,22vw,22rem)]">
          Builds
        </span>
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <RadioFilters />
        <p className="font-ui text-sm uppercase tracking-hud text-off-white/85" aria-live="polite">
          Discovered {discoveredCount}/{projects.length}
          {g.secretUnlocked && <span className="ml-3 text-yellow">· All missions discovered</span>}
        </p>
      </div>

      {/* ---------- md+: map board ---------- */}
      <div data-board className="relative mt-6 hidden aspect-[16/9] overflow-hidden rounded-lg border border-off-white/15 md:block">
        <DocksMapArt />
        <p className="hud-label absolute left-4 top-3 text-[0.65rem] text-off-white/80">
          Mission board // ← → select · Enter open
        </p>

        {boardIndices.map((i) => {
          const p = ALL_PROJECTS[i];
          const active = g.matchesFilter(i);
          const found = g.discovered.includes(p.id);
          const selected = g.projectIndex === i;
          const secret = i === SECRET_INDEX;
          const pin = (
            <button
              type="button"
              data-pin-id={p.id}
              disabled={!active}
              onClick={() => g.openBriefing(i)}
              aria-label={`${secret ? 'Secret mission' : 'Mission'}: ${p.title} (${p.type})${found ? ', discovered' : ''}`}
              className="group flex flex-col items-center disabled:cursor-default"
            >
              <span
                className={`relative grid h-11 w-11 place-items-center rounded-full rounded-br-none border-2 font-ui text-sm font-bold rotate-45 transition-colors ${
                  secret
                    ? 'border-dashed border-yellow bg-black text-yellow'
                    : selected
                      ? 'border-off-white bg-yellow text-black'
                      : 'border-black bg-yellow text-black group-hover:bg-off-white'
                }`}
              >
                <span className="-rotate-45">{secret ? '?' : String(i + 1).padStart(2, '0')}</span>
                {found && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 -rotate-45 place-items-center rounded-full bg-green text-black">
                    <CheckIcon width={12} height={12} />
                  </span>
                )}
              </span>
              <span className="mt-2 max-w-[11rem] bg-black/90 px-2 py-1 text-center font-ui text-xs font-bold uppercase leading-tight tracking-[0.1em] text-off-white group-hover:text-yellow">
                {secret ? p.status : p.title}
                <span className="block text-[0.65rem] font-semibold text-hud-gray">{p.type}</span>
              </span>
            </button>
          );

          return (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-full transition-opacity duration-300"
              style={{ left: `${p.pin.x}%`, top: `${p.pin.y}%`, opacity: active ? 1 : 0.2 }}
            >
              {secret ? (
                <motion.span
                  className="block"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                >
                  {pin}
                </motion.span>
              ) : (
                <span data-pin-pop className="block">
                  {pin}
                </span>
              )}
            </div>
          );
        })}

        {!anyMatch && (
          <div className="absolute inset-0 grid place-items-center bg-black/60">
            <NoSignal />
          </div>
        )}
      </div>

      {/* ---------- mobile: scrollable card grid ---------- */}
      <ul className="mt-6 grid gap-3 md:hidden">
        {boardIndices.map((i) => {
          const p = ALL_PROJECTS[i];
          const active = g.matchesFilter(i);
          const found = g.discovered.includes(p.id);
          return (
            <li key={p.id} className="transition-opacity duration-300" style={{ opacity: active ? 1 : 0.2 }}>
              <button
                type="button"
                data-pin-id={p.id}
                disabled={!active}
                onClick={() => g.openBriefing(i)}
                className="panel flex w-full items-start gap-3 p-4 text-left"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-yellow font-ui font-bold text-black">
                  {i === SECRET_INDEX ? '?' : String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="hud-label block text-[0.65rem] text-yellow">
                    {p.type}
                    {found && <span className="ml-2 text-green">· Discovered</span>}
                  </span>
                  <span className="mt-0.5 block font-ui text-lg font-bold uppercase leading-tight tracking-wide">{p.title}</span>
                  <span className="mt-1 block text-sm text-off-white/80">{p.objective}</span>
                  <span className="mt-2 block font-ui text-xs font-bold uppercase tracking-hud text-off-white">Open briefing ›</span>
                </span>
              </button>
            </li>
          );
        })}
        {!anyMatch && (
          <li>
            <NoSignal />
          </li>
        )}
      </ul>
    </DistrictSection>
  );
}
