"use client";

import { useEffect, useMemo, useState } from "react";

type Bubble = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

const BUBBLE_COUNT = 16;

export default function Bubbles() {
  const [mounted, setMounted] = useState(false);

  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: BUBBLE_COUNT }, () => ({
        left: Math.random() * 100,
        size: 6 + Math.random() * 26,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 26,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.25 + Math.random() * 0.35,
      })),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden motion-reduce:hidden"
    >
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={
            {
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              "--bubble-drift": `${b.drift}px`,
              "--bubble-opacity": b.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
