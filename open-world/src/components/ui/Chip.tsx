import type { ReactNode } from 'react';

/** Small tool / tech tag. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="border border-off-white/20 bg-black/40 px-2 py-0.5 font-ui text-xs font-semibold uppercase tracking-[0.12em] text-off-white/90">
      {children}
    </li>
  );
}

export function ChipList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </ul>
  );
}
