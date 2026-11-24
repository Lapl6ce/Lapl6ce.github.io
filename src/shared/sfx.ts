/* Sound effects synthesized with Web Audio; no audio files. Both modes share
   one on/off setting. Each sound is a list of notes: band-passed noise bursts
   for "ticks" plus quiet sine tones, all sent through one shared reverb.
   Browsers keep an AudioContext suspended until a click or key press, so
   play() is only called from input handlers. */

type Note = {
  freq?: number;     // tone: start frequency (Hz). Omit with `noise`.
  to?: number;       // glide to this frequency
  noise?: number;    // noise burst through a band-pass at this frequency (Hz)
  q?: number;        // band-pass sharpness for noise (default 1.2)
  dur: number;       // seconds
  type?: OscillatorType;
  gain?: number;     // peak volume (0-1); keep these small
  attack?: number;   // seconds (default 4 ms)
  delay?: number;    // seconds after trigger
  wet?: number;      // reverb send (0-1, default 0.25)
};

const SOUNDS = {
  // fun mode, cursor up/down: a soft dry tick
  move: [
    { noise: 4200, q: 1.6, dur: 0.028, gain: 0.09, wet: 0.08 },
    { freq: 3100, dur: 0.022, type: "sine", gain: 0.018, wet: 0.08 },
  ],
  // category left/right, a slightly rounder "tok"
  cat: [
    { noise: 2600, q: 1.4, dur: 0.04, gain: 0.1, wet: 0.12 },
    { freq: 1900, to: 1750, dur: 0.045, type: "sine", gain: 0.03, wet: 0.12 },
  ],
  // end of a list, a muted thud
  bump: [
    { freq: 150, to: 95, dur: 0.08, type: "sine", gain: 0.12, wet: 0.05 },
    { noise: 700, q: 0.9, dur: 0.035, gain: 0.05, wet: 0 },
  ],
  // confirm, a glassy two-note chime
  select: [
    { noise: 5200, q: 2, dur: 0.02, gain: 0.05, wet: 0.2 },
    { freq: 1568, dur: 0.35, type: "sine", gain: 0.05, wet: 0.45 },
    { freq: 2349, dur: 0.45, type: "sine", gain: 0.035, delay: 0.055, wet: 0.5 },
  ],
  // open a detail panel, a soft rising whoosh into a chime
  open: [
    { noise: 1800, q: 0.7, dur: 0.16, gain: 0.05, attack: 0.08, wet: 0.35 },
    { freq: 1175, dur: 0.3, type: "sine", gain: 0.04, delay: 0.06, wet: 0.45 },
    { freq: 1760, dur: 0.38, type: "sine", gain: 0.03, delay: 0.1, wet: 0.5 },
  ],
  // back / cancel: a lower, falling tick
  back: [
    { noise: 1500, q: 1.3, dur: 0.045, gain: 0.08, wet: 0.12 },
    { freq: 990, to: 660, dur: 0.12, type: "sine", gain: 0.035, wet: 0.25 },
  ],
  // settings toggle: double tick
  toggle: [
    { noise: 3800, q: 1.6, dur: 0.025, gain: 0.08, wet: 0.1 },
    { noise: 4600, q: 1.6, dur: 0.025, gain: 0.07, delay: 0.07, wet: 0.1 },
  ],
  // a project's backdrop fades in: faint shimmer
  focus: [
    { freq: 2637, dur: 0.9, type: "sine", gain: 0.008, attack: 0.25, wet: 0.8 },
    { freq: 3951, dur: 0.9, type: "sine", gain: 0.005, attack: 0.3, delay: 0.08, wet: 0.8 },
  ],
  // startup: airy swell with a wide, warm chord
  boot: [
    { noise: 900, q: 0.5, dur: 2.2, gain: 0.05, attack: 1.1, wet: 0.6 },
    { freq: 261.63, dur: 2.8, type: "sine", gain: 0.05, attack: 0.9, wet: 0.6 },
    { freq: 392.0, dur: 2.7, type: "sine", gain: 0.04, attack: 0.9, delay: 0.1, wet: 0.6 },
    { freq: 493.88, dur: 2.6, type: "sine", gain: 0.03, attack: 0.9, delay: 0.2, wet: 0.65 },
    { freq: 659.25, dur: 2.4, type: "sine", gain: 0.025, attack: 0.8, delay: 0.35, wet: 0.7 },
    { freq: 1318.5, dur: 1.6, type: "sine", gain: 0.012, attack: 0.02, delay: 1.0, wet: 0.8 },
    { freq: 1975.5, dur: 1.6, type: "sine", gain: 0.009, attack: 0.02, delay: 1.12, wet: 0.8 },
  ],
  // professional site link clicks (deliberately quiet)
  click: [{ freq: 1400, to: 1100, dur: 0.03, type: "sine", gain: 0.025, wet: 0 }],
  // terminal
  key: [{ freq: 2400, dur: 0.012, type: "square", gain: 0.008, wet: 0 }],
} satisfies Record<string, Note[]>;

export type SoundName = keyof typeof SOUNDS;

const KEY = "sfx.enabled";
let ctx: AudioContext | null = null;
let dry: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled: boolean | null = null;
const listeners = new Set<(on: boolean) => void>();

/** Saved on/off setting. `defaultOn` applies only when nothing is saved, and the
 *  first caller's default sticks for the rest of the page's life. */
export function isSoundOn(defaultOn = true): boolean {
  if (enabled === null) {
    try {
      const saved = localStorage.getItem(KEY);
      enabled = saved === null ? defaultOn : saved !== "0";
    } catch {
      enabled = defaultOn;
    }
  }
  return enabled;
}

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage blocked (private mode): the setting lasts for this page only */
  }
  listeners.forEach((fn) => fn(on));
}

/** Subscribe to on/off changes; returns an unsubscribe function. */
export function onSoundChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Reverb impulse response: stereo noise with a power-curve decay. Also used by bgm.ts. */
export function makeImpulse(ac: BaseAudioContext, seconds: number, decay: number) {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay;
  }
  return buf;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // A sound asked for before any click or key press could not play anyway, and
  // creating the context then only earns a console warning.
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  if (activation && !activation.hasBeenActive) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    // every note goes to `dry`, and optionally a share of it to the reverb
    dry = ctx.createGain();
    dry.connect(ctx.destination);
    reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(ctx, 1.8, 3);
    reverb.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  // a context created before the first gesture starts suspended
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Plays a named sound. `force` plays it even while sound is off (used by the toggle that turns it on). */
export function play(name: SoundName, { force = false } = {}) {
  if (!force && !isSoundOn()) return;
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime;
  for (const note of SOUNDS[name] as Note[]) {
    const t = now + (note.delay ?? 0);
    const attack = note.attack ?? 0.004;
    const amp = ac.createGain();
    // Exponential envelope: sounds natural and avoids clicks. Exponential ramps
    // can't reach 0, hence the 0.0001 floor at both ends.
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(note.gain ?? 0.04, t + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(note.dur, attack + 0.01));

    let src: AudioScheduledSourceNode;
    if (note.noise) {
      // one second of white noise, looped and band-passed to give the tick its pitch
      const ns = ac.createBufferSource();
      ns.buffer = noiseBuf;
      ns.loop = true;
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = note.noise;
      bp.Q.value = note.q ?? 1.2;
      ns.connect(bp).connect(amp);
      src = ns;
    } else {
      const osc = ac.createOscillator();
      osc.type = note.type ?? "sine";
      osc.frequency.setValueAtTime(note.freq ?? 1000, t);
      if (note.to) osc.frequency.exponentialRampToValueAtTime(note.to, t + note.dur);
      osc.connect(amp);
      src = osc;
    }

    amp.connect(dry!);
    const wet = note.wet ?? 0.25;
    if (wet > 0) {
      const send = ac.createGain();
      send.gain.value = wet;
      amp.connect(send).connect(reverb!);
    }
    src.start(t);
    src.stop(t + Math.max(note.dur, attack) + 0.05); // a little past the release so the tail isn't cut
  }
}
