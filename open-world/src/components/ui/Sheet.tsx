import { motion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { CloseIcon } from './Icons';

interface SheetProps {
  /** id of the title element (used for aria-labelledby) */
  titleId: string;
  kicker: string;
  title: ReactNode;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

/**
 * Pause-menu-style dialog: blurred backdrop, centred panel on desktop,
 * full-screen sheet on mobile. Framer Motion only. ESC is handled by the
 * global shortcut layer; focus is trapped and returned to the opener.
 */
export function Sheet({ titleId, kicker, title, closeLabel, onClose, children, wide = false }: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref);

  return (
    <motion.div
      className="fixed inset-0 z-overlay flex bg-black/60 backdrop-blur-md md:items-center md:justify-center md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className={`h-full w-full overflow-y-auto overscroll-contain bg-black/95 p-5 pb-safe sm:p-8 md:h-auto md:max-h-[88vh] md:border md:border-off-white/15 ${
          wide ? 'md:max-w-6xl' : 'md:max-w-3xl'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="hud-label text-yellow">{kicker}</p>
            <h2 id={titleId} className="display mt-1 text-5xl sm:text-6xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-11 w-11 shrink-0 place-items-center border border-off-white/20 hover:border-yellow hover:text-yellow"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
