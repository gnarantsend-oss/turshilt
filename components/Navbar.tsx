"use client";

import { useEffect, useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full px-6 md:px-14 py-4 z-50 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "bg-[#141414] shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
          : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        <span
          className="text-[#E50914] text-4xl tracking-widest font-display select-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          NABO
        </span>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#" className="text-white font-semibold">Нүүр</a>
          <a href="#" className="hover:text-white transition-colors">Цуврал</a>
          <a href="#" className="hover:text-white transition-colors">Кино</a>
          <a href="#" className="hover:text-white transition-colors">Шинэ & Онцлох</a>
          <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
            Миний жагсаалт <ChevronDown size={14} />
          </a>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-5 text-gray-300">
        <button className="hover:text-white transition-colors">
          <Search size={20} />
        </button>
        <button className="hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-sm font-bold">
            Н
          </div>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
        </div>
      </div>
    </nav>
  );
}
