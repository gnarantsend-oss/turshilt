"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HoverPreview } from "./HoverPreview";
import type { Movie } from "@/types/movie";

export function MovieCard({
  movie, wide = false, onPlay, onInfo, myList, onToggleList, progress,
}: {
  movie: Movie; wide?: boolean;
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
  progress?: number;
}) {
  const imgSrc = movie.poster || movie.banner;

  return (
    <div className={`movie-card ${wide ? "movie-card-wide" : "movie-card-normal"}`}>
      <div className="movie-card-inner">
        <motion.div
          layoutId={`movie-img-${movie.id}`}
          style={{ position: "absolute", inset: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
        >
          {imgSrc ? (
            <Image src={imgSrc} alt={movie.title} fill className="object-cover" sizes="160px" />
          ) : (
            <div className="card-empty">
              <span className="card-empty-text">{movie.title}</span>
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
            <div className="card-progress-bar" style={{ width: `${progress}%` }} />
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
