import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Countdown from "./Countdown";
import BirthdayBurst from "./BirthdayBurst";
import CakeScene from "./CakeScene";
import EnvelopeScene from "./EnvelopeScene";
import MemoryStage from "../Memories/MemoryStage";
import FinalSelfie from "../Ending/FinalSelfie";

/**
 * One continuous chapter: countdown → reveal → cake → candles → envelope → letter.
 * The birthday world lives at the App root; each scene only steers its mood.
 */
export default function CelebrationExperience() {
  const [scene, setScene] = useState("countdown");

  const toBirthday = useCallback(() => setScene("birthday"), []);
  const toCake = useCallback(() => setScene("cake"), []);
  const toMail = useCallback(() => setScene("mail"), []);
  const toMemories = useCallback(() => setScene("memories"), []);
  const toEnding = useCallback(() => setScene("ending"), []);

  // The memory stage owns the full viewport and handles its own taps, so it
  // opts out of the padded, centred layout the earlier scenes share.
  if (scene === "memories") {
    return (
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <MemoryStage onFinish={toEnding} />
      </motion.div>
    );
  }

  // Likewise the ending: full viewport, its own layout.
  if (scene === "ending") {
    return (
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <FinalSelfie />
      </motion.div>
    );
  }

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-14 sm:px-8 sm:py-16">
      <AnimatePresence mode="wait">
        {scene === "countdown" && <Countdown key="countdown" onDone={toBirthday} />}
        {scene === "birthday" && <BirthdayBurst key="birthday" onDone={toCake} />}
        {scene === "cake" && <CakeScene key="cake" onDone={toMail} />}
        {scene === "mail" && <EnvelopeScene key="mail" onDone={toMemories} />}
      </AnimatePresence>
    </div>
  );
}
