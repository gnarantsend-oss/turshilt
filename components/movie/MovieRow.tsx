"use client";

import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types/movie";

export function MovieRow({
  label,
  title,
  movies: list,
  wide = false,
  onPlay,
  onInfo,
  myList,
  onToggleList,
  progress,
}: {
  label?: string;
  title: string;
  movies: Movie[];
  wide?: boolean;
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
  progress?: Record<number, number>;
}) {
  if (!list.length) return null;

  return (
    <section style={{ padding: "0 40px 32px", overflow: "visible" }}>
      {label && <div className="section-label">{label}</div>}
      <div className="section-divider" />
      <h3 className="section-title">{title}</h3>
      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 16,
          paddingTop: 4,
          overflow: "visible",
        }}
      >
        {list.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            wide={wide}
            onPlay={onPlay}
            onInfo={onInfo}
            myList={myList}
            onToggleList={onToggleList}
            progress={progress?.[m.id]}
          />
        ))}
      </div>
    </section>
  );
}
