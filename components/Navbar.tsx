"use client";
import { useEffect, useState } from "react";
import { Search, Bell, X, Menu, List } from "lucide-react";
import moviesData from "@/lib/movies.json";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
type Movie = { id:number; title:string; poster:string; banner:string; rating:number; genre:{id:number;name:string}[]; tags:string[]; overview:string; bunnyEmbedUrl:string };
const movies = moviesData as Movie[];
interface NavbarProps { onSearch?:(q:string)=>void; onMovieSelect?:(m:Movie)=>void; onNavClick?:(s:string)=>void }
export default function Navbar({ onMovieSelect, onNavClick, onSearch }:NavbarProps) {
  const [scrolled,setScrolled]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [searchQ,setSearchQ]=useState("");
  const [mobileOpen,setMobileOpen]=useState(false);
  const [activeNav,setActiveNav]=useState("hero-section");
  useBodyScrollLock(searchOpen||mobileOpen);
  useEffect(()=>{ const f=()=>setScrolled(window.scrollY>50); window.addEventListener("scroll",f,{passive:true}); return ()=>window.removeEventListener("scroll",f); },[]);
  useEffect(()=>{ if(searchOpen) setTimeout(()=>document.getElementById("search-input")?.focus(),100); else setSearchQ(""); },[searchOpen]);
  useEffect(()=>{ const f=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearchOpen(true);} if(e.key==="Escape"){setSearchOpen(false);setMobileOpen(false);} }; window.addEventListener("keydown",f); return ()=>window.removeEventListener("keydown",f); },[]);
  const results=searchQ.trim().length>1?movies.filter(m=>m.title.toLowerCase().includes(searchQ.toLowerCase())).slice(0,12):[];
  const scrollTo=(id:string)=>{ setActiveNav(id); setMobileOpen(false); onNavClick?.(id); document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}); };
  const navLinks=[{label:"Нүүр",id:"hero-section"},{label:"Трэнд",id:"trending-section"},{label:"Шинэ",id:"new-section"},{label:"Жанрын дагуу",id:"genre-section"},{label:"Миний жагсаалт",id:"mylist-section"}];
  return (<>
    <nav className={`fixed top-0 w-full px-6 md:px-14 py-4 z-50 flex items-center justify-between transition-all duration-500 ${scrolled?"bg-[#141414] shadow-[0_2px_20px_rgba(0,0,0,0.8)]":"bg-gradient-to-b from-black/90 to-transparent"}`}>
      <div className="flex items-center gap-8">
        <button onClick={()=>scrollTo("hero-section")} style={{fontFamily:"'Bebas Neue',sans-serif",background:"none",border:"none",cursor:"pointer",padding:0}} className="text-[#E50914] text-4xl tracking-widest select-none">NABO</button>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({label,id})=>(<button key={id} onClick={()=>scrollTo(id)} className={`hover:text-white transition-colors bg-transparent border-none cursor-pointer font-medium text-sm ${activeNav===id?"text-white font-semibold":"text-gray-300"}`}>{label}</button>))}
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-300">
        <button onClick={()=>setSearchOpen(true)} className="hover:text-white flex items-center gap-2"><Search size={20}/><span className="hidden md:flex text-[10px] opacity-30 border border-white/20 px-1.5 py-0.5 rounded-md font-mono">⌘K</span></button>
        <button className="hidden md:flex hover:text-white relative" onClick={()=>alert("Шинэ мэдэгдэл байхгүй")}><Bell size={20}/><span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full"/></button>
        <button className="hidden md:flex items-center gap-2" onClick={()=>scrollTo("mylist-section")}><div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-sm font-bold text-white">Н</div></button>
        <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/10" onClick={()=>setMobileOpen(s=>!s)}>{mobileOpen?<X size={20} className="text-white"/>:<Menu size={20} className="text-gray-300"/>}</button>
      </div>
    </nav>
    {mobileOpen&&(<><div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>
      <div className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col" style={{background:"rgba(14,14,14,0.97)",backdropFilter:"blur(24px)",borderLeft:"1px solid rgba(255,255,255,0.07)"}}>
        <div className="flex items-center justify-between px-6 py-5" style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",color:"#E50914"}}>NABO</span>
          <button onClick={()=>setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400"><X size={18}/></button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navLinks.map(({label,id})=>{ const a=activeNav===id; return(<button key={id} onClick={()=>scrollTo(id)} className="w-full flex items-center px-4 py-3.5 rounded-xl text-left" style={{fontWeight:a?700:500,border:"none",cursor:"pointer",background:a?"rgba(201,168,76,0.1)":"transparent",color:a?"#C9A84C":"rgba(255,255,255,0.75)",borderLeft:a?"2px solid #C9A84C":"2px solid transparent"}}>{label}</button>); })}
        </nav>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",padding:"16px 12px"}}>
          <button onClick={()=>scrollTo("mylist-section")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5" style={{color:"rgba(255,255,255,0.7)",border:"none",background:"none",cursor:"pointer"}}><List size={16}/>Миний жагсаалт</button>
        </div>
      </div></>)}
    {searchOpen&&(<div className="search-overlay" onClick={e=>{if(e.target===e.currentTarget)setSearchOpen(false);}}>
      <div className="search-input-wrap">
        <input id="search-input" className="search-input" placeholder="Кино, цуврал хайх..." value={searchQ} onChange={e=>{setSearchQ(e.target.value);onSearch?.(e.target.value);}}/>
        <button className="search-close-btn" onClick={()=>setSearchOpen(false)}><X size={20}/></button>
      </div>
      {searchQ.trim().length>1&&(<div className="search-results scrollbar-hide">{results.length===0?(<div className="search-empty" style={{gridColumn:"1/-1"}}>"{searchQ}" — олдсонгүй</div>):results.map(m=>(<div key={m.id} className="search-result-card" onClick={()=>{onMovieSelect?.(m);setSearchOpen(false);}}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={m.poster||m.banner} alt={m.title} style={{width:"100%",height:110,objectFit:"cover",display:"block"}}/><div className="search-result-info"><div>{m.title}</div><div style={{fontSize:"0.7rem",color:"#46d369"}}>★ {m.rating}</div></div></div>))}</div>)}
      {searchQ.trim().length===0&&<div className="search-empty">Хайх гарчгаа бичнэ үү...</div>}
    </div>)}
  </>);
}
