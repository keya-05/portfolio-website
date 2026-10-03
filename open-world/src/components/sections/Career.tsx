import { useRef } from 'react';
import { experience } from '../../data/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { play } from '../../lib/sounds';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { ChipList } from '../ui/Chip';
import { MissionCard } from '../ui/MissionCard';
import { DistrictSection } from './DistrictSection';

const totalXp = experience.reduce((sum, job) => sum + job.xp, 0);

function Backdrop() {
  return (
    <>
      <span data-speed="-0.35" className="display text-outline absolute -right-10 top-24 select-none text-[clamp(8rem,22vw,22rem)]">
        Career
      </span>
      <div data-speed="0.18" className="absolute bottom-0 left-[6%] h-[55%] w-24 border border-b-0 border-off-white/[0.06] bg-off-white/[0.02]" />
      <div data-speed="0.3" className="absolute bottom-0 left-[14%] h-[38%] w-16 border border-b-0 border-off-white/[0.06] bg-off-white/[0.02]" />
      <div data-speed="0.1" className="absolute bottom-0 right-[10%] h-[48%] w-28 border border-b-0 border-off-white/[0.06] bg-off-white/[0.02]" />
    </>
  );
}

export function Career() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useScrollParallax(root);

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(root);

      // The route draws itself with scroll.
      gsap.fromTo(
        q('[data-route-fill]'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-route]')[0], start: 'top 70%', end: 'bottom 55%', scrub: true },
        },
      );

      // Each mission: "MISSION START" flashes, the waypoint lights, then the card expands in.
      q('[data-mission]').forEach((item) => {
        const card = item.querySelector('[data-mission-card]');
        const label = item.querySelector('[data-mission-start]');
        const dot = item.querySelector('[data-route-dot]');
        gsap.set(card, { opacity: 0, scale: 0.92, y: 30 });
        gsap.set(dot, { scale: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: 'top 75%', once: true } })
          .fromTo(label, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.2 })
          .to(dot, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 0)
          .to(label, { opacity: 0, duration: 0.25 }, 0.6)
          .to(card, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }, 0.35);
      });

      gsap.from(q('[data-mission-passed]'), {
        opacity: 0,
        scale: 1.2,
        duration: 0.7,
        ease: 'power4.out',
        scrollTrigger: { trigger: q('[data-mission-passed]')[0], start: 'top 82%', once: true },
        onStart: () => play('mission'),
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <DistrictSection
      ref={root}
      id="career"
      title="Previous jobs"
      intro="Every contract on the route through the Business District, oldest first."
      backdrop={<Backdrop />}
    >
      <ol data-route className="relative space-y-14 md:space-y-20">
        {/* route line */}
        <li aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-[3px] bg-off-white/10 md:left-1/2 md:-translate-x-1/2">
          <span data-route-fill className="absolute inset-0 origin-top bg-yellow" />
        </li>

        {experience.map((job, i) => {
          const headingId = `job-${job.id}`;
          const left = i % 2 === 0;
          return (
            <li key={job.id} data-mission className="relative pl-10 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
              {/* waypoint */}
              <span
                className="absolute left-0 top-9 grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-yellow bg-black md:left-1/2 md:-translate-x-1/2"
                aria-hidden="true"
              >
                <span data-route-dot className="h-2.5 w-2.5 rounded-full bg-yellow" />
              </span>

              <div className={left ? 'md:col-start-1 md:flex md:flex-col md:items-end' : 'md:col-start-2'}>
                <p data-mission-start className="hud-label mb-2 text-yellow opacity-0" aria-hidden="true">
                  ▶ Mission start
                </p>
                <MissionCard
                  data-mission-card
                  tabIndex={0}
                  aria-labelledby={headingId}
                  headingId={headingId}
                  number={String(i + 1).padStart(2, '0')}
                  title={job.alias}
                  status={job.status}
                  className="w-full outline-offset-4"
                  meta={
                    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                      <div>
                        <dt className="hud-label text-[0.65rem]">Role</dt>
                        <dd className="font-ui text-lg font-bold uppercase tracking-wide text-off-white">{job.title}</dd>
                      </div>
                      <div>
                        <dt className="hud-label text-[0.65rem]">Company</dt>
                        <dd className="font-ui text-lg font-bold uppercase tracking-wide text-off-white">{job.company}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="hud-label text-[0.65rem]">Dates</dt>
                        <dd className="font-ui text-base uppercase tracking-wide text-off-white/85">
                          {job.start} – {job.end}
                        </dd>
                      </div>
                    </dl>
                  }
                  reward={
                    <>
                      +{job.xp} XP <span className="text-off-white/70">· {job.status === 'completed' ? 'Mission complete' : 'Rewards accruing'}</span>
                    </>
                  }
                >
                  <p className="hud-label text-[0.65rem]">Objective</p>
                  <p className="mt-1 text-off-white/90">{job.objective}</p>
                  <p className="hud-label mt-4 text-[0.65rem]">Tools</p>
                  <div className="mt-2">
                    <ChipList items={job.tech} label={`Tools used at ${job.company}`} />
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer font-ui text-sm font-semibold uppercase tracking-hud text-off-white/80 hover:text-yellow">
                      Full debrief
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </details>
                </MissionCard>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Shown once, after the final job only */}
      <div data-mission-passed className="mt-20 text-center">
        <p className="display text-6xl text-yellow sm:text-8xl">Mission passed</p>
        <p className="mt-3 font-ui text-base uppercase tracking-hud text-off-white/85">
          Career route logged · +{totalXp} XP total · next stop: University Hill
        </p>
      </div>
    </DistrictSection>
  );
}
