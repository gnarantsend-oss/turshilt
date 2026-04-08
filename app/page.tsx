import Image from "next/image";
import { Play, Info, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import moviesData from "@/lib/movies.json";

// ─── Types ─────────────────────────────────────────────────────────
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster: string;
  banner: string;
  rating: number;
  bunnyEmbedUrl: string;
  genre: { id: number; name: string }[];
  tags: string[];
};

const movies = moviesData as Movie[];

// ─── Data helpers (tag болон genre-оор шүүх) ──────────────────────
const byTag = (tag: string) => movies.filter((m) => m.tags.includes(tag));
const byGenre = (name: string) =>
  movies.filter((m) => m.genre.some((g) => g.name === name));

const HERO = byTag("trending")[0] ?? movies[0];
const TRENDING = byTag("trending").slice(0, 10);
const TOP10 = byTag("top10").slice(0, 10);
const NEW_RELEASES = byTag("new").slice(0, 10);
const HORROR = byGenre("Аймшиг").slice(0, 10);
const ACTION = byGenre("Экшн").slice(0, 10);
const POPULAR = byTag("popular").slice(0, 10);

// ─── Movie Card ────────────────────────────────────────────────────
function MovieCard({ movie, wide = false }: { movie: Movie; wide?: boolean }) {
  const imgSrc = movie.poster || movie.banner;

  return (
    <div
      className={`movie-card ${
        wide
          ? "min-w-[280px] md:min-w-[320px] h-[175px]"
          : "min-w-[130px] md:min-w-[160px] h-[190px] md:h-[230px]"
      }`}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 135px, 165px"
          unoptimized={imgSrc.includes("placeholder.com")}
        />
      ) : (
        <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
          <span className="text-gray-500 text-xs text-center px-2">{movie.title}</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="card-overlay">
        {/* Genre tag */}
        {movie.genre[0] && (
          <span className="text-[10px] text-gray-400 mb-1">{movie.genre[0].name}</span>
        )}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[#46d369] text-xs font-bold">★ {movie.rating}</span>
        </div>
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {movie.title}
        </p>
        <div className="flex gap-2 mt-2">
          <a
            href={movie.bunnyEmbedUrl}
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition"
          >
            <Play size={10} fill="black" className="text-black" />
          </a>
          <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/40">
            <Plus size={10} />
          </button>
          <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/40">
            <ThumbsUp size={10} />
          </button>
          <button className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/40 ml-auto">
            <ChevronDown size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Movie Row ─────────────────────────────────────────────────────
function MovieRow({
  title,
  movies: list,
  wide = false,
}: {
  title: string;
  movies: Movie[];
  wide?: boolean;
}) {
  if (!list.length) return null;
  return (
    <section className="row-section px-6 md:px-14 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {list.map((m) => (
          <MovieCard key={m.id} movie={m} wide={wide} />
        ))}
      </div>
    </section>
  );
}

// ─── Top 10 Row ────────────────────────────────────────────────────
function Top10Row({ list }: { list: Movie[] }) {
  if (!list.length) return null;
  return (
    <section className="row-section px-6 md:px-14 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
        🔥 Монголд Топ 10
      </h3>
      <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
        {list.map((m, i) => (
          <div key={m.id} className="relative flex items-end flex-shrink-0">
            <span
              className="top10-number select-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {i + 1}
            </span>
            <div className="ml-8">
              <div className="movie-card min-w-[105px] h-[145px]">
                {m.poster ? (
                  <Image
                    src={m.poster}
                    alt={m.title}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center p-2">
                    <span className="text-gray-400 text-[10px] text-center">{m.title}</span>
                  </div>
                )}
                <div className="card-overlay">
                  <p className="text-white text-xs font-semibold line-clamp-1">
                    {m.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────
export default function Home() {
  const heroBanner = HERO.banner || HERO.poster;

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        {heroBanner && (
          <Image
            src={heroBanner}
            alt={HERO.title}
            fill
            priority
            className="absolute inset-0 object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        <div className="absolute bottom-[22%] left-6 md:left-14 max-w-xl z-10">
          <div className="badge hero-title">
            <span>⬛</span> NABO Онцлох
          </div>

          <h1
            className="hero-title text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-3 drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {HERO.title}
          </h1>

          <div className="hero-desc flex flex-wrap items-center gap-2 text-sm mb-3 text-gray-300">
            <span className="text-[#46d369] font-bold">★ {HERO.rating}</span>
            <span className="border border-gray-500 px-1 text-xs">HD</span>
            {HERO.genre.map((g) => (
              <span key={g.id} className="genre-dot">
                {g.name}
              </span>
            ))}
          </div>

          {HERO.overview && (
            <p className="hero-desc text-sm md:text-base text-gray-200 mb-6 leading-relaxed line-clamp-3 drop-shadow">
              {HERO.overview}
            </p>
          )}

          <div className="hero-btns flex flex-wrap gap-3">
            <a
              href={HERO.bunnyEmbedUrl}
              className="btn-play flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded font-bold text-base hover:bg-white/85 transition-all duration-200"
            >
              <Play fill="black" size={20} /> Тоглуулах
            </a>
            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-7 py-2.5 rounded font-semibold text-base hover:bg-white/30 transition-all duration-200 border border-white/20">
              <Info size={20} /> Дэлгэрэнгүй
            </button>
            <button className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/30 hover:bg-white/25 transition">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Rows ── */}
      <div className="-mt-20 relative z-20 pb-20">
        <MovieRow title="🔴 Одоо трэнд байгаа" movies={TRENDING} />
        <Top10Row list={TOP10} />
        <MovieRow title="🆕 Шинэ нэмэгдсэн" movies={NEW_RELEASES} wide />
        <MovieRow title="⚡ Экшн" movies={ACTION} />
        <MovieRow title="😱 Аймшиг" movies={HORROR} wide />
        <MovieRow title="🎬 Алдартай" movies={POPULAR} />
      </div>
    </main>
  );
}
