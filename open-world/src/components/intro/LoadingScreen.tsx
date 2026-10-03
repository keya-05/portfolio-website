import { useEffect, useRef, useState } from 'react';
import { profile, site } from '../../data/content';
import { gsap, useGSAP } from '../../lib/gsap';
import { play } from '../../lib/sounds';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SoundToggle } from '../shell/HUD';
import { SkylineArt } from '../shell/Skyline';
import { useGame } from '../shell/GameContext';

const LOADING_TEXT = 'LOADING KC';

/**
 * Boot sequence (~3s): black → grain → typed "LOADING KC_" → skyline push-in
 * → player card → pulsing CTA. Clicking dives the camera into the city while
 * the portfolio mounts underneath.
 */
export function LoadingScreen() {
  const { intro, setIntro, skipIntro } = useGame();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLButtonElement>(null);
  const bootTl = useRef<gsap.core.Timeline | null>(null);
  const [ready, setReady] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ onComplete: () => setReady(true) });
      bootTl.current = tl;

      if (reduced) {
        // Opacity-only, no camera moves.
        tl.set(q('[data-char]'), { opacity: 1 })
          .to(q('[data-intro-sky]'), { opacity: 1, duration: 0.4 })
          .to(q('[data-card-line]'), { opacity: 1, duration: 0.3 })
          .to(q('[data-cta]'), { opacity: 1, duration: 0.3 });
        return;
      }

      tl.to(q('[data-intro-grain]'), { opacity: 0.07, duration: 0.3 }, 0.1)
        .to(q('[data-char]'), { opacity: 1, duration: 0.01, stagger: 0.07 }, 0.3)
        .fromTo(
          q('[data-intro-sky]'),
          { opacity: 0, scale: 1 },
          { opacity: 1, scale: 1.06, duration: 1.6, ease: 'power1.out' },
          1.05,
        )
        .to(q('[data-loading]'), { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' }, 1.75)
        .fromTo(
          q('[data-card-line]'),
          { opacity: 0, x: -32 },
          { opacity: 1, x: 0, stagger: 0.08, duration: 0.6 },
          1.85,
        )
        .fromTo(q('[data-cta]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 2.65)
        // Slow idle push-in while the player waits (not part of the 3s budget).
        .add(() => {
          gsap.to(q('[data-intro-sky]'), { scale: 1.14, duration: 10, ease: 'none' });
        });
    },
    { scope: root, dependencies: [reduced] },
  );

  useEffect(() => {
    if (ready) cta.current?.focus({ preventScroll: true });
  }, [ready]);

  const start = contextSafe(() => {
    if (intro !== 'playing') return;
    if (!ready) {
      // First click fast-forwards the boot sequence.
      bootTl.current?.progress(1);
      return;
    }
    play('bass');
    setIntro('entering'); // portfolio mounts underneath

    const q = gsap.utils.selector(root);
    gsap.killTweensOf(q('[data-intro-sky]'));
    const done = () => setIntro('done');

    if (reduced) {
      gsap.to(root.current, { opacity: 0, duration: 0.4, onComplete: done });
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to(q('[data-card], [data-cta]'), { opacity: 0, y: 24, duration: 0.3, ease: 'power2.in' }, 0)
      .to(q('[data-letterbox]'), { scaleY: 0, duration: 0.5, ease: 'power2.in' }, 0)
      .to(q('[data-intro-sky]'), { scale: 2.8, duration: 1.05, ease: 'power3.in', transformOrigin: '50% 74%' }, 0)
      .to(q('[data-flash]'), { opacity: 0.35, duration: 0.15 }, 0.78)
      .to(root.current, { opacity: 0, duration: 0.45, ease: 'power1.out' }, 0.88);
  });

  const skip = contextSafe(() => {
    bootTl.current?.kill();
    skipIntro();
  });

  return (
    <div
      ref={root}
      className="fixed inset-0 z-intro overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={`${site.name} intro`}
      onClick={start}
    >
      {/* skyline (camera) */}
      <div data-intro-sky className="absolute inset-0 opacity-0 will-change-transform">
        <SkylineArt />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, transparent 35%, rgba(9,9,9,.85) 100%)' }}
          aria-hidden="true"
        />
      </div>

      {/* letterbox bars */}
      <div data-letterbox className="absolute inset-x-0 top-0 h-[7vh] origin-top bg-black" aria-hidden="true" />
      <div data-letterbox className="absolute inset-x-0 bottom-0 h-[7vh] origin-bottom bg-black" aria-hidden="true" />

      {/* intro grain (slightly stronger than the global layer) */}
      <div data-intro-grain className="grain opacity-0" aria-hidden="true" style={{ position: 'absolute' }} />

      {/* typed loading text */}
      <div className="absolute inset-0 grid place-items-center">
      <p data-loading className="font-ui text-2xl font-semibold tracking-[0.3em] text-off-white sm:text-3xl" aria-label="Loading KC">
        {LOADING_TEXT.split('').map((c, i) => (
          <span key={i} data-char className="opacity-0" aria-hidden="true">
            {c === ' ' ? ' ' : c}
          </span>
        ))}
        <span className="animate-blink text-yellow" aria-hidden="true">
          _
        </span>
      </p>
      </div>

      {/* player card */}
      <div data-card className="absolute bottom-[14vh] left-4 right-4 max-w-md sm:left-10 md:left-16">
        <p data-card-line className="hud-label text-yellow opacity-0">
          Player 01 // {site.city}
        </p>
        <p data-card-line className="display mt-1 text-[clamp(5rem,18vw,9rem)] text-off-white opacity-0">
          {profile.alias}
        </p>
        <p data-card-line className="font-ui text-2xl font-bold uppercase tracking-[0.2em] text-yellow opacity-0">
          {profile.title}
        </p>
        <ul className="mt-3 space-y-0.5">
          {profile.roleLines.map((line) => (
            <li key={line} data-card-line className="font-ui text-base uppercase tracking-[0.12em] text-off-white/85 opacity-0">
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="absolute inset-x-0 bottom-[5vh] flex justify-center">
      <button
        ref={cta}
        data-cta
        type="button"
        disabled={!ready}
        onClick={(e) => {
          e.stopPropagation();
          start();
        }}
        className="min-h-[48px] whitespace-nowrap px-4 font-ui text-lg font-bold uppercase tracking-[0.35em] text-off-white opacity-0 sm:text-xl"
      >
        <span className={ready ? 'animate-pulse-soft' : ''}>[ Click to start ]</span>
      </button>
      </div>

      {/* chrome: sound + skip (always reachable) */}
      {intro === 'playing' && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
          <SoundToggle />
          <button
            type="button"
            onClick={skip}
            className="min-h-[40px] border border-off-white/25 bg-black/50 px-4 font-ui text-sm font-bold uppercase tracking-hud text-off-white transition-colors hover:border-yellow hover:text-yellow"
          >
            Skip ›
          </button>
        </div>
      )}

      <div data-flash className="pointer-events-none absolute inset-0 bg-off-white opacity-0" aria-hidden="true" />
    </div>
  );
}
