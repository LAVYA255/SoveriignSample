import { useState, useEffect, useRef } from "react";

const F_BITMAP = [
  [1,1,1,1,1],
  [1,0,0,0,0],
  [1,1,1,1,0],
  [1,0,0,0,0],
  [1,0,0,0,0],
  [1,0,0,0,0],
  [1,0,0,0,0],
];

const PARTY = [
  "#FF5500","#FF3300","#FF8C00",
  "#8B5CF6","#A78BFA",
  "#22D3EE","#06B6D4",
  "#F59E0B","#FBBF24",
  "#10B981","#34D399",
  "#EC4899","#F472B6",
  "#FF5500",
];

const KEYFRAMES = `
@keyframes fadeOut { from { opacity:1 } to { opacity:0 } }
@keyframes fc-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
`;

const GridBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <pattern id="fc-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,85,0,0.08)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#fc-grid)" />
    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,85,0,0.12)" strokeWidth="0.5"/>
    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,85,0,0.12)" strokeWidth="0.5"/>
    {/* corner brackets */}
    {[0,1,2,3].map(qi => {
      const cx = qi % 2 === 0 ? 12 : "calc(100% - 12px)";
      const cy = qi < 2 ? 12 : "calc(100% - 12px)";
      const sx = qi % 2 === 0 ? 1 : -1;
      const sy = qi < 2 ? 1 : -1;
      const cxStr = typeof cx === "number" ? `${cx}px` : cx;
      const cyStr = typeof cy === "number" ? `${cy}px` : cy;
      return (
        <g key={qi}>
          <line x1={cx} y1={cy} x2={`calc(${cxStr} + ${sx*12}px)`} y2={cy} stroke="#FF5500" strokeWidth="1.5" strokeOpacity="0.7"/>
          <line x1={cx} y1={cy} x2={cx} y2={`calc(${cyStr} + ${sy*12}px)`} stroke="#FF5500" strokeWidth="1.5" strokeOpacity="0.7"/>
        </g>
      );
    })}
  </svg>
);

const CardFront = () => (
  <div
    className="relative overflow-hidden select-none"
    style={{
      width: 180, height: 220,
      backgroundColor: "#0A0A1A",
      border: "1px solid rgba(255,85,0,0.45)",
      boxShadow: "0 0 24px rgba(255,85,0,0.2), inset 0 0 30px rgba(255,85,0,0.04)",
      borderRadius: 6,
    }}
  >
    <GridBg />
    <div className="absolute top-2.5 right-3 font-mono-brand text-[8px] tracking-[0.15em] text-orange-500/50">· TAP ·</div>
    <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 14px)", gap: 5 }}>
        {F_BITMAP.map((row, ri) =>
          row.map((on, ci) => (
            <div key={`${ri}-${ci}`} style={{
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: on ? "#FF5500" : "rgba(255,85,0,0.07)",
              boxShadow: on ? "0 0 6px rgba(255,85,0,0.8), 0 0 2px #FF5500" : "none",
              animation: on ? `pulse-node ${1.8 + ri*0.07 + ci*0.05}s ease-in-out infinite` : "none",
              animationDelay: `${(ri + ci) * 0.08}s`,
            }} />
          ))
        )}
      </div>
    </div>
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 font-mono-brand text-[9px] tracking-[0.22em] text-orange-400/60"
      style={{ borderTop: "1px solid rgba(255,85,0,0.15)" }}
    >
      FINDABLE · REV.0
    </div>
  </div>
);

const ExpandedCard = ({ onClose }: { onClose: () => void }) => {
  const [colorIdx, setColorIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    timer.current = setInterval(() => setColorIdx(i => (i + 1) % PARTY.length), 220);
    return () => clearInterval(timer.current);
  }, []);

  const c0 = PARTY[colorIdx];
  const c1 = PARTY[(colorIdx + 3) % PARTY.length];
  const c2 = PARTY[(colorIdx + 6) % PARTY.length];
  const c3 = PARTY[(colorIdx + 9) % PARTY.length];
  const grad = `conic-gradient(from 0deg, ${c0}, ${c1}, ${c2}, ${c3}, ${c0})`;

  return (
    /* Party-lights border wrapper — use backgroundImage to avoid shorthand conflicts */
    <div className="relative" style={{
      width: "min(560px, 90vw)",
      padding: 3,
      borderRadius: 14,
      backgroundImage: grad,
      boxShadow: `0 0 60px ${c0}55, 0 0 120px ${c2}33`,
    }}>
      {/* Inner card */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#08081A", borderRadius: 12, padding: "36px 40px 32px" }}>
        <GridBg />

        {/* Close */}
        <button
          onPointerDown={e => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 flex items-center justify-center font-mono-brand text-white/40 hover:text-white transition-colors duration-200"
          style={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, backgroundColor: "rgba(255,255,255,0.04)", fontSize: 18, cursor: "pointer", zIndex: 10 }}
          aria-label="Close"
        >×</button>

        {/* Header */}
        <div className="relative flex items-center gap-4 mb-6">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 3, flexShrink: 0 }}>
            {F_BITMAP.map((row, ri) =>
              row.map((on, ci) => (
                <div key={`e-${ri}-${ci}`} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  backgroundColor: on ? c0 : "rgba(255,85,0,0.07)",
                  boxShadow: on ? `0 0 4px ${c0}` : "none",
                  transition: "background-color 0.22s ease, box-shadow 0.22s ease",
                }} />
              ))
            )}
          </div>
          <div>
            <div className="font-mono-brand text-xs tracking-[0.2em] mb-0.5" style={{ color: c0, transition: "color 0.22s" }}>
              FINDABLE · REV.0
            </div>
            <h2 className="font-syne text-2xl font-bold text-white tracking-tight">About Findable</h2>
          </div>
        </div>

        {/* Divider — use backgroundImage for gradient */}
        <div className="relative h-px mb-6" style={{ backgroundImage: `linear-gradient(90deg, ${c0}44, ${c2}44, transparent)` }} />

        <div className="relative space-y-4 text-sm leading-relaxed text-white/55">
          <p><span className="text-white font-medium">Findable</span> is Sovriigne's on-chain discovery and verification layer — the intelligence substrate that makes every tokenized asset transparent, traceable, and searchable across the protocol.</p>
          <p>Built for institutional participants, Findable indexes asset provenance, legal-wrapping status, yield history, and counterparty metadata into a composable query layer. Think of it as a real-world asset search engine with cryptographic guarantees.</p>
          <p>Rev.0 is the genesis deployment — audit-ready, chain-agnostic, and designed to grow with every new asset class Sovriigne onboards.</p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ label:"Indexed Assets", value:"9" }, { label:"Avg. Query Time", value:"<120ms" }, { label:"Data Integrity", value:"100%" }].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-syne text-xl font-bold mb-1" style={{ color: c0, transition: "color 0.22s" }}>{value}</div>
              <div className="text-xs text-white/35">{label}</div>
            </div>
          ))}
        </div>

        {/* Shimmer bar — only longhand props */}
        <div className="relative mt-6 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(90deg, ${c0}, ${c1}, ${c2}, ${c3}, ${c0})`,
            backgroundSize: "200% 100%",
            animation: "fc-shimmer 1.5s linear infinite",
          }} />
        </div>
      </div>
    </div>
  );
};

export const FindableCard = () => {
  const [phase, setPhase] = useState<"idle"|"flipping-out"|"open"|"flipping-in">("idle");

  const handleOpen  = () => { if (phase !== "idle") return; setPhase("flipping-out"); setTimeout(() => setPhase("open"), 380); };
  const handleClose = () => { setPhase("flipping-in"); setTimeout(() => setPhase("idle"), 380); };

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Small card — flips on click */}
      <div
        onClick={handleOpen}
        aria-label="Open Findable card"
        style={{
          transformStyle: "preserve-3d",
          transform: (phase === "flipping-out" || phase === "flipping-in") ? "rotateY(90deg) scale(0.92)" : "rotateY(0deg) scale(1)",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.6,1)",
          cursor: phase === "idle" ? "pointer" : "default",
        }}
      >
        <CardFront />
      </div>

      {/* Expanded overlay */}
      {(phase === "open" || phase === "flipping-in") && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 200 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(5,5,18,0.85)",
              backdropFilter: "blur(12px)",
              animation: phase === "flipping-in" ? "fadeOut 0.3s ease forwards" : "fadeIn 0.3s ease forwards",
            }}
            onPointerDown={handleClose}
          />
          {/* Card */}
          <div style={{
            position: "relative", zIndex: 1,
            transform: phase === "flipping-in" ? "rotateY(90deg) scale(0.9)" : "rotateY(0deg) scale(1)",
            opacity: phase === "flipping-in" ? 0 : 1,
            transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
          }}>
            <ExpandedCard onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
};
