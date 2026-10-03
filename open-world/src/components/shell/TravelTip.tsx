import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './GameContext';

/**
 * Loading-screen-style tip shown during long Phone/Map jumps (< 1.5s).
 * Only the Skip button takes pointer events, so scrolling is never blocked.
 */
export function TravelTip() {
  const { tip, dismissTip } = useGame();

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-24 z-toast flex justify-center md:bottom-8">
      <AnimatePresence>
        {tip && (
          <motion.div
            key={tip}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="panel flex max-w-xl items-center gap-4 px-4 py-3"
          >
            <span className="font-ui text-xs font-bold uppercase tracking-hud text-yellow">Tip</span>
            <span className="font-body text-sm text-off-white/90">{tip}</span>
            <button
              type="button"
              onClick={dismissTip}
              className="pointer-events-auto shrink-0 font-ui text-xs font-bold uppercase tracking-hud text-off-white/80 underline underline-offset-4 hover:text-yellow"
            >
              Skip
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
