import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Option A — Folded Letter
 * A flat 2D letter that unfolds (bottom third up, top third down) like a
 * tri-fold paper, revealing the invitation card. No 3D envelope shell.
 */
export function EnvelopeFold({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState<"folded" | "opening" | "done">("folded");

  const handleOpen = () => {
    if (stage !== "folded") return;
    setStage("opening");
    setTimeout(() => {
      setStage("done");
      onOpened();
    }, 1800);
  };

  const open = stage !== "folded";

  return (
    <div className="relative w-full h-screen bg-emerald-deep overflow-hidden flex items-center justify-center px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, oklch(0.62 0.13 70 / 0.35), transparent 60%)",
        }}
      />

      <div
        className="relative"
        style={{
          width: "min(86vw, 420px)",
          aspectRatio: "5 / 7",
          perspective: "1400px",
        }}
      >
        {/* Inner card (revealed) */}
        <div
          className="absolute inset-0 rounded-sm flex flex-col items-center justify-center text-center p-8"
          style={{
            background:
              "linear-gradient(180deg, var(--cream), oklch(0.92 0.03 85))",
            boxShadow: "0 25px 60px -20px oklch(0 0 0 / 0.6)",
          }}
        >
          <div className="font-arabic text-[var(--gold-deep)] text-3xl mb-2">۞</div>
          <div className="font-display tracking-[0.4em] text-[10px] text-[var(--emerald-deep)] uppercase">
            You are invited
          </div>
          <div className="my-3 h-px w-20 bg-[var(--gold)]/70" />
          <div className="font-display text-[var(--emerald-deep)] text-2xl">
            Aisha &amp; Yusuf
          </div>
          <div className="font-serif italic text-[var(--emerald-deep)]/70 text-sm mt-2">
            A blessed union
          </div>
          <div className="absolute inset-3 border border-[var(--gold)]/40 rounded-sm pointer-events-none" />
        </div>

        {/* Top fold — hinged at top, flips down to reveal */}
        <motion.div
          className="absolute left-0 right-0 top-0 origin-top"
          style={{ height: "33.33%", transformStyle: "preserve-3d", zIndex: 2 }}
          animate={{ rotateX: open ? -180 : 0 }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1], delay: open ? 0.2 : 0 }}
        >
          <FoldFace />
        </motion.div>

        {/* Bottom fold — hinged at bottom, flips up to reveal */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 origin-bottom"
          style={{ height: "33.33%", transformStyle: "preserve-3d", zIndex: 2 }}
          animate={{ rotateX: open ? 180 : 0 }}
          transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
        >
          <FoldFace />
        </motion.div>

        {/* Seal sticker on the closed folds */}
        {!open && (
          <motion.button
            onClick={handleOpen}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none"
            style={{
              width: 72,
              height: 72,
              zIndex: 3,
              background:
                "radial-gradient(circle at 35% 30%, oklch(0.55 0.16 25), oklch(0.32 0.14 25) 70%)",
              boxShadow:
                "0 8px 20px -6px oklch(0 0 0 / 0.6), inset 0 -4px 8px oklch(0 0 0 / 0.4)",
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Open invitation"
          >
            <div
              className="absolute inset-2 rounded-full border-2 flex items-center justify-center font-arabic text-2xl"
              style={{
                borderColor: "oklch(0.78 0.13 82 / 0.6)",
                color: "oklch(0.85 0.13 82)",
              }}
            >
              ۞
            </div>
          </motion.button>
        )}
      </div>

      {!open && (
        <div className="pointer-events-none absolute bottom-12 inset-x-0 flex flex-col items-center gap-3 text-center px-6">
          <div className="ornamental-divider w-full max-w-xs">
            <span className="font-arabic text-2xl">۞</span>
          </div>
          <p className="text-gold font-display tracking-[0.3em] text-sm uppercase animate-shimmer">
            Press the Seal to Unfold
          </p>
        </div>
      )}
    </div>
  );
}

function FoldFace() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.32 0.06 158), oklch(0.22 0.05 158))",
          boxShadow: "inset 0 0 0 1px oklch(0.62 0.13 70 / 0.3)",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          className="absolute inset-3 border border-[var(--gold)]/40"
          style={{ borderRadius: 2 }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.36 0.06 158), oklch(0.28 0.05 158))",
          transform: "rotateX(180deg)",
          backfaceVisibility: "hidden",
        }}
      />
    </>
  );
}
