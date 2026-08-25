import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrapbookBackdrop from "../Memories/ScrapbookBackdrop";
import { StarMark, HeartMark, HeartRule, LeafMark } from "../Memories/Doodles";
import { useMood } from "../shared/mood";

/*
 * The true end of the site: a last word, a nudge for one photo together, then
 * a scrapbook photo booth. The capture never leaves the browser — no upload,
 * no network, no storage beyond this tab's memory.
 */

const COUNT_MS = 700; // per countdown number
const FLASH_MS = 220;

const ease = [0.16, 1, 0.3, 1];

/* ── the paper button used for every call to action ── */
function PaperButton({ children, onClick, className = "", ...rest }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.035, y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={
        "relative rounded-[14px] border border-ink-faint/45 bg-[#fbf6ea] px-7 py-3.5 font-hand text-xl text-ink " +
        "shadow-[0_10px_22px_-12px_rgba(88,62,38,0.55),inset_0_1px_0_rgba(255,255,255,0.85)] " +
        "transition-colors hover:border-rust/50 sm:px-9 sm:text-2xl " +
        className
      }
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default function FinalSelfie() {
  useMood("memories");

  // message → invite → camera → shooting → photo | denied | unsupported
  const [phase, setPhase] = useState("message");
  const [showInvite, setShowInvite] = useState(false);
  const [count, setCount] = useState(0); // 3,2,1 while shooting
  const [flash, setFlash] = useState(false);
  const [shot, setShot] = useState(null); // data URL, local only
  // The shutter stays inert until the stream has actually produced a frame —
  // otherwise a slow device can finish the countdown with nothing to capture.
  const [ready, setReady] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /* Never leave the camera light on. */
  const stopStream = useCallback(() => {
    const s = streamRef.current;
    if (!s) return;
    s.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => {
    clearTimers();
    stopStream();
  }, [stopStream]);

  /* beat one → beat two */
  useEffect(() => {
    const t = setTimeout(() => setShowInvite(true), 2400);
    return () => clearTimeout(t);
  }, []);

  /*
   * Attach on the element's own callback ref, not in an effect keyed on phase:
   * AnimatePresence `mode="wait"` holds the viewfinder back until the message
   * has finished exiting, so a phase-keyed effect fires while the <video> is
   * still null and never runs again — leaving srcObject unset.
   */
  const attachVideo = useCallback((el) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      const play = el.play();
      if (play && typeof play.catch === "function") play.catch(() => {});
    }
  }, []);

  /* Watch for the first real frame; also re-attaches if the element arrived
     before the stream did. */
  useEffect(() => {
    if (phase !== "camera" && phase !== "shooting") return undefined;
    const id = setInterval(() => {
      const v = videoRef.current;
      if (!v) return;
      if (streamRef.current && v.srcObject !== streamRef.current) {
        v.srcObject = streamRef.current;
        const play = v.play();
        if (play && typeof play.catch === "function") play.catch(() => {});
      }
      if (v.videoWidth > 0 && v.readyState >= 2) setReady(true);
    }, 120);
    return () => clearInterval(id);
  }, [phase]);

  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPhase("unsupported");
      return;
    }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
      } catch {
        // some webcams reject the facingMode hint — fall back to any camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      setReady(false);
      setPhase("camera");
    } catch (err) {
      const name = err?.name || "";
      setPhase(
        name === "NotAllowedError" || name === "PermissionDeniedError"
          ? "denied"
          : "unsupported"
      );
    }
  }, []);

  const capture = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;

    const w = v.videoWidth;
    const h = v.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    // The preview is mirrored like a mirror, so mirror the capture too —
    // otherwise the photo comes back flipped from what they just posed for.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, w, h);

    setShot(canvas.toDataURL("image/jpeg", 0.92));
    stopStream();
  }, [stopStream]);

  const startShoot = useCallback(() => {
    if (phase !== "camera" || !ready) return;
    setPhase("shooting");
    setCount(3);
    timers.current = [
      setTimeout(() => setCount(2), COUNT_MS),
      setTimeout(() => setCount(1), COUNT_MS * 2),
      setTimeout(() => {
        setCount(0);
        setFlash(true);
        capture();
      }, COUNT_MS * 3),
      setTimeout(() => setFlash(false), COUNT_MS * 3 + FLASH_MS),
      setTimeout(() => setPhase("photo"), COUNT_MS * 3 + FLASH_MS + 120),
    ];
  }, [phase, ready, capture]);

  const finishAnyway = useCallback(() => {
    clearTimers();
    stopStream();
    setShot(null);
    setPhase("photo");
  }, [stopStream]);

  const shooting = phase === "shooting";
  const live = phase === "camera" || shooting;

  return (
    <div className="relative flex min-h-[100svh] w-full select-none flex-col items-center justify-center overflow-hidden px-5 py-12 text-center text-ink sm:px-8">
      <ScrapbookBackdrop />

      {/* shutter flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.82 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FLASH_MS / 1000, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ── the last word, and the nudge ── */}
        {(phase === "message" || phase === "denied" || phase === "unsupported") && (
          <motion.div
            key="message"
            className="relative z-10 flex w-full max-w-[46ch] flex-col items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.5 } }}
            transition={{ duration: 1.2, ease }}
          >
            <StarMark className="mb-3 text-rust/70" size={20} />
            <p className="font-hand text-2xl leading-relaxed text-ink text-balance sm:text-4xl">
              Thanks for seeing my website, and happy birthday once again.
              Enjoy your day <span className="text-rust">❤️</span>
            </p>
            <HeartRule className="mt-5 text-ink-faint sm:mt-7" width={150} />

            <AnimatePresence>
              {showInvite && phase === "message" && (
                <motion.div
                  key="invite"
                  className="mt-7 flex flex-col items-center sm:mt-9"
                  initial={{ opacity: 0, y: 14, rotate: -1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <p className="font-hand text-xl text-ink-soft text-balance sm:text-2xl">
                    Yaar, 1 photo to banti hai saath mein 📸
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55, ease }}
                    className="mt-6 sm:mt-7"
                  >
                    <PaperButton onClick={openCamera}>Take a Selfie 📸</PaperButton>
                  </motion.div>
                </motion.div>
              )}

              {/* camera refused, or not available at all */}
              {(phase === "denied" || phase === "unsupported") && (
                <motion.div
                  key="trouble"
                  className="mt-8 flex flex-col items-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease }}
                >
                  {phase === "denied" ? (
                    <>
                      <p className="font-hand text-xl text-ink-soft sm:text-2xl">
                        Looks like the camera is shy today 😭📸
                      </p>
                      <p className="mt-2 font-hand text-lg text-ink-faint sm:text-xl">
                        No worries, the memories still count. ❤️
                      </p>
                    </>
                  ) : (
                    <p className="font-hand text-xl text-ink-soft text-balance sm:text-2xl">
                      Your browser isn&rsquo;t letting me open the camera right now. 📸
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <PaperButton onClick={openCamera}>Try Again</PaperButton>
                    <button
                      type="button"
                      onClick={finishAnyway}
                      className="font-hand text-base text-ink-faint underline decoration-ink-faint/40 underline-offset-4 transition-colors hover:text-rust sm:text-lg"
                    >
                      Finish anyway
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── the photo booth ── */}
        {live && (
          <motion.div
            key="camera"
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.4 } }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="font-hand text-xl text-ink-soft sm:text-2xl">Okay, smile 😭📸</p>

            <div
              className="relative mt-4 sm:mt-5"
              style={{ width: "min(86vw, 380px)" }}
            >
              <div
                className="relative overflow-hidden rounded-[26px] bg-[#e6dccb]"
                style={{
                  aspectRatio: "3 / 4",
                  boxShadow:
                    "0 0 0 8px #fbf6ea, 0 0 0 9px rgba(122,92,58,0.22), 0 22px 44px -16px rgba(88,62,38,0.5)",
                }}
              >
                <video
                  ref={attachVideo}
                  playsInline
                  muted
                  autoPlay
                  className="h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />

                {/* viewfinder corner marks */}
                {[
                  "left-3 top-3 border-l-2 border-t-2 rounded-tl-[10px]",
                  "right-3 top-3 border-r-2 border-t-2 rounded-tr-[10px]",
                  "left-3 bottom-3 border-l-2 border-b-2 rounded-bl-[10px]",
                  "right-3 bottom-3 border-r-2 border-b-2 rounded-br-[10px]",
                ].map((c) => (
                  <span
                    key={c}
                    className={`pointer-events-none absolute h-7 w-7 border-[#fbf6ea]/75 ${c}`}
                  />
                ))}

                {/* countdown */}
                <AnimatePresence mode="wait">
                  {shooting && count > 0 && (
                    <motion.span
                      key={count}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center font-hand text-[6rem] text-[#fbf6ea] sm:text-[7rem]"
                      style={{ textShadow: "0 6px 26px rgba(60,40,24,0.55)" }}
                      initial={{ opacity: 0, scale: 1.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.34, ease }}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-4 font-hand text-base text-ink-faint sm:text-lg">
              {ready ? "One for the memories." : "Warming up the lens…"}
            </p>

            {/* shutter */}
            <motion.button
              type="button"
              onClick={startShoot}
              disabled={shooting || !ready}
              aria-label="Take the photo"
              whileHover={shooting || !ready ? undefined : { scale: 1.05 }}
              whileTap={shooting || !ready ? undefined : { scale: 0.9 }}
              transition={{ type: "spring", stiffness: 460, damping: 24 }}
              className="mt-5 flex h-[74px] w-[74px] items-center justify-center rounded-full border border-ink-faint/40 bg-[#fbf6ea] shadow-[0_10px_22px_-10px_rgba(88,62,38,0.6),inset_0_1px_0_rgba(255,255,255,0.9)] disabled:opacity-70 sm:mt-6 sm:h-[82px] sm:w-[82px]"
            >
              <span className="h-[54px] w-[54px] rounded-full border-2 border-rust/45 bg-[#f3e9d8] sm:h-[60px] sm:w-[60px]" />
            </motion.button>
          </motion.div>
        )}

        {/* ── the developed print, and goodbye ── */}
        {phase === "photo" && (
          <motion.div
            key="photo"
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {shot && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: [0.85, 1.03, 1], rotate: [-4, 2, -1.2] }}
                transition={{
                  duration: 1.05,
                  ease,
                  scale: { duration: 1.05, times: [0, 0.62, 1], ease: "easeOut" },
                  rotate: { duration: 1.05, times: [0, 0.62, 1], ease: "easeOut" },
                }}
              >
                <div
                  className="paper-texture rounded-[4px] bg-gradient-to-b from-[#fbf6ec] to-[#ece2ce] p-3 pb-12 sm:p-4 sm:pb-14"
                  style={{
                    width: "min(78vw, 330px)",
                    boxShadow:
                      "0 22px 46px -18px rgba(88,62,38,0.6), 0 6px 16px -8px rgba(88,62,38,0.35)",
                  }}
                >
                  <img
                    src={shot}
                    alt="Your selfie"
                    className="block w-full rounded-[2px] object-cover"
                    style={{ aspectRatio: "3 / 4", background: "#e6dccb" }}
                  />
                  <p className="absolute inset-x-0 bottom-3 text-center font-hand text-lg text-ink-soft sm:bottom-4 sm:text-xl">
                    26.08.2026
                  </p>
                </div>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shot ? 0.9 : 0.2, ease }}
              className="mt-8 font-hand text-xl text-ink text-balance sm:text-2xl"
            >
              And now we have one more memory. <span className="text-rust">❤️</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: shot ? 1.4 : 0.6, ease }}
              className="mt-4 flex flex-col items-center"
            >
              <div className="flex items-center gap-3">
                <LeafMark className="text-sage/70" size={28} />
                <p className="font-hand text-2xl text-ink text-balance sm:text-3xl">
                  Happy Birthday once again, Tarun! 🎂
                </p>
                <LeafMark className="text-sage/70" size={28} flip />
              </div>
              <HeartMark className="mt-4 text-rust/75" size={17} filled />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
