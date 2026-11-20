import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SwRegister } from "@/components/SwRegister";

const splash = [
  [430, 932, 3, "1290x2796"], [393, 852, 3, "1179x2556"], [390, 844, 3, "1170x2532"], [375, 812, 3, "1125x2436"], [375, 667, 2, "750x1334"],
] as const;

export const metadata: Metadata = {
  title: { default: "Raff Maff", template: "%s · Raff Maff" },
  description: "Matematik för årskurs 4–6 – och hur man lär ut den.",
  applicationName: "Raff Maff",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true, title: "Raff Maff", statusBarStyle: "black-translucent",
    startupImage: splash.map(([w, h, r, f]) => ({ url: `/icons/splash-${f}.png`, media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)` })),
  },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192" }, { url: "/icons/icon-512.png", sizes: "512x512" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, viewportFit: "cover", themeColor: "#070d1c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}<SwRegister /></body>
    </html>
  );
}
