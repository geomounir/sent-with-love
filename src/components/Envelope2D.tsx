import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = "sealed" | "opening" | "card" | "done";

export function Envelope2D({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState<Stage>("sealed");

  const handleSealClick = () => {
    if (stage !== "sealed") return;
    setStage("opening");
    setTimeout(() => setStage("card"), 1100);
    setTimeout(() => {
      setStage("done");
      onOpened();
    }, 2600);
  };

  const flapOpen = stage !== "sealed";
  const cardOut = stage === "card" || stage === "done";

  return (
    <div className="relative w-full h-screen bg-emerald-deep overflow-hidden flex items-center justify-center">
      {/* Ornamental ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, oklch(0.62 0.13 70 / 0.35), transparent 60%)",
        }}
      />
      {/* Arabesque pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 50%, var(--gold) 0deg 10deg, transparent 10deg 30deg)",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 70%)",
        }}
      />

      <div className="relative" style={{ perspective: "1600px" }}>
        {/* Envelope shell */}
        <motion.div
          className="relative"
          style={{ width: "min(86vw, 440px)", aspectRatio: "8 / 5" }}
          initial={{ y: 30, opacity: 0, rotateX: 8 }}
          animate={{
            y: cardOut ? -10 : 0,
            opacity: 1,
            rotateX: cardOut ? 4 : 8,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Envelope body (back) */}
          <div
            className="absolute inset-0 rounded-md"
            style={{
              background:
                "linear-gradient(160deg, oklch(0.32 0.06 158), oklch(0.22 0.05 158))",
              boxShadow:
                "0 30px 60px -25px oklch(0 0 0 / 0.7), inset 0 0 0 1px oklch(0.62 0.13 70 / 0.25)",
            }}
          />

          {/* Card sliding out */}
          <motion.div
            className="absolute left-1/2 rounded-sm overflow-hidden"
            style={{
              width: "92%",
              height: "92%",
              top: "4%",
              x: "-50%",
              background:
                "linear-gradient(180deg, var(--cream), oklch(0.92 0.03 85))",
              boxShadow: "0 12px 30px -10px oklch(0 0 0 / 0.5)",
              zIndex: 1,
            }}
            initial={{ y: 0 }}
            animate={{ y: cardOut ? "-78%" : 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: cardOut ? 0.1 : 0 }}
          >
            <div className="absolute inset-3 border border-[var(--gold)]/60 rounded-sm flex flex-col items-center justify-center text-center p-4">
              <div className="font-arabic text-[var(--gold)] text-2xl mb-1">۞</div>
              <div className="font-display tracking-[0.35em] text-[10px] text-[var(--emerald-deep)] uppercase">
                You are invited
              </div>
              <div className="my-2 h-px w-16 bg-[var(--gold)]/60" />
              <div className="font-display text-[var(--emerald-deep)] text-lg">
                Aisha &amp; Yusuf
              </div>
              <div className="font-serif italic text-[var(--emerald-deep)]/70 text-xs mt-1">
                A blessed union
              </div>
            </div>
          </motion.div>

          {/* Side + bottom flaps (static, decorative diagonals) */}
          <div
            className="absolute inset-0 rounded-md pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 49.6%, oklch(0.18 0.05 158) 50%) no-repeat, linear-gradient(225deg, transparent 49.6%, oklch(0.18 0.05 158) 50%) no-repeat",
              backgroundSize: "50% 100%, 50% 100%",
              backgroundPosition: "left, right",
              zIndex: 2,
              opacity: 0.55,
            }}
          />

          {/* Top flap (opens) */}
          <motion.div
            className="absolute left-0 right-0 top-0 origin-top"
            style={{
              height: "60%",
              transformStyle: "preserve-3d",
              zIndex: flapOpen ? 0 : 3,
            }}
            animate={{ rotateX: flapOpen ? -175 : 0 }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
          >
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(180deg, oklch(0.30 0.06 158), oklch(0.22 0.05 158))",
                boxShadow: "inset 0 -10px 30px oklch(0 0 0 / 0.35)",
                backfaceVisibility: "hidden",
              }}
            />
            {/* back side of flap */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(180deg, oklch(0.36 0.06 158), oklch(0.28 0.05 158))",
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>

          {/* Wax seal */}
          <AnimatePresence>
            {stage === "sealed" && (
              <motion.button
                key="seal"
                onClick={handleSealClick}
                className="absolute left-1/2 -translate-x-1/2 rounded-full focus:outline-none"
                style={{
                  top: "calc(60% - 32px)",
                  width: 64,
                  height: 64,
                  zIndex: 4,
                  background:
                    "radial-gradient(circle at 35% 30%, oklch(0.55 0.16 25), oklch(0.32 0.14 25) 70%)",
                  boxShadow:
                    "0 8px 18px -6px oklch(0 0 0 / 0.6), inset 0 -4px 8px oklch(0 0 0 / 0.4), inset 0 2px 4px oklch(1 0 0 / 0.15)",
                  cursor: "pointer",
                }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: 1,
                }}
                exit={{ scale: 1.4, opacity: 0, rotate: 20 }}
                transition={{
                  scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.6 },
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Press the wax seal to open"
              >
                <div
                  className="absolute inset-2 rounded-full border-2 flex items-center justify-center font-arabic text-xl"
                  style={{
                    borderColor: "oklch(0.78 0.13 82 / 0.6)",
                    color: "oklch(0.85 0.13 82)",
                    textShadow: "0 1px 2px oklch(0 0 0 / 0.5)",
                  }}
                >
                  ۞
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Prompt overlay */}
      <div className="pointer-events-none absolute bottom-12 inset-x-0 flex flex-col items-center gap-3 text-center px-6">
        {stage === "sealed" && (
          <>
            <div className="ornamental-divider w-full max-w-xs">
              <span className="font-arabic text-2xl">۞</span>
            </div>
            <p className="text-gold font-display tracking-[0.3em] text-sm uppercase animate-shimmer">
              Press the Wax Seal to Open
            </p>
            <p className="font-serif italic text-cream/60 text-sm">
              An invitation awaits
            </p>
          </>
        )}
        {stage !== "sealed" && stage !== "done" && (
          <p className="text-gold/80 font-display tracking-[0.3em] text-xs uppercase">
            Opening…
          </p>
        )}
      </div>
    </div>
  );
}
