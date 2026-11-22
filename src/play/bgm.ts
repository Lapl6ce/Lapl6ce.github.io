/* Fun mode's background music. Plays the files in TRACKS in order, looping;
   if none load, an ambient piece is synthesized live instead: slow wide chords,
   a breathing noise layer and sparse bell notes in a long reverb.
   Browsers block audio until a click or key press, so start() has to be called
   from a gesture handler. */

import { makeImpulse } from "@/shared/sfx";

// Paths under public/assets/audio/. Empty, so the synthesized piece plays; every
// listed file that doesn't exist costs a failed request before the fallback.
const TRACKS: string[] = [];
const VOLUME = 0.35; // file tracks
const SYNTH_VOLUME = 0.55; // generated fallback (master)
const DUCKED = 0.35; // fraction of normal volume while ducked

const KEY = "bgm.enabled";
let enabled: boolean | null = null;
let started = false;
let ducked = false;
const listeners = new Set<(on: boolean) => void>();

export function isMusicOn(): boolean {
  if (enabled === null) {
    try {
      enabled = localStorage.getItem(KEY) !== "0";
    } catch {
      enabled = true;
    }
  }
  return enabled;
}

export function onMusicChange(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMusicOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* storage blocked: the setting lasts for this page only */
  }
  listeners.forEach((fn) => fn(on));
  if (on) start();
  else pause();
}

/** Begin playback if music is on. Safe to call repeatedly; call from a user gesture. */
export function start() {
  if (typeof window === "undefined" || !isMusicOn()) return;
  if (!started) {
    started = true;
    // silence in background tabs
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
      else if (isMusicOn()) resume();
    });
    void playFiles(0, 0);
    return;
  }
  resume();
}

/** Stops playback without changing the on/off setting (e.g. on unmount). */
export function stop() {
  pause();
}

/** Lowers (or restores) the volume smoothly, e.g. while a project backdrop is showing. */
export function duck(on: boolean) {
  if (ducked === on) return;
  ducked = on;
  if (el) fadeElement(el, VOLUME * (on ? DUCKED : 1));
  synth.level();
}

// ---------- file playback ----------
// <audio> volume can't be ramped natively, so fades step it on an interval.

let el: HTMLAudioElement | null = null;
let mode: "files" | "synth" | null = null;
let fadeTimer: ReturnType<typeof setInterval> | undefined;

function fadeElement(a: HTMLAudioElement, target: number) {
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    const d = target - a.volume;
    if (Math.abs(d) < 0.01) {
      a.volume = target;
      clearInterval(fadeTimer);
    } else a.volume += d * 0.15;
  }, 40);
}

/** Plays track i; a track that fails to load skips to the next. After a full
 *  round of failures it switches to the synthesizer for good. */
async function playFiles(i: number, failures: number) {
  if (failures >= TRACKS.length) {
    mode = "synth";
    if (isMusicOn() && !document.hidden) synth.start();
    return;
  }
  const src = TRACKS[i % TRACKS.length];
  el ??= new Audio();
  el.src = src;
  el.volume = VOLUME * (ducked ? DUCKED : 1);
  el.loop = TRACKS.length === 1;
  el.onended = () => void playFiles(i + 1, 0);
  el.onerror = () => void playFiles(i + 1, failures + 1);
  mode = "files";
  if (!isMusicOn() || document.hidden) return;
  try {
    await el.play();
  } catch {
    /* blocked or failed to load: onerror handles missing files */
  }
}

function pause() {
  el?.pause();
  synth.stop();
}

function resume() {
  if (mode === "files") void el?.play().catch(() => {});
  else if (mode === "synth") synth.start();
}

// ---------- synthesized fallback ----------

const synth = (() => {
  // Separate AudioContext from sfx.ts so the music's master fade and ducking
  // never touch the sound effects.
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null; // everything musical goes here → dry + reverb
  let timer: ReturnType<typeof setTimeout> | undefined;
  let air: { src: AudioBufferSourceNode; lfo: OscillatorNode } | null = null;
  let step = 0;
  let running = false;

  // MIDI notes, voiced wide. Fmaj9 → Em7 → Dm9 → Cmaj9(add6)
  const CHORDS = [
    [41, 53, 57, 60, 64, 67],
    [40, 52, 55, 59, 62, 66],
    [38, 50, 57, 60, 64, 65],
    [36, 48, 55, 59, 62, 69],
  ];
  // glassy notes drawn from C major pentatonic, high register
  const BELLS = [72, 74, 76, 79, 81, 84, 86, 88];
  const BAR = 9; // seconds per chord
  const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0; // start() fades in from silence
    master.connect(ctx.destination);

    // bus → low-pass (takes the edge off the sines) → dry and long-reverb paths
    bus = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    const dryG = ctx.createGain();
    dryG.gain.value = 0.55;
    const verb = ctx.createConvolver();
    verb.buffer = makeImpulse(ctx, 5, 2.2);
    const wetG = ctx.createGain();
    wetG.gain.value = 0.9;
    bus.connect(lp);
    lp.connect(dryG).connect(master);
    lp.connect(verb).connect(wetG).connect(master);
    return ctx;
  }

  function voice(freq: number, t: number, dur: number, peak: number, type: OscillatorType, attack: number) {
    const ac = ctx!;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 10; // ±5 cents, so stacked voices sound less synthetic
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(bus!);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Soft, slowly breathing filtered noise underneath everything. */
  function startAir() {
    const ac = ctx!;
    const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
    const d = buf.getChannelData(0);
    // brown-ish noise: smoother than white
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.5;
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 600;
    bp.Q.value = 0.6;
    // a 20 s LFO sweeps the band-pass centre ±350 Hz: the "breathing"
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.05;
    const depth = ac.createGain();
    depth.gain.value = 350;
    lfo.connect(depth).connect(bp.frequency);
    const g = ac.createGain();
    g.gain.value = 0.05;
    src.connect(bp).connect(g).connect(bus!);
    src.start();
    lfo.start();
    air = { src, lfo };
  }

  /** Schedules one chord with its bell notes, then re-arms itself for the next bar. */
  function bar() {
    if (!running || !ctx) return;
    const t = ctx.currentTime + 0.05;
    const chord = CHORDS[step % CHORDS.length];
    // pad: slow swell, with a tail 4 s past the bar so chords overlap rather than cut
    // (the root is a louder triangle so the bass carries)
    chord.forEach((n, k) => {
      voice(hz(n), t, BAR + 4, k === 0 ? 0.03 : 0.014, k === 0 ? "triangle" : "sine", 3);
      if (k > 0) voice(hz(n) * 1.003, t, BAR + 4, 0.007, "sine", 3.5); // slight chorus
    });
    // a handful of glassy notes, scattered
    const count = 2 + Math.floor(Math.random() * 3);
    for (let k = 0; k < count; k++) {
      const n = BELLS[Math.floor(Math.random() * BELLS.length)];
      const at = t + 1.5 + Math.random() * (BAR - 2.5);
      voice(hz(n), at, 3.2, 0.016, "sine", 0.008);
      voice(hz(n) * 3, at, 0.9, 0.003, "sine", 0.008); // bell partial
    }
    step++;
    timer = setTimeout(bar, BAR * 1000);
  }

  function target() {
    return SYNTH_VOLUME * (ducked ? DUCKED : 1);
  }

  return {
    start() {
      const ac = ensure();
      if (!ac || running) return;
      if (ac.state === "suspended") void ac.resume();
      running = true;
      if (!air) startAir();
      master!.gain.cancelScheduledValues(ac.currentTime);
      master!.gain.setTargetAtTime(target(), ac.currentTime, 2); // slow fade in
      bar();
    },
    stop() {
      if (!ctx || !running) return;
      running = false;
      clearTimeout(timer);
      master!.gain.cancelScheduledValues(ctx.currentTime);
      master!.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    },
    level() {
      if (!ctx || !running) return;
      master!.gain.cancelScheduledValues(ctx.currentTime);
      master!.gain.setTargetAtTime(target(), ctx.currentTime, 0.6);
    },
  };
})();
