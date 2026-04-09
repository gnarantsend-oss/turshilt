"use client";

import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react";
import type { Movie } from "@/types/movie";

export function HoverPreview({
  movie,
  onPlay,
  onInfo,
  myList,
  onToggleList,
}: {
  movie: Movie;
  onPlay: () => void;
  onInfo: () => void;
  myList: number[];
  onToggleList: () => void;
}) {
  const inList = myList.includes(movie.id);
  const img = movie.banner || movie.poster;

  return (
    <div className="hover-preview">
      <div className="hover-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img && <img src={img} alt={movie.title} />}
        <div className="hover-thumb-grad" />
        <div className="hover-thumb-title">{movie.title}</div>
      </div>
      <div className="hover-body">
        <div className="hover-btns">
          <button className="hp-play" onClick={onPlay}>
            <Play fill="#0a0a0a" size={15} />
          </button>
          <button className="hp-circle" onClick={onToggleList}>
            {inList ? <Check size={14} /> : <Plus size={14} />}
          </button>
          <button className="hp-circle">
            <ThumbsUp size={14} />
          </button>
          <button
            className="hp-circle hp-info"
            onClick={onInfo}
            style={{ marginLeft: "auto" }}
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="hover-rating">★ {movie.rating}</div>
        <div className="hover-genres">
          {movie.genre.slice(0, 3).map((g) => (
            <span key={g.id} className="hover-genre-tag">
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
