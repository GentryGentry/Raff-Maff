import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SwRegister } from "@/components/SwRegister";
import { DM_Mono, Schibsted_Grotesk } from "next/font/google";

const grotesk = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-grotesk", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dmmono", display: "swap" });

const splash = [
  [430, 932, 3, "1290x2796"], [393, 852, 3, "1179x2556"], [390, 844, 3, "1170x2532"], [375, 812, 3, "1125x2436"], [375, 667, 2, "750x1334"],
] as const;

export const metadata: Metadata = {
  title: { default: "Raff Maff", template: "%s · Raff Maff" },
  description: "Matematik för årskurs 4–6 – och hur man lär ut den.",
  applicationName: "Raff Maff",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true, title: "Raff Maff", statusBarStyle: "default",
    startupImage: splash.map(([w, h, r, f]) => ({ url: `/icons/splash-${f}.png`, media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)` })),
  },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192" }, { url: "/icons/icon-512.png", sizes: "512x512" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, viewportFit: "cover", themeColor: "var(--paper)",
};

/** Sätter valt läge innan sidan målas, så att det inte blinkar. */
const THEME_BOOT = `try{var t=localStorage.getItem("rm-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;var c=t==="dark"?"#10162B":"#FBFCFE";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",c);m.removeAttribute("media")})}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv" className={`${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} /></head>
      <body>{children}<SwRegister /></body>
    </html>
  );
}
