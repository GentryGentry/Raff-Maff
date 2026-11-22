"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { StateProvider, useAppState } from "@/lib/client/state";
import { ToastHost } from "@/components/ui";

const NAV = [
  { href: "/", label: "Hem" },
  { href: "/varldskarta", label: "Karta" },
  { href: "/lararakademin", label: "Akademi" },
  { href: "/repetition", label: "Repetera" },
  { href: "/profil", label: "Profil" },
];

function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { offline, state } = useAppState();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <div className="mx-auto min-h-dvh max-w-xl pb-28">
      {offline && <div className="safe-top bg-hl px-4 py-2 text-center text-xs text-onhl">Du är offline – framsteg i övningar sparas och skickas när du är online igen.</div>}
      <main>{children}</main>
      <ToastHost />
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper" aria-label="Huvudmeny">
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`uppercase relative flex min-h-[54px] items-center justify-center text-[10.5px] ${active(n.href) ? "bg-hl text-onhl" : "text-muted"}`}>
                {n.label}
                {n.href === "/repetition" && (state?.revisionDue ?? 0) > 0 && <span className="absolute right-[14%] top-2 h-2 w-2 rounded-full bg-bad" aria-label="Repetition väntar" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
export default function AppLayout({ children }: { children: ReactNode }) {
  return <StateProvider><Shell>{children}</Shell></StateProvider>;
}
