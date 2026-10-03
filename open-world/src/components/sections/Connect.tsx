import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { availability, contactChannels, links, profile, site, type ContactChannel } from '../../data/content';
import { play } from '../../lib/sounds';
import { useScrollParallax } from '../../hooks/useScrollParallax';
import { useGame } from '../shell/GameContext';
import { CheckIcon, DistrictIcon, ExternalIcon, PhoneIcon } from '../ui/Icons';
import { DistrictSection } from './DistrictSection';

type CallState = 'idle' | 'ringing' | 'directory';
const STATUS_MS = 600;

const screen = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25 },
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function ChannelRow({ channel, onStatus }: { channel: ContactChannel; onStatus: (s: string) => void }) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<number>();
  const external = channel.id !== 'email';
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab/window) behave natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (busy) return;
    play('click');
    setBusy(true);
    onStatus(channel.status);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      onStatus('');
      if (!external) {
        window.location.href = channel.href;
        return;
      }
      const w = window.open(channel.href, '_blank');
      if (w) w.opener = null;
      else window.location.href = channel.href; // popup blocked: navigate instead
    }, STATUS_MS);
  };

  return (
    <li>
      <a
        href={channel.href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex min-h-[64px] items-center gap-3 border border-off-white/10 bg-off-white/[0.04] px-3 py-2.5 transition-colors hover:border-yellow/70"
      >
        <span className="w-[4.5rem] shrink-0 bg-yellow py-1 text-center font-ui text-xs font-bold uppercase tracking-hud text-black">
          {channel.action}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-ui text-lg font-bold uppercase leading-tight tracking-wide text-off-white">{channel.label}</span>
          <span className={`block truncate text-sm ${busy ? 'text-yellow' : 'text-off-white/75'}`}>
            {busy ? channel.status : channel.handle}
          </span>
        </span>
        {external && (
          <>
            <ExternalIcon width={16} height={16} className="shrink-0 text-off-white/70" />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </a>
    </li>
  );
}

function Directory() {
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  const heading = useRef<HTMLParagraphElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // The button that opened the directory is gone; hand focus to the new screen.
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  const copy = async () => {
    await copyText(links.email);
    play('click');
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div key="directory" {...screen} className="flex h-full flex-col">
      <p className="hud-label text-yellow">K-OS // Contacts</p>
      <p ref={heading} tabIndex={-1} className="display mt-1 text-4xl">
        Directory
      </p>
      <ul className="mt-5 space-y-2">
        {contactChannels.map((c) => (
          <ChannelRow key={c.id} channel={c} onStatus={setStatus} />
        ))}
      </ul>
      <button
        type="button"
        onClick={copy}
        className={`mt-4 flex min-h-[48px] items-center justify-center gap-2 border font-ui text-sm font-bold uppercase tracking-hud transition-colors ${
          copied ? 'border-green bg-green text-black' : 'border-off-white/25 text-off-white hover:border-yellow hover:text-yellow'
        }`}
      >
        {copied ? (
          <>
            <CheckIcon width={18} height={18} /> Copied
          </>
        ) : (
          'Copy email address'
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : status}
      </p>
    </motion.div>
  );
}

export function Connect() {
  const { activeSection } = useGame();
  const [call, setCall] = useState<CallState>('idle');
  const root = useRef<HTMLElement>(null);
  useScrollParallax(root);

  // The phone rings the first time the player enters the district.
  useEffect(() => {
    if (call === 'idle' && activeSection === 'connect') {
      setCall('ringing');
      play('ring');
    }
  }, [activeSection, call]);

  const pickUp = () => {
    play('click');
    setCall('directory');
  };

  return (
    <DistrictSection
      ref={root}
      id="connect"
      title="Establish connection"
      intro="The Radio Tower routes every call. Pick up, or skip straight to the directory."
      backdrop={
        <span data-speed="-0.3" className="display text-outline absolute -left-6 top-16 select-none text-[clamp(8rem,22vw,22rem)]">
          Signal
        </span>
      }
    >
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        {/* in-world phone */}
        <div className="mx-auto w-full max-w-[380px] rounded-[2.2rem] border-[7px] border-[#1d1d1d] bg-black shadow-2xl shadow-black">
          <div className="flex items-center justify-between px-6 pb-1 pt-4 font-ui text-xs font-semibold uppercase tracking-hud text-off-white/80">
            <span>K-NET</span>
            <span className="h-4 w-20 rounded-full bg-[#1d1d1d]" aria-hidden="true" />
            <span>▮▮▮</span>
          </div>
          <div className="relative min-h-[460px] px-5 pb-6 pt-4">
            <AnimatePresence mode="wait" initial={false}>
              {call === 'idle' && (
                <motion.div key="idle" {...screen} className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <PhoneIcon width={36} height={36} className="text-off-white/60" />
                  <p className="mt-4 font-ui text-lg uppercase tracking-hud text-off-white/80">Waiting for signal…</p>
                  <button type="button" onClick={pickUp} className="mt-6 font-ui text-sm font-bold uppercase tracking-hud text-yellow underline underline-offset-4">
                    Skip to contacts
                  </button>
                </motion.div>
              )}

              {call === 'ringing' && (
                <motion.div
                  key="ringing"
                  {...screen}
                  role="group"
                  aria-labelledby="incoming-call-title"
                  className="flex min-h-[420px] flex-col items-center text-center"
                >
                  <p id="incoming-call-title" className="hud-label text-green" aria-live="polite">
                    Incoming call
                  </p>
                  <motion.span
                    className="mt-8 grid h-28 w-28 place-items-center rounded-full border-2 border-yellow bg-yellow/10 text-yellow"
                    animate={{ rotate: [0, -7, 7, -5, 5, 0] }}
                    transition={{ duration: 0.6, repeat: 3, repeatDelay: 0.5 }}
                    aria-hidden="true"
                  >
                    <DistrictIcon id="profile" width={52} height={52} strokeWidth={1.4} />
                  </motion.span>
                  <p className="display mt-6 text-4xl">{profile.fullName}</p>
                  <p className="font-ui text-base uppercase tracking-hud text-off-white/80">
                    {profile.title} · {site.city}
                  </p>
                  <div className="mt-auto grid w-full grid-cols-2 gap-3 pt-10">
                    <button
                      type="button"
                      onClick={pickUp}
                      className="min-h-[52px] bg-danger font-ui text-sm font-bold uppercase tracking-hud text-off-white hover:brightness-110"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={pickUp}
                      className="min-h-[52px] bg-green font-ui text-sm font-bold uppercase tracking-hud text-black hover:brightness-110"
                    >
                      Answer
                    </button>
                  </div>
                  <button type="button" onClick={pickUp} className="mt-4 font-ui text-sm font-semibold uppercase tracking-hud text-off-white/80 underline underline-offset-4 hover:text-yellow">
                    Skip
                  </button>
                </motion.div>
              )}

              {call === 'directory' && <Directory />}
            </AnimatePresence>
          </div>
        </div>

        {/* availability */}
        <div className="panel p-6 sm:p-8">
          <p className="hud-label text-yellow">Status // Open channel</p>
          <h3 className="display mt-2 text-4xl sm:text-5xl">Available for</h3>
          <ul className="mt-6 space-y-3">
            {availability.map((a) => (
              <li key={a} className="flex items-center gap-3 font-ui text-lg uppercase tracking-wide text-off-white">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-body text-sm text-off-white/75">
            Based in {profile.location} (IST, UTC+5:30). Email is the fastest channel: {links.email}
          </p>
        </div>
      </div>
    </DistrictSection>
  );
}
