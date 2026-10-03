import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { districts, site, type DistrictId } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { CheckIcon, CloseIcon, DistrictIcon, MapIcon } from '../ui/Icons';
import { useGame } from './GameContext';

/** Original abstract plan of K-CITY in a 200x200 space. */
function MapArt() {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="200" height="200" fill="#111111" />
      {/* block grid */}
      <path
        d={Array.from({ length: 9 }, (_, i) => `M${(i + 1) * 20} 0V200M0 ${(i + 1) * 20}H200`).join('')}
        stroke="rgba(242,240,232,.05)"
        strokeWidth="1"
      />
      {/* bay + river */}
      <path d="M150 200Q160 168 200 158V200Z" fill="rgba(83,184,212,.16)" />
      <path d="M0 86Q52 98 88 76T200 34" stroke="rgba(83,184,212,.22)" strokeWidth="7" fill="none" />
      {/* district zones */}
      {districts.map((d) => (
        <circle key={d.id} cx={d.map.x} cy={d.map.y} r="22" fill="rgba(242,240,232,.04)" stroke="rgba(242,240,232,.08)" />
      ))}
      {/* avenues */}
      <path
        d="M8 104H192M104 8V192M52 52L104 104L150 140M138 64L104 104L58 128M104 104L100 176"
        stroke="rgba(155,155,155,.4)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M8 104H192M104 8V192" stroke="rgba(246,215,67,.25)" strokeWidth="1" strokeDasharray="3 4" />
    </svg>
  );
}

function PlayerMarker({ active }: { active: DistrictId }) {
  const d = districts.find((x) => x.id === active) ?? districts[0];
  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <motion.g initial={false} animate={{ x: d.map.x, y: d.map.y }} transition={{ type: 'spring', stiffness: 90, damping: 18 }}>
        <circle r="14" fill="rgba(246,215,67,.18)" className="animate-pulse-soft" />
        <path d="M0 -8L6 6L0 3L-6 6Z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="1.2" />
      </motion.g>
    </svg>
  );
}

interface CityMapProps {
  labels?: boolean;
  onSelect: (id: DistrictId) => void;
}

function CityMap({ labels = false, onSelect }: CityMapProps) {
  const { activeSection, visited } = useGame();
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <MapArt />
      <PlayerMarker active={activeSection} />
      {districts.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelect(d.id)}
          aria-label={`Travel to ${d.label}: ${d.codename}${visited.includes(d.id) ? ' (visited)' : ''}`}
          aria-current={activeSection === d.id ? 'location' : undefined}
          className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${d.map.x / 2}%`, top: `${d.map.y / 2}%` }}
        >
          <span
            className={`grid place-items-center rounded-full border transition-colors ${
              labels ? 'h-9 w-9' : 'h-6 w-6'
            } ${
              activeSection === d.id
                ? 'border-yellow bg-yellow text-black'
                : 'border-off-white/40 bg-black/80 text-off-white group-hover:border-yellow group-hover:text-yellow'
            }`}
          >
            <DistrictIcon id={d.id} width={labels ? 18 : 12} height={labels ? 18 : 12} />
          </span>
          {visited.includes(d.id) && (
            <span
              className={`absolute grid place-items-center rounded-full bg-green text-black ${
                labels ? '-right-1.5 -top-1.5 h-4 w-4' : '-right-1 -top-1 h-3 w-3'
              }`}
              aria-hidden="true"
            >
              <CheckIcon width={labels ? 10 : 8} height={labels ? 10 : 8} strokeWidth={3} />
            </span>
          )}
          {labels && (
            <span className="mt-1 whitespace-nowrap bg-black/80 px-1.5 font-ui text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-off-white sm:text-xs">
              {d.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Desktop HUD minimap (bottom-left). */
export function Minimap() {
  const { activeSection, navigateTo, toggleOverlay } = useGame();
  const current = districts.find((d) => d.id === activeSection) ?? districts[0];

  return (
    <nav aria-label="Minimap" className="w-44">
      <div className="relative overflow-hidden rounded-xl border-2 border-off-white/15 shadow-xl shadow-black/50">
        <CityMap onSelect={navigateTo} />
        <button
          type="button"
          onClick={() => toggleOverlay('map')}
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded bg-black/80 text-off-white hover:text-yellow"
          aria-label="Open full map (M)"
        >
          <MapIcon width={14} height={14} />
        </button>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-ui text-sm font-bold uppercase tracking-[0.14em] text-off-white"
          >
            {current.codename}
          </motion.span>
        </AnimatePresence>
        <span className="hud-label text-[0.6rem]">M</span>
      </div>
    </nav>
  );
}

/** Full-screen map overlay (M key, minimap expand, mobile MAP tab). */
export function WorldMap() {
  const { overlay } = useGame();
  return <AnimatePresence>{overlay === 'map' && <WorldMapDialog />}</AnimatePresence>;
}

function WorldMapDialog() {
  const { navigateTo, closeOverlay, activeSection, visited } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  return (
    <motion.div
      className="fixed inset-0 z-overlay flex items-center justify-center bg-black/85 p-4 pb-safe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && closeOverlay()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        tabIndex={-1}
        data-lenis-prevent
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="panel flex max-h-full w-full max-w-5xl flex-col gap-6 overflow-y-auto p-4 sm:p-6 md:flex-row"
      >
        <div className="w-full shrink-0 md:w-[min(70vh,560px)]">
          <div className="overflow-hidden rounded-lg border border-off-white/15">
            <CityMap labels onSelect={navigateTo} />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="hud-label text-yellow">{site.city} // Map</p>
              <h2 id="map-title" className="display text-4xl sm:text-5xl">
                Set waypoint
              </h2>
            </div>
            <button
              type="button"
              onClick={closeOverlay}
              className="grid h-11 w-11 shrink-0 place-items-center border border-off-white/20 hover:border-yellow hover:text-yellow"
              aria-label="Close map"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="mt-6 space-y-2">
            {districts.map((d, i) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => navigateTo(d.id)}
                  className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors ${
                    activeSection === d.id
                      ? 'border-yellow/70 bg-yellow/10'
                      : 'border-off-white/10 hover:border-yellow/60'
                  }`}
                >
                  <span className="font-ui text-sm tabular-nums text-hud-gray">0{i + 1}</span>
                  <DistrictIcon id={d.id} className="shrink-0 text-yellow" />
                  <span className="min-w-0">
                    <span className="block font-ui text-lg font-bold uppercase leading-tight tracking-wide">
                      {d.label} <span className="font-medium text-hud-gray">· {d.codename}</span>
                    </span>
                    <span className="block text-xs text-off-white/75">{d.mission}</span>
                  </span>
                  {visited.includes(d.id) && (
                    <span className="ml-auto flex shrink-0 items-center gap-1 font-ui text-xs font-bold uppercase tracking-hud text-green">
                      <CheckIcon width={14} height={14} /> Visited
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <p className="hud-label mt-auto pt-6 text-[0.65rem]">Click a location to set a waypoint · ESC to close</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
