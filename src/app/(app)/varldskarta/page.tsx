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
      <ol className="mx-5 border-[1.5px] border-b-0 border-ink bg-paper">
        {WORLDS.map((w) => {
          const ws = state.worlds[w.id];
          const built = w.lessons.length > 0;
          const status = !built ? "planned" : !ws.unlocked ? "locked" : ws.bossPassed ? "done" : "open";
          const label = status === "planned" ? "Planerad" : status === "locked" ? "Låst" : status === "done" ? "Klar" : `${ws.completedLessons}/${ws.total}`;
          const inner = (
            <div className={`grid grid-cols-[34px_1fr_auto] items-baseline gap-2 border-b border-rule px-3 py-3.5 ${status === "locked" || status === "planned" ? "[&>*]:opacity-50" : ""}`}>
              <span className="uppercase text-[11px] text-muted">{String(w.index).padStart(2, "0")}</span>
              <span className={`${status === "open" ? "font-extrabold" : "font-semibold"} truncate`}>{w.title}<span className="mt-0.5 block text-xs font-normal text-muted">{built ? `${ws.completedLessons}/${ws.total} lektioner${ws.bossPassed ? " · boss besegrad" : ""}` : `${w.planned?.length ?? 0} lektioner planerade`}</span></span>
              <span className={`uppercase text-[10.5px] ${status === "open" ? "bg-hl px-1.5 py-0.5 text-onhl" : "text-muted"}`}>{label}</span>
            </div>
          );
          return <li key={w.id}>{status === "locked" || status === "planned" ? inner : <Link href={`/varldskarta/${w.id}`} className="block">{inner}</Link>}</li>;
        })}
      </ol>
    </div>
  );
}
