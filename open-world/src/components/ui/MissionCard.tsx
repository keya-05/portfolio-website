import type { HTMLAttributes, ReactNode } from 'react';

export type MissionCardStatus = 'locked' | 'active' | 'completed' | 'in-progress';

interface MissionCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  number: string;
  title: string;
  status: MissionCardStatus;
  /** Readable facts shown under the title (role, company, dates…) */
  meta?: ReactNode;
  /** Revealed on hover/focus (e.g. "+XP" reward line) */
  reward?: ReactNode;
  headingId?: string;
  children?: ReactNode;
}

const statusStyle: Record<MissionCardStatus, string> = {
  locked: 'text-hud-gray border-hud-gray/40',
  active: 'text-yellow border-yellow/60',
  completed: 'text-green border-green/60',
  'in-progress': 'text-yellow border-yellow/60',
};

const statusLabel: Record<MissionCardStatus, string> = {
  locked: 'Locked',
  active: 'Active',
  completed: 'Completed',
  'in-progress': 'In progress',
};

export function MissionCard({
  number,
  title,
  status,
  meta,
  reward,
  headingId,
  children,
  className = '',
  ...rest
}: MissionCardProps) {
  return (
    <article {...rest} className={`panel group relative max-w-xl p-6 sm:p-8 ${className}`}>
      <span className="absolute left-0 top-0 h-full w-1 bg-yellow" aria-hidden="true" />
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="hud-label">Mission {number}</span>
        <span className={`border px-2 py-0.5 font-ui text-xs font-semibold uppercase tracking-hud ${statusStyle[status]}`}>
          <span className="sr-only">Status: </span>
          {statusLabel[status]}
        </span>
      </div>
      <h3 id={headingId} className="display text-3xl text-off-white sm:text-4xl">
        {title}
      </h3>
      {meta && <div className="mt-3">{meta}</div>}
      {children && <div className="mt-4 font-body text-sm leading-relaxed text-off-white/80">{children}</div>}
      {reward && (
        <div className="mt-5 translate-y-1 font-ui text-sm font-bold uppercase tracking-hud text-yellow opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
          {reward}
        </div>
      )}
    </article>
  );
}
