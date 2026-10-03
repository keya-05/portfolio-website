import { useEffect, useState } from 'react';
import { districts, site } from '../../data/content';
import { PauseIcon, PhoneIcon, SoundOffIcon, SoundOnIcon } from '../ui/Icons';
import { useGame } from './GameContext';
import { Minimap } from './Minimap';

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: site.timeZone,
});

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);
  const [h, m] = timeFmt.format(now).split(':');
  return (
    <time dateTime={now.toISOString()} className="font-ui text-xl font-bold tabular-nums tracking-wider text-off-white md:text-2xl">
      <span className="sr-only">Local time in Pune: </span>
      {h}
      <span className="animate-pulse-soft text-yellow">:</span>
      {m}
    </time>
  );
}

export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const { muted, toggleMuted } = useGame();
  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-pressed={!muted}
      aria-label={muted ? 'Sound effects off. Turn on' : 'Sound effects on. Turn off'}
      className="flex min-h-[40px] items-center gap-1.5 border border-off-white/15 bg-black/50 px-2.5 font-ui text-xs font-semibold uppercase tracking-hud text-off-white transition-colors hover:border-yellow hover:text-yellow"
    >
      {muted ? <SoundOffIcon width={16} height={16} /> : <SoundOnIcon width={16} height={16} />}
      {!compact && <span>{muted ? 'SFX off' : 'SFX on'}</span>}
    </button>
  );
}

export function HUD() {
  const { toggleOverlay, activeSection } = useGame();
  const current = districts.find((d) => d.id === activeSection) ?? districts[0];

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-hud flex items-start justify-between bg-gradient-to-b from-black/70 to-transparent px-4 pb-6 pt-3 md:bg-none md:px-6 md:pt-5">
        <div className="pointer-events-auto pt-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-green" aria-hidden="true" />
            <span className="font-ui text-sm font-bold uppercase tracking-hud text-off-white md:text-base">
              KC <span className="text-yellow">//</span> Online
            </span>
          </div>
          <p className="mt-0.5 pl-4 font-ui text-xs font-semibold uppercase tracking-hud text-off-white/80">
            <span className="sr-only">Current district: </span>
            {current.label} district
          </p>
        </div>

        <div className="pointer-events-auto flex items-start gap-2 md:gap-4">
          <div className="hidden flex-col items-end md:flex">
            <Clock />
            <span className="hud-label text-[0.65rem]">Pune</span>
          </div>
          <SoundToggle compact />
          <button
            type="button"
            onClick={() => toggleOverlay('pause')}
            aria-label="Pause menu (Escape)"
            className="flex min-h-[40px] items-center gap-1.5 border border-off-white/15 bg-black/50 px-2.5 font-ui text-xs font-semibold uppercase tracking-hud text-off-white transition-colors hover:border-yellow hover:text-yellow"
          >
            <PauseIcon width={16} height={16} />
            <span className="hidden md:inline">Esc</span>
          </button>
        </div>
      </header>

      {/* Desktop-only HUD furniture */}
      <div className="fixed bottom-6 left-6 z-hud hidden md:block">
        <Minimap />
      </div>

      <button
        type="button"
        onClick={() => toggleOverlay('phone')}
        aria-label="Open phone (P)"
        className="fixed bottom-6 right-6 z-hud hidden h-14 items-center gap-2 rounded-full border border-off-white/15 bg-black/80 pl-4 pr-5 text-off-white shadow-xl shadow-black/50 transition-colors hover:border-yellow hover:text-yellow md:flex"
      >
        <PhoneIcon />
        <span className="font-ui text-sm font-bold uppercase tracking-hud">Phone</span>
        <span className="hud-label ml-1 text-[0.6rem]">P</span>
      </button>
    </>
  );
}
