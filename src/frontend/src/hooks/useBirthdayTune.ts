import { useCallback, useEffect, useRef, useState } from "react";

// Music box / chime melody - Happy Birthday notes
const MELODY_NOTES = [
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 587.33, dur: 0.5 }, // D5
  { freq: 523.25, dur: 0.5 }, // C5
  { freq: 698.46, dur: 0.5 }, // F5
  { freq: 659.25, dur: 1.0 }, // E5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 587.33, dur: 0.5 }, // D5
  { freq: 523.25, dur: 0.5 }, // C5
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 698.46, dur: 1.0 }, // F5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 523.25, dur: 0.25 }, // C5
  { freq: 1046.5, dur: 0.5 }, // C6
  { freq: 880.0, dur: 0.5 }, // A5
  { freq: 698.46, dur: 0.5 }, // F5
  { freq: 659.25, dur: 0.5 }, // E5
  { freq: 587.33, dur: 0.5 }, // D5
  { freq: 932.33, dur: 0.25 }, // Bb5
  { freq: 932.33, dur: 0.25 }, // Bb5
  { freq: 880.0, dur: 0.5 }, // A5
  { freq: 698.46, dur: 0.5 }, // F5
  { freq: 783.99, dur: 0.5 }, // G5
  { freq: 698.46, dur: 1.0 }, // F5
];

export function useBirthdayTune() {
  const [isMuted, setIsMuted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const stopRef = useRef<(() => void) | null>(null);

  const playMelody = useCallback(() => {
    if (isPlayingRef.current) return;
    let stopped = false;
    isPlayingRef.current = true;

    const ctx = audioCtxRef.current;
    if (!ctx || !gainRef.current) return;

    let time = ctx.currentTime + 0.1;
    const noteGain = gainRef.current;

    const playLoop = () => {
      if (stopped) return;
      let t = time;
      for (const note of MELODY_NOTES) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(noteGain);

        osc.type = "sine";
        osc.frequency.setValueAtTime(note.freq, t);

        // Higher harmonic for chime quality
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.connect(g2);
        g2.connect(noteGain);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(note.freq * 2, t);
        g2.gain.setValueAtTime(0.15, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + note.dur * 0.8);
        osc2.start(t);
        osc2.stop(t + note.dur);

        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + note.dur * 0.9);
        osc.start(t);
        osc.stop(t + note.dur);
        t += note.dur + 0.05;
      }
      const totalDur = MELODY_NOTES.reduce((s, n) => s + n.dur + 0.05, 0);
      time = time + totalDur + 1.0;
      const delay = (time - ctx.currentTime - 0.5) * 1000;
      if (!stopped) {
        setTimeout(
          () => {
            if (!stopped) playLoop();
          },
          Math.max(delay, 100),
        );
      }
    };

    playLoop();
    stopRef.current = () => {
      stopped = true;
      isPlayingRef.current = false;
    };
  }, []);

  const start = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current = masterGain;
    }
    setIsStarted(true);
    playMelody();
  }, [playMelody]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setValueAtTime(
          next ? 0 : 0.4,
          audioCtxRef.current.currentTime,
        );
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      stopRef.current?.();
      audioCtxRef.current?.close();
    };
  }, []);

  return { isMuted, isStarted, start, toggleMute };
}
