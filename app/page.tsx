"use client";
import { useEffect, useState } from "react";
import moviesData from "@/lib/movies.json";

type Movie = {
  id: number; title: string; overview: string;
  poster: string; banner: string; rating: number;
  bunnyEmbedUrl: string;
  genre: { id: number; name: string }[];
  tags: string[];
};

const movies = moviesData as Movie[];

const ROWS = [
  { label: "🔥 Трэнд",    filter: (m: Movie) => m.tags.includes("trending") },
  { label: "🆕 Шинэ",     filter: (m: Movie) => m.tags.includes("new") },
  { label: "⭐ Топ 10",   filter: (m: Movie) => m.tags.includes("top10") },
  { label: "💥 Алдартай", filter: (m: Movie) => m.tags.includes("popular") },
  { label: "👻 Аймшиг",   filter: (m: Movie) => m.tags.includes("horror") },
];

export default function Home() {
  const [scrolled, setScrolled]     = useState(false);
  const [selected, setSelected]     = useState<Movie | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const [genre, setGenre]           = useState("Бүгд");

  const hero   = movies[0];
  const genres = ["Бүгд", ...Array.from(new Set(movies.flatMap(m => m.genre.map(g => g.name))))];
  const filtered = genre === "Бүгд" ? movies : movies.filter(m => m.genre.some(g => g.name === genre));
  const searchResults = searchQ.trim().length > 1
    ? movies.filter(m => m.title.toLowerCase().includes(searchQ.toLowerCase())).slice(0, 20)
    : [];

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selected || searchOpen) ? "hidden" : "";
  }, [selected, searchOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : "top"}`}>
        <span className="logo">NABO</span>
        <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Хайх">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${hero.banner || hero.poster})` }} />
        <div className="hero-content">
          <h1 className="hero-title">{hero.title}</h1>
          {hero.overview && <p className="hero-overview">{hero.overview}</p>}
          <button className="btn-play" onClick={() => setSelected(hero)}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Үзэх
          </button>
        </div>
      </section>

      {/* GENRE FILTER */}
      <div className="genre-filter">
        {genres.map(g => (
          <button key={g} className={`genre-btn${genre === g ? " active" : ""}`} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>

      {/* ROWS */}
      <div className="rows">
        {genre !== "Бүгд" ? (
          <div>
            <p className="row-title">{genre}</p>
            <div className="row-scroll">
              {filtered.map(m => <Card key={m.id} movie={m} onClick={() => setSelected(m)} />)}
            </div>
          </div>
        ) : (
          ROWS.map(row => {
            const list = movies.filter(row.filter);
            if (!list.length) return null;
            return (
              <div key={row.label}>
                <p className="row-title">{row.label}</p>
                <div className="row-scroll">
                  {list.map(m => <Card key={m.id} movie={m} onClick={() => setSelected(m)} />)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PLAYER MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-video">
              <video src={selected.bunnyEmbedUrl} controls autoPlay playsInline style={{ width: "100%", height: "100%" }} />
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{selected.title}</h2>
              <div className="modal-meta">
                <span className="modal-rating">★ {selected.rating}</span>
                <span className="modal-genre">{selected.genre.map(g => g.name).join(", ")}</span>
              </div>
              {selected.overview && <p className="modal-overview">{selected.overview}</p>}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => { setSearchOpen(false); setSearchQ(""); }}>
          <div className="search-box" onClick={e => e.stopPropagation()}>
            <div className="search-input-wrap">
              <svg width="18" height="18" fill="none" stroke="#888" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                autoFocus className="search-input"
                placeholder="Кино хайх..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              <button className="search-close" onClick={() => { setSearchOpen(false); setSearchQ(""); }}>✕</button>
            </div>
            <div className="search-results">
              {searchQ.trim().length <= 1 && <p className="search-empty">Хайх нэрээ бичнэ үү...</p>}
              {searchQ.trim().length > 1 && searchResults.length === 0 && <p className="search-empty">"{searchQ}" олдсонгүй</p>}
              {searchResults.map(m => (
                <div key={m.id} className="search-card"
                  onClick={() => { setSelected(m); setSearchOpen(false); setSearchQ(""); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.poster || m.banner} alt={m.title} />
                  <p className="search-card-title">{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Card({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={movie.poster || movie.banner} alt={movie.title} loading="lazy" />
      <div className="card-info">
        <p className="card-title">{movie.title}</p>
        <p className="card-rating">★ {movie.rating}</p>
      </div>
    </div>
  );
}
