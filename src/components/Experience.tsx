import { experience } from "@/content/experience";
import Reveal from "./motion/Reveal";

function orgInitials(org: string) {
  return org
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

// Loose decorative flourish under the heading on mobile, where the timeline
// collapses to a simple stack and there's nothing to precisely anchor to.
function HeadingDoodleMobile() {
  return (
    <svg
      viewBox="0 0 160 90"
      className="h-16 w-28 text-doodle sm:hidden"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6,10 C60,4 120,20 100,48 C88,66 60,60 60,42 C60,28 82,26 110,40 C132,51 148,62 152,72"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Layout constants (px, at the sm+ breakpoint) that the heading box, row
// boxes, and gaps below are actually rendered at. The connector line is
// computed from these same numbers, so it lands exactly on the heading and
// every circle instead of floating between them — keep them in sync with
// the classNames below (sm:h-28, sm:h-52, sm:gap-12, the mb-10 under the
// heading).
const HEAD_H = 112;
const HEAD_GAP = 40;
const ROW_H = 208;
const ROW_GAP = 48;

// One continuous hand-drawn line running from the tail of "Experience"
// through every circle's center, zigzagging left/right along the way.
function ExperienceConnector({ count }: { count: number }) {
  if (count < 1) return null;

  const totalHeight = HEAD_H + HEAD_GAP + count * ROW_H + (count - 1) * ROW_GAP;

  const points = [
    { x: 30, y: (HEAD_H / totalHeight) * 100 },
    ...Array.from({ length: count }, (_, i) => {
      const rowTop = HEAD_H + HEAD_GAP + i * (ROW_H + ROW_GAP);
      const centerY = rowTop + ROW_H / 2;
      return { x: i % 2 === 0 ? 9 : 91, y: (centerY / totalHeight) * 100 };
    }),
  ];

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C${prev.x},${midY} ${curr.x},${midY} ${curr.x},${curr.y}`;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full text-doodle/70 sm:block"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="w-full bg-taupe">
      <div className="mx-auto max-w-screen-2xl px-6 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-24">
        <div className="relative mx-auto max-w-3xl">
          <ExperienceConnector count={experience.length} />

          <Reveal className="relative z-10 mb-10 flex flex-col items-start gap-1 sm:h-28 sm:justify-center">
            <h2 className="text-balance font-script text-5xl text-ink sm:text-6xl">
              Experience
            </h2>
            <HeadingDoodleMobile />
          </Reveal>

          <div className="flex flex-col gap-10 sm:gap-12">
            {experience.map((role, i) => {
              const reversed = i % 2 === 1;
              return (
                <Reveal
                  key={role.id}
                  delay={i * 0.08}
                  className="relative z-10 sm:h-52"
                >
                  <div
                    className={`flex h-full flex-col items-center gap-5 sm:flex-row sm:gap-8 ${
                      reversed ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
                    }`}
                  >
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-2 border-wine bg-placeholder font-mono text-sm uppercase tracking-wide text-ink-3 shadow-card sm:h-52 sm:w-52">
                      {orgInitials(role.org) || "LOGO"}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 text-center sm:text-left">
                      <div
                        className={`flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3 ${
                          reversed ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        <h3 className="font-script text-3xl leading-none text-cream">
                          {role.title}
                        </h3>
                        <p className="font-serif text-lg italic text-cream/80">
                          {role.org}
                        </p>
                      </div>
                      <p className="font-mono text-xs uppercase tracking-wide text-cream/60">
                        {role.period}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
