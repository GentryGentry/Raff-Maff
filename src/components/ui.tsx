"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export function Bar({ value, tone = "gold", height = 8 }: { value: number; tone?: "gold" | "green" | "blue"; height?: number }) {
  const fill = tone === "green" ? "bg-ink" : tone === "blue" ? "bg-fig" : "bg-hl";
  return (
    <div className="w-full overflow-hidden border border-ink bg-paper" style={{ height: height + 2 }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full ${fill} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

export function Ring({ value, size = 56, children }: { value: number; size?: number; children?: ReactNode }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--rule)" strokeWidth={6} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ink)" strokeWidth={6} fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, value))} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">{children ?? `${Math.round(value * 100)}%`}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: { href: string; label: string } }) {
  return (
    <header className="safe-top px-5 pb-3 pt-5">
      {back && <Link href={back.href} className="mb-2 inline-flex min-h-[32px] items-center text-sm text-muted">‹ {back.label}</Link>}
      <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "gold" | "green" | "red" }) {
  const t = { muted: "border-rule text-ink2", gold: "border-ink bg-hl text-onhl", green: "border-ink text-ink", red: "border-bad text-bad" }[tone];
  return <span className={`uppercase inline-flex items-center border px-2 py-0.5 text-[11px] ${t}`}>{children}</span>;
}

type Toast = { id: number; icon: string; title: string; text?: string };
export function pushToast(t: Omit<Toast, "id">) { window.dispatchEvent(new CustomEvent("rm-toast", { detail: t })); }
export function ToastHost() {
  const [list, setList] = useState<Toast[]>([]);
  useEffect(() => {
    const on = (e: Event) => {
      const t = { ...(e as CustomEvent).detail, id: Date.now() + Math.random() } as Toast;
      setList((l) => [...l, t]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), 4500);
    };
    window.addEventListener("rm-toast", on);
    return () => window.removeEventListener("rm-toast", on);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 safe-top pt-3" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className="pop pointer-events-auto flex w-full max-w-md items-center gap-3 border-[1.5px] border-ink bg-paper px-4 py-3">
                    <div><div className="font-bold text-ink">{t.title}</div>{t.text && <div className="text-sm text-ink2">{t.text}</div>}</div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ label = "Laddar …" }: { label?: string }) {
  return <div className="flex items-center justify-center gap-3 p-10 text-muted"><span className="h-5 w-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />{label}</div>;
}
