import { useEffect, useRef, useState, type RefObject } from 'react';
import { education } from '../../data/content';
import { revealStatBars } from '../../lib/animations';
import { gsap, useGSAP } from '../../lib/gsap';
import { play } from '../../lib/sounds';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useGame } from '../shell/GameContext';
import { Button } from '../ui/Button';
import { DistrictIcon, DossierIcon } from '../ui/Icons';
import { StatBar } from '../ui/StatBar';
import { useToast } from '../ui/Toast';
import { DistrictSection } from './DistrictSection';

/** Original stylised plan of University Hill. */
function CampusMapArt() {
  return (
    <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <rect width="100" height="75" fill="#101010" />
      {/* hill contours */}
      {[34, 27, 20, 13].map((r, i) => (
        <ellipse key={r} cx="60" cy="40" rx={r * 1.4} ry={r} fill="none" stroke={`rgba(105,184,107,${0.08 + i * 0.04})`} strokeWidth="0.6" />
      ))}
      {/* paths */}
      <path d="M0 62Q30 58 44 48T60 40M60 40Q72 30 100 26M60 40L64 75" stroke="rgba(155,155,155,.45)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* faculty blocks */}
      {[
        [48, 30, 8, 5],
        [66, 46, 9, 6],
        [40, 44, 6, 4],
        [72, 32, 6, 4],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="rgba(242,240,232,.12)" stroke="rgba(242,240,232,.25)" strokeWidth="0.3" />
      ))}
      {/* trees */}
      {[
        [20, 20], [26, 14], [14, 30], [84, 58], [90, 50], [80, 64], [30, 66], [12, 52],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" fill="rgba(105,184,107,.35)" />
      ))}
      <text x="4" y="8" fill="rgba(155,155,155,.8)" fontSize="3" fontFamily="Barlow Condensed, sans-serif" letterSpacing="0.6">
        UNIVERSITY HILL
      </text>
    </svg>
  );
}

function EducationCard({ headingRef }: { headingRef: RefObject<HTMLHeadingElement> }) {
  const [score, max] = education.cgpa.split('/');
  return (
    <article data-edu-card className="panel relative p-6 sm:p-8" aria-labelledby="edu-heading">
      <span className="absolute left-0 top-0 h-1 w-24 bg-yellow" aria-hidden="true" />
      <p className="hud-label text-green">Training facility // Unlocked</p>
      <h3 id="edu-heading" ref={headingRef} tabIndex={-1} className="display mt-2 text-4xl sm:text-5xl">
        {education.university}
      </h3>
      <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {[
          ['School', education.school],
          ['Program', education.program],
          ['Specialization', education.specialization],
          ['Status', education.status],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="hud-label text-[0.65rem]">{k}</dt>
            <dd className="font-ui text-lg font-semibold uppercase tracking-wide text-off-white">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex items-end gap-4 border-t border-off-white/10 pt-6">
        <div>
          <p className="hud-label">Academic score</p>
          <p className="display mt-1 text-7xl text-yellow sm:text-8xl">
            {score}
            <span className="ml-1 font-ui text-2xl font-semibold text-off-white/70">/{max}</span>
          </p>
        </div>
        <p className="mb-3 font-ui text-sm uppercase tracking-hud text-off-white/70">CGPA</p>
      </div>
    </article>
  );
}

export function Campus() {
  const root = useRef<HTMLElement>(null);
  const cardHeading = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();
  const { visited, openOverlay } = useGame();
  const notify = useToast();
  const toasted = useRef(false);
  useScrollParallax(root);

  // Loadout bars fill when they scroll into view.
  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const list = root.current.querySelector('[data-academic-loadout]');
      if (list) revealStatBars(list, list);
    },
    { scope: root, dependencies: [reduced] },
  );

  // Camera zoom into the marker, then swap the map for the education card.
  const { contextSafe } = useGSAP({ scope: root });
  const enterCampus = contextSafe(() => {
    play('open');
    if (reduced) {
      setRevealed(true);
      return;
    }
    const { x, y } = education.marker;
    gsap
      .timeline({ onComplete: () => setRevealed(true) })
      .to('[data-campus-camera]', { scale: 2.8, transformOrigin: `${x}% ${y}%`, duration: 0.75, ease: 'power2.in' })
      .to('[data-campus-camera]', { opacity: 0, duration: 0.3 }, '-=0.3');
  });

  useGSAP(
    () => {
      if (!revealed || reduced) return;
      gsap.from('[data-edu-card]', { opacity: 0, y: 30, scale: 0.96, duration: 0.55, ease: 'power3.out' });
    },
    { scope: root, dependencies: [revealed, reduced] },
  );

  useEffect(() => {
    if (revealed) cardHeading.current?.focus({ preventScroll: true });
  }, [revealed]);

  // Achievement on first visit.
  useEffect(() => {
    if (toasted.current || !visited.includes('campus')) return;
    toasted.current = true;
    notify({ title: 'Enrolled', subtitle: `Discovered ${education.university}` });
  }, [visited, notify]);

  return (
    <DistrictSection
      ref={root}
      id="campus"
      title="Training"
      intro="The academy on University Hill. Select the marker to enter the campus."
      backdrop={
        <span data-speed="-0.3" className="display text-outline absolute -left-8 bottom-10 select-none text-[clamp(8rem,22vw,22rem)]">
          Campus
        </span>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        {/* map → card slot */}
        <div>
          {revealed ? (
            <EducationCard headingRef={cardHeading} />
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-off-white/15">
              <div data-campus-camera className="relative aspect-[4/3] will-change-transform">
                <CampusMapArt />
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${education.marker.x}%`, top: `${education.marker.y}%` }}
                >
                  <span className="animate-pulse-few absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow/20" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={enterCampus}
                    aria-label={`Enter ${education.university} campus`}
                    className="relative flex flex-col items-center gap-1"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-black bg-yellow text-black shadow-lg shadow-black/50">
                      <DistrictIcon id="campus" width={24} height={24} />
                    </span>
                    <span className="whitespace-nowrap bg-black/90 px-2 py-0.5 font-ui text-xs font-bold uppercase tracking-hud text-off-white">
                      {education.university}
                    </span>
                  </button>
                </div>
              </div>
              <p className="hud-label absolute bottom-3 left-3 text-[0.65rem] text-off-white/80">Select marker · Enter</p>
            </div>
          )}
        </div>

        {/* loadout */}
        <div className="panel p-6 sm:p-8">
          <h3 className="hud-label text-off-white">Academic loadout</h3>
          <ul data-academic-loadout className="mt-5 space-y-4">
            {education.academicLoadout.map((s) => (
              <StatBar key={s.name} name={s.name} level={s.level} />
            ))}
          </ul>
          <Button className="mt-8" variant="ghost" icon={<DossierIcon width={18} height={18} />} onClick={() => openOverlay('transcript')}>
            View transcript
          </Button>
        </div>
      </div>
    </DistrictSection>
  );
}
