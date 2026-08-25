import { useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import CryingPenguin from "./shared/CryingPenguin";
import { useMood } from "./shared/mood";

const YES_STEPS = [
  "At least give it one chance? 🥺",
  "Are you sure? 😏",
  "Okay okay... one more time! 😂",
  "Finally! ❤️ Let's go!",
];

const NO_MESSAGES = [
  "Brooo 😭 Don't do this to me.",
  "Come on Tarun, just three clicks! 🥺",
  "Okay... I'll wait 😭",
];

export default function GuiltScreen({ onProceed }) {
  useMood("calm");
  const [showPenguin, setShowPenguin] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [yesClicks, setYesClicks] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const [lastAction, setLastAction] = useState(null); // null | "yes" | "no"
  const noControls = useAnimationControls();

  function handlePenguinShown() {
    setShowPenguin(true);
    setTimeout(() => setShowAsk(true), 500);
  }

  function handleYes() {
    if (yesClicks >= 3) return;
    const next = yesClicks + 1;
    setYesClicks(next);
    setLastAction("yes");
    if (next === 3) {
      setTimeout(() => onProceed?.(), 900);
    }
  }

  function handleNo() {
    setNoClicks((n) => n + 1);
    setLastAction("no");
    noControls.start({
      x: [0, -8, 8, -6, 6, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  }

  const noMessage = NO_MESSAGES[Math.min(Math.max(noClicks - 1, 0), NO_MESSAGES.length - 1)];
  const yesPrompt = YES_STEPS[yesClicks];
  const transitioning = yesClicks >= 3;

  return (
    <div className="relative min-h-[100svh] w-full flex flex-col items-center justify-center gap-6 px-6 py-16 text-center text-cloud-mist">
      <motion.h1
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: "backOut" }}
        onAnimationComplete={handlePenguinShown}
        className="font-display italic text-3xl sm:text-5xl md:text-6xl text-cloud-blue text-balance max-w-2xl"
      >
        Why Bro, please see it once
      </motion.h1>

      {showPenguin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-40 sm:w-48"
        >
          <CryingPenguin className="w-full h-auto" />
        </motion.div>
      )}

      {showAsk && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="w-full max-w-[460px] rounded-2xl border border-bw-line bg-bw-panel/80 backdrop-blur-md shadow-[0_26px_70px_rgba(10,6,14,0.6)] overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-bw-line bg-black/25">
            <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
            <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
            <span className="h-[9px] w-[9px] rounded-full bg-bw-line" />
            <span className="ml-2 font-mono text-[11px] tracking-wide text-cloud-mist/50">
              prompt.sh — one more try
            </span>
          </div>

          <div className="px-7 sm:px-9 py-8 sm:py-9">
            <AnimatePresence mode="wait">
              <motion.p
                key={lastAction === "no" ? `no-${noClicks}` : `yes-${yesClicks}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-display italic text-xl sm:text-2xl text-cloud-blue text-balance"
              >
                {lastAction === "no" ? noMessage : yesPrompt}
              </motion.p>
            </AnimatePresence>

            {!transitioning && (
              <div className="flex items-center justify-center gap-4 mt-7">
                <button
                  type="button"
                  onClick={handleYes}
                  className="font-sport-body font-semibold tracking-wide text-sm sm:text-base text-cloud-night bg-gradient-to-br from-cloud-blue to-server-teal px-8 py-3 rounded-full shadow-lg transition hover:brightness-110"
                >
                  Yes ❤️
                </button>
                <motion.button
                  type="button"
                  onClick={handleNo}
                  animate={noControls}
                  className="font-sport-body font-semibold tracking-wide text-sm sm:text-base text-cloud-mist border border-bw-line px-8 py-3 rounded-full transition hover:bg-black/25"
                >
                  No 😭
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
