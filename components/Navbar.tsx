"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown, X, LogOut, User, List, Menu } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import moviesData from "@/lib/movies.json";

type Movie = {
  id: number;
  title: string;
  poster: string;
  banner: string;
  rating: number;
  genre: { id: number; name: string }[];
  tags: string[];
  overview: string;
  bunnyEmbedUrl: string;
};

const movies = moviesData as Movie[];

interface NavbarProps {
  onSearch?: (query: string) => void;
  onMovieSelect?: (movie: Movie) => void;
  onNavClick?: (section: string) => void;
}

export default function Navbar({ onMovieSelect, onNavClick }: NavbarProps) {
  const { data: session } = useSession();
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQ, setSearchQ]         = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeNav, setActiveNav]     = useState("hero-section");
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen || mobileOpen) {
      document.body.style.overflow = "hidden";
      if (searchOpen) setTimeout(() => document.getElementById("search-input")?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    if (!searchOpen) setSearchQ("");
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setProfileOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = searchQ.trim().length > 1
    ? movies.filter(m => m.title.toLowerCase().includes(searchQ.toLowerCase())).slice(0, 12)
    : [];

  const scrollTo = (id: string) => {
    setActiveNav(id);
    setMobileOpen(false);
    onNavClick?.(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const initials = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "Н";

  const navLinks = [
    { label: "Нүүр",           id: "hero-section" },
    { label: "Трэнд",          id: "trending-section" },
    { label: "Шинэ",           id: "new-section" },
    { label: "Жанрын дагуу",   id: "genre-section" },
    { label: "Миний жагсаалт", id: "mylist-section" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full px-6 md:px-14 py-4 z-50 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-[#141414] shadow-[0_2px_20px_rgba(0,0,0,0.8)]" : "bg-gradient-to-b from-black/90 to-transparent"
      }`}>
        <div className="flex items-center gap-8">
          <button onClick={() => scrollTo("hero-section")}
            style={{ fontFamily:"'Bebas Neue',sans-serif", background:"none", border:"none", cursor:"pointer", padding:0 }}
            className="text-[#E50914] text-4xl tracking-widest select-none">
            NABO
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            {navLinks.map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`hover:text-white transition-colors bg-transparent border-none cursor-pointer font-medium text-sm ${activeNav === id ? "text-white font-semibold" : "text-gray-300"}`}
                style={{ fontFamily:"'Barlow',sans-serif" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-300">
          <button onClick={() => setSearchOpen(true)} className="hover:text-white transition-colors" title="Хайх">
            <Search size={20} />
          </button>

          <button className="hidden md:flex hover:text-white transition-colors relative" title="Мэдэгдэл"
            onClick={() => alert("Шинэ мэдэгдэл байхгүй")}>
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full" />
          </button>

          <div className="relative hidden md:block" ref={profileRef}>
            <button onClick={() => setProfileOpen(p => !p)} className="flex items-center gap-2 cursor-pointer" title="Профайл">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="user" className="w-8 h-8 rounded object-cover" />
              ) : (
                <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-sm font-bold text-white">
                  {initials}
                </div>
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[200]">
                {session?.user && (
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white text-sm font-semibold truncate">{session.user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{session.user.email}</p>
                  </div>
                )}
                <div className="py-1">
                  <button onClick={() => { scrollTo("mylist-section"); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                    style={{ fontFamily:"'Barlow',sans-serif", border:"none", background:"none", cursor:"pointer" }}>
                    <List size={15} /> Миний жагсаалт
                  </button>
                  {session ? (
                    <button onClick={() => { setProfileOpen(false); signOut({ callbackUrl:"/login" }); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-left"
                      style={{ fontFamily:"'Barlow',sans-serif", border:"none", background:"none", cursor:"pointer" }}>
                      <LogOut size={15} /> Гарах
                    </button>
                  ) : (
                    <button onClick={() => { setProfileOpen(false); signIn(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                      style={{ fontFamily:"'Barlow',sans-serif", border:"none", background:"none", cursor:"pointer" }}>
                      <User size={15} /> Нэвтрэх
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Hamburger — mobile only ── */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Цэс нээх"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(s => !s)}
          >
            {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-gray-300" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className="fixed top-0 right-0 h-full w-72 z-50 md:hidden flex flex-col"
            style={{
              background: "rgba(14,14,14,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", letterSpacing:"0.12em", color:"#E50914" }}>
                NABO
              </span>
              <button onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Nav линкүүд */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
              {navLinks.map(({ label, id }) => {
                const active = activeNav === id;
                return (
                  <button key={id} onClick={() => scrollTo(id)}
                    className="w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all"
                    style={{
                      fontFamily: "'Barlow',sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: active ? 700 : 500,
                      border: "none",
                      cursor: "pointer",
                      background: active ? "rgba(201,168,76,0.1)" : "transparent",
                      color: active ? "#C9A84C" : "rgba(255,255,255,0.75)",
                      borderLeft: active ? "2px solid #C9A84C" : "2px solid transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>

            {/* Профайл — доод хэсэг */}
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"16px 12px" }}>
              {session?.user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl" style={{ background:"rgba(255,255,255,0.04)" }}>
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="user" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#E50914] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-white text-sm font-semibold truncate">{session.user.name}</p>
                    <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
                  </div>
                </div>
              )}

              <button onClick={() => scrollTo("mylist-section")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-white/5"
                style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.7)", border:"none", background:"none", cursor:"pointer" }}>
                <List size={16} /> Миний жагсаалт
              </button>

              {session ? (
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl:"/login" }); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-white/5"
                  style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"#f87171", border:"none", background:"none", cursor:"pointer" }}>
                  <LogOut size={16} /> Гарах
                </button>
              ) : (
                <button onClick={() => { setMobileOpen(false); signIn(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-white/5"
                  style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.9rem", color:"rgba(255,255,255,0.7)", border:"none", background:"none", cursor:"pointer" }}>
                  <User size={16} /> Нэвтрэх
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="search-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="search-input-wrap">
            <input id="search-input" className="search-input" placeholder="Кино, цуврал хайх..."
              value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            <button className="search-close-btn" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </button>
          </div>
          {searchQ.trim().length > 1 && (
            <div className="search-results scrollbar-hide">
              {results.length === 0 ? (
                <div className="search-empty" style={{ gridColumn:"1/-1" }}>&ldquo;{searchQ}&rdquo; — олдсонгүй</div>
              ) : results.map(m => (
                <div key={m.id} className="search-result-card"
                  onClick={() => { onMovieSelect?.(m); setSearchOpen(false); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.poster || m.banner} alt={m.title}
                    style={{ width:"100%", height:110, objectFit:"cover", display:"block" }} />
                  <div className="search-result-info">
                    <div style={{ marginBottom:2 }}>{m.title}</div>
                    <div style={{ fontSize:"0.7rem", color:"#46d369" }}>★ {m.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {searchQ.trim().length === 0 && (
            <div className="search-empty">Хайх гарчгаа бичнэ үү...</div>
          )}
        </div>
      )}
    </>
  );
}
