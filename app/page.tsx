"use client";
import { useEffect, useRef, useState } from "react";
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
  { label: "🔥 Трэнд",        filter: (m: Movie) => m.tags.includes("trending") },
  { label: "🆕 Шинэ",         filter: (m: Movie) => m.tags.includes("new") },
  { label: "⭐ Топ 10",        filter: (m: Movie) => m.tags.includes("top10") },
  { label: "💥 Алдартай",     filter: (m: Movie) => m.tags.includes("popular") },
  { label: "👻 Аймшиг",       filter: (m: Movie) => m.tags.includes("horror") },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [genre, setGenre] = useState("Бүгд");

  const hero = movies[0];

  const genres = ["Бүгд", ...Array.from(new Set(movies.flatMap(m => m.genre.map(g => g.name))))];

  const filtered = genre === "Бүгд"
    ? movies
    : movies.filter(m => m.genre.some(g => g.name === genre));

  const searchResults = searchQ.trim().length > 1
    ? movies.filter(m => m.title.toLowerCase().includes(searchQ.toLowerCase())).slice(0, 20)
    : [];

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setSelected(null); }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selected || searchOpen) ? "hidden" : "";
  }, [selected, searchOpen]);

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : "top"}`}>
        <span className="logo">NABO</span>
        <div className="nav-links">
          {["Нүүр", "Трэнд", "Шинэ", "Топ 10"].map(l => (
            <button key={l}>{l}</button>
          ))}
        </div>
        <div className="nav-right">
          <button className="search-btn" onClick={() => setSearchOpen(true)} title="Хайх (Ctrl+K)">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${hero.banner || hero.poster})` }} />
        <div className="hero-content">
          <h1 className="hero-title">{hero.title}</h1>
          {hero.overview && <p className="hero-overview">{hero.overview}</p>}
          <div className="hero-buttons">
            <button className="btn-play" onClick={() => setSelected(hero)}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Үзэх
            </button>
            <button className="btn-info" onClick={() => setSelected(hero)}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              Дэлгэрэнгүй
            </button>
          </div>
        </div>
      </section>

      {/* GENRE FILTER */}
      <div className="genre-filter" style={{ marginTop: -20, marginBottom: 24 }}>
        {genres.map(g => (
          <button key={g} className={`genre-btn ${genre === g ? "active" : ""}`} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>

      {/* ROWS */}
      <div className="rows" style={{ paddingTop: 0 }}>
        {genre !== "Бүгд" ? (
          <div>
            <p className="row-title">{genre}</p>
            <div className="row-scroll">
              {filtered.map(m => <Card key={m.id} movie={m} onClick={() => setSelected(m)} />)}
            </div>
          </div>
        ) : (
          ROWS.map(row => {
            const list = row.filter ? movies.filter(row.filter) : movies;
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
              <video
                src={selected.bunnyEmbedUrl}
                controls autoPlay
                style={{ width: "100%", height: "100%" }}
              />
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
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-input-wrap" onClick={e => e.stopPropagation()}>
            <svg width="18" height="18" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
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
          <div className="search-results" onClick={e => e.stopPropagation()}>
            {searchQ.trim().length > 1 && searchResults.length === 0 && (
              <p className="search-empty">"{searchQ}" олдсонгүй</p>
            )}
            {searchResults.map(m => (
              <div key={m.id} className="search-card" onClick={() => { setSelected(m); setSearchOpen(false); setSearchQ(""); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.poster || m.banner} alt={m.title} />
                <p className="search-card-title">{m.title}</p>
              </div>
            ))}
            {searchQ.trim().length === 0 && <p className="search-empty">Хайх гарчгаа бичнэ үү...</p>}
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
