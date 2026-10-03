import { motion } from 'framer-motion';
import { districts } from '../../data/content';
import { useGame } from '../shell/GameContext';
import { Button } from '../ui/Button';
import { CheckIcon } from '../ui/Icons';
import { Sheet } from '../ui/Sheet';

/** Lazy-loaded "MISSION PASSED" screen. Always dismissible. */
export default function CompletionScreen() {
  const { closeOverlay, navigateTo, resetProgress, visited, discovered } = useGame();

  return (
    <Sheet
      titleId="completion-title"
      kicker="Keya Chaudhary // Portfolio"
      title={<span className="text-yellow">Mission passed</span>}
      closeLabel="Close completion screen"
      onClose={closeOverlay}
    >
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 18 }}
        className="display text-8xl text-off-white sm:text-9xl"
        aria-label="100 percent, with a footnote"
      >
        100%<span className="text-yellow">*</span>
      </motion.p>

      <ul className="mt-8 space-y-2" aria-label="Districts">
        {districts.map((d) => {
          const done = visited.includes(d.id);
          return (
            <li key={d.id} className="flex items-center gap-3 border-b border-off-white/10 pb-2 font-ui text-lg uppercase tracking-wide">
              <span
                className={`grid h-6 w-6 place-items-center ${done ? 'bg-green text-black' : 'border border-off-white/30 text-transparent'}`}
                aria-hidden="true"
              >
                <CheckIcon width={14} height={14} />
              </span>
              <span className={done ? 'text-off-white' : 'text-off-white/60'}>
                {d.label} <span className="text-hud-gray">· {d.codename}</span>
              </span>
              <span className="sr-only">{done ? 'visited' : 'not visited yet'}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 font-ui text-sm uppercase tracking-hud text-off-white/70">
        Missions inspected: {discovered.length}
      </p>

      <p className="mt-6 font-body text-sm italic text-off-white/75">*There are always more missions.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => navigateTo('connect')}>[ Contact Keya Chaudhary ]</Button>
        <Button variant="ghost" onClick={resetProgress}>
          [ Replay ]
        </Button>
      </div>
    </Sheet>
  );
}
