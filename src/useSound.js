import { useRef, useCallback } from "react";

// square waves through WebAudio, so there are no sound files to ship.
// gain is deliberately low (0.04) because square waves are harsh.
export function useSound(enabledRef) {
  const ctx = useRef(null);

  const beep = useCallback((freq, dur) => {
    if (!enabledRef.current) return;
    try {
      ctx.current = ctx.current || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.current.createOscillator();
      const g = ctx.current.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      o.connect(g); g.connect(ctx.current.destination);
      const t = ctx.current.currentTime;
      o.start(t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.stop(t + dur);
    } catch {
      // no WebAudio, or the browser won't let me make noise yet. silence is fine.
    }
  }, [enabledRef]);

  const click = useCallback(() => beep(620, 0.05), [beep]);
  const close = useCallback(() => beep(300, 0.07), [beep]);
  const chime = useCallback(() => {
    beep(700, 0.09);
    setTimeout(() => beep(990, 0.11), 100);
    setTimeout(() => beep(1320, 0.13), 200);
  }, [beep]);
  const power = useCallback(() => {
    beep(440, 0.15);
    setTimeout(() => beep(220, 0.4), 150);
  }, [beep]);

  return { beep, click, close, chime, power };
}
