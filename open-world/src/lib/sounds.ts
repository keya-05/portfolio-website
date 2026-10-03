import { Howl, Howler } from 'howler';

/**
 * Original UI sounds synthesized at runtime into tiny WAV data URIs —
 * no audio assets to download, nothing borrowed. Howls are created lazily
 * on first play, and everything starts muted.
 */
export type SoundName = 'click' | 'open' | 'close' | 'bass' | 'toast' | 'ring' | 'mission';

const RATE = 22050;
type Synth = (t: number, dur: number) => number;

const synths: Record<SoundName, { dur: number; fn: Synth }> = {
  click: {
    dur: 0.05,
    fn: (t, d) => Math.sin(2 * Math.PI * 1400 * t) * (1 - t / d) * 0.35,
  },
  open: {
    dur: 0.12,
    fn: (t, d) => Math.sin(2 * Math.PI * (420 + 2600 * t) * t) * Math.sin((Math.PI * t) / d) * 0.3,
  },
  close: {
    dur: 0.12,
    fn: (t, d) => Math.sin(2 * Math.PI * (900 - 2400 * t) * t) * Math.sin((Math.PI * t) / d) * 0.3,
  },
  bass: {
    dur: 0.9,
    fn: (t) => {
      const freq = 38 + 90 * Math.exp(-t * 14);
      const body = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 4.2);
      const knock = (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.4;
      return (body + knock) * 0.8;
    },
  },
  ring: {
    dur: 1.1,
    fn: (t) => {
      // two short trills, phone-style
      const on = t % 0.5 < 0.36;
      const trill = Math.sin(2 * Math.PI * 22 * t) > 0 ? 1 : 0.6;
      return on ? Math.sin(2 * Math.PI * 1046 * t) * trill * 0.18 : 0;
    },
  },
  mission: {
    dur: 1.2,
    fn: (t) => {
      // rising three-note fanfare (C5 → E5 → G5) with a soft tail
      const notes = [523.25, 659.25, 783.99];
      const i = Math.min(2, Math.floor(t / 0.16));
      const local = t - i * 0.16;
      const decay = i === 2 ? Math.exp(-local * 2.6) : Math.exp(-local * 9);
      return (Math.sin(2 * Math.PI * notes[i] * t) + 0.3 * Math.sin(4 * Math.PI * notes[i] * t)) * decay * 0.22;
    },
  },
  toast: {
    dur: 0.32,
    fn: (t) => {
      const f = t < 0.12 ? 880 : 1320;
      const local = t < 0.12 ? t : t - 0.12;
      return Math.sin(2 * Math.PI * f * t) * Math.exp(-local * 18) * 0.25;
    },
  },
};

function toWavDataUri({ dur, fn }: { dur: number; fn: Synth }): string {
  const n = Math.floor(RATE * dur);
  const buffer = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buffer);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, fn(i / RATE, dur)));
    v.setInt16(44 + i * 2, s * 0x7fff, true);
  }
  let bin = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${btoa(bin)}`;
}

const cache = new Map<SoundName, Howl>();
let muted = true;
Howler.mute(true);

export function setMuted(next: boolean) {
  muted = next;
  Howler.mute(next);
}

export function play(name: SoundName) {
  if (muted) return;
  let howl = cache.get(name);
  if (!howl) {
    howl = new Howl({ src: [toWavDataUri(synths[name])], format: ['wav'], volume: 0.6 });
    cache.set(name, howl);
  }
  howl.play();
}
