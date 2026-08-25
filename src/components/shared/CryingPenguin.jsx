import { motion } from "framer-motion";

function Tear({ cx, delay }) {
  return (
    <motion.ellipse
      cx={cx}
      cy={78}
      rx={3.2}
      ry={5}
      fill="var(--color-cloud-blue)"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: [0, 10, 26, 34] }}
      transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 0.4, ease: "easeIn" }}
    />
  );
}

export default function CryingPenguin({ className = "" }) {
  return (
    <svg viewBox="0 0 160 190" className={className} aria-label="A sad, crying penguin">
      {/* feet */}
      <ellipse cx={62} cy={176} rx={14} ry={7} fill="#e8922f" />
      <ellipse cx={98} cy={176} rx={14} ry={7} fill="#e8922f" />

      {/* body */}
      <ellipse cx={80} cy={100} rx={56} ry={66} fill="#1c2130" />
      {/* belly */}
      <ellipse cx={80} cy={114} rx={33} ry={48} fill="#f3f1e7" />
      {/* flippers */}
      <ellipse cx={26} cy={100} rx={12} ry={34} fill="#1c2130" transform="rotate(18 26 100)" />
      <ellipse cx={134} cy={100} rx={12} ry={34} fill="#1c2130" transform="rotate(-18 134 100)" />

      {/* sad eyebrows */}
      <path d="M52 60 Q62 52 72 58" stroke="#1c2130" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M88 58 Q98 52 108 60" stroke="#1c2130" strokeWidth={3} fill="none" strokeLinecap="round" />

      {/* eyes */}
      <circle cx={62} cy={70} r={9} fill="#fff" />
      <circle cx={98} cy={70} r={9} fill="#fff" />
      <circle cx={64} cy={73} r={4} fill="#1c2130" />
      <circle cx={96} cy={73} r={4} fill="#1c2130" />

      {/* beak */}
      <path d="M72 84 L88 84 L80 96 Z" fill="#e8922f" />

      <Tear cx={62} delay={0} />
      <Tear cx={98} delay={0.6} />
    </svg>
  );
}
