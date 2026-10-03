interface StatBarProps {
  name: string;
  level: number;
}

/**
 * Plain DOM on purpose: the parent section's GSAP timeline animates
 * [data-stat-fill] (scaleX) and [data-stat-value] (count-up).
 * The default markup is the final state, so reduced motion just shows the values.
 */
export function StatBar({ name, level }: StatBarProps) {
  return (
    <li data-stat>
      <div className="mb-1.5 flex items-baseline justify-between font-ui uppercase">
        <span className="text-base font-semibold tracking-[0.12em] text-off-white">{name}</span>
        <span className="text-sm tabular-nums text-yellow" aria-hidden="true">
          <span data-stat-value={level}>{level}</span>
          <span className="text-hud-gray">/100</span>
        </span>
        <span className="sr-only">{level} out of 100</span>
      </div>
      <div className="relative h-2.5 overflow-hidden bg-off-white/10" aria-hidden="true">
        <div
          data-stat-fill
          className="absolute inset-0 origin-left bg-yellow"
          style={{ transform: `scaleX(${level / 100})` }}
        />
        {/* segment ticks */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 calc(10% - 2px), var(--black) calc(10% - 2px) 10%)',
          }}
        />
      </div>
    </li>
  );
}
