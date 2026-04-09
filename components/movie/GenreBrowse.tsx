"use client";

import { useState } from "react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];
const ALL_GENRES = [
  "Бүгд",
  ...Array.from(new Set(movies.flatMap(m => m.genre.map(g => g.name)))).sort(),
];

export function GenreBrowse({ onPlay, onInfo, myList, onToggleList }: {
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
}) {
  const [activeGenre, setActiveGenre] = useState("Бүгд");
  const filtered = activeGenre === "Бүгд"
    ? movies.slice(0, 24)
    : movies.filter(m => m.genre.some(g => g.name === activeGenre)).slice(0, 24);

  return (
    <section className="genre-section">
      <div className="section-label">Хайлт</div>
      <div className="section-divider" />
      <h3 className="section-title">Жанрын дагуу</h3>
      <div className="genre-tabs">
        {ALL_GENRES.map(g => (
          <button key={g} className={`genre-tab ${activeGenre === g ? "active" : ""}`}
            onClick={() => setActiveGenre(g)}>{g}</button>
        ))}
      </div>
      <div className="scrollbar-hide row-scroll">
        {filtered.map(m => (
          <MovieCard key={m.id} movie={m} onPlay={onPlay} onInfo={onInfo}
            myList={myList} onToggleList={onToggleList} />
        ))}
      </div>
    </section>
  );
}
