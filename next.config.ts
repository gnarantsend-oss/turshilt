import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // ✅ TMDB movie poster зургууд
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        // ✅ Bunny.net CDN (ирээдүйд хэрэгтэй)
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;

// ✅ ЗАСВАР: зөвхөн dev орчинд дуудагдана — build crash засагдлаа
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
