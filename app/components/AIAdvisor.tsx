"use client";
import { useState, useRef, useEffect } from "react";
import moviesData from "../data/movies.json";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const movieList = moviesData
  .map(m => `"${m.title}" (${m.year}) - ${m.genre.join(", ")}`)
  .join("\n");

const SYSTEM_PROMPT = `Та Nabooshy платформын AI кино зөвлөгч бөгөөд зөвхөн монгол хэлээр хариулна.

ЧУХАЛ АНХААРУУЛГА — ЗААВАЛ ДАГАХ ДҮРЭМ:
- Та зөвхөн доорх жагсаалтад байгаа кинонуудын талаар мэдээлэл өгнө.
- Таамаглал, уран зохиол, таамаглаж бичсэн мэдээлэл хэзээ ч бичихгүй.
- "Би мэдэхгүй" гэж шударгаар хариулах нь худлаа мэдээлэл өгөхөөс дээр.
- Хариулт товч, тодорхой, практик байх ёстой.

ПЛАТФОРМЫН КИНО ЖАГСААЛТ:
${movieList}

Хэрэглэгчийн асуусан бол зөвхөн дээрх жагсаалтаас санал болгоно. Жагсаалтад байхгүй кино дурдахгүй.`;

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey.trim()) { alert("API түлхүүр оруулна уу"); return; }

    const newMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "Алдаа гарлаа.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "⚠️ Холболтын алдаа. API түлхүүрийг шалгана уу." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>

      {/* ═══ ХАТУУ АНХААРУУЛГА ═══ */}
      <div style={{
        border: "1px solid #ff4444",
        background: "rgba(255,68,68,0.07)",
        borderRadius: 6,
        padding: "0.9rem 1.1rem",
        marginBottom: "1.5rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
        <div>
          <p style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.65rem",
            color: "#ff4444",
            letterSpacing: "0.15em",
            marginBottom: "0.4rem",
          }}>
            ХИЙМЭЛ ОЮУНЫ ТААМАГЛАЛ — БАРИМТ БИШ
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,68,68,0.85)", lineHeight: 1.6 }}>
            Энэ хэсгийн хариултууд нь <strong>зөвхөн платформд байгаа кинонуудад суурилсан AI-н санал</strong> бөгөөд
            баримт, шүүмж, эсвэл албан ёсны мэдэлэл биш. Таамаглаж бичсэн эсвэл баримтгүй мэдэлэл гарвал
            AI буруу байна — итгэж болохгүй.
          </p>
        </div>
      </div>

      {/* API Key */}
      {showKeyInput && (
        <div style={{
          border: "1px solid var(--border)",
          background: "rgba(0,255,136,0.04)",
          borderRadius: 6,
          padding: "1rem",
          marginBottom: "1.2rem",
        }}>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.6rem", fontFamily: "'Space Mono', monospace" }}>
            // ANTHROPIC API ТҮЛХҮҮР (зөвхөн энэ session-д хадгалагдана)
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                flex: 1,
                background: "rgba(0,255,136,0.06)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "0.5rem 0.75rem",
                color: "var(--green)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.8rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => setShowKeyInput(false)}
              disabled={!apiKey.trim()}
              style={{
                background: apiKey.trim() ? "var(--green)" : "transparent",
                color: apiKey.trim() ? "var(--bg)" : "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "0.5rem 1rem",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.7rem",
                cursor: apiKey.trim() ? "pointer" : "default",
              }}
            >
              ХАДГАЛАХ
            </button>
          </div>
        </div>
      )}

      {!showKeyInput && (
        <button
          onClick={() => setShowKeyInput(true)}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            borderRadius: 4,
            padding: "0.3rem 0.7rem",
            fontSize: "0.65rem",
            fontFamily: "'Space Mono', monospace",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          🔑 API ТҮЛХҮҮР СОЛИХ
        </button>
      )}

      {/* Chat window */}
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: 6,
        minHeight: 320,
        maxHeight: 460,
        overflowY: "auto",
        padding: "1rem",
        background: "rgba(0,0,0,0.3)",
        marginBottom: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}>
        {messages.length === 0 && (
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textAlign: "center", paddingTop: "3rem", fontFamily: "'Space Mono', monospace" }}>
            <div style={{ marginBottom: "0.5rem", opacity: 0.5 }}>// AI ЗӨВЛӨГЧ БЭЛЭН</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.4 }}>
              Жишээ: "Аймшгийн кино санал болго" · "Action кино хайж байна" · "Хамгийн шинэ кино?"
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "80%",
              background: m.role === "user"
                ? "rgba(0,255,136,0.12)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${m.role === "user" ? "rgba(0,255,136,0.3)" : "var(--border)"}`,
              borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "0.6rem 0.9rem",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              color: m.role === "user" ? "var(--green)" : "var(--text)",
              fontFamily: "'Share Tech Mono', monospace",
              whiteSpace: "pre-wrap",
            }}>
              {m.role === "assistant" && (
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "0.3rem", fontFamily: "'Space Mono', monospace" }}>
                  🤖 AI · <span style={{ color: "#ff9900" }}>ТААМАГЛАЛ</span>
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              border: "1px solid var(--border)",
              borderRadius: "12px 12px 12px 2px",
              padding: "0.6rem 0.9rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontFamily: "'Space Mono', monospace",
            }}>
              <span className="animate-blink">▋</span> боловсруулж байна...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Кино талаар асуу..."
          disabled={loading || showKeyInput}
          style={{
            flex: 1,
            background: "rgba(0,255,136,0.05)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "0.6rem 0.9rem",
            color: "var(--green)",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.82rem",
            outline: "none",
            caretColor: "var(--green)",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || showKeyInput}
          style={{
            background: loading || !input.trim() || showKeyInput ? "transparent" : "var(--green)",
            color: loading || !input.trim() || showKeyInput ? "var(--text-muted)" : "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "0.6rem 1.2rem",
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: loading || !input.trim() || showKeyInput ? "default" : "pointer",
            transition: "all 0.2s",
          }}
        >
          ИЛГЭЭХ
        </button>
      </div>

      <p style={{
        fontSize: "0.6rem",
        color: "var(--text-muted)",
        marginTop: "0.5rem",
        fontFamily: "'Space Mono', monospace",
        opacity: 0.5,
      }}>
        // API түлхүүр browser-т л хадгалагдана · сервер рүү явахгүй · session дуусвал арчигдана
      </p>
    </div>
  );
}
