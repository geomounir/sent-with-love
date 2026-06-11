import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { Invitation } from "@/components/Invitation";

const Envelope2D = lazy(() =>
  import("@/components/Envelope2D").then((m) => ({ default: m.Envelope2D })),
);

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

  return (
    <>
      {!opened && (
        <Suspense
          fallback={
            <div className="w-full h-screen flex items-center justify-center bg-emerald-deep">
              <p className="text-gold font-display tracking-[0.3em] uppercase text-sm animate-shimmer">
                Preparing your invitation…
              </p>
            </div>
          }
        >
          <Envelope3D onOpened={() => setOpened(true)} />
        </Suspense>
      )}
      {opened && <Invitation />}
    </>
  );
}
