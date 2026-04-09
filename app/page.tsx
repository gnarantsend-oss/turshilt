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
import { AmbientGlowLayer } from "@/components/movie/AmbientGlowLayer";
import { useAmbientColor } from "@/hooks/useAmbientColor";

import type { Movie } from "@/types/movie";
import moviesData from "@/lib/movies.json";

const movies = moviesData as Movie[];
const byTag   = (tag: string)  => movies.filter(m => m.tags.includes(tag));
const byGenre = (name: string) => movies.filter(m => m.genre.some(g => g.name === name));

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

  // ── Ambient Glow ──────────────────────────────────────────────────
  const { color: ambientColor, setFromImage, scheduleReset, cancelReset } = useAmbientColor();

  // Hero-ийн өнгийг mount хийхэд тохируулна
  useEffect(() => {
    const heroSrc = HERO.banner || HERO.poster;
    if (heroSrc) setFromImage(heroSrc);
  }, [setFromImage]);

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

  const handleInfo = useCallback((m: Movie) => {
    setPlayingMovie(null);
    const open = () => setModalMovie(m);
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(open);
    } else { open(); }
  }, []);

  const handleToggleList = useCallback((m: Movie) => {
    setMyList(prev => {
      if (prev.includes(m.id)) { showToast(`"${m.title}" хасагдлаа`); return prev.filter(id => id !== m.id); }
      showToast(`"${m.title}" нэмэгдлээ ✓`);
      return [...prev, m.id];
    });
  }, [showToast]);

  // Ambient callbacks — бүх row-д ижилхэн дамжуулна
  const ambientProps = {
    onHoverColor: (src: string) => { cancelReset(); setFromImage(src); },
    onHoverEnd:   () => scheduleReset(),
  };

  const heroBg     = HERO.banner || HERO.poster;
  const heroInList = myList.includes(HERO.id);

  return (
    <>
      <main className="page-main">
        {/* ── Philips Ambilight динамик өнгөт гэрэлтүүлэг ── */}
        <AmbientGlowLayer color={ambientColor} />

        {/* ── Анхны Hero ambient (blur зураг) ── */}
        {heroBg && (
          <div className="ambient-glow-container" aria-hidden>
            <div className="ambient-glow-blob" style={{ backgroundImage: `url(${heroBg})` }} />
          </div>
        )}

        <Navbar onMovieSelect={handleInfo} />

        {/* ── Hero ── */}
        <section
          id="hero-section"
          className="hero-section"
          onMouseEnter={() => { cancelReset(); setFromImage(heroBg); }}
          onMouseLeave={() => scheduleReset()}
        >
          {heroBg && (
            <div className="hero-image-wrap" style={{ position: "absolute", inset: 0 }}>
              <Image src={heroBg} alt={HERO.title} fill priority className="object-cover"
                style={{ objectPosition: "center 20%" }} sizes="100vw" />
            </div>
          )}
          <div className="hero-overlay-main" />
          <div className="hero-overlay-bottom" />
          <div className="hero-overlay-top" />

          <div className="hero-content">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Онцлох кино</span>
            </div>
            <h1 className="hero-title" style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              lineHeight: 0.9, letterSpacing: "0.03em",
              marginBottom: 20, textShadow: "0 4px 40px rgba(0,0,0,0.5)",
            }}>
              {HERO.title}
            </h1>
            <div className="hero-meta">
              <span className="hero-rating">★ {HERO.rating}</span>
              <span className="hero-meta-divider" />
              <span className="hero-hd-badge">HD</span>
              {HERO.genre.slice(0, 3).map((g, i) => (
                <span key={g.id} className="hero-genre-text">
                  {i > 0 && <span className="hero-genre-dot">·</span>}
                  {g.name}
                </span>
              ))}
            </div>
            {HERO.overview && (
              <p className="hero-overview" style={{
                fontSize: "0.95rem", lineHeight: 1.75,
                color: "rgba(255,255,255,0.7)", marginBottom: 28,
                display: "-webkit-box", WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {HERO.overview}
              </p>
            )}
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => handlePlay(HERO)}>
                <Play fill="#0a0a0a" size={18} /> Тоглуулах
              </button>
              <button className="btn-ghost" onClick={() => handleInfo(HERO)}>
                <Info size={18} /> Дэлгэрэнгүй
              </button>
              <button className="btn-circle" onClick={() => handleToggleList(HERO)}
                title={heroInList ? "Жагсаалтаас хасах" : "Жагсаалтад нэмэх"}>
                {heroInList ? <Check size={17} /> : <Plus size={17} />}
              </button>
              <button className="btn-discover" onClick={() => setShowDiscover(true)}>
                <Compass size={16} /> Нээн олох
              </button>
            </div>
          </div>
        </section>

        {/* ── Content rows ── */}
        <div className="content-rows">
          <div id="mylist-section">
            <MyListRow myList={myList} onPlay={handlePlay} onInfo={handleInfo} onToggleList={handleToggleList} {...ambientProps} />
          </div>
          <ContinueWatchingRow watchProgress={watchProgress} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} {...ambientProps} />
          <div id="trending-section">
            <MovieRow label="Одоо" title="Трэнд байгаа" movies={TRENDING} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          </div>
          <Top10Row list={TOP10} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} {...ambientProps} />
          <div id="new-section">
            <MovieRow label="Саяхан" title="Шинэ нэмэгдсэн" movies={NEW_MOVIES} wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          </div>
          <MovieRow label="Жанр" title="Экшн"    movies={ACTION}   onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          <MovieRow label="Жанр" title="Аймшиг"  movies={HORROR}   wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          <MovieRow label="Жанр" title="Драм"    movies={DRAMA}    onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          <MovieRow label="Жанр" title="Триллер" movies={THRILLER} wide onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          <MovieRow label="Алдартай" title="Их үзэлттэй" movies={POPULAR} onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} progress={watchProgress} {...ambientProps} />
          <div id="genre-section">
            <GenreBrowse onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          </div>
        </div>

        {playingMovie && <VideoPlayer movie={playingMovie} onClose={handleClosePlayer} />}
        <AnimatePresence>
          {modalMovie && (
            <MovieModal key={modalMovie.id} movie={modalMovie} onClose={() => setModalMovie(null)}
              onPlay={handlePlay} onInfo={handleInfo} myList={myList} onToggleList={handleToggleList} />
          )}
        </AnimatePresence>
        {showDiscover && (
          <DiscoverFeed
            movies={[...TRENDING, ...POPULAR, ...NEW_MOVIES].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)}
            onClose={() => setShowDiscover(false)} onPlay={handlePlay} onInfo={handleInfo}
            myList={myList} onToggleList={handleToggleList}
          />
        )}
        <Toast msg={toast.msg} show={toast.show} />
      </main>
    </>
  );
}
