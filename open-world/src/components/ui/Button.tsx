import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ExternalIcon } from './Icons';

type Variant = 'primary' | 'ghost';

interface Common {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean };

const styles: Record<Variant, string> = {
  primary: 'bg-yellow text-black hover:bg-off-white',
  ghost: 'border border-off-white/25 text-off-white hover:border-yellow hover:text-yellow',
};

const baseClass =
  'group relative inline-flex min-h-[44px] items-center justify-center gap-2 px-5 font-ui text-sm font-bold uppercase tracking-hud transition-colors duration-200 disabled:cursor-not-allowed';

export function Button(props: AsButton | AsLink) {
  const cls = `${baseClass} ${styles[props.variant ?? 'primary']} ${props.className ?? ''}`;

  if (props.href !== undefined) {
    const { external, variant: _v, icon, className: _c, children, ...rest } = props as AsLink;
    return (
      <a {...rest} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {icon}
        <span>{children}</span>
        {external && (
          <>
            <ExternalIcon width={16} height={16} />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </a>
    );
  }

  const { variant: _v, icon, className: _c, children, type = 'button', ...rest } = props as AsButton;
  return (
    <button {...rest} type={type} className={cls}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
