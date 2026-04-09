"use client";

import { MovieCard } from "./MovieCard";
import { MovieRow } from "./MovieRow";
import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];

// ── Continue Watching ──────────────────────────────────────────────
export function ContinueWatchingRow({
  watchProgress,
  onPlay,
  onInfo,
  myList,
  onToggleList,
}: {
  watchProgress: Record<number, number>;
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
}) {
  const continueMovies = movies.filter(
    (m) =>
      watchProgress[m.id] != null &&
      watchProgress[m.id] > 0 &&
      watchProgress[m.id] < 95
  );
  if (!continueMovies.length) return null;

  return (
    <section style={{ padding: "0 40px 32px", overflow: "visible" }}>
      <div className="continue-label">
        <span className="continue-dot" />
        <span className="section-label" style={{ marginBottom: 0 }}>
          Үргэлжлүүлэх
        </span>
      </div>
      <div className="section-divider" />
      <h3 className="section-title">Хаана зогссон бэ</h3>
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
        {continueMovies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            wide
            onPlay={onPlay}
            onInfo={onInfo}
            myList={myList}
            onToggleList={onToggleList}
            progress={watchProgress[m.id]}
          />
        ))}
      </div>
    </section>
  );
}

// ── Top 10 ─────────────────────────────────────────────────────────
export function Top10Row({
  list,
  onPlay,
  onInfo,
  myList,
  onToggleList,
}: {
  list: Movie[];
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  myList: number[];
  onToggleList: (m: Movie) => void;
}) {
  if (!list.length) return null;

  return (
    <section style={{ padding: "0 40px 32px", overflow: "visible" }}>
      <div className="section-label">Монгол</div>
      <div className="section-divider" />
      <h3 className="section-title">Топ 10</h3>
      <div
        className="scrollbar-hide"
        style={{
          display: "flex",
          gap: 4,
          overflowX: "auto",
          paddingBottom: 16,
          paddingTop: 8,
          overflow: "visible",
        }}
      >
        {list.map((m, i) => (
          <div
            key={m.id}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <span className="top10-num">{i + 1}</span>
            <div style={{ marginLeft: 40 }}>
              <MovieCard
                movie={m}
                onPlay={onPlay}
                onInfo={onInfo}
                myList={myList}
                onToggleList={onToggleList}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── My List ────────────────────────────────────────────────────────
export function MyListRow({
  myList,
  onPlay,
  onInfo,
  onToggleList,
}: {
  myList: number[];
  onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void;
  onToggleList: (m: Movie) => void;
}) {
  const listMovies = movies.filter((m) => myList.includes(m.id));
  if (!listMovies.length) return null;

  return (
    <MovieRow
      label="Хадгалсан"
      title="Миний жагсаалт"
      movies={listMovies}
      onPlay={onPlay}
      onInfo={onInfo}
      myList={myList}
      onToggleList={onToggleList}
    />
  );
}
