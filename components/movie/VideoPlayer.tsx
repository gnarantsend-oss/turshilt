"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import type { Movie } from "@/types/movie";

export function VideoPlayer({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const isMp4 = movie.bunnyEmbedUrl.endsWith(".mp4");

  return (
    <div className="player-wrap">
      <div className="player-topbar">
        <button className="player-back-btn" onClick={onClose}>
          <ArrowLeft size={18} /> Буцах
        </button>
        <span className="player-movie-name">{movie.title}</span>
      </div>
      {isMp4 ? (
        <video
          className="player-frame"
          src={movie.bunnyEmbedUrl}
          controls
          autoPlay
          style={{ background: "#000" }}
        />
      ) : (
        <iframe
          className="player-frame"
          src={movie.bunnyEmbedUrl}
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      )}
    </div>
  );
}
