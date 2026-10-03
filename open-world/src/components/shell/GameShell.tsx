import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { destroyLenis, initLenis, setScrollLocked } from '../../lib/lenis';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { LoadingScreen } from '../intro/LoadingScreen';
import { Campus } from '../sections/Campus';
import { Career } from '../sections/Career';
import { ClassicView } from '../sections/ClassicView';
import { Completion } from '../sections/Completion';
import { Connect } from '../sections/Connect';
import { Profile } from '../sections/Profile';
import { Projects } from '../sections/Projects';
import { BottomNav } from './BottomNav';
import { DistrictBanner } from './DistrictBanner';
import { useGame } from './GameContext';
import { HUD } from './HUD';
import { WorldMap } from './Minimap';
import { PauseMenu } from './PauseMenu';
import { Phone } from './Phone';
import { Skyline } from './Skyline';
import { TravelTip } from './TravelTip';

// Overlay content is only downloaded the first time it opens.
const MissionBriefing = lazy(() => import('../sections/MissionBriefing'));
const Transcript = lazy(() => import('../sections/Transcript'));
const CompletionScreen = lazy(() => import('../sections/CompletionScreen'));

export function GameShell() {
  const g = useGame();
  const reduced = useReducedMotion();
  const worldMounted = g.intro !== 'playing' && !g.classic;
  const playable = g.intro === 'done' && !g.classic;

  // Smooth scrolling only when motion is welcome; native scroll otherwise.
  useEffect(() => {
    if (!worldMounted || reduced) return;
    initLenis();
    ScrollTrigger.refresh();
    return destroyLenis;
  }, [worldMounted, reduced]);

  // Overlays and the intro lock the page.
  useEffect(() => {
    if (g.classic) return;
    setScrollLocked(g.overlay !== 'none' || g.intro !== 'done');
  }, [g.overlay, g.intro, g.classic]);

  // Pause menu freezes the world: every GSAP timeline halts behind the blur.
  useEffect(() => {
    if (g.overlay === 'pause') gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  }, [g.overlay]);

  const switchProject = (dir: 1 | -1) => {
    if (g.overlay === 'none' || g.overlay === 'briefing') g.cycleProject(dir);
  };

  useKeyboardShortcuts(
    {
      p: () => g.toggleOverlay('phone'),
      m: () => g.toggleOverlay('map'),
      escape: () => (g.overlay === 'none' ? g.toggleOverlay('pause') : g.closeOverlay()),
      arrowleft: () => switchProject(-1),
      arrowright: () => switchProject(1),
    },
    playable,
  );

  if (g.classic) return <ClassicView />;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {worldMounted && (
        <>
          <Skyline />
          <HUD />
          <main id="main" tabIndex={-1} className="relative z-world">
            <Profile />
            <Career />
            <Campus />
            <Projects />
            <Connect />
            <Completion />
          </main>
          <BottomNav />
          <DistrictBanner />
          <TravelTip />
          <Phone />
          <WorldMap />
          <PauseMenu />
          <AnimatePresence>
            {g.overlay === 'briefing' && (
              <Suspense key="briefing" fallback={null}>
                <MissionBriefing />
              </Suspense>
            )}
            {g.overlay === 'transcript' && (
              <Suspense key="transcript" fallback={null}>
                <Transcript />
              </Suspense>
            )}
            {g.overlay === 'completion' && (
              <Suspense key="completion" fallback={null}>
                <CompletionScreen />
              </Suspense>
            )}
          </AnimatePresence>
        </>
      )}

      {g.intro !== 'done' && <LoadingScreen />}

      <div className="grain z-grain" aria-hidden="true" />
    </>
  );
}
