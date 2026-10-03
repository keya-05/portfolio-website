/** Original stylised plan of the Workshop Docks (mission board + briefing backdrop). */
export function DocksMapArt({ stretch = false }: { stretch?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid slice'}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="160" height="90" fill="#0f0f10" />
      {/* block grid */}
      <path
        d={Array.from({ length: 15 }, (_, i) => `M${(i + 1) * 10} 0V90`).join('') + Array.from({ length: 8 }, (_, i) => `M0 ${(i + 1) * 10}H160`).join('')}
        stroke="rgba(242,240,232,.045)"
        strokeWidth="0.4"
      />
      {/* harbour water */}
      <path d="M0 90V78Q40 72 70 80T130 74Q148 70 160 60V90Z" fill="rgba(83,184,212,.14)" />
      <path d="M118 0Q126 20 142 30T160 44V0Z" fill="rgba(83,184,212,.1)" />
      {/* piers */}
      {[18, 46, 74, 102].map((x) => (
        <rect key={x} x={x} y="72" width="5" height="16" fill="rgba(242,240,232,.1)" />
      ))}
      {/* roads */}
      <path
        d="M0 46H160M44 0V78M96 0V76M44 46Q70 30 96 46M96 46L140 18"
        stroke="rgba(155,155,155,.35)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M0 46H160" stroke="rgba(246,215,67,.22)" strokeWidth="0.4" strokeDasharray="2 2" />
      {/* container stacks (environmental colour, low opacity) */}
      {[
        [8, 56, 'rgba(244,122,56,.35)'],
        [14, 56, 'rgba(83,184,212,.3)'],
        [8, 60, 'rgba(232,93,117,.3)'],
        [108, 54, 'rgba(105,184,107,.3)'],
        [114, 54, 'rgba(244,122,56,.3)'],
        [108, 58, 'rgba(83,184,212,.3)'],
        [60, 58, 'rgba(232,93,117,.28)'],
        [66, 58, 'rgba(105,184,107,.28)'],
      ].map(([x, y, c]) => (
        <rect key={`${x}-${y}`} x={x as number} y={y as number} width="5" height="3" fill={c as string} />
      ))}
      {/* cranes */}
      <path d="M30 70V54H40M86 70V52H98M30 54L36 70M86 52L92 70" stroke="rgba(246,215,67,.28)" strokeWidth="0.7" fill="none" />
      <text x="4" y="7" fill="rgba(155,155,155,.75)" fontSize="3" fontFamily="Barlow Condensed, sans-serif" letterSpacing="0.6">
        WORKSHOP DOCKS
      </text>
    </svg>
  );
}
