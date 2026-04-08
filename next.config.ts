import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      // ✅ Таны movies.json дахь бодит image host-ууд
      { protocol: "https", hostname: "*.b-cdn.net" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "tbinoukdsxxmbtzkghvj.supabase.co" },
      { protocol: "https", hostname: "cdn.moviefone.com" },
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
      { protocol: "https", hostname: "i.namu.wiki" },
      { protocol: "https", hostname: "imusic.b-cdn.net" },
      { protocol: "https", hostname: "asianwiki.com" },
      { protocol: "https", hostname: "lovingmoviesfr.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;

// Зөвхөн dev орчинд
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev()
  );
}
