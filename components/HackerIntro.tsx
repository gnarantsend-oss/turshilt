"use client";

import { useEffect, useRef, useState } from "react";

interface GeoData {
  ip: string;
  city: string;
  country: string;
  aimag: string;
  sum: string;
  isp: string;
  lat: number;
  lon: number;
}

interface HackerIntroProps {
  onDone: () => void;
}

const CITY_MN: Record<string, string> = {
  "Ulan Bator":   "Улаанбаатар",
  "Ulaanbaatar":  "Улаанбаатар",
  "Darkhan":      "Дархан",
  "Erdenet":      "Эрдэнэт",
  "Choibalsan":   "Чойбалсан",
  "Bayankhongor": "Баянхонгор",
  "Khovd":        "Ховд",
  "Ölgii":        "Өлгий",
  "Mörön":        "Мөрөн",
  "Arvaikheer":   "Арвайхээр",
  "Dalanzadgad":  "Даланзадгад",
  "Mandalgovi":   "Мандалговь",
  "Sainshand":    "Сайншанд",
  "Sukhbaatar":   "Сүхбаатар",
  "Zuunmod":      "Зуунмод",
  "Bulgan":       "Булган",
  "Tsetserleg":   "Цэцэрлэг",
  "Uliastai":     "Улиастай",
  "Ulaangom":     "Улаангом",
  "Altai":        "Алтай",
  "Baruun-Urt":   "Баруун-Урт",
};

export default function HackerIntro({ onDone }: HackerIntroProps) {
  const canvasRef               = useRef<HTMLCanvasElement>(null);
  const termRef                 = useRef<HTMLDivElement>(null);
  const [fading, setFading]     = useState(false);
  const [phase, setPhase]       = useState<"terminal" | "map">("terminal");
  const [geo, setGeo]           = useState<GeoData | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // ── Matrix rain ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const CHARS = "アイウエオ01サタバパ10ABCDEF<>{}[];".split("");
    const drops: number[] = Array(Math.floor(canvas.width / 16)).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "13px 'Courier New'";
      drops.forEach((y, i) => {
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const animId = window.setInterval(draw, 50);
    return () => {
      window.clearInterval(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Geo fetch + sequence ────────────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    async function fetchGeo(): Promise<GeoData> {
      let ip = "???", city = "Улаанбаатар", country = "Монгол";
      let isp = "Тодорхойгүй", lat = 47.9, lon = 106.9;

      try {
        const r = await fetch("http://ip-api.com/json/?fields=query,city,country,org,lat,lon");
        const d = await r.json();
        ip      = String(d.query   ?? "???");
        city    = CITY_MN[String(d.city ?? "")] || String(d.city ?? "Тодорхойгүй");
        country = String(d.country ?? "") === "Mongolia" ? "Монгол" : String(d.country ?? "");
        isp     = String(d.org     ?? "Тодорхойгүй");
        lat     = Number(d.lat)   || 47.9;
        lon     = Number(d.lon)   || 106.9;
      } catch {
        try {
          const r = await fetch("https://ipapi.co/json/");
          const d = await r.json();
          ip      = String(d.ip           ?? "???");
          city    = CITY_MN[String(d.city ?? "")] || String(d.city ?? "Улаанбаатар");
          country = String(d.country_name ?? "") === "Mongolia" ? "Монгол" : String(d.country_name ?? "");
          isp     = String(d.org          ?? "Тодорхойгүй");
          lat     = Number(d.latitude)   || 47.9;
          lon     = Number(d.longitude)  || 106.9;
        } catch { /* default */ }
      }

      // Nominatim — аймаг / дүүрэг
      let aimag = "", sum = "";
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          { headers: { "Accept-Language": "mn" } }
        );
        const d = await r.json();
        aimag = String(d.address?.state  ?? "");
        sum   = String(d.address?.county ?? d.address?.suburb ?? "");
      } catch { /* skip */ }

      return { ip, city, country, aimag, sum, isp, lat, lon };
    }

    function addLine(text: string, color: string, delay: number): Promise<void> {
      return new Promise(res => setTimeout(() => {
        if (!termRef.current) return res();
        const el = document.createElement("div");
        el.style.cssText = `color:${color};font-size:${isMobile ? "11px" : "13px"};line-height:1.8;font-family:'Courier New',monospace;white-space:nowrap;`;
        el.textContent = text;
        termRef.current.appendChild(el);
        termRef.current.scrollTop = termRef.current.scrollHeight;
        res();
      }, delay));
    }

    function typewriter(text: string, color: string, delay: number, speed = 15): Promise<void> {
      return new Promise(res => setTimeout(() => {
        if (!termRef.current) return res();
        const el = document.createElement("div");
        el.style.cssText = `color:${color};font-size:${isMobile ? "11px" : "13px"};line-height:1.8;font-family:'Courier New',monospace;`;
        termRef.current.appendChild(el);
        let i = 0;
        const iv = window.setInterval(() => {
          el.textContent = text.slice(0, ++i);
          if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
          if (i >= text.length) { clearInterval(iv); res(); }
        }, speed);
      }, delay));
    }

    async function run() {
      const g = await fetchGeo();
      setGeo(g);
      const timeStr = new Date().toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const dateStr = new Date().toLocaleDateString("mn-MN");

      await typewriter("> NABO SECURITY SYSTEM v2.4.1",   "#2a7a2a",    0);
      await addLine("",                                    "#2a7a2a",  200);
      await typewriter("> Систем эхлүүлж байна...",        "#00ff41",  300, 12);
      await typewriter("> Сүлжээнд холбогдож байна...",    "#00ff41",  700, 12);
      await addLine("  [OK] Холболт тогтоогдлоо",          "#7fff7f", 1100);
      await typewriter("> IP хаяг илрүүлж байна...",       "#00ff41", 1300, 12);
      await addLine(`  [FOUND]  ${g.ip}`,                  "#00ffcc", 1700);
      await typewriter("> Байршил тодорхойлж байна...",    "#00ff41", 1900, 12);
      await addLine(`  [OK]  ${g.city}${g.country ? ", " + g.country : ""}`, "#00ffcc", 2300);
      if (g.aimag) {
        await addLine(`  [OK]  ${g.aimag}${g.sum ? " · " + g.sum : ""}`, "#7fff7f", 2500);
      }
      await addLine(`  [OK]  GPS: ${g.lat.toFixed(4)}°N  ${g.lon.toFixed(4)}°E`, "#7fff7f", 2700);

      if (isMobile) {
        await typewriter("> Газрын зураг нээж байна...",   "#00ff41", 2900, 12);
        await addLine("  [MAP]  Байршил тэмдэглэгдлээ ✓", "#00ffcc", 3300);
        setMapReady(true);
        setTimeout(() => setPhase("map"), 3500);
        setTimeout(() => { setFading(true); setTimeout(onDone, 900); }, 5500);
        return;
      }

      await typewriter("> Оператор мэдээлэл...",           "#00ff41", 2900, 12);
      await addLine(`  [OK]  ${g.isp}`,                    "#7fff7f", 3200);
      await typewriter("> Цагийн бүс...",                  "#00ff41", 3400, 12);
      await addLine(`  [OK]  ${timeStr}  —  ${dateStr}`,   "#00ffcc", 3700);
      await addLine("",                                    "#2a7a2a", 3900);
      await typewriter("> Мэдээлэл цуглуулж дууслаа ✓",   "#ffdd00", 4000, 12);
      await typewriter("> Нэвтэрч байна...",               "#00ff41", 4500, 12);

      setMapReady(true);
      setTimeout(() => { setFading(true); setTimeout(onDone, 900); }, 5400);
    }

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapSrc = geo
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${geo.lon - 0.15},${geo.lat - 0.1},${geo.lon + 0.15},${geo.lat + 0.1}&layer=mapnik&marker=${geo.lat},${geo.lon}`
    : "";

  const isMobileMap = phase === "map";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", overflow:"hidden", opacity:fading ? 0 : 1, transition:"opacity 0.9s ease" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, opacity:0.18 }} />

      {/* Corner brackets */}
      {(["tl","tr","bl","br"] as const).map(c => (
        <div key={c} style={{
          position:"absolute", width:20, height:20, opacity:0.4,
          top:    c[0]==="t" ? 10 : "auto",
          bottom: c[0]==="b" ? 10 : "auto",
          left:   c[1]==="l" ? 10 : "auto",
          right:  c[1]==="r" ? 10 : "auto",
          borderTop:    c[0]==="t" ? "1px solid #00ff41" : "none",
          borderBottom: c[0]==="b" ? "1px solid #00ff41" : "none",
          borderLeft:   c[1]==="l" ? "1px solid #00ff41" : "none",
          borderRight:  c[1]==="r" ? "1px solid #00ff41" : "none",
        }} />
      ))}

      {/* Scan line */}
      <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#00ff41,transparent)", animation:"naboScan 2s linear infinite", zIndex:15 }} />

      {/* Mobile fullscreen map */}
      {isMobileMap && geo && (
        <div style={{ position:"absolute", inset:0, zIndex:50 }}>
          <iframe src={mapSrc} style={{ width:"100%", height:"100%", border:"none", filter:"sepia(1) hue-rotate(80deg) saturate(3) brightness(0.55)" }} title="Байршил" />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.93))", padding:"40px 24px 32px", fontFamily:"'Courier New',monospace" }}>
            <div style={{ color:"#00ffcc", fontSize:10, letterSpacing:3, marginBottom:6 }}>БАЙРШИЛ ТОГТООГДЛОО</div>
            <div style={{ color:"#00ff41", fontSize:17, fontWeight:700, marginBottom:4 }}>
              {geo.city}{geo.country ? `, ${geo.country}` : ""}
            </div>
            {geo.aimag && (
              <div style={{ color:"#7fff7f", fontSize:12, marginBottom:4 }}>
                {geo.aimag}{geo.sum ? ` · ${geo.sum}` : ""}
              </div>
            )}
            <div style={{ color:"#2a7a2a", fontSize:11 }}>{geo.ip}  ·  {geo.isp}</div>
          </div>
        </div>
      )}

      {/* Desktop layout */}
      {!isMobileMap && (
        <div style={{ position:"relative", zIndex:20, display:"flex", alignItems:"center", height:"100vh", padding:"0 5%", gap:32 }}>
          <div ref={termRef} style={{ flex:1, maxHeight:"80vh", overflowY:"auto", paddingRight:8 }} />
          <div style={{ width:"clamp(260px,30vw,420px)", height:"clamp(200px,30vh,320px)", flexShrink:0, border:"1px solid #00ff41", borderRadius:4, overflow:"hidden", opacity:mapReady ? 1 : 0, transition:"opacity 1s" }}>
            {geo && <iframe src={mapSrc} style={{ width:"100%", height:"100%", border:"none", filter:"sepia(1) hue-rotate(80deg) saturate(3) brightness(0.55)" }} title="Байршил" />}
          </div>
        </div>
      )}

      {/* Mobile terminal */}
      {!isMobileMap && (
        <div ref={phase === "terminal" ? termRef : undefined} style={{ display:"block", position:"absolute", inset:0, zIndex:20, padding:"48px 20px 24px", overflowY:"auto" }} className="md:hidden" />
      )}

      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:0, left:0, height:2, background:"#00ff41", animation:"naboProgress 5.5s linear forwards", zIndex:20 }} />

      <style>{`
        @keyframes naboScan    { 0%{top:0}    100%{top:100%}    }
        @keyframes naboProgress{ 0%{width:0%} 100%{width:100%} }
      `}</style>
    </div>
  );
}
