"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Play, Info, Plus, Check, Compass } from "lucide-react";

import Navbar from "@/components/Navbar";
import DiscoverFeed from "@/components/DiscoverFeed";
import { Toast } from "@/components/movie/Toast";
import { VideoPlayer } from "@/components/movie/VideoPlayer";
import { MovieModal } from "@/components/movie/MovieModal";
import { MovieRow } from "@/components/movie/MovieRow";
import { GenreBrowse } from "@/components/movie/GenreBrowse";
import { ContinueWatchingRow, Top10Row, MyListRow } from "@/components/movie/SpecialRows";

import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];
const byTag = (tag: string) => movies.filter((m) => m.tags.includes(tag));
const byGenre = (name: string) => movies.filter((m) => m.genre.some((g) => g.name === name));

const HERO       = byTag("trending")[0] ?? movies[0];
const TRENDING   = byTag("trending").slice(0, 14);
const TOP10      = byTag("top10").slice(0, 10);
const NEW_MOVIES = byTag("new").slice(0, 14);
const ACTION     = byGenre("Экшн").slice(0, 14);
const HORROR     = byGenre("Аймшиг").slice(0, 14);
const DRAMA      = byGenre("Драм").slice(0, 14);
const THRILLER   = byGenre("Триллер").slice(0, 14);
const POPULAR    = byTag("popular").slice(0, 14);

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
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  }, []);

  const handlePlay = useCallback((m: Movie) => {
    setModalMovie(null);
    setPlayingMovie(m);
  }, []);

  const handleClosePlayer = useCallback(() => {
    if (playingMovie) {
      const prog = Math.floor(Math.random() * 60) + 20;
      setWatchProgress((prev) => {
        const next = { ...prev, [playingMovie.id]: prog };
        try { localStorage.setItem("nabo_progress", JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
    setPlayingMovie(null);
  }, [playingMovie]);

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
    setMyList((prev) => {
      if (prev.includes(m.id)) {
        showToast(`"${m.title}" хасагдлаа`);
        return prev.filter((id) => id !== m.id);
      }
      showToast(`"${m.title}" нэмэгдлээ ✓`);
      return [...prev, m.id];
    });
  }, [showToast]);

  const heroBg = HERO.banner || HERO.poster;
  const heroInList = myList.includes(HERO.id);

  return (
    <>
      <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", position: "relative" }}>
        {heroBg && (
          <div className="ambient-glow-container" aria-hidden>
            <div className="ambient-glow-blob" style={{ backgroundImage: `url(${heroBg})` }} />
          </div>
        )}

        <Navbar onMovieSelect={handleInfo} />

        {/* Hero */}
        <section id="hero-section" style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden" }}>
          {heroBg && (
            <div className="hero-image-wrap" style={{ position: "absolute", inset: 0 }}>
              <Image src={heroBg} alt={HERO.title} fill priority className="object-cover" style={{ objectPosition: "center 20%" }} sizes="100vw" />
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.1) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0a 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 20%)" }} />

          <div style={{ position: "absolute", bottom: "18%", left: 40, maxWidth: 560, zIndex: 10 }}>
            <div className="hero-eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: "#C9A84C", borderRadius: 2 }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600 }}>
                Онцлох кино
              </span>
            </div>
            <h1 className="hero-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 0.9, letterSpacing: "0.03em", marginBottom: 20, textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}>
              {HERO.title}
            </h1>
            <div className="hero-meta" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "0.95rem" }}>★ {HERO.rating}</span>
              <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ border: "1px solid rgba(255,255,255,0.25)", padding: "2px 8px", fontSize: "0.7rem", borderRadius: 3, color: "rgba(255,255,255,0.6)" }}>HD</span>
              {HERO.genre.slice(0, 3).map((g, i) => (
                <span key={g.id} style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
                  {i > 0 && <span style={{ marginRight: 8, color: "rgba(255,255,255,0.2)" }}>·</span>}
                  {g.name}
                </span>
              ))}
            </div>
            {HERO.overview && (
              <p className="hero-overview" style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(255,255,255,0.7)", marginBottom: 28, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {HERO.overview}
              </p>
            )}
            <div className="hero-actions" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button className="btn-primary" onClick={() => handlePlay(HERO)}><Play fill="#0a0a0a" size={18} /> Тоглуулах</button>
              <button className="btn-ghost" onClick={() => handleInfo(HERO)}><Info size={18} /> Дэлгэрэнгүй</button>
              <button className="btn-circle" onClick={() => handleToggleList(HERO)} title={heroInList ? "Жагсаалтаас хасах" : "Жагсаалтад нэмэх"} style={{ marginLeft: 4 }}>
                {heroInList ? <Check size={17} /> : <Plus size={17} />}
              </button>
              <button className="btn-discover" onClick={() => setShowDiscover(true)}><Compass size={16} /> Нээн олох</button>
            </div>
          </div>
        </section>

        {/* Content rows */}
        <div style={{ marginTop: -80, position: "relative", zIndex: 20, paddingBottom: 60, overflow: "visible" }}>
          <div id="mylist-section">
            <MyListRow myList={myList} onPlay={handlePlay} onInfo={handleInfo} onToggleList={handleToggleList} />
          </div>
          <ContinueWatchingRow watchProgress={watchProgress} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          <div id="trending-section">
            <MovieRow label="Одоо" title="Трэнд байгаа" movies={TRENDING} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          </div>
          <Top10Row list={TOP10} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          <div id="new-section">
            <MovieRow label="Саяхан" title="Шинэ нэмэгдсэн" movies={NEW_MOVIES} wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          </div>
          <MovieRow label="Жанр" title="Экшн" movies={ACTION} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          <MovieRow label="Жанр" title="Аймшиг" movies={HORROR} wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          <MovieRow label="Жанр" title="Драм" movies={DRAMA} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          <MovieRow label="Жанр" title="Триллер" movies={THRILLER} wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          <MovieRow label="Алдартай" title="Их үзэлттэй" movies={POPULAR} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} />
          <div id="genre-section">
            <GenreBrowse onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          </div>
        </div>

        {playingMovie && <VideoPlayer movie={playingMovie} onClose={handleClosePlayer} />}
        <AnimatePresence>
          {modalMovie && (
            <MovieModal key={modalMovie.id} movie={modalMovie} onClose={() => setModalMovie(null)} onPlay={handlePlay} myList={myList} onToggleList={handleToggleList} />
          )}
        </AnimatePresence>
        {showDiscover && (
          <DiscoverFeed
            movies={[...TRENDING, ...POPULAR, ...NEW_MOVIES].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)}
            onClose={() => setShowDiscover(false)} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList}
          />
        )}
        <Toast msg={toast.msg} show={toast.show} />
      </main>
    </>
  );
}
