"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, Plus, Check, ThumbsUp, Info, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";

type Movie = {
  id: number; title: string; overview: string;
  poster: string; banner: string; rating: number;
  bunnyEmbedUrl: string;
  genre: { id: number; name: string }[];
  tags: string[];
};

interface Props {
  movies: Movie[];
  onClose: () => void;
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
}

export default function DiscoverFeed({ movies, onClose, onPlay, onInfo, myList, onToggleList }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIdx(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    slideRefs.current.forEach((el) => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [movies]);

  const goTo = useCallback((idx: number) => {
    const el = slideRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "#000",
    }}>
      {/* Fixed UI */}
      <button onClick={onClose} className="discover-close-btn">
        <X size={18} />
      </button>

      <div className="discover-label">DISCOVER</div>

      <button onClick={() => setMuted(m => !m)} className="discover-mute-btn">
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Prev / Next arrows */}
      {activeIdx > 0 && (
        <button onClick={() => goTo(activeIdx - 1)} className="discover-nav-btn discover-nav-up">
          <ChevronUp size={22} />
        </button>
      )}
      {activeIdx < movies.length - 1 && (
        <button onClick={() => goTo(activeIdx + 1)} className="discover-nav-btn discover-nav-down">
          <ChevronDown size={22} />
        </button>
      )}

      {/* Progress dots */}
      <div className="discover-dots">
        {movies.slice(0, 12).map((_, i) => (
          <div key={i} onClick={() => goTo(i)} className={`discover-dot ${i === activeIdx ? "active" : ""}`} />
        ))}
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        style={{
          height: "100%", overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
        className="scrollbar-hide"
      >
        {movies.map((movie, i) => {
          const isActive = i === activeIdx;
          const isMp4 = movie.bunnyEmbedUrl?.endsWith(".mp4");
          const imgSrc = movie.banner || movie.poster;
          const inList = myList.includes(movie.id);

          return (
            <div
              key={movie.id}
              ref={el => { slideRefs.current[i] = el; }}
              style={{
                height: "100vh", width: "100%",
                scrollSnapAlign: "start",
                position: "relative", flexShrink: 0,
              }}
            >
              {/* Background media */}
              {isActive && isMp4 ? (
                <video
                  src={movie.bunnyEmbedUrl}
                  autoPlay loop muted={muted} playsInline
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : imgSrc ? (
                <Image src={imgSrc} alt={movie.title} fill className="object-cover" sizes="100vw" priority={i === 0} />
              ) : null}

              {/* Gradients */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.55) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />

              {/* Right actions */}
              <div className="discover-actions">
                <div className="discover-action-item">
                  <button
                    className={`discover-action-btn ${inList ? "active" : ""}`}
                    onClick={() => onToggleList(movie)}
                  >
                    {inList ? <Check size={22} /> : <Plus size={22} />}
                  </button>
                  <span className="discover-action-label">{inList ? "Хадгалсан" : "Хадгалах"}</span>
                </div>
                <div className="discover-action-item">
                  <button className="discover-action-btn"><ThumbsUp size={22} /></button>
                  <span className="discover-action-label">Таалагдлаа</span>
                </div>
                <div className="discover-action-item">
                  <button className="discover-action-btn" onClick={() => { onInfo(movie); onClose(); }}>
                    <Info size={22} />
                  </button>
                  <span className="discover-action-label">Дэлгэрэнгүй</span>
                </div>
              </div>

              {/* Bottom info */}
              <div className="discover-info">
                <div className="discover-genre">
                  {movie.genre.slice(0, 2).map(g => g.name).join(" · ")}
                </div>
                <h2 className="discover-title">{movie.title}</h2>
                {movie.overview && (
                  <p className="discover-overview">{movie.overview}</p>
                )}
                <div className="discover-btns">
                  <button
                    className="discover-play-btn"
                    onClick={() => { onPlay(movie); onClose(); }}
                  >
                    <Play fill="#0a0a0a" size={16} /> Тоглуулах
                  </button>
                  <span className="discover-rating">★ {movie.rating}</span>
                </div>
              </div>

              {/* Slide number */}
              <div className="discover-counter">{i + 1} / {movies.length}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
