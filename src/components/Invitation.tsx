import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import arabesque from "@/assets/arabesque-bg.jpg";
import couple from "@/assets/couple.jpg";

function Ornament() {
  return (
    <div className="ornamental-divider w-full max-w-md mx-auto my-8">
      <span className="font-arabic text-3xl text-gold">۞</span>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`relative py-20 px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function Countdown({ target }: { target: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { label: "Days", v: t.d },
    { label: "Hours", v: t.h },
    { label: "Minutes", v: t.m },
    { label: "Seconds", v: t.s },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
      {items.map((i) => (
        <div key={i.label} className="text-center border border-gold/30 rounded-md py-5 px-2 bg-card/40 backdrop-blur-sm">
          <div className="text-3xl sm:text-5xl font-display text-gold tabular-nums">
            {String(i.v).padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cream/70 mt-2">{i.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Invitation() {
  const [rsvp, setRsvp] = useState<null | "yes" | "no">(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative bg-emerald-deep min-h-screen overflow-x-hidden"
    >
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${arabesque})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-darker/40 via-transparent to-emerald-darker" />

        <div className="relative text-center px-6 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            className="font-arabic text-2xl sm:text-3xl text-gold mb-8"
          >
            {wedding.bismillah}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-cream/70 tracking-[0.4em] uppercase text-xs mb-6"
          >
            The Wedding of
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="font-display text-6xl sm:text-8xl text-gold leading-none"
          >
            {wedding.bride}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="font-serif italic text-gold/80 text-2xl my-3"
          >
            &amp;
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1.2 }}
            className="font-display text-6xl sm:text-8xl text-gold leading-none"
          >
            {wedding.groom}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-10"
          >
            <Ornament />
            <p className="font-serif text-cream/90 text-lg">{wedding.dateDisplay}</p>
            <p className="text-cream/60 tracking-[0.25em] uppercase text-xs mt-2">{wedding.venue} · {wedding.city}</p>
          </motion.div>
        </div>
      </section>

      {/* Bismillah / Welcome */}
      <Section className="text-center max-w-3xl mx-auto">
        <h2 className="font-arabic text-4xl sm:text-5xl text-gold leading-loose">{wedding.ayah}</h2>
        <p className="font-serif italic text-cream/80 mt-6 leading-relaxed">{wedding.ayahTranslation}</p>
        <Ornament />
        <p className="font-serif text-lg text-cream/90 leading-relaxed">{wedding.welcome}</p>
      </Section>

      {/* Couple */}
      <Section className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <img
            src={couple}
            alt="The couple"
            width={1024}
            height={1280}
            loading="lazy"
            className="rounded-md shadow-[var(--shadow-deep)] border border-gold/30"
          />
          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Our Story</p>
            <h2 className="font-display text-4xl text-gold mb-6">Two souls, one du'a</h2>
            <p className="font-serif text-cream/85 text-lg leading-relaxed">{wedding.story}</p>
          </div>
        </div>
      </Section>

      {/* Countdown */}
      <Section className="text-center">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Counting the moments</p>
        <h2 className="font-display text-4xl text-gold mb-10">Until our blessed day</h2>
        <Countdown target={wedding.date} />
      </Section>

      {/* Events */}
      <Section className="max-w-4xl mx-auto text-center">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Join Us</p>
        <h2 className="font-display text-4xl text-gold mb-10">Events</h2>
        <div className={`grid gap-6 ${wedding.events.length > 1 ? "md:grid-cols-2" : "max-w-md mx-auto"}`}>
          {wedding.events.map((e) => (
            <div key={e.title} className="border border-gold/30 rounded-md p-8 bg-card/40 backdrop-blur-sm">
              <h3 className="font-display text-2xl text-gold mb-4">{e.title}</h3>
              <p className="font-serif text-cream/90">{e.date}</p>
              <p className="font-serif text-cream/70 text-sm mb-4">{e.time}</p>
              <div className="ornamental-divider my-4"><span className="font-arabic text-gold">۞</span></div>
              <p className="font-serif text-cream/90">{e.venue}</p>
              {e.mapsUrl ? (
                <a
                  href={e.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-gold/90 hover:text-gold underline underline-offset-4 text-sm tracking-wider"
                >
                  {e.address}
                </a>
              ) : (
                <p className="text-cream/60 text-sm">{e.address}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* RSVP */}
      <Section className="max-w-xl mx-auto text-center">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Your Presence</p>
        <h2 className="font-display text-4xl text-gold mb-8">Kindly RSVP</h2>
        {rsvp ? (
          <p className="font-serif italic text-cream/90 text-lg border border-gold/30 rounded-md p-8 bg-card/40">
            {rsvp === "yes"
              ? "Jazak Allah khair — your response has been received. We cannot wait to share this blessed day with you."
              : "Thank you for letting us know. You will be in our du'as."}
          </p>
        ) : (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setRsvp("yes")}
              className="px-8 py-3 bg-[image:var(--gradient-gold)] text-emerald-darker font-display tracking-[0.2em] uppercase text-sm rounded-sm shadow-[var(--shadow-gold)] hover:scale-[1.03] transition-transform"
            >
              Joyfully Accept
            </button>
            <button
              onClick={() => setRsvp("no")}
              className="px-8 py-3 border border-gold/50 text-gold font-display tracking-[0.2em] uppercase text-sm rounded-sm hover:bg-gold/10 transition-colors"
            >
              Regretfully Decline
            </button>
          </div>
        )}
      </Section>

      {/* Closing Dua */}
      <Section className="text-center max-w-3xl mx-auto">
        <h2 className="font-arabic text-3xl sm:text-4xl text-gold leading-loose">{wedding.dua}</h2>
        <p className="font-serif italic text-cream/80 mt-6">{wedding.duaTranslation}</p>
        <Ornament />
        <p className="font-display text-2xl text-gold">{wedding.brideFull} &amp; {wedding.groomFull}</p>
        <p className="text-cream/60 tracking-[0.25em] uppercase text-xs mt-3">{wedding.dateDisplay}</p>
      </Section>

      <footer className="text-center py-10 text-cream/40 text-xs tracking-[0.25em] uppercase">
        Made with love · Bi'idhnillah
      </footer>
    </motion.main>
  );
}
