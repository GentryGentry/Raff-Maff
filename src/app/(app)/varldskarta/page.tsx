"use client";
import Link from "next/link";
import { PageHeader, Pill, Ring, Spinner } from "@/components/ui";
import { useAppState } from "@/lib/client/state";
import { WORLDS } from "@/lib/content";

export default function WorldMap() {
  const { state, loading } = useAppState();
  if (loading || !state) return <Spinner />;
  return (
    <div className="pb-6">
      <PageHeader title="Världskarta" subtitle="13 världar. Du låser upp nästa genom att besegra bossen." />
      <ol className="relative px-5">
        <div className="absolute bottom-6 left-[2.35rem] top-6 w-0.5 bg-gradient-to-b from-[#e8b64a]/60 to-[#223660]" aria-hidden />
        {WORLDS.map((w) => {
          const ws = state.worlds[w.id];
          const built = w.lessons.length > 0;
          const status = !built ? "planned" : !ws.unlocked ? "locked" : ws.bossPassed ? "done" : "open";
          const inner = (
            <div className={`card relative flex items-center gap-4 p-4 ${status === "open" ? "border-[#e8b64a]/50" : ""} ${status === "planned" || status === "locked" ? "opacity-60" : ""}`}>
              <div className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-xl ${status === "done" ? "border-[#3ecf8e] bg-[#3ecf8e]/15" : status === "open" ? "border-[#e8b64a] bg-[#e8b64a]/15" : "border-[#223660] bg-[#0b1428]"}`}>{status === "locked" ? "🔒" : status === "planned" ? "🚧" : status === "done" ? "✓" : w.icon}</div>
              <div className="min-w-0 flex-1"><div className="truncate font-semibold">{w.index}. {w.title}</div><div className="text-xs text-[#8d99b3]">{built ? `${ws.completedLessons}/${ws.total} lektioner${ws.bossPassed ? " · boss besegrad" : ""}` : `${w.planned?.length ?? 0} lektioner planerade`}</div></div>
              {built && ws.unlocked ? <Ring value={ws.total ? ws.completedLessons / ws.total : 0} size={44} /> : <Pill>{status === "planned" ? "Under uppbyggnad" : "Låst"}</Pill>}
            </div>
          );
          return <li key={w.id} className="relative mb-3">{status === "locked" ? inner : <Link href={`/varldskarta/${w.id}`}>{inner}</Link>}</li>;
        })}
      </ol>
    </div>
  );
}
