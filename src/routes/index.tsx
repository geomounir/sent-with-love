import { createFileRoute } from "@tanstack/react-router";
import { useState, lazy, Suspense } from "react";
import { Invitation } from "@/components/Invitation";

const IslamicIntro = lazy(() =>
  import("@/components/IslamicIntro").then((m) => ({ default: m.IslamicIntro })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heba & Khaled — A Blessed Union" },
      { name: "description", content: "You are warmly invited to the wedding of Heba & Khaled. Enter to view your invitation." },
      { property: "og:title", content: "Heba & Khaled — A Blessed Union" },
      { property: "og:description", content: "Enter to view your invitation." },
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
          <IslamicIntro onOpened={() => setOpened(true)} />
        </Suspense>
      )}
      {opened && <Invitation />}
    </>
  );
}
