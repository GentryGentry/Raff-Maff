import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raff Maff", short_name: "Raff Maff", description: "Matematik för åk 4–6 och lärarens didaktik.",
    lang: "sv", start_url: "/", scope: "/", display: "standalone", orientation: "portrait",
    background_color: "#FBFCFE", theme_color: "#FBFCFE",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
