"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HoverPreview } from "./HoverPreview";
import type { Movie } from "@/types/movie";

export function MovieCard({
  movie,
  wide = false,
  onPlay,
  onInfo,
  myList,
  onToggleList,
  progress,
}: {
  movie: Movie;
  wide?: boolean;
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
  progress?: number;
}) {
  const imgSrc = movie.poster || movie.banner;
  const cardStyle = wide
    ? { minWidth: 280, height: 160 }
    : { minWidth: 145, height: 210 };

  return (
    <div className="movie-card" style={cardStyle}>
      <div className="movie-card-inner">
        <motion.div
          layoutId={`movie-img-${movie.id}`}
          style={{ position: "absolute", inset: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.75rem",
                  textAlign: "center",
                }}
              >
                {movie.title}
              </span>
            </div>
          )}
        </motion.div>
        <div className="card-grad" />
        <div className="card-info">
          <div className="card-rating">★ {movie.rating}</div>
          <div className="card-name">{movie.title}</div>
        </div>
        {progress != null && progress > 0 && (
          <div className="card-progress-wrap">
            <div
              className="card-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <HoverPreview
        movie={movie}
        onPlay={() => onPlay(movie)}
        onInfo={() => onInfo(movie)}
        myList={myList}
        onToggleList={() => onToggleList(movie)}
      />
    </div>
  );
}
