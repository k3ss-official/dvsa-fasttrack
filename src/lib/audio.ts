let ctx: AudioContext | null = null;

function ac() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  return ctx;
}

function tone(freq: number, dur: number, gain = 0.045, type: OscillatorType = "square") {
  const audio = ac();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur);
}

export function haptic(kind: "tap" | "ok" | "bad" | "pass" | "warn", enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    if (kind === "tap") {
      navigator.vibrate?.(10);
      tone(420, 0.04, 0.025, "triangle");
    } else if (kind === "ok") {
      navigator.vibrate?.([12, 30, 12]);
      tone(740, 0.07, 0.04, "triangle");
      setTimeout(() => tone(980, 0.09, 0.035, "triangle"), 70);
    } else if (kind === "bad") {
      navigator.vibrate?.([40, 30, 40]);
      tone(170, 0.16, 0.05, "sawtooth");
    } else if (kind === "pass") {
      navigator.vibrate?.([16, 40, 16, 40, 24]);
      tone(660, 0.08);
      setTimeout(() => tone(880, 0.1), 90);
      setTimeout(() => tone(1170, 0.14), 180);
    } else {
      navigator.vibrate?.(24);
      tone(520, 0.08, 0.04, "triangle");
    }
  } catch {
    /* audio optional */
  }
}
