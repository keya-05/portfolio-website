import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  completionDistricts,
  districts,
  loadingTips,
  projects,
  secretMission,
  type DistrictId,
  type Project,
  type ProjectFilter,
} from '../../data/content';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import { scrollToSection, setScrollLocked } from '../../lib/lenis';
import { play, setMuted as setHowlerMuted } from '../../lib/sounds';

export type Overlay = 'none' | 'phone' | 'map' | 'pause' | 'briefing' | 'transcript' | 'completion';
export type IntroState = 'playing' | 'entering' | 'done';

/** Every project that can appear on the board; the secret one is last. */
export const ALL_PROJECTS: Project[] = [...projects, secretMission];
export const SECRET_INDEX = ALL_PROJECTS.length - 1;

const INTRO_KEY = 'kc:intro-skipped';
const CLASSIC_KEY = 'kc:classic-view';
const SECTION_IDS = districts.map((d) => d.id);
const districtIndex = (id: DistrictId) => SECTION_IDS.indexOf(id);
/** A district counts as visited after the player lingers this long (not while flying past). */
const VISIT_DWELL_MS = 700;
const TIP_MS = 1400;

function readStorage(store: () => Storage, key: string) {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(store: () => Storage, key: string, value: string | null) {
  try {
    if (value === null) store().removeItem(key);
    else store().setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — non-critical */
  }
}

interface GameContextValue {
  overlay: Overlay;
  openOverlay: (o: Exclude<Overlay, 'none'>) => void;
  toggleOverlay: (o: Exclude<Overlay, 'none'>) => void;
  closeOverlay: () => void;
  muted: boolean;
  toggleMuted: () => void;
  classic: boolean;
  setClassic: (v: boolean) => void;
  intro: IntroState;
  setIntro: (s: IntroState) => void;
  skipIntro: () => void;
  replayIntro: () => void;
  activeSection: DistrictId;
  progress: number;
  /** District being travelled to via Phone/Map (null when the player scrolls freely) */
  traveling: DistrictId | null;
  navigateTo: (id: DistrictId) => void;
  tip: string | null;
  dismissTip: () => void;
  visited: DistrictId[];
  completionReady: boolean;
  resetProgress: () => void;
  // projects
  projectIndex: number;
  filter: ProjectFilter;
  setFilter: (f: ProjectFilter) => void;
  isOnBoard: (index: number) => boolean;
  matchesFilter: (index: number) => boolean;
  cycleProject: (dir: 1 | -1) => void;
  openBriefing: (index: number) => void;
  discovered: string[];
  markDiscovered: (id: string) => void;
  secretUnlocked: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [muted, setMuted] = useState(true);
  const [classic, setClassicState] = useState(() => readStorage(() => localStorage, CLASSIC_KEY) === '1');
  const [intro, setIntro] = useState<IntroState>(() =>
    readStorage(() => sessionStorage, INTRO_KEY) === '1' ? 'done' : 'playing',
  );
  const [projectIndex, setProjectIndex] = useState(0);
  const [filter, setFilterState] = useState<ProjectFilter>('All');
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [visited, setVisited] = useState<DistrictId[]>([]);
  const [traveling, setTraveling] = useState<DistrictId | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [completionShown, setCompletionShown] = useState(false);

  const travelTimer = useRef<number>();
  const tipTimer = useRef<number>();
  const tipCursor = useRef(0);

  const { active: activeRaw, progress } = useSectionProgress(SECTION_IDS, intro !== 'playing' && !classic);
  const active = activeRaw as DistrictId;
  const activeRef = useRef(active);
  activeRef.current = active;

  // ---------- overlays ----------
  const openOverlay = useCallback((o: Exclude<Overlay, 'none'>) => {
    play('open');
    setOverlay(o);
  }, []);

  const toggleOverlay = useCallback(
    (o: Exclude<Overlay, 'none'>) => {
      const next = overlay === o ? 'none' : o;
      play(next === 'none' ? 'close' : 'open');
      setOverlay(next);
    },
    [overlay],
  );

  const closeOverlay = useCallback(() => {
    if (overlay !== 'none') play('close');
    setOverlay('none');
  }, [overlay]);

  const toggleMuted = useCallback(() => {
    const next = !muted;
    setHowlerMuted(next);
    if (!next) play('click');
    setMuted(next);
  }, [muted]);

  const setClassic = useCallback((v: boolean) => {
    setClassicState(v);
    setOverlay('none');
    setScrollLocked(false);
    writeStorage(() => localStorage, CLASSIC_KEY, v ? '1' : null);
    window.scrollTo(0, 0);
  }, []);

  const skipIntro = useCallback(() => {
    writeStorage(() => sessionStorage, INTRO_KEY, '1');
    setIntro('done');
  }, []);

  const replayIntro = useCallback(() => {
    writeStorage(() => sessionStorage, INTRO_KEY, null);
    setOverlay('none');
    setScrollLocked(false);
    window.scrollTo(0, 0);
    setIntro('playing');
  }, []);

  // ---------- travel ----------
  const dismissTip = useCallback(() => {
    window.clearTimeout(tipTimer.current);
    setTip(null);
  }, []);

  const showTip = useCallback(() => {
    setTip(loadingTips[tipCursor.current++ % loadingTips.length]);
    window.clearTimeout(tipTimer.current);
    tipTimer.current = window.setTimeout(() => setTip(null), TIP_MS);
  }, []);

  const navigateTo = useCallback(
    (id: DistrictId) => {
      setOverlay('none');
      // Unlock synchronously: restarting Lenis later would cancel the scroll in flight.
      setScrollLocked(false);
      play('click');
      setTraveling(id);
      if (Math.abs(districtIndex(id) - districtIndex(activeRef.current)) >= 2) showTip();

      const arrive = () => {
        window.clearTimeout(travelTimer.current);
        setTraveling(null);
      };
      // Safety net: if the user interrupts the scroll, onComplete never fires.
      window.clearTimeout(travelTimer.current);
      travelTimer.current = window.setTimeout(arrive, 2400);
      requestAnimationFrame(() => scrollToSection(id, arrive));
    },
    [showTip],
  );

  useEffect(
    () => () => {
      window.clearTimeout(travelTimer.current);
      window.clearTimeout(tipTimer.current);
    },
    [],
  );

  // ---------- progress ----------
  useEffect(() => {
    if (intro !== 'done' || classic || traveling) return;
    const t = window.setTimeout(
      () => setVisited((v) => (v.includes(active) ? v : [...v, active])),
      VISIT_DWELL_MS,
    );
    return () => window.clearTimeout(t);
  }, [active, traveling, intro, classic]);

  const completionReady = completionDistricts.every((id) => visited.includes(id));

  // Show the completion screen once, when nothing else is on screen. It is always dismissible.
  useEffect(() => {
    if (!completionReady || completionShown || overlay !== 'none' || traveling || classic) return;
    const t = window.setTimeout(() => {
      setCompletionShown(true);
      play('mission');
      setOverlay('completion');
    }, 1500);
    return () => window.clearTimeout(t);
  }, [completionReady, completionShown, overlay, traveling, classic]);

  // ---------- projects ----------
  const secretUnlocked = projects.every((p) => discovered.includes(p.id));

  const isOnBoard = useCallback((i: number) => i !== SECRET_INDEX || secretUnlocked, [secretUnlocked]);
  const matchesFilter = useCallback(
    (i: number) => isOnBoard(i) && (filter === 'All' || ALL_PROJECTS[i].type === filter),
    [filter, isOnBoard],
  );

  const setFilter = useCallback((f: ProjectFilter) => {
    play('click');
    setFilterState(f);
  }, []);

  const cycleProject = useCallback(
    (dir: 1 | -1) => {
      const list = ALL_PROJECTS.map((_, i) => i).filter(matchesFilter);
      if (list.length === 0) return;
      const pos = list.indexOf(projectIndex);
      const next = pos === -1 ? list[0] : list[(pos + dir + list.length) % list.length];
      if (next !== projectIndex) play('click');
      setProjectIndex(next);
    },
    [matchesFilter, projectIndex],
  );

  const openBriefing = useCallback((index: number) => {
    setProjectIndex(index);
    play('open');
    setOverlay('briefing');
  }, []);

  const markDiscovered = useCallback((id: string) => {
    setDiscovered((d) => (d.includes(id) ? d : [...d, id]));
  }, []);

  const resetProgress = useCallback(() => {
    setVisited([]);
    setDiscovered([]);
    setCompletionShown(false);
    setFilterState('All');
    setProjectIndex(0);
    setOverlay('none');
    setScrollLocked(false);
    play('click');
    requestAnimationFrame(() => scrollToSection('profile'));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      overlay,
      openOverlay,
      toggleOverlay,
      closeOverlay,
      muted,
      toggleMuted,
      classic,
      setClassic,
      intro,
      setIntro,
      skipIntro,
      replayIntro,
      activeSection: active,
      progress,
      traveling,
      navigateTo,
      tip,
      dismissTip,
      visited,
      completionReady,
      resetProgress,
      projectIndex,
      filter,
      setFilter,
      isOnBoard,
      matchesFilter,
      cycleProject,
      openBriefing,
      discovered,
      markDiscovered,
      secretUnlocked,
    }),
    [
      overlay, openOverlay, toggleOverlay, closeOverlay, muted, toggleMuted, classic, setClassic, intro, skipIntro,
      replayIntro, active, progress, traveling, navigateTo, tip, dismissTip, visited, completionReady, resetProgress,
      projectIndex, filter, setFilter, isOnBoard, matchesFilter, cycleProject, openBriefing, discovered, markDiscovered,
      secretUnlocked,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
