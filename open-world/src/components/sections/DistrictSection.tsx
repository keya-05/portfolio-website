import { forwardRef, type ReactNode } from 'react';
import { districts, type DistrictId } from '../../data/content';

interface DistrictSectionProps {
  id: DistrictId;
  /** Display title, e.g. "Previous jobs". The district label stays in the kicker. */
  title: string;
  intro?: ReactNode;
  /** Decorative layers rendered behind the content (e.g. [data-speed] parallax) */
  backdrop?: ReactNode;
  children: ReactNode;
}

/** Shared frame for every district: anchor id, labelled heading, focus target for navigation. */
export const DistrictSection = forwardRef<HTMLElement, DistrictSectionProps>(function DistrictSection(
  { id, title, intro, backdrop, children },
  ref,
) {
  const index = districts.findIndex((d) => d.id === id);
  const d = districts[index];

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative overflow-hidden px-4 py-24 sm:px-8 md:py-32 lg:px-16"
    >
      {backdrop && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {backdrop}
        </div>
      )}
      <div className="relative mx-auto w-full max-w-7xl">
        <p className="hud-label text-yellow">
          District 0{index + 1} // {d.codename} // {d.label}
        </p>
        <h2 id={`${id}-heading`} tabIndex={-1} data-section-heading className="display mt-2 text-5xl sm:text-7xl lg:text-8xl">
          {title}
        </h2>
        {intro && <div className="mt-4 max-w-2xl font-body text-base text-off-white/80">{intro}</div>}
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
});
