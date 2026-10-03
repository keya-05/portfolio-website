import type { ReactNode } from 'react';
import { DistrictIcon, MapIcon, PhoneIcon } from '../ui/Icons';
import { useGame } from './GameContext';

function NavButton({
  label,
  icon,
  active,
  onClick,
  current,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  current?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={current ? 'location' : undefined}
      className={`relative flex min-h-[60px] flex-col items-center justify-center gap-1 font-ui text-[0.7rem] font-bold uppercase tracking-[0.16em] transition-colors ${
        active ? 'text-yellow' : 'text-off-white/80'
      }`}
    >
      {active && <span className="absolute inset-x-5 top-0 h-0.5 bg-yellow" aria-hidden="true" />}
      {icon}
      {label}
    </button>
  );
}

/** Mobile-only navigation: replaces the desktop HUD furniture. */
export function BottomNav() {
  const { activeSection, overlay, navigateTo, toggleOverlay } = useGame();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-hud grid grid-cols-4 border-t border-off-white/10 bg-black/95 pb-safe md:hidden"
    >
      <NavButton
        label="Profile"
        icon={<DistrictIcon id="profile" />}
        active={overlay === 'none' && activeSection === 'profile'}
        current={activeSection === 'profile'}
        onClick={() => navigateTo('profile')}
      />
      <NavButton
        label="Career"
        icon={<DistrictIcon id="career" />}
        active={overlay === 'none' && activeSection === 'career'}
        current={activeSection === 'career'}
        onClick={() => navigateTo('career')}
      />
      <NavButton label="Map" icon={<MapIcon />} active={overlay === 'map'} onClick={() => toggleOverlay('map')} />
      <NavButton label="Phone" icon={<PhoneIcon />} active={overlay === 'phone'} onClick={() => toggleOverlay('phone')} />
    </nav>
  );
}
