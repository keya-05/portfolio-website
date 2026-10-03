import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ------------------------------------------------------------------ */
/* Procedural skyline art: deterministic, a few KB, zero image assets.  */
/* ------------------------------------------------------------------ */

const W = 1440;
const H = 400;

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

interface LayerOpts {
  seed: number;
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
  gap: number;
  windows?: number; // probability a window is lit
}

function buildLayer({ seed, minW, maxW, minH, maxH, gap, windows = 0 }: LayerOpts) {
  const r = rng(seed);
  let x = -10;
  let body = '';
  let lit = '';
  const tops: { x: number; y: number; w: number }[] = [];
  while (x < W + 10) {
    const w = Math.round(minW + r() * (maxW - minW));
    const h = Math.round(minH + r() * (maxH - minH));
    const top = H - h;
    body += `M${x} ${H}V${top}H${x + w}V${H}Z`;
    if (r() > 0.7) {
      // stepped crown
      const cw = Math.round(w * 0.45);
      const cx = x + Math.round((w - cw) / 2);
      body += `M${cx} ${top}V${top - Math.round(h * 0.1)}H${cx + cw}V${top}Z`;
    }
    if (windows > 0) {
      for (let wy = top + 10; wy < H - 12; wy += 12) {
        for (let wx = x + 5; wx < x + w - 7; wx += 9) {
          if (r() < windows) lit += `M${wx} ${wy}h4v6h-4z`;
        }
      }
    }
    tops.push({ x, y: top, w });
    x += w + Math.round(r() * gap);
  }
  return { body, lit, tops };
}

function palm(x: number, h: number) {
  const top = H - h;
  const trunk = `M${x} ${H}Q${x + 10} ${H - h * 0.5} ${x + 4} ${top}`;
  const fronds = [
    [-34, 14],
    [-22, 22],
    [26, 18],
    [36, 10],
    [4, -16],
    [-12, -8],
  ]
    .map(([dx, dy]) => `M${x + 4} ${top}q${dx * 0.5} ${-12 + dy * 0.2} ${dx} ${dy}`)
    .join('');
  return trunk + fronds;
}

const FAR = buildLayer({ seed: 7, minW: 40, maxW: 90, minH: 120, maxH: 260, gap: 6 });
const MID = buildLayer({ seed: 21, minW: 50, maxW: 110, minH: 80, maxH: 210, gap: 14, windows: 0.06 });
const NEAR = buildLayer({ seed: 42, minW: 70, maxW: 150, minH: 40, maxH: 150, gap: 40, windows: 0.12 });
const PALMS = [90, 420, 470, 860, 1210, 1260].map((x, i) => palm(x, 120 + (i % 3) * 22)).join('');
const TOWER = MID.tops[Math.floor(MID.tops.length * 0.62)];

function Layer({
  name,
  color,
  height,
  children,
}: {
  name: 'far' | 'mid' | 'near';
  color: string;
  height: string;
  children: ReactNode;
}) {
  // A solid block hangs below each layer so upward parallax never reveals a gap.
  return (
    <div data-layer={name} className="absolute inset-x-0 bottom-[-25vh] flex flex-col will-change-transform">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="block w-full"
        style={{ height }}
        aria-hidden="true"
        focusable="false"
      >
        {children}
      </svg>
      <div style={{ height: '25vh', background: color }} />
    </div>
  );
}

/** The skyline art itself — shared by the background and the intro. */
export function SkylineArt() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0b0a14 0%, #1c1330 22%, #4b2346 42%, var(--sunset-pink) 60%, var(--orange) 76%, var(--yellow) 92%)',
        }}
      />
      {/* sun + glow */}
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2">
      <div data-sun className="relative will-change-transform">
        <div
          className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(246,215,67,.55) 0%, rgba(244,122,56,.18) 40%, transparent 68%)' }}
        />
        <div
          className="relative h-[34vmin] w-[34vmin] rounded-full"
          style={{ background: 'linear-gradient(180deg, #FFF1A8 0%, var(--yellow) 45%, var(--orange) 100%)' }}
        />
      </div>
      </div>
      {/* haze bands */}
      <div
        className="absolute inset-x-0 top-[52%] h-[20%] opacity-40"
        style={{ background: 'repeating-linear-gradient(180deg, transparent 0 14px, rgba(232,93,117,.35) 14px 16px)' }}
      />

      <Layer name="far" color="#3a1d3c" height="62vh">
        <path d={FAR.body} fill="#3a1d3c" />
      </Layer>

      <Layer name="mid" color="#1f1224" height="50vh">
        <path d={MID.body} fill="#1f1224" />
        <path d={MID.lit} fill="var(--orange)" opacity="0.35" />
        {TOWER && (
          <g>
            <path
              d={`M${TOWER.x + TOWER.w / 2} ${TOWER.y}V${TOWER.y - 90}`}
              stroke="#1f1224"
              strokeWidth="4"
            />
            <circle className="animate-pulse-soft" cx={TOWER.x + TOWER.w / 2} cy={TOWER.y - 92} r="4" fill="var(--danger)" />
          </g>
        )}
      </Layer>

      <Layer name="near" color="#0a090c" height="40vh">
        <path d={NEAR.body} fill="#0a090c" />
        <path d={NEAR.lit} fill="var(--yellow)" opacity="0.5" />
        <path d={PALMS} stroke="#0a090c" strokeWidth="7" strokeLinecap="round" fill="none" />
      </Layer>

      {/* dusk: darkens as the player progresses through the city */}
      <div data-dusk className="absolute inset-0 bg-black opacity-0" />
    </div>
  );
}

/** Fixed background: scroll-scrubbed sunset → dusk with layered parallax. */
export function Skyline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set('[data-dusk]', { opacity: 0.55 });
        return;
      }
      const vh = () => window.innerHeight;
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to('[data-sun]', { y: () => vh() * 0.35 }, 0)
        .to('[data-layer="far"]', { y: () => -vh() * 0.04 }, 0)
        .to('[data-layer="mid"]', { y: () => -vh() * 0.1 }, 0)
        .to('[data-layer="near"]', { y: () => -vh() * 0.2 }, 0)
        .to('[data-dusk]', { opacity: 0.82 }, 0);
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="fixed inset-0 z-sky">
      <SkylineArt />
    </div>
  );
}
