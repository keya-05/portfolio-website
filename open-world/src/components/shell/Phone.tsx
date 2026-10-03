import { AnimatePresence, motion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { districts, links, site } from '../../data/content';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { CheckIcon, CloseIcon, DistrictIcon, DossierIcon, LayoutIcon, MapIcon, SoundOffIcon, SoundOnIcon } from '../ui/Icons';
import { useGame } from './GameContext';

export function Phone() {
  const { overlay } = useGame();
  return <AnimatePresence>{overlay === 'phone' && <PhoneDevice />}</AnimatePresence>;
}

function AppTile({
  label,
  icon,
  active = false,
  done = false,
  onClick,
  href,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  done?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const tile = (
    <>
      <span
        className={`relative grid aspect-square w-full max-w-[72px] place-items-center rounded-2xl border transition-colors ${
          active
            ? 'border-yellow bg-yellow text-black'
            : 'border-off-white/10 bg-off-white/[0.06] text-yellow group-hover:border-yellow/70'
        }`}
      >
        {icon}
        {done && (
          <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-green text-black" aria-hidden="true">
            <CheckIcon width={12} height={12} strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="font-ui text-xs font-semibold uppercase tracking-[0.12em] text-off-white">
        {label}
        {done && <span className="sr-only"> (visited)</span>}
      </span>
    </>
  );
  const cls = 'group flex flex-col items-center gap-1.5 rounded-xl p-1';
  return href ? (
    <a href={href} download className={cls} onClick={onClick}>
      {tile}
    </a>
  ) : (
    <button type="button" className={cls} onClick={onClick} aria-current={active ? 'location' : undefined}>
      {tile}
    </button>
  );
}

function PhoneDevice() {
  const { activeSection, visited, navigateTo, closeOverlay, toggleOverlay, muted, toggleMuted, setClassic } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timeZone }).format(
    new Date(),
  );

  return (
    <>
      <motion.div
        className="fixed inset-0 z-overlay bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeOverlay}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Phone: quick travel"
        tabIndex={-1}
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        exit={{ y: '110%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="fixed inset-0 z-overlay flex flex-col overflow-hidden bg-black md:inset-auto md:bottom-6 md:right-6 md:h-[620px] md:max-h-[calc(100vh-3rem)] md:w-[330px] md:rounded-[2.4rem] md:border-[7px] md:border-[#1d1d1d] md:shadow-2xl md:shadow-black"
      >
        {/* wallpaper: environmental sunset tint */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: 'linear-gradient(180deg, transparent 30%, var(--sunset-pink) 75%, var(--orange) 100%)' }}
          aria-hidden="true"
        />

        <div className="relative flex items-center justify-between px-6 pb-2 pt-4 font-ui text-sm font-semibold tabular-nums">
          <span>{time}</span>
          <span className="hidden h-5 w-24 rounded-full bg-[#1d1d1d] md:block" aria-hidden="true" />
          <span className="hud-label text-[0.65rem] text-off-white">K-NET ▮▮▮</span>
        </div>

        <div data-lenis-prevent className="relative flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-6 pt-4 pb-safe">
          <p className="hud-label text-yellow">K-OS // Quick travel</p>
          <p className="display mt-1 text-4xl">Where to?</p>

          <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5">
            {districts.map((d) => (
              <AppTile
                key={d.id}
                label={d.label}
                icon={<DistrictIcon id={d.id} width={26} height={26} />}
                active={activeSection === d.id}
                done={visited.includes(d.id)}
                onClick={() => navigateTo(d.id)}
              />
            ))}
            <AppTile label="Map" icon={<MapIcon width={26} height={26} />} onClick={() => toggleOverlay('map')} />
            <AppTile label="Dossier" icon={<DossierIcon width={26} height={26} />} href={links.resume} />
            <AppTile
              label={muted ? 'SFX off' : 'SFX on'}
              icon={muted ? <SoundOffIcon width={26} height={26} /> : <SoundOnIcon width={26} height={26} />}
              onClick={toggleMuted}
            />
            <AppTile label="Classic" icon={<LayoutIcon width={26} height={26} />} onClick={() => setClassic(true)} />
          </div>

          <button
            type="button"
            onClick={closeOverlay}
            className="mt-auto flex min-h-[48px] items-center justify-center gap-2 self-center pt-8 font-ui text-sm font-bold uppercase tracking-hud text-off-white hover:text-yellow"
          >
            <CloseIcon width={18} height={18} /> Put phone away
          </button>
        </div>
      </motion.div>
    </>
  );
}
