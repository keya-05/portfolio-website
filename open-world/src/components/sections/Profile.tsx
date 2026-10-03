import { useEffect, useRef, useState } from 'react';
import { education, profile, site, skills } from '../../data/content';
import { revealStatBars } from '../../lib/animations';
import { gsap, useGSAP } from '../../lib/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useGame } from '../shell/GameContext';
import { DossierButton } from '../ui/DossierButton';
import { StatBar } from '../ui/StatBar';
import { useToast } from '../ui/Toast';

/** Original placeholder silhouette, used until /public/profile.png exists. */
function Silhouette() {
  return (
    <svg viewBox="0 0 400 500" className="h-full w-auto" aria-hidden="true">
      <defs>
        <linearGradient id="rim" x1="0" x2="1">
          <stop offset="0" stopColor="var(--yellow)" />
          <stop offset="1" stopColor="var(--orange)" />
        </linearGradient>
      </defs>
      <path
        d="M200 70c48 0 80 36 80 86 0 34-14 62-34 78l-4 22c62 14 118 48 138 104l20 140H0l20-140c20-56 76-90 138-104l-4-22c-20-16-34-44-34-78 0-50 32-86 80-86Z"
        fill="#0d0c10"
        stroke="url(#rim)"
        strokeWidth="3"
      />
    </svg>
  );
}

function Character() {
  const [failed, setFailed] = useState(false);
  if (failed) return <Silhouette />;
  return (
    <img
      src={profile.photo}
      alt={`${profile.fullName}, alias ${profile.alias}`}
      width={520}
      height={650}
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,.6)]"
    />
  );
}

export function Profile() {
  const { intro } = useGame();
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const notify = useToast();
  const root = useRef<HTMLElement>(null);
  const joined = useRef(false);
  const ready = intro === 'done';
  // True from the moment the camera dive starts; the reveal is timed to land as the intro fades.
  const started = intro !== 'playing';
  const entryDelay = useRef(intro === 'entering' ? 0.85 : 0.05);

  // Entry choreography — GSAP owns every [data-entry], [data-reveal] and stat element.
  useGSAP(
    () => {
      if (!started || reduced) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ delay: entryDelay.current })
        .from(q('[data-entry="bg"]'), { opacity: 0, scale: 1.08, duration: 1.2 }, 0)
        .from(q('[data-entry="char"]'), { opacity: 0, y: 60, duration: 1 }, 0.1)
        .from(q('[data-entry="fg"]'), { opacity: 0, scale: 0.94, duration: 0.8 }, 0.35)
        .from(q('[data-reveal]'), { opacity: 0, y: 24, stagger: 0.06, duration: 0.7 }, 0.2);

      revealStatBars(root.current!, q('[data-stats]')[0]);
    },
    { scope: root, dependencies: [started, reduced] },
  );

  // Mouse parallax: background ±3px, character ±8px, foreground ±15px.
  useGSAP(
    () => {
      const section = root.current;
      if (!section || reduced || !finePointer) return;
      const q = gsap.utils.selector(section);
      const layers = (
        [
          ['bg', 3],
          ['char', 8],
          ['fg', 15],
        ] as const
      ).map(([depth, amount]) => {
        const el = q(`[data-depth="${depth}"]`);
        return {
          amount,
          x: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' }),
        };
      });

      const onMove = (e: PointerEvent) => {
        const r = section.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        layers.forEach((l) => {
          l.x(nx * l.amount);
          l.y(ny * l.amount);
        });
      };
      const onLeave = () => layers.forEach((l) => (l.x(0), l.y(0)));

      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
      return () => {
        section.removeEventListener('pointermove', onMove);
        section.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: root, dependencies: [reduced, finePointer], revertOnUpdate: true },
  );

  // Achievement toast on entry (once per mount).
  useEffect(() => {
    if (!ready || joined.current) return;
    joined.current = true;
    const id = window.setTimeout(() => notify({ title: 'Player 1 joined', subtitle: `Welcome to ${site.city}` }), 900);
    return () => window.clearTimeout(id);
  }, [ready, notify]);

  return (
    <section
      ref={root}
      id="profile"
      aria-labelledby="profile-heading"
      className="relative flex min-h-screen items-center px-4 pb-28 pt-24 sm:px-8 md:pb-24 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* ---------- character stage ---------- */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] sm:max-w-[400px] lg:mr-0 lg:max-w-[460px]">
          <div data-entry="bg" className="absolute inset-0">
            <div data-depth="bg" className="absolute -inset-[4%]">
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at 50% 62%, rgba(246,215,67,.28) 0%, rgba(232,93,117,.12) 38%, transparent 66%)' }}
              />
              <span
                className="display text-outline absolute inset-x-0 top-[6%] select-none text-center text-[clamp(10rem,38vw,20rem)]"
                aria-hidden="true"
              >
                {profile.alias}
              </span>
              <div
                className="absolute inset-x-[12%] bottom-[8%] h-[38%] opacity-30"
                style={{ background: 'repeating-linear-gradient(135deg, var(--yellow) 0 2px, transparent 2px 14px)' }}
              />
            </div>
          </div>

          <div data-entry="char" className="absolute inset-0">
            <div data-depth="char" className="absolute inset-0 flex items-end justify-center">
              <Character />
            </div>
          </div>

          <div data-entry="fg" className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div data-depth="fg" className="absolute inset-0">
              {/* targeting brackets */}
              <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-yellow" />
              <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-yellow" />
              <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-yellow" />
              <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-yellow" />
              <span className="absolute left-3 top-10 bg-yellow px-2 py-0.5 font-ui text-xs font-bold uppercase tracking-hud text-black">
                P1 · {profile.alias}
              </span>
              <span className="absolute bottom-4 right-3 bg-black/85 px-2 py-1 font-ui text-xs font-semibold uppercase tracking-hud text-off-white">
                {education.status} · CGPA {education.cgpa.split('/')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* ---------- player info ---------- */}
        <div className="panel relative p-6 sm:p-8">
          <span className="absolute left-0 top-0 h-1 w-24 bg-yellow" aria-hidden="true" />
          <p data-reveal className="hud-label text-yellow">
            Player profile // Character select
          </p>
          <h1 id="profile-heading" tabIndex={-1} data-section-heading data-reveal className="mt-3">
            <span className="display block text-7xl text-off-white sm:text-8xl">{profile.alias}</span>
            <span className="mt-1 block font-ui text-xl font-semibold uppercase tracking-[0.18em] text-off-white/80">
              {profile.fullName} · {profile.title}
            </span>
          </h1>

          <ul data-reveal className="mt-4 space-y-1 border-l-2 border-yellow/60 pl-3">
            {profile.roleLines.map((line) => (
              <li key={line} className="font-ui text-lg uppercase tracking-[0.08em] text-off-white">
                {line}
              </li>
            ))}
          </ul>

          <dl data-reveal className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Base', profile.location],
              ['Guild', education.university],
              ['Class', education.school],
              ['CGPA', education.cgpa],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="hud-label text-[0.65rem]">{k}</dt>
                <dd className="font-ui text-base font-semibold uppercase tracking-wide text-off-white">{v}</dd>
              </div>
            ))}
          </dl>

          <h2 data-reveal className="hud-label mt-8 text-off-white">
            Current loadout
          </h2>
          <ul data-stats className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-x-8">
            {skills.map((s) => (
              <StatBar key={s.name} name={s.name} level={s.level} />
            ))}
          </ul>

          <div data-reveal className="mt-8">
            <DossierButton />
          </div>

          <p data-reveal className="hud-label mt-6 text-[0.65rem]">
            {site.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
