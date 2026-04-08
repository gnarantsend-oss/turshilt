import Image from "next/image";
import { Play, Info, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";

// ─── Mock Movie Data ───────────────────────────────────────────────
const HERO = {
  title: "DUNE: PART TWO",
  desc: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
  match: "97",
  year: "2024",
  duration: "2ц 46мин",
  genres: ["Sci-Fi", "Adventure", "Action"],
  img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
};

const MOVIES = {
  trending: [
    { id: 1, title: "Oppenheimer", year: "2023", match: 98, img: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
    { id: 2, title: "The Batman", year: "2022", match: 91, img: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    { id: 3, title: "Interstellar", year: "2014", match: 99, img: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { id: 4, title: "Inception", year: "2010", match: 98, img: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
    { id: 5, title: "Mad Max: Fury Road", year: "2015", match: 95, img: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg" },
    { id: 6, title: "Parasite", year: "2019", match: 97, img: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
    { id: 7, title: "1917", year: "2019", match: 94, img: "https://image.tmdb.org/t/p/w500/iZf0KyrE25z1sage4SYFLCCrMi9.jpg" },
    { id: 8, title: "Joker", year: "2019", match: 89, img: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
  ],
  action: [
    { id: 9, title: "John Wick 4", year: "2023", match: 93, img: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
    { id: 10, title: "Top Gun: Maverick", year: "2022", match: 96, img: "https://image.tmdb.org/t/p/w500/62HCnUTHJatonMkli5fiiIG4l.jpg" },
    { id: 11, title: "The Dark Knight", year: "2008", match: 99, img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { id: 12, title: "Mission: Impossible", year: "2023", match: 94, img: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg" },
    { id: 13, title: "Everything Everywhere", year: "2022", match: 96, img: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg" },
    { id: 14, title: "Avatar: The Way", year: "2022", match: 88, img: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
    { id: 15, title: "The Avengers", year: "2012", match: 92, img: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7KE3wYKmg.jpg" },
    { id: 16, title: "Blade Runner 2049", year: "2017", match: 97, img: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
  ],
  drama: [
    { id: 17, title: "The Shawshank Redemption", year: "1994", match: 99, img: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" },
    { id: 18, title: "Whiplash", year: "2014", match: 98, img: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg" },
    { id: 19, title: "A Beautiful Mind", year: "2001", match: 94, img: "https://image.tmdb.org/t/p/w500/z7tBpEaEiocb6YKMfPOMipGTSBa.jpg" },
    { id: 20, title: "The Godfather", year: "1972", match: 99, img: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeMQHrMunXr.jpg" },
    { id: 21, title: "Forrest Gump", year: "1994", match: 97, img: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg" },
    { id: 22, title: "Good Will Hunting", year: "1997", match: 95, img: "https://image.tmdb.org/t/p/w500/bABCcRokAdI2MiqFCKvFcBbAE4e.jpg" },
    { id: 23, title: "Schindler's List", year: "1993", match: 99, img: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg" },
    { id: 24, title: "The Pianist", year: "2002", match: 97, img: "https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg" },
  ],
};

const TOP10 = MOVIES.trending.slice(0, 10);

// ─── Movie Card ────────────────────────────────────────────────────
function MovieCard({ movie, wide = false }: { movie: typeof MOVIES.trending[0]; wide?: boolean }) {
  return (
    <div className={`movie-card ${wide ? "min-w-[280px] md:min-w-[320px] h-[175px]" : "min-w-[155px] md:min-w-[190px] h-[105px] md:h-[125px]"}`}>
      <Image
        src={movie.img}
        alt={movie.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 160px, 200px"
      />
      {/* Hover overlay */}
      <div className="card-overlay">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[#46d369] text-xs font-bold">{movie.match}% тохирох</span>
          <span className="text-gray-400 text-xs ml-1">{movie.year}</span>
        </div>
        <p className="text-white text-xs font-semibold leading-tight line-clamp-1">{movie.title}</p>
        <div className="flex gap-2 mt-2">
          <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition">
            <Play size={10} fill="black" className="text-black" />
          </button>
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
function MovieRow({ title, movies, wide = false }: {
  title: string;
  movies: typeof MOVIES.trending;
  wide?: boolean;
}) {
  return (
    <section className="row-section px-6 md:px-14 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} wide={wide} />
        ))}
      </div>
    </section>
  );
}

// ─── Top 10 Row ────────────────────────────────────────────────────
function Top10Row() {
  return (
    <section className="row-section px-6 md:px-14 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">🔥 Монголд Топ 10</h3>
      <div className="flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
        {TOP10.map((m, i) => (
          <div key={m.id} className="relative flex items-end flex-shrink-0">
            {/* Big number */}
            <span
              className="top10-number select-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {i + 1}
            </span>
            {/* Card shifted right so number shows */}
            <div className="ml-8">
              <div className="movie-card min-w-[105px] h-[145px]">
                <Image
                  src={m.img}
                  alt={m.title}
                  fill
                  className="object-cover"
                  sizes="110px"
                />
                <div className="card-overlay">
                  <p className="text-white text-xs font-semibold line-clamp-1">{m.title}</p>
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
  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <Image
          src={HERO.img}
          alt="Hero"
          fill
          priority
          className="absolute inset-0 object-cover"
          sizes="100vw"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-[22%] left-6 md:left-14 max-w-xl z-10">
          {/* Badge */}
          <div className="badge hero-title">
            <span>⬛</span> NABO Онцлох
          </div>

          <h1
            className="hero-title text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-3 drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
          >
            {HERO.title}
          </h1>

          <div className="hero-desc flex flex-wrap items-center gap-2 text-sm mb-3 text-gray-300">
            <span className="text-[#46d369] font-bold">{HERO.match}% тохирох</span>
            <span>{HERO.year}</span>
            <span className="border border-gray-500 px-1 text-xs">HD</span>
            <span>{HERO.duration}</span>
            {HERO.genres.map((g, i) => (
              <span key={g} className={i > 0 ? "genre-dot" : ""}>{g}</span>
            ))}
          </div>

          <p className="hero-desc text-sm md:text-base text-gray-200 mb-6 leading-relaxed line-clamp-3 drop-shadow">
            {HERO.desc}
          </p>

          <div className="hero-btns flex flex-wrap gap-3">
            <button className="btn-play flex items-center gap-2 bg-white text-black px-7 py-2.5 rounded font-bold text-base hover:bg-white/85 transition-all duration-200">
              <Play fill="black" size={20} /> Тоглуулах
            </button>
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
        <MovieRow title="Одоо трэнд байгаа" movies={MOVIES.trending} />
        <Top10Row />
        <MovieRow title="🎬 Экшн & Адвентур" movies={MOVIES.action} wide />
        <MovieRow title="🎭 Драм & Классик" movies={MOVIES.drama} />
        <MovieRow title="✨ Та дахин үзэж болох" movies={[...MOVIES.trending].reverse()} />
      </div>
    </main>
  );
}
