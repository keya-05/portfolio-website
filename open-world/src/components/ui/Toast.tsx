import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { play } from '../../lib/sounds';
import { TrophyIcon } from './Icons';

interface ToastInput {
  label?: string;
  title: string;
  subtitle?: string;
}
interface ToastItem extends ToastInput {
  id: number;
}

const ToastContext = createContext<(t: ToastInput) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const notify = useCallback((t: ToastInput) => {
    const id = nextId.current++;
    setItems((list) => [...list.slice(-2), { ...t, id }]);
    play('toast');
    window.setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[84px] z-toast flex flex-col items-center gap-2 md:bottom-auto md:left-auto md:right-6 md:top-20 md:items-end"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="panel flex w-full max-w-sm items-center gap-3 border-l-4 border-l-yellow py-3 pl-3 pr-5 shadow-2xl shadow-black/60"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-yellow text-black">
                <TrophyIcon />
              </span>
              <span className="min-w-0">
                <span className="hud-label block text-[0.65rem] text-yellow">{t.label ?? 'Achievement unlocked'}</span>
                <span className="block font-ui text-lg font-bold uppercase leading-tight tracking-wide text-off-white">
                  {t.title}
                </span>
                {t.subtitle && <span className="block truncate text-xs text-off-white/70">{t.subtitle}</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
