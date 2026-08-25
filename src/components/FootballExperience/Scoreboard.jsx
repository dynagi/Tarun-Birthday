import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FlipDigits({ value, className = "", digitClassName = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const chars = String(value).split("");

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={inView ? { rotateX: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.12, ease: "easeOut" }}
          style={{ display: "inline-block", transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}
          className={digitClassName}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Scoreboard({ home = "TARUN", vsLabel = "AGE", age = 23 }) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="rounded-lg border border-amber/30 bg-black/40 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(255,182,39,0.35)] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div>
            <p className="font-sport-body text-[10px] sm:text-xs tracking-[0.3em] text-chalk/50">HOME</p>
            <p className="font-sport text-lg sm:text-2xl text-chalk tracking-wide mt-1">{home}</p>
          </div>
          <div className="font-sport-body text-amber/70 text-sm sm:text-base tracking-widest">VS</div>
          <div>
            <p className="font-sport-body text-[10px] sm:text-xs tracking-[0.3em] text-chalk/50">{vsLabel}</p>
            <FlipDigits
              value={age}
              delay={0.3}
              className="justify-center mt-1"
              digitClassName="font-sport text-3xl sm:text-5xl text-amber tabular-nums"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
