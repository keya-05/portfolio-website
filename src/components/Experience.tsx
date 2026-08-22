import { experience } from "@/content/experience";
import Reveal from "./motion/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
      <Reveal className="mb-10 flex flex-col gap-2 text-center lg:text-left">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-wine">
          Where I&apos;ve worked
        </span>
        <h2 className="text-balance font-display text-3xl font-bold text-ink sm:text-4xl">
          Experience
        </h2>
      </Reveal>
      <div className="flex flex-col gap-6">
        {experience.map((role, i) => (
          <Reveal key={role.id} delay={i * 0.08}>
            <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-8 shadow-card sm:p-10">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {role.title}
                  </h3>
                  <p className="text-sm font-medium text-wine">{role.org}</p>
                </div>
                <p className="font-mono text-xs uppercase tracking-wide text-ink-3">
                  {role.period}
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {role.points.map((point, j) => (
                  <li
                    key={`${role.id}-point-${j}`}
                    className="flex gap-2 text-sm leading-relaxed text-ink-2"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-wine" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
