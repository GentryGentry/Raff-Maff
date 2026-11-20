"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

export function Bar({ value, tone = "gold", height = 8 }: { value: number; tone?: "gold" | "green" | "blue"; height?: number }) {
  const c = tone === "green" ? "from-[#2bb673] to-[#3ecf8e]" : tone === "blue" ? "from-[#3b82f6] to-[#60a5fa]" : "from-[#e8b64a] to-[#f3d58a]";
  return (
    <div className="w-full overflow-hidden rounded-full bg-[#182848]" style={{ height }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full bg-gradient-to-r ${c} transition-all duration-700`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

export function Ring({ value, size = 56, children }: { value: number; size?: number; children?: ReactNode }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#182848" strokeWidth={6} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={value >= 1 ? "#3ecf8e" : "#e8b64a"} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, value))} className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">{children ?? `${Math.round(value * 100)}%`}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: { href: string; label: string } }) {
  return (
    <header className="safe-top px-5 pb-3 pt-5">
      {back && <Link href={back.href} className="mb-2 inline-flex min-h-[32px] items-center text-sm text-[#8d99b3]">‹ {back.label}</Link>}
      <h1 className="text-[26px] font-bold leading-tight tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-[#8d99b3]">{subtitle}</p>}
    </header>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "gold" | "green" | "red" }) {
  const t = { muted: "bg-[#182848] text-[#c3cce0]", gold: "bg-[#e8b64a]/15 text-[#f3d58a]", green: "bg-[#3ecf8e]/15 text-[#3ecf8e]", red: "bg-[#ef6a6a]/15 text-[#ef6a6a]" }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${t}`}>{children}</span>;
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
        <div key={t.id} className="pop pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-[#e8b64a]/40 bg-[#111d38] px-4 py-3 shadow-xl">
          <span className="text-2xl">{t.icon}</span>
          <div><div className="font-semibold text-[#f3d58a]">{t.title}</div>{t.text && <div className="text-sm text-[#c3cce0]">{t.text}</div>}</div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ label = "Laddar …" }: { label?: string }) {
  return <div className="flex items-center justify-center gap-3 p-10 text-[#8d99b3]"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e8b64a] border-t-transparent" />{label}</div>;
}
