"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Play, Info, Plus, ThumbsUp, ChevronDown, X, Check, ArrowLeft, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import DiscoverFeed from "@/components/DiscoverFeed";
import moviesData from "@/lib/movies.json";

type Movie = {
  id: number; title: string; overview: string;
  poster: string; banner: string; rating: number;
  bunnyEmbedUrl: string;
  genre: { id: number; name: string }[];
  tags: string[];
};

const movies = moviesData as Movie[];
const byTag = (tag: string) => movies.filter((m) => m.tags.includes(tag));
const byGenre = (name: string) => movies.filter((m) => m.genre.some((g) => g.name === name));

const HERO      = byTag("trending")[0] ?? movies[0];
const TRENDING  = byTag("trending").slice(0, 14);
const TOP10     = byTag("top10").slice(0, 10);
const NEW_MOVIES= byTag("new").slice(0, 14);
const ACTION    = byGenre("Экшн").slice(0, 14);
const HORROR    = byGenre("Аймшиг").slice(0, 14);
const DRAMA     = byGenre("Драм").slice(0, 14);
const THRILLER  = byGenre("Триллер").slice(0, 14);
const POPULAR   = byTag("popular").slice(0, 14);

const ALL_GENRES = ["Бүгд", ...Array.from(new Set(movies.flatMap(m => m.genre.map(g => g.name)))).sort()];

// ── Toast ──────────────────────────────────────────────────────────
function Toast({ msg, show }: { msg: string; show: boolean }) {
  return <div className={`toast ${show ? "show" : ""}`}>{msg}</div>;
}

// ── Video Player ───────────────────────────────────────────────────
function VideoPlayer({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const isMp4 = movie.bunnyEmbedUrl.endsWith(".mp4");

  return (
    <div className="player-wrap">
      <div className="player-topbar">
        <button className="player-back-btn" onClick={onClose}>
          <ArrowLeft size={18} /> Буцах
        </button>
        <span className="player-movie-name">{movie.title}</span>
      </div>
      {isMp4 ? (
        <video className="player-frame" src={movie.bunnyEmbedUrl} controls autoPlay style={{ background:"#000" }} />
      ) : (
        <iframe className="player-frame" src={movie.bunnyEmbedUrl} allowFullScreen allow="autoplay; fullscreen" />
      )}
    </div>
  );
}

// ── Movie Modal ────────────────────────────────────────────────────
function MovieModal({
  movie, onClose, onPlay, myList, onToggleList,
}: {
  movie: Movie; onClose: () => void; onPlay: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
}) {
  const inList = myList.includes(movie.id);
  const similar = movies
    .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.map(x => x.name).includes(g.name)))
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
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
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
            <motion.div layoutId={`movie-img-${movie.id}`} style={{ position:"absolute", inset:0 }}
              transition={{ type:"spring", stiffness:280, damping:30 }}>
              <Image src={img} alt={movie.title} fill className="object-cover" sizes="820px" priority />
            </motion.div>
          )}
          <div className="modal-banner-grad" />
          <button className="modal-close-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-content">
          <h2 className="modal-movie-title">{movie.title}</h2>
          <div className="modal-actions">
            <button className="modal-action-play" onClick={() => onPlay(movie)}>
              <Play fill="#0a0a0a" size={18} /> Тоглуулах
            </button>
            <button className="btn-circle" onClick={() => onToggleList(movie)} title={inList ? "Хасах" : "Нэмэх"}>
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button className="btn-circle"><ThumbsUp size={16} /></button>
            <span className="modal-rating" style={{ marginLeft:"auto" }}>★ {movie.rating} / 10</span>
            <span style={{ border:"1px solid rgba(255,255,255,0.2)", padding:"4px 8px", fontSize:"0.7rem", color:"rgba(255,255,255,0.5)", borderRadius:3 }}>HD</span>
          </div>
          {movie.overview ? (
            <p className="modal-overview">{movie.overview}</p>
          ) : (
            <p className="modal-overview" style={{ color:"rgba(255,255,255,0.3)", fontStyle:"italic" }}>Тайлбар байхгүй байна.</p>
          )}
          <div className="modal-tags">
            {movie.genre.map(g => <span key={g.id} className="modal-tag">{g.name}</span>)}
            {movie.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
          </div>
          {similar.length > 0 && (
            <>
              <h3 className="modal-similar-title">Төстэй кинонууд</h3>
              <div className="similar-grid">
                {similar.map(m => (
                  <div key={m.id} className="similar-card" onClick={() => onPlay(m)}>
                    <div style={{ position:"relative", height:100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.poster || m.banner} alt={m.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
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

// ── Hover Preview ──────────────────────────────────────────────────
function HoverPreview({
  movie, onPlay, onInfo, myList, onToggleList,
}: {
  movie: Movie; onPlay: () => void; onInfo: () => void;
  myList: number[]; onToggleList: () => void;
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
          <button className="hp-play" onClick={onPlay}><Play fill="#0a0a0a" size={15} /></button>
          <button className="hp-circle" onClick={onToggleList}>
            {inList ? <Check size={14} /> : <Plus size={14} />}
          </button>
          <button className="hp-circle"><ThumbsUp size={14} /></button>
          <button className="hp-circle hp-info" onClick={onInfo} style={{ marginLeft:"auto" }}>
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="hover-rating">★ {movie.rating}</div>
        <div className="hover-genres">
          {movie.genre.slice(0, 3).map(g => (
            <span key={g.id} className="hover-genre-tag">{g.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Movie Card ─────────────────────────────────────────────────────
function MovieCard({
  movie, wide = false, onPlay, onInfo, myList, onToggleList, progress,
}: {
  movie: Movie; wide?: boolean;
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
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
          style={{ position:"absolute", inset:0 }}
          transition={{ type:"spring", stiffness:280, damping:30 }}
        >
          {imgSrc ? (
            <Image src={imgSrc} alt={movie.title} fill className="object-cover" sizes="160px" />
          ) : (
            <div style={{ width:"100%", height:"100%", background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", padding:8 }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.75rem", textAlign:"center" }}>{movie.title}</span>
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
            <div className="card-progress-bar" style={{ width:`${progress}%` }} />
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

// ── Movie Row ──────────────────────────────────────────────────────
function MovieRow({
  label, title, movies: list, wide = false, onPlay, onInfo, myList, onToggleList, progress,
}: {
  label?: string; title: string; movies: Movie[]; wide?: boolean;
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
  progress?: Record<number, number>;
}) {
  if (!list.length) return null;
  return (
    <section style={{ padding:"0 40px 32px", overflow:"visible" }}>
      {label && <div className="section-label">{label}</div>}
      <div className="section-divider" />
      <h3 className="section-title">{title}</h3>
      <div className="scrollbar-hide" style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:16, paddingTop:4, overflow:"visible" }}>
        {list.map(m => (
          <MovieCard key={m.id} movie={m} wide={wide} onPlay={onPlay} onInfo={onInfo} myList={myList} onToggleList={onToggleList} progress={progress?.[m.id]} />
        ))}
      </div>
    </section>
  );
}

// ── Continue Watching ──────────────────────────────────────────────
function ContinueWatchingRow({ watchProgress, onPlay, onInfo, myList, onToggleList }: {
  watchProgress: Record<number, number>;
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
}) {
  const continueMovies = movies.filter(m => watchProgress[m.id] != null && watchProgress[m.id] > 0 && watchProgress[m.id] < 95);
  if (!continueMovies.length) return null;
  return (
    <section style={{ padding:"0 40px 32px", overflow:"visible" }}>
      <div className="continue-label">
        <span className="continue-dot" />
        <span className="section-label" style={{ marginBottom:0 }}>Үргэлжлүүлэх</span>
      </div>
      <div className="section-divider" />
      <h3 className="section-title">Хаана зогссон бэ</h3>
      <div className="scrollbar-hide" style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:16, paddingTop:4, overflow:"visible" }}>
        {continueMovies.map(m => (
          <MovieCard key={m.id} movie={m} wide onPlay={onPlay} onInfo={onInfo}
            myList={myList} onToggleList={onToggleList} progress={watchProgress[m.id]} />
        ))}
      </div>
    </section>
  );
}

// ── Top 10 ─────────────────────────────────────────────────────────
function Top10Row({ list, onPlay, onInfo, myList, onToggleList }: {
  list: Movie[]; onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
}) {
  if (!list.length) return null;
  return (
    <section style={{ padding:"0 40px 32px", overflow:"visible" }}>
      <div className="section-label">Монгол</div>
      <div className="section-divider" />
      <h3 className="section-title">Топ 10</h3>
      <div className="scrollbar-hide" style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:16, paddingTop:8, overflow:"visible" }}>
        {list.map((m, i) => (
          <div key={m.id} style={{ position:"relative", display:"flex", alignItems:"flex-end", flexShrink:0 }}>
            <span className="top10-num">{i + 1}</span>
            <div style={{ marginLeft:40 }}>
              <MovieCard movie={m} onPlay={onPlay} onInfo={onInfo} myList={myList} onToggleList={onToggleList} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── My List ────────────────────────────────────────────────────────
function MyListRow({ myList, onPlay, onInfo, onToggleList }: {
  myList: number[]; onPlay: (m: Movie) => void;
  onInfo: (m: Movie) => void; onToggleList: (m: Movie) => void;
}) {
  const listMovies = movies.filter(m => myList.includes(m.id));
  if (!listMovies.length) return null;
  return (
    <MovieRow label="Хадгалсан" title="Миний жагсаалт"
      movies={listMovies} onPlay={onPlay} onInfo={onInfo} myList={myList} onToggleList={onToggleList} />
  );
}

// ── Genre Browse ───────────────────────────────────────────────────
function GenreBrowse({ onPlay, onInfo, myList, onToggleList }: {
  onPlay: (m: Movie) => void; onInfo: (m: Movie) => void;
  myList: number[]; onToggleList: (m: Movie) => void;
}) {
  const [activeGenre, setActiveGenre] = useState("Бүгд");
  const filtered = activeGenre === "Бүгд"
    ? movies.slice(0, 24)
    : movies.filter(m => m.genre.some(g => g.name === activeGenre)).slice(0, 24);

  return (
    <section style={{ padding:"0 40px 40px", overflow:"visible" }}>
      <div className="section-label">Хайлт</div>
      <div className="section-divider" />
      <h3 className="section-title">Жанрын дагуу</h3>
      <div className="genre-tabs">
        {ALL_GENRES.map(g => (
          <button key={g} className={`genre-tab ${activeGenre === g ? "active" : ""}`} onClick={() => setActiveGenre(g)}>{g}</button>
        ))}
      </div>
      <div className="scrollbar-hide" style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:16, paddingTop:4, overflow:"visible" }}>
        {filtered.map(m => (
          <MovieCard key={m.id} movie={m} onPlay={onPlay} onInfo={onInfo} myList={myList} onToggleList={onToggleList} />
        ))}
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function Home() {
  const [playingMovie,  setPlayingMovie]  = useState<Movie | null>(null);
  const [modalMovie,    setModalMovie]    = useState<Movie | null>(null);
  const [myList,        setMyList]        = useState<number[]>([]);
  const [toast,         setToast]         = useState({ msg: "", show: false });
  const [watchProgress, setWatchProgress] = useState<Record<number, number>>({});
  const [isLoaded,      setIsLoaded]      = useState(false);
  const [showDiscover,  setShowDiscover]  = useState(false);

  useEffect(() => {
    try {
      const prog = localStorage.getItem("nabo_progress");
      const list = localStorage.getItem("nabo_mylist");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (prog) setWatchProgress(JSON.parse(prog));
      if (list) setMyList(JSON.parse(list));
    } catch { /* ignore */ }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("nabo_mylist", JSON.stringify(myList));
  }, [myList, isLoaded]);

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  }, []);

  const handlePlay = useCallback((m: Movie) => {
    setModalMovie(null);
    setPlayingMovie(m);
  }, []);

  const handleClosePlayer = useCallback(() => {
    if (playingMovie) {
      const prog = Math.floor(Math.random() * 60) + 20;
      setWatchProgress(prev => {
        const next = { ...prev, [playingMovie.id]: prog };
        try { localStorage.setItem("nabo_progress", JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
    setPlayingMovie(null);
  }, [playingMovie]);

  // View Transitions API ашигласан modal нээлт
  const handleInfo = useCallback((m: Movie) => {
    setPlayingMovie(null);
    const open = () => setModalMovie(m);
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(open);
    } else {
      open();
    }
  }, []);

  const handleToggleList = useCallback((m: Movie) => {
    setMyList(prev => {
      if (prev.includes(m.id)) {
        showToast(`"${m.title}" хасагдлаа`);
        return prev.filter(id => id !== m.id);
      }
      showToast(`"${m.title}" нэмэгдлээ ✓`);
      return [...prev, m.id];
    });
  }, [showToast]);

  const heroBg = HERO.banner || HERO.poster;
  const heroInList = myList.includes(HERO.id);

  return (
    <>
      <main style={{ minHeight:"100vh", background:"#0a0a0a", color:"white", position:"relative" }}>

        {/* ── Ambient Glow — hero зурагнаас өнгө авна ── */}
        {heroBg && (
          <div className="ambient-glow-container" aria-hidden>
            <div className="ambient-glow-blob" style={{ backgroundImage:`url(${heroBg})` }} />
          </div>
        )}

        <Navbar onMovieSelect={handleInfo} />

        {/* ── Hero ── */}
        <section id="hero-section" style={{ position:"relative", height:"100vh", width:"100%", overflow:"hidden" }}>
          {heroBg && (
            <div className="hero-image-wrap" style={{ position:"absolute", inset:0 }}>
              <Image src={heroBg} alt={HERO.title} fill priority className="object-cover"
                style={{ objectPosition:"center 20%" }} sizes="100vw" />
            </div>
          )}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(105deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.1) 100%)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #0a0a0a 0%, transparent 40%)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 20%)" }} />

          <div style={{ position:"absolute", bottom:"18%", left:40, maxWidth:560, zIndex:10 }}>
            <div className="hero-eyebrow" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:28, height:2, background:"#C9A84C", borderRadius:2 }} />
              <span style={{ fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"#C9A84C", fontWeight:600 }}>
                Онцлох кино
              </span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(3.5rem, 8vw, 6.5rem)",
              lineHeight:0.9, letterSpacing:"0.03em",
              marginBottom:20, textShadow:"0 4px 40px rgba(0,0,0,0.5)",
            }}>
              {HERO.title}
            </h1>

            <div className="hero-meta" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, flexWrap:"wrap" }}>
              <span style={{ color:"#C9A84C", fontWeight:700, fontSize:"0.95rem" }}>★ {HERO.rating}</span>
              <span style={{ width:1, height:14, background:"rgba(255,255,255,0.2)" }} />
              <span style={{ border:"1px solid rgba(255,255,255,0.25)", padding:"2px 8px", fontSize:"0.7rem", borderRadius:3, color:"rgba(255,255,255,0.6)" }}>HD</span>
              {HERO.genre.slice(0, 3).map((g, i) => (
                <span key={g.id} style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.85rem" }}>
                  {i > 0 && <span style={{ marginRight:8, color:"rgba(255,255,255,0.2)" }}>·</span>}
                  {g.name}
                </span>
              ))}
            </div>

            {HERO.overview && (
              <p className="hero-overview" style={{
                fontSize:"0.95rem", lineHeight:1.75,
                color:"rgba(255,255,255,0.7)", marginBottom:28,
                display:"-webkit-box", WebkitLineClamp:3,
                WebkitBoxOrient:"vertical", overflow:"hidden",
              }}>
                {HERO.overview}
              </p>
            )}

            <div className="hero-actions" style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <button className="btn-primary" onClick={() => handlePlay(HERO)}>
                <Play fill="#0a0a0a" size={18} /> Тоглуулах
              </button>
              <button className="btn-ghost" onClick={() => handleInfo(HERO)}>
                <Info size={18} /> Дэлгэрэнгүй
              </button>
              <button className="btn-circle" onClick={() => handleToggleList(HERO)}
                title={heroInList ? "Жагсаалтаас хасах" : "Жагсаалтад нэмэх"}
                style={{ marginLeft:4 }}>
                {heroInList ? <Check size={17} /> : <Plus size={17} />}
              </button>
              {/* Discover button */}
              <button className="btn-discover" onClick={() => setShowDiscover(true)}>
                <Compass size={16} /> Нээн олох
              </button>
            </div>
          </div>
        </section>

        {/* ── Content rows ── */}
        <div style={{ marginTop:-80, position:"relative", zIndex:20, paddingBottom:60, overflow:"visible" }}>
          <div id="mylist-section">
            <MyListRow myList={myList} onPlay={handlePlay} onInfo={handleInfo} onToggleList={handleToggleList} />
          </div>

          <ContinueWatchingRow watchProgress={watchProgress} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />

          <div id="trending-section">
            <MovieRow label="Одоо" title="Трэнд байгаа" movies={TRENDING}
              onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          </div>

          <Top10Row list={TOP10} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />

          <div id="new-section">
            <MovieRow label="Саяхан" title="Шинэ нэмэгдсэн" movies={NEW_MOVIES} wide
              onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          </div>

          <MovieRow label="Жанр" title="Экшн" movies={ACTION}
            onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />

          <MovieRow label="Жанр" title="Аймшиг" movies={HORROR} wide
            onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />

          <MovieRow label="Жанр" title="Драм" movies={DRAMA}
            onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />

          <MovieRow label="Жанр" title="Триллер" movies={THRILLER} wide
            onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />

          <MovieRow label="Алдартай" title="Их үзэлттэй" movies={POPULAR}
            onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />

          <div id="genre-section">
            <GenreBrowse onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          </div>
        </div>

        {playingMovie && <VideoPlayer movie={playingMovie} onClose={handleClosePlayer} />}
        <AnimatePresence>
          {modalMovie && (
            <MovieModal key={modalMovie.id} movie={modalMovie} onClose={() => setModalMovie(null)}
              onPlay={handlePlay} myList={myList} onToggleList={handleToggleList} />
          )}
        </AnimatePresence>

        {/* TikTok-style Discover Feed */}
        {showDiscover && (
          <DiscoverFeed
            movies={[...TRENDING, ...POPULAR, ...NEW_MOVIES].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)}
            onClose={() => setShowDiscover(false)}
            onPlay={handlePlay}
            onInfo={handleInfo}
            myList={myList}
            onToggleList={handleToggleList}
          />
        )}

        <Toast msg={toast.msg} show={toast.show} />
      </main>
    </>
  );
}
