import { motion } from 'framer-motion';
import { education } from '../../data/content';
import { useGame } from '../shell/GameContext';
import { Sheet } from '../ui/Sheet';

const list = { show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/** Lazy-loaded transcript overlay. Hover or focus a course to reveal its abilities. */
export default function Transcript() {
  const { closeOverlay } = useGame();

  return (
    <Sheet titleId="transcript-title" kicker="University Hill // Records" title="Transcript" closeLabel="Close transcript" onClose={closeOverlay} wide>
      <p className="font-body text-sm text-off-white/75">
        {education.program} · {education.specialization}. Hover or focus a course to see the abilities it unlocked.
      </p>
      <motion.ul variants={list} initial="hidden" animate="show" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {education.courses.map((c) => (
          <motion.li key={c.id} variants={item}>
            <article
              tabIndex={0}
              aria-labelledby={`course-${c.id}`}
              className="group panel relative h-full p-5 transition-colors hover:border-yellow/60 focus-visible:border-yellow/60"
            >
              <p className="hud-label text-[0.65rem]">{c.code}</p>
              <h3 id={`course-${c.id}`} className="mt-1 font-ui text-xl font-bold uppercase leading-tight tracking-wide text-off-white">
                {c.name}
              </h3>
              <div className="mt-3 flex items-center gap-3" aria-hidden="true">
                <div className="relative h-1.5 flex-1 overflow-hidden bg-off-white/10">
                  <div className="absolute inset-0 origin-left bg-yellow" style={{ transform: `scaleX(${c.mastery / 100})` }} />
                </div>
                <span className="font-ui text-sm tabular-nums text-yellow">{c.mastery}</span>
              </div>
              <span className="sr-only">Mastery {c.mastery} out of 100.</span>

              <div className="mt-4 transition duration-300 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus:translate-y-0 md:group-focus:opacity-100">
                <p className="hud-label text-[0.65rem] text-green">Unlocked abilities</p>
                <ul className="mt-2 space-y-1">
                  {c.abilities.map((a) => (
                    <li key={a} className="flex gap-2 text-sm text-off-white/90">
                      <span className="text-yellow" aria-hidden="true">+</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </motion.li>
        ))}
      </motion.ul>
    </Sheet>
  );
}
