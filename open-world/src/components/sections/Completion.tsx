import { completionDistricts, districts, site } from '../../data/content';
import { useGame } from '../shell/GameContext';
import { Button } from '../ui/Button';
import { CheckIcon } from '../ui/Icons';

/** End-of-world footer: progress checklist + a permanent way back to the completion screen. */
export function Completion() {
  const { setClassic, visited, completionReady, openOverlay, navigateTo } = useGame();
  const done = completionDistricts.filter((id) => visited.includes(id)).length;

  return (
    <footer className="relative px-4 pb-32 pt-16 sm:px-8 md:pb-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="hud-label text-yellow">End of map</p>
        <p className="display mx-auto mt-3 text-4xl sm:text-6xl">{site.tagline}</p>

        <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2" aria-label="Districts visited">
          {completionDistricts.map((id) => {
            const d = districts.find((x) => x.id === id)!;
            const ok = visited.includes(id);
            return (
              <li
                key={id}
                className={`flex items-center gap-1.5 border px-3 py-1.5 font-ui text-sm font-semibold uppercase tracking-hud ${
                  ok ? 'border-green/70 text-green' : 'border-off-white/20 text-off-white/70'
                }`}
              >
                {ok && <CheckIcon width={14} height={14} />}
                {d.label}
                <span className="sr-only">{ok ? '(visited)' : '(not visited yet)'}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 font-ui text-sm uppercase tracking-hud text-off-white/80">
          {completionReady ? 'All districts visited' : `${done}/${completionDistricts.length} districts visited`}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {completionReady && <Button onClick={() => openOverlay('completion')}>View results</Button>}
          <Button variant="ghost" onClick={() => navigateTo('connect')}>
            Contact KC
          </Button>
        </div>

        <p className="mt-10 font-ui text-sm uppercase tracking-hud text-off-white/70">
          © {new Date().getFullYear()} KC · Built in {site.city}, Pune ·{' '}
          <button type="button" onClick={() => setClassic(true)} className="underline underline-offset-4 hover:text-yellow">
            Classic view
          </button>
        </p>
      </div>
    </footer>
  );
}
