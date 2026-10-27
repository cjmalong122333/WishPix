import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WishPix Teacher App",
    short_name: "WishPix",
    description:
      "WishPix: An AI-Powered Voice-Activated Generative Learning and Thermal Sticker Printing Kiosk for Early Childhood Education Centers.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0F253E",
    theme_color: "#0F253E",
    categories: ["education", "productivity", "utilities"],
    icons: [
      {
        src: "/pwa-icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
