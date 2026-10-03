import type { SVGProps } from 'react';
import type { DistrictId } from '../../data/content';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></svg>
);
export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" /><path d="M9 4v13M15 6.5v13" /></svg>
);
export const PauseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 5v14M16 5v14" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const SoundOnIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
);
export const SoundOffIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></svg>
);
export const ExternalIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M7 17 17 7M9 7h8v8" /></svg>
);
export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const TrophyIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4" /></svg>
);
export const DossierIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>
);
export const LayoutIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 9h16M9 9v11" /></svg>
);

const districtPaths: Record<DistrictId, JSX.Element> = {
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  career: <><rect x="3.5" y="7.5" width="17" height="12" rx="1.5" /><path d="M9 7.5V5h6v2.5M3.5 12.5h17" /></>,
  campus: <><path d="m2.5 9 9.5-4.5L21.5 9 12 13.5z" /><path d="M6.5 11v5c3 2.5 8 2.5 11 0v-5M21.5 9v5" /></>,
  projects: <><path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z" /><path d="M5 5l4 4M4 8l4-4" /></>,
  connect: <><path d="M12 10v11M8.5 21h7" /><circle cx="12" cy="8" r="2" /><path d="M7.8 3.8a6 6 0 0 0 0 8.4M16.2 3.8a6 6 0 0 1 0 8.4" /></>,
};

export const DistrictIcon = ({ id, ...p }: IconProps & { id: DistrictId }) => <svg {...base(p)}>{districtPaths[id]}</svg>;
