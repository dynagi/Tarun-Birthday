import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MusicControl({ dark = false }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);

  useEffect(() => {
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildAmbience(ctx) {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);

    const notes = [98, 146.83, 220]; // warm low pad (G2, D3, A3)
    const oscs = notes.map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = 0.25 / (i + 1);

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(gain);
      gain.connect(master);
      osc.start();
      return { osc, lfo, gain };
    });

    // soft filtered noise for crowd/stadium air
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.02;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    return { master, oscs, noise };
  }

  function stopAudio() {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (ctx && nodes) {
      const now = ctx.currentTime;
      nodes.master.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        nodes.oscs.forEach(({ osc, lfo }) => {
          try {
            osc.stop();
            lfo.stop();
          } catch {
            /* already stopped */
          }
        });
        try {
          nodes.noise.stop();
        } catch {
          /* already stopped */
        }
        ctx.close();
      }, 700);
    }
    ctxRef.current = null;
    nodesRef.current = null;
  }

  function toggle() {
    if (playing) {
      stopAudio();
      setPlaying(false);
    } else {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      nodesRef.current = buildAmbience(ctx);
      setPlaying(true);
    }
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className={`fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm shadow-lg transition-colors ${
        dark
          ? "border-amber/30 bg-black/40 text-amber"
          : "border-ink/15 bg-paper/70 text-ink"
      }`}
    >
      {playing ? (
        <span className="flex items-end gap-[2px] h-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ height: ["30%", "100%", "30%"] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
              className="w-[3px] bg-current rounded-full"
              style={{ height: "60%" }}
            />
          ))}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 18V6l10-2v12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
          <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
        </svg>
      )}
    </motion.button>
  );
}
