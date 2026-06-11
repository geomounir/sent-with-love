import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { Invitation } from "@/components/Invitation";

const Envelope2D = lazy(() =>
  import("@/components/Envelope2D").then((m) => ({ default: m.Envelope2D })),
);
const EnvelopeFold = lazy(() =>
  import("@/components/EnvelopeFold").then((m) => ({ default: m.EnvelopeFold })),
);

type Variant = "envelope" | "fold";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aisha & Yusuf — A Blessed Union" },
      { name: "description", content: "You are warmly invited to the wedding of Aisha & Yusuf. Press the wax seal to open your invitation." },
      { property: "og:title", content: "Aisha & Yusuf — A Blessed Union" },
      { property: "og:description", content: "Press the wax seal to open your invitation." },
    ],
  }),
  component: Index,
  ssr: false,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [variant, setVariant] = useState<Variant>("envelope");

  return (
    <>
      {!opened && (
        <>
          <div className="fixed top-4 right-4 z-50 flex gap-1 bg-black/40 backdrop-blur rounded-full p-1 border border-[var(--gold)]/30">
            {(["envelope", "fold"] as Variant[]).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-3 py-1 rounded-full text-[10px] font-display tracking-[0.2em] uppercase transition ${
                  variant === v
                    ? "bg-[var(--gold)] text-[var(--emerald-darker)]"
                    : "text-[var(--gold)]/70 hover:text-[var(--gold)]"
                }`}
              >
                {v === "envelope" ? "Envelope" : "Folded"}
              </button>
            ))}
          </div>
          <Suspense
            fallback={
              <div className="w-full h-screen flex items-center justify-center bg-emerald-deep">
                <p className="text-gold font-display tracking-[0.3em] uppercase text-sm animate-shimmer">
                  Preparing your invitation…
                </p>
              </div>
            }
          >
            {variant === "envelope" ? (
              <Envelope2D onOpened={() => setOpened(true)} />
            ) : (
              <EnvelopeFold onOpened={() => setOpened(true)} />
            )}
          </Suspense>
        </>
      )}
      {opened && <Invitation />}
    </>
  );
}

