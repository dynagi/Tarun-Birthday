import { motion } from "framer-motion";

function Star({ className, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={className}
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      whileInView={{ opacity: 0.55, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay }}
    >
      <path
        d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z"
        fill="var(--color-rust)"
      />
    </motion.svg>
  );
}

function Arrow({ className, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 100 40"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.5 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, delay, ease: "easeInOut" }}
    >
      <path
        d="M4 8 C 40 -2, 60 30, 92 20 M92 20 L80 14 M92 20 L82 30"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export default function DecorativeElements() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 hidden sm:block" aria-hidden="true">
      <Star className="absolute top-[8%] left-[6%] w-5 h-5" delay={0.1} />
      <Star className="absolute top-[34%] right-[8%] w-4 h-4" delay={0.3} />
      <Star className="absolute top-[62%] left-[4%] w-6 h-6" delay={0.15} />
      <Star className="absolute top-[85%] right-[10%] w-5 h-5" delay={0.25} />

      <Arrow className="absolute top-[20%] right-[4%] w-24 h-10 rotate-[10deg]" delay={0.2} />
      <Arrow className="absolute top-[70%] left-[2%] w-20 h-9 -scale-x-100 rotate-[-8deg]" delay={0.1} />

      {/* film-strip edge */}
      <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-evenly opacity-20">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-2 w-1.5 bg-ink-faint ml-1 rounded-[1px]" />
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-evenly opacity-20">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-2 w-1.5 bg-ink-faint mr-1 ml-auto rounded-[1px]" />
        ))}
      </div>
    </div>
  );
}
