import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wedding } from "@/lib/wedding-data";

/**
 * Islamic-themed animated intro.
 * Concept: an arabesque mandala blooms, golden geometric gates part,
 * Bismillah descends, and a CTA invites the guest in.
 */
export function IslamicIntro({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, 1800);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-emerald-deep flex items-center justify-center">
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.62 0.13 70 / 0.25), transparent 65%)",
        }}
      />

      {/* Star-field shimmer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, var(--gold) 50%, transparent 51%), radial-gradient(1px 1px at 80% 70%, var(--gold) 50%, transparent 51%), radial-gradient(1px 1px at 60% 20%, var(--gold) 50%, transparent 51%), radial-gradient(1px 1px at 30% 85%, var(--gold) 50%, transparent 51%), radial-gradient(1px 1px at 90% 40%, var(--gold) 50%, transparent 51%)",
          backgroundSize: "100% 100%",
        }}
      />

      {/* Opening fade-out veil */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 0%, var(--emerald-darker) 80%)",
            }}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Two golden gate halves parting */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 z-20"
        initial={{ x: 0 }}
        animate={{ x: opening ? "-100%" : 0 }}
        transition={{ duration: 1.6, ease: [0.7, 0, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, transparent 95%, oklch(0.62 0.13 70 / 0.35) 100%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 z-20"
        initial={{ x: 0 }}
        animate={{ x: opening ? "100%" : 0 }}
        transition={{ duration: 1.6, ease: [0.7, 0, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(270deg, transparent, transparent 95%, oklch(0.62 0.13 70 / 0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Central composition */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: opening ? 0 : 1, y: opening ? -10 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Arabesque mandala (SVG) */}
        <div className="relative" style={{ width: "min(78vw, 420px)", aspectRatio: "1" }}>
          {/* Outer rotating ring */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{
              rotate: { duration: 90, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1.2 },
            }}
          >
            <defs>
              <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.85 0.14 82)" />
                <stop offset="100%" stopColor="oklch(0.58 0.13 70)" />
              </radialGradient>
            </defs>
            {/* 16-point star */}
            <g
              stroke="url(#goldGrad)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.85"
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const a = (i * Math.PI * 2) / 16;
                const x1 = 100 + Math.cos(a) * 95;
                const y1 = 100 + Math.sin(a) * 95;
                const x2 = 100 + Math.cos(a + Math.PI) * 95;
                const y2 = 100 + Math.sin(a + Math.PI) * 95;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
              <circle cx="100" cy="100" r="95" />
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="100" r="65" />
            </g>
          </motion.svg>

          {/* Inner counter-rotating geometry */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            initial={{ rotate: 0, scale: 0.6, opacity: 0 }}
            animate={{ rotate: -360, scale: 1, opacity: 1 }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 1.2 },
            }}
          >
            <g
              stroke="oklch(0.78 0.13 82)"
              strokeWidth="0.6"
              fill="none"
              opacity="0.9"
            >
              {/* 8-point star polygon */}
              {[0, 1].map((k) => {
                const offset = (k * Math.PI) / 8;
                const pts = Array.from({ length: 8 }).map((_, i) => {
                  const a = offset + (i * Math.PI * 2) / 8;
                  return `${100 + Math.cos(a) * 55},${100 + Math.sin(a) * 55}`;
                });
                return <polygon key={k} points={pts.join(" ")} />;
              })}
              <circle cx="100" cy="100" r="40" />
              <circle cx="100" cy="100" r="28" />
            </g>
          </motion.svg>

          {/* Center arch + bismillah */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: "55%",
                height: "70%",
                borderTopLeftRadius: "9999px",
                borderTopRightRadius: "9999px",
                border: "1px solid oklch(0.62 0.13 70 / 0.55)",
                background:
                  "radial-gradient(ellipse at 50% 65%, oklch(0.18 0.05 158 / 0.85), transparent 70%)",
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="font-arabic text-gold text-2xl sm:text-3xl px-3 text-center leading-relaxed"
              >
                ﷽
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Names + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-8 flex flex-col items-center"
        >
          <p className="text-cream/60 tracking-[0.35em] uppercase text-[10px] mb-3">
            The Wedding of
          </p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl leading-tight">
            {wedding.bride} <span className="font-serif italic text-gold/70 text-2xl sm:text-3xl">&amp;</span> {wedding.groom}
          </h1>

          <div className="ornamental-divider w-64 my-6">
            <span className="font-arabic text-2xl text-gold">۞</span>
          </div>

          <button
            onClick={handleOpen}
            className="group relative px-8 py-3 rounded-sm overflow-hidden border border-gold/60 text-gold font-display tracking-[0.3em] uppercase text-xs hover:text-emerald-darker transition-colors"
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 -z-10"
              style={{ background: "var(--gradient-gold)" }}
            />
            <span className="relative">Open Invitation</span>
          </button>

          <p className="font-serif italic text-cream/50 text-xs mt-4">
            Bi'idhnillah · {wedding.dateDisplay}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
