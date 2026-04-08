"use client";

import { useEffect, useRef, useState } from "react";

interface GeoData {
  ip: string;
  city: string;
  country: string;
  isp: string;
  lat: number;
  lon: number;
  connection: string;
}

interface HackerIntroProps {
  onDone: () => void;
}

export default function HackerIntro({ onDone }: HackerIntroProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const termRef     = useRef<HTMLDivElement>(null);
  const [fading, setFading]   = useState(false);
  const [phase, setPhase]     = useState<"terminal" | "map">("terminal");
  const [geo, setGeo]         = useState<GeoData | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // ── Matrix rain ────────────────────────────────────────────────
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
    const cols  = () => Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols()).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "13px 'Courier New'";
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(ch, i * 16, y * 16);
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

  // ── Geo fetch + terminal sequence ──────────────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    async function fetchGeo(): Promise<GeoData> {
      try {
        const r = await fetch("https://ipapi.co/json/");
        const d = await r.json();
        return {
          ip:         d.ip          || "???",
          city:       d.city        || "Тодорхойгүй",
          country:    d.country_name|| "",
          isp:        d.org         || "Тодорхойгүй",
          lat:        d.latitude    || 47.9,
          lon:        d.longitude   || 106.9,
          connection: d.network     || "IPv4",
        };
      } catch {
        return { ip:"202.55.xx.xx", city:"Улаанбаатар", country:"Монгол", isp:"MobiCom LLC", lat:47.9, lon:106.9, connection:"IPv4" };
      }
    }

    function addLine(text: string, color: string, delay: number): Promise<void> {
      return new Promise(res => {
        setTimeout(() => {
          if (!termRef.current) return res();
          const el = document.createElement("div");
          el.style.cssText = `color:${color};font-size:${isMobile?"11px":"13px"};line-height:1.9;font-family:'Courier New',monospace;white-space:nowrap;overflow:hidden;`;
          el.textContent = text;
          termRef.current.appendChild(el);
          termRef.current.scrollTop = termRef.current.scrollHeight;
          res();
        }, delay);
      });
    }

    function typewriter(text: string, color: string, delay: number, speed = 25): Promise<void> {
      return new Promise(res => {
        setTimeout(() => {
          if (!termRef.current) return res();
          const el = document.createElement("div");
          el.style.cssText = `color:${color};font-size:${isMobile?"11px":"13px"};line-height:1.9;font-family:'Courier New',monospace;`;
          termRef.current.appendChild(el);
          let i = 0;
          const iv = window.setInterval(() => {
            el.textContent = text.slice(0, ++i);
            if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
            if (i >= text.length) { clearInterval(iv); res(); }
          }, speed);
        }, delay);
      });
    }

    async function run() {
      const geoData = await fetchGeo();
      setGeo(geoData);

      const now = new Date();
      const timeStr = now.toLocaleTimeString("mn-MN", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
      const dateStr = now.toLocaleDateString("mn-MN");

      // ── Terminal sequence ──
      await typewriter("> NABO SECURITY SYSTEM v2.4.1", "#2a7a2a", 0);
      await addLine("", "#2a7a2a", 300);
      await typewriter("> Систем эхлүүлж байна...", "#00ff41", 400);
      await typewriter("> Сүлжээнд холбогдож байна...", "#00ff41", 1100);
      await addLine("  [OK] Холболт тогтоогдлоо", "#7fff7f", 1700);
      await typewriter("> IP хаяг илрүүлж байна...", "#00ff41", 2200);
      await addLine(`  [FOUND]  ${geoData.ip}`, "#00ffcc", 2900);
      await typewriter("> Байршил тодорхойлж байна...", "#00ff41", 3400);
      await addLine(`  [OK]  ${geoData.city}${geoData.country ? ", " + geoData.country : ""}`, "#00ffcc", 4100);
      await addLine(`  [OK]  GPS: ${geoData.lat.toFixed(4)}°N  ${geoData.lon.toFixed(4)}°E`, "#7fff7f", 4600);

      if (isMobile) {
        // Mobile: show fullscreen map phase
        await addLine("", "#2a7a2a", 5000);
        await typewriter("> Газрын зураг нээж байна...", "#00ff41", 5100);
        await addLine("  [MAP]  Байршил тэмдэглэгдлээ ✓", "#00ffcc", 5700);
        setMapReady(true);
        setTimeout(() => setPhase("map"), 6000);
        setTimeout(() => {
          setFading(true);
          setTimeout(onDone, 900);
        }, 8500);
        return;
      }

      // Desktop continues
      await typewriter("> Оператор мэдээлэл...", "#00ff41", 5200);
      await addLine(`  [OK]  ${geoData.isp}`, "#7fff7f", 5900);
      await typewriter("> Цагийн бүс тодорхойлж байна...", "#00ff41", 6400);
      await addLine(`  [OK]  ${timeStr}  —  ${dateStr}`, "#00ffcc", 7000);
      await typewriter("> Профайл шалгаж байна...", "#00ff41", 7500);
      await addLine("  [OK]  Хэрэглэгч танигдлаа", "#7fff7f", 8200);
      await addLine("", "#2a7a2a", 8600);
      await typewriter("> Мэдээлэл цуглуулж дууслаа ✓", "#ffdd00", 8700);
      await typewriter("> Нэвтэрч байна...", "#00ff41", 9400);

      setMapReady(true);

      // Fade out
      setTimeout(() => {
        setFading(true);
        setTimeout(onDone, 900);
      }, 10200);
    }

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapSrc = geo
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${geo.lon - 0.15},${geo.lat - 0.1},${geo.lon + 0.15},${geo.lat + 0.1}&layer=mapnik&marker=${geo.lat},${geo.lon}`
    : "";

  const isMobileMap = phase === "map";

  return (
    <div
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     9999,
        background: "#000",
        overflow:   "hidden",
        opacity:    fading ? 0 : 1,
        transition: "opacity 0.9s ease",
      }}
    >
      {/* Matrix rain */}
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, opacity:0.18 }} />

      {/* Corner brackets */}
      {["tl","tr","bl","br"].map(c => (
        <div key={c} style={{
          position:"absolute", width:20, height:20, opacity:0.5,
          top:    c.startsWith("t") ? 10 : "auto",
          bottom: c.startsWith("b") ? 10 : "auto",
          left:   c.endsWith("l")   ? 10 : "auto",
          right:  c.endsWith("r")   ? 10 : "auto",
          borderTop:    c.startsWith("t") ? "1px solid #00ff41" : "none",
          borderBottom: c.startsWith("b") ? "1px solid #00ff41" : "none",
          borderLeft:   c.endsWith("l")   ? "1px solid #00ff41" : "none",
          borderRight:  c.endsWith("r")   ? "1px solid #00ff41" : "none",
        }} />
      ))}

      {/* Scan line */}
      <div style={{
        position:"absolute", left:0, right:0, height:2,
        background:"linear-gradient(90deg,transparent,#00ff41,transparent)",
        animation:"naboScan 2s linear infinite",
        zIndex:15,
      }} />

      {/* ── MOBILE: Fullscreen map phase ── */}
      {isMobileMap && geo && (
        <div style={{ position:"absolute", inset:0, zIndex:50 }}>
          <iframe
            src={mapSrc}
            style={{
              width:"100%", height:"100%", border:"none",
              filter:"sepia(1) hue-rotate(80deg) saturate(3) brightness(0.55)",
            }}
            title="Байршил"
          />
          {/* Overlay info */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            background:"linear-gradient(transparent,rgba(0,0,0,0.92))",
            padding:"40px 24px 32px",
            fontFamily:"'Courier New',monospace",
          }}>
            <div style={{ color:"#00ffcc", fontSize:11, letterSpacing:2, marginBottom:6 }}>{/* БАЙРШИЛ ТОГТООГДЛОО */}</div>
            <div style={{ color:"#00ff41", fontSize:16, fontWeight:700, marginBottom:4 }}>
              {geo.city}{geo.country ? `, ${geo.country}` : ""}
            </div>
            <div style={{ color:"#7fff7f", fontSize:11 }}>{geo.ip}  ·  {geo.isp}</div>
          </div>
        </div>
      )}

      {/* ── DESKTOP layout ── */}
      {!isMobileMap && (
        <div style={{
          position:"relative", zIndex:20,
          display:"flex", alignItems:"center",
          height:"100vh", padding:"0 5%",
          gap:32,
        }}>
          {/* Terminal panel */}
          <div
            ref={termRef}
            style={{
              flex:1, maxHeight:"80vh",
              overflowY:"auto", paddingRight:8,
            }}
          />

          {/* Map panel — desktop only */}
          <div style={{
            width:"clamp(260px, 30vw, 420px)",
            height:"clamp(200px, 30vh, 320px)",
            flexShrink:0,
            border:"1px solid #00ff41",
            borderRadius:4,
            overflow:"hidden",
            opacity: mapReady ? 1 : 0,
            transition:"opacity 1s",
          }}>
            {geo && (
              <iframe
                src={mapSrc}
                style={{
                  width:"100%", height:"100%", border:"none",
                  filter:"sepia(1) hue-rotate(80deg) saturate(3) brightness(0.55)",
                }}
                title="Байршил"
              />
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE terminal (before map phase) ── */}
      {!isMobileMap && (
        <div
          ref={phase === "terminal" ? termRef : undefined}
          style={{
            display: "block",
            position:"absolute", inset:0,
            zIndex:20,
            padding:"48px 20px 24px",
            overflowY:"auto",
          }}
          className="md:hidden"
        />
      )}

      {/* Progress bar */}
      <div style={{
        position:"absolute", bottom:0, left:0,
        height:2, background:"#00ff41",
        animation:"naboProgress 10s linear forwards",
        zIndex:20,
      }} />

      <style>{`
        @keyframes naboScan {
          0%   { top: 0 }
          100% { top: 100% }
        }
        @keyframes naboProgress {
          0%   { width: 0% }
          100% { width: 100% }
        }
      `}</style>
    </div>
  );
}
