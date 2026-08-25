import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BirthdayWorld from "./components/shared/BirthdayWorld";
import { MoodContext } from "./components/shared/mood";
import WelcomeMessage from "./components/WelcomeMessage";
import GuiltScreen from "./components/GuiltScreen";
import BirthdayReveal from "./components/BirthdayReveal";
import CelebrationExperience from "./components/Celebration/CelebrationExperience";

const STAGES = {
  WELCOME: "welcome",
  GUILT: "guilt",
  BIRTHDAY: "birthday",
  CELEBRATION: "celebration",
};

const SCREENS = {
  [STAGES.WELCOME]: WelcomeMessage,
  [STAGES.GUILT]: GuiltScreen,
  [STAGES.BIRTHDAY]: BirthdayReveal,
  [STAGES.CELEBRATION]: CelebrationExperience,
};

export default function App() {
  const [stage, setStage] = useState(STAGES.WELCOME);
  const [mood, setMood] = useState("calm");

  // Stable so scenes' useMood effects don't re-fire every render.
  const publishMood = useCallback((next) => setMood(next), []);

  const Screen = SCREENS[stage];

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-bw-deep">
      {/* One world for the whole story — rendered outside AnimatePresence so
          it never remounts and the user never leaves the birthday room. */}
      <BirthdayWorld mood={mood} />

      <MoodContext.Provider value={publishMood}>
        {/* Screens stack absolutely so they cross-dissolve over the world
            instead of leaving a gap where the page background shows through. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={stage}
            className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            <Screen
              onNo={() => setStage(STAGES.GUILT)}
              onProceed={() => setStage(STAGES.BIRTHDAY)}
              onComplete={() => setStage(STAGES.CELEBRATION)}
            />
          </motion.div>
        </AnimatePresence>
      </MoodContext.Provider>
    </div>
  );
}
