"use client";

import { MovieCard } from "./MovieCard";
import { MovieRow } from "./MovieRow";
import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];

type AmbientProps = {
  onHoverColor?: (src: string) => void;
  onHoverEnd?: () => void;
};

// ── Continue Watching ──────────────────────────────────────────────
export function ContinueWatchingRow({ watchProgress, onPlay, onInfo, myList, onToggleList, onHoverColor, onHoverEnd }: {
  watchProgress: Record<number, number>;
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
} & AmbientProps) {
  const continueMovies = movies.filter(
    m => watchProgress[m.id] != null && watchProgress[m.id] > 0 && watchProgress[m.id] < 95
  );
  if (!continueMovies.length) return null;
  return (
    <section className="row-section">
      <div className="continue-label">
        <span className="continue-dot" />
        <span className="section-label" style={{ marginBottom: 0 }}>Үргэлжлүүлэх</span>
      </div>
      <div className="section-divider" />
      <h3 className="section-title">Хаана зогссон бэ</h3>
      <div className="scrollbar-hide row-scroll">
        {continueMovies.map(m => (
          <MovieCard key={m.id} movie={m} wide
            onPlay={onPlay} onInfo={onInfo}
            myList={myList} onToggleList={onToggleList}
            progress={watchProgress[m.id]}
            onHoverColor={onHoverColor} onHoverEnd={onHoverEnd}
          />
        ))}
      </div>
    </section>
  );
}

// ── Top 10 ─────────────────────────────────────────────────────────
export function Top10Row({ list, onPlay, onInfo, myList, onToggleList, onHoverColor, onHoverEnd }: {
  list: Movie[]; onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
} & AmbientProps) {
  if (!list.length) return null;
  return (
    <section className="row-section">
      <div className="section-label">Монгол</div>
      <div className="section-divider" />
      <h3 className="section-title">Топ 10</h3>
      <div className="scrollbar-hide row-scroll row-scroll-tight">
        {list.map((m, i) => (
          <div key={m.id} className="top10-item">
            <span className="top10-num">{i + 1}</span>
            <div className="top10-card">
              <MovieCard movie={m} onPlay={onPlay} onInfo={onInfo}
                myList={myList} onToggleList={onToggleList}
                onHoverColor={onHoverColor} onHoverEnd={onHoverEnd}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── My List ────────────────────────────────────────────────────────
export function MyListRow({ myList, onPlay, onInfo, onToggleList, onHoverColor, onHoverEnd }: {
  myList: number[]; onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void; onToggleList: (m: Movie) => void;
} & AmbientProps) {
  const listMovies = movies.filter(m => myList.includes(m.id));
  if (!listMovies.length) return null;
  return (
    <MovieRow label="Хадгалсан" title="Миний жагсаалт"
      movies={listMovies} onPlay={onPlay} onInfo={onInfo}
      myList={myList} onToggleList={onToggleList}
      onHoverColor={onHoverColor} onHoverEnd={onHoverEnd}
    />
  );
}
