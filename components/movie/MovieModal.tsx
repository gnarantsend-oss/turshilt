"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, Check, X } from "lucide-react";
import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];

export function MovieModal({
  movie,
  onClose,
  onPlay,
  myList,
  onToggleList,
}: {
  movie: Movie;
  onClose: () => void;
  onPlay: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
}) {
  const inList = myList.includes(movie.id);
  const similar = movies
    .filter(
      (m) =>
        m.id !== movie.id &&
        m.genre.some((g) =>
          movie.genre.map((x) => x.name).includes(g.name)
        )
    )
    .slice(0, 6);
  const img = movie.banner || movie.poster;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="modal-box"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        <div className="modal-banner">
          {img && (
            <motion.div
              layoutId={`movie-img-${movie.id}`}
              style={{ position: "absolute", inset: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              <Image
                src={img}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="820px"
                priority
              />
            </motion.div>
          )}
          <div className="modal-banner-grad" />
          <button className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-content">
          <h2 className="modal-movie-title">{movie.title}</h2>
          <div className="modal-actions">
            <button className="modal-action-play" onClick={() => onPlay(movie)}>
              <Play fill="#0a0a0a" size={18} /> Тоглуулах
            </button>
            <button
              className="btn-circle"
              onClick={() => onToggleList(movie)}
              title={inList ? "Хасах" : "Нэмэх"}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button className="btn-circle">
              <ThumbsUp size={16} />
            </button>
            <span className="modal-rating" style={{ marginLeft: "auto" }}>
              ★ {movie.rating} / 10
            </span>
            <span
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "4px 8px",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.5)",
                borderRadius: 3,
              }}
            >
              HD
            </span>
          </div>

          {movie.overview ? (
            <p className="modal-overview">{movie.overview}</p>
          ) : (
            <p
              className="modal-overview"
              style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}
            >
              Тайлбар байхгүй байна.
            </p>
          )}

          <div className="modal-tags">
            {movie.genre.map((g) => (
              <span key={g.id} className="modal-tag">
                {g.name}
              </span>
            ))}
            {movie.tags.map((t) => (
              <span key={t} className="modal-tag">
                {t}
              </span>
            ))}
          </div>

          {similar.length > 0 && (
            <>
              <h3 className="modal-similar-title">Төстэй кинонууд</h3>
              <div className="similar-grid">
                {similar.map((m) => (
                  <div
                    key={m.id}
                    className="similar-card"
                    onClick={() => onPlay(m)}
                  >
                    <div style={{ position: "relative", height: 100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.poster || m.banner}
                        alt={m.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                    <div className="similar-card-body">
                      <div className="similar-card-name">{m.title}</div>
                      <div className="similar-card-rating">★ {m.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
