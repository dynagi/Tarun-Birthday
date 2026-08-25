import { createContext, useContext, useEffect } from "react";

/**
 * The birthday world lives once, at the App root, and never remounts.
 * Scenes reach up through this channel to shift its mood so the user always
 * stays inside the same room instead of landing on a new background.
 */
export const MoodContext = createContext(() => {});

export function useMood(mood) {
  const setMood = useContext(MoodContext);
  useEffect(() => {
    setMood(mood);
  }, [mood, setMood]);
}
