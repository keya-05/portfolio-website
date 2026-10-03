import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { districts, type DistrictId } from '../../data/content';
import { useGame } from './GameContext';

const VISIBLE_MS = 900; // + ~0.3s in/out ≈ 1.2s total

/**
 * "NOW ENTERING: CAMPUS DISTRICT". Fires when the active district changes
 * (scroll) or when Phone/Map travel arrives — districts flown past mid-travel
 * are skipped. pointer-events: none, so it never blocks anything; the HUD
 * carries the same information for assistive tech.
 */
export function DistrictBanner() {
  const { activeSection, traveling, intro } = useGame();
  const [shown, setShown] = useState<DistrictId | null>(null);
  const last = useRef<DistrictId>(activeSection);

  useEffect(() => {
    if (intro !== 'done' || traveling || activeSection === last.current) return;
    last.current = activeSection;
    setShown(activeSection);
  }, [activeSection, traveling, intro]);

  // Own effect so a trip starting mid-banner can't cancel the hide.
  useEffect(() => {
    if (!shown) return;
    const t = window.setTimeout(() => setShown(null), VISIBLE_MS);
    return () => window.clearTimeout(t);
  }, [shown]);

  const d = districts.find((x) => x.id === shown);

  return (
    <div className="pointer-events-none fixed inset-x-4 top-20 z-hud flex justify-center md:inset-x-auto md:bottom-28 md:right-6 md:top-auto md:justify-end" aria-hidden="true">
      <AnimatePresence>
        {d && (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="border-r-4 border-yellow bg-black/85 px-4 py-2 text-right"
          >
            <p className="hud-label text-[0.65rem] text-yellow">Now entering</p>
            <p className="display text-3xl text-off-white md:text-4xl">{d.label} district</p>
            <p className="font-ui text-xs uppercase tracking-hud text-off-white/75">{d.codename}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
