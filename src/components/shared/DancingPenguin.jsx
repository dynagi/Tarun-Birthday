import { motion } from "framer-motion";

export default function DancingPenguin({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 160 190"
      className={className}
      aria-label="A happy, dancing penguin"
      style={{ transformOrigin: "80px 176px" }}
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* feet */}
      <ellipse cx={62} cy={176} rx={14} ry={7} fill="#e8922f" />
      <ellipse cx={98} cy={176} rx={14} ry={7} fill="#e8922f" />

      <motion.g
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* body */}
        <ellipse cx={80} cy={100} rx={56} ry={66} fill="#1c2130" />
        {/* belly */}
        <ellipse cx={80} cy={114} rx={33} ry={48} fill="#f3f1e7" />

        {/* left flipper — waving */}
        <motion.ellipse
          cx={26}
          cy={96}
          rx={12}
          ry={34}
          fill="#1c2130"
          style={{ transformOrigin: "26px 70px" }}
          animate={{ rotate: [12, -42, 12] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* right flipper — waving, offset */}
        <motion.ellipse
          cx={134}
          cy={96}
          rx={12}
          ry={34}
          fill="#1c2130"
          style={{ transformOrigin: "134px 70px" }}
          animate={{ rotate: [-12, 42, -12] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        />

        {/* head — slight tilt */}
        <motion.g
          style={{ transformOrigin: "80px 70px" }}
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* happy brows */}
          <path d="M52 58 Q62 63 72 58" stroke="#1c2130" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M88 58 Q98 63 108 58" stroke="#1c2130" strokeWidth={3} fill="none" strokeLinecap="round" />

          {/* eyes */}
          <circle cx={62} cy={71} r={9} fill="#fff" />
          <circle cx={98} cy={71} r={9} fill="#fff" />
          <circle cx={64} cy={73} r={4} fill="#1c2130" />
          <circle cx={96} cy={73} r={4} fill="#1c2130" />

          {/* rosy cheeks */}
          <circle cx={48} cy={82} r={5} fill="#ff8fc0" opacity={0.55} />
          <circle cx={112} cy={82} r={5} fill="#ff8fc0" opacity={0.55} />

          {/* beak */}
          <path d="M72 84 L88 84 L80 96 Z" fill="#e8922f" />
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
