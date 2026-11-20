"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { StateProvider, useAppState } from "@/lib/client/state";
import { ToastHost } from "@/components/ui";

const NAV = [
  { href: "/", label: "Hem", icon: "🏠" },
  { href: "/varldskarta", label: "Världskarta", icon: "🗺️" },
  { href: "/lararakademin", label: "Lärarakademin", icon: "🎓" },
  { href: "/repetition", label: "Repetition", icon: "🔁" },
  { href: "/profil", label: "Profil", icon: "👤" },
];

function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { offline, state } = useAppState();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <div className="mx-auto min-h-dvh max-w-xl pb-28">
      {offline && <div className="safe-top bg-[#e8b64a]/15 px-4 py-2 text-center text-xs text-[#f3d58a]">Du är offline – framsteg i övningar sparas och skickas när du är online igen.</div>}
      <main>{children}</main>
      <ToastHost />
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070d1c]/95 backdrop-blur" aria-label="Huvudmeny">
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={`relative flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-[10.5px] ${active(n.href) ? "text-[#f3d58a]" : "text-[#8d99b3]"}`}>
                <span className="text-xl leading-none">{n.icon}</span>{n.label}
                {n.href === "/repetition" && (state?.revisionDue ?? 0) > 0 && <span className="absolute right-[24%] top-2 h-2 w-2 rounded-full bg-[#e8b64a]" aria-label="Repetition väntar" />}
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
