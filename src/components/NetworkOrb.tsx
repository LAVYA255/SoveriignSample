const outerNodes = [
  { x: 250, y: 52 },
  { x: 390, y: 128 },
  { x: 430, y: 270 },
  { x: 360, y: 408 },
  { x: 210, y: 448 },
  { x: 80,  y: 378 },
  { x: 48,  y: 230 },
  { x: 128, y: 100 },
];

const innerNodes = [
  { x: 250, y: 148 },
  { x: 338, y: 196 },
  { x: 340, y: 304 },
  { x: 250, y: 356 },
  { x: 160, y: 308 },
  { x: 158, y: 196 },
];

const orbitMarkers = [0, 60, 120, 180, 240, 300];

export const NetworkOrb = () => {
  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-square select-none">
      {/* Ambient glow behind orb */}
      <div
        className="absolute inset-[10%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,85,0,0.12) 0%, transparent 70%)", filter: "blur(30px)" }}
      />
      <div
        className="absolute inset-[25%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", filter: "blur(20px)" }}
      />

      <svg viewBox="0 0 500 500" className="relative w-full h-full overflow-visible">
        <defs>
          <radialGradient id="orb-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FF5500" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FF7A00" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF3300" stopOpacity="1" />
          </radialGradient>
          <filter id="glow-orange">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Outer orbit ring — spinning */}
        <g style={{ animation: "spin-slow 20s linear infinite", transformOrigin: "250px 250px" }}>
          <circle cx="250" cy="250" r="198"
            fill="none"
            stroke="rgba(255,85,0,0.18)"
            strokeWidth="1"
            strokeDasharray="6 10"
          />
          {orbitMarkers.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = 250 + Math.cos(rad) * 198;
            const y = 250 + Math.sin(rad) * 198;
            return (
              <circle key={deg} cx={x} cy={y} r="3"
                fill="#FF5500"
                opacity="0.9"
                filter="url(#glow-orange)"
              />
            );
          })}
        </g>

        {/* Inner orbit ring — counter-rotating */}
        <g style={{ animation: "spin-reverse 30s linear infinite", transformOrigin: "250px 250px" }}>
          <circle cx="250" cy="250" r="140"
            fill="none"
            stroke="rgba(139,92,246,0.12)"
            strokeWidth="0.8"
            strokeDasharray="3 8"
          />
        </g>

        {/* Static structure rings */}
        <circle cx="250" cy="250" r="165" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="100" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* Outer node → center spokes */}
        {outerNodes.map((n, i) => (
          <line key={`spoke-${i}`}
            x1="250" y1="250" x2={n.x} y2={n.y}
            stroke="rgba(255,85,0,0.18)"
            strokeWidth="0.6"
          />
        ))}

        {/* Outer ring connections */}
        {outerNodes.map((n, i) => {
          const next = outerNodes[(i + 1) % outerNodes.length];
          return (
            <line key={`ring-${i}`}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Inner ring connections (purple) */}
        {innerNodes.map((n, i) => {
          const next = innerNodes[(i + 1) % innerNodes.length];
          return (
            <line key={`inner-${i}`}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              stroke="rgba(139,92,246,0.25)"
              strokeWidth="0.6"
            />
          );
        })}
        {/* Inner nodes → center */}
        {innerNodes.map((n, i) => (
          <line key={`ispoke-${i}`}
            x1="250" y1="250" x2={n.x} y2={n.y}
            stroke="rgba(139,92,246,0.12)"
            strokeWidth="0.4"
          />
        ))}

        {/* Inner nodes — purple */}
        {innerNodes.map((n, i) => (
          <g key={`inode-${i}`} style={{
            animation: `pulse-node ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            transformOrigin: `${n.x}px ${n.y}px`,
          }}>
            <circle cx={n.x} cy={n.y} r="4" fill="#8B5CF6" opacity="0.85" filter="url(#glow-purple)" />
            <circle cx={n.x} cy={n.y} r="9" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" />
          </g>
        ))}

        {/* Outer nodes — orange */}
        {outerNodes.map((n, i) => (
          <g key={`onode-${i}`} style={{
            animation: `pulse-node ${4 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            transformOrigin: `${n.x}px ${n.y}px`,
          }}>
            <circle cx={n.x} cy={n.y} r="14" fill="rgba(255,85,0,0.08)" />
            <circle cx={n.x} cy={n.y} r="6" fill="#FF5500" filter="url(#glow-orange)" />
            <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="rgba(255,140,0,0.5)" strokeWidth="1" />
          </g>
        ))}

        {/* Center glow */}
        <circle cx="250" cy="250" r="70" fill="url(#orb-center)" />
        <circle cx="250" cy="250" r="50" fill="rgba(255,85,0,0.06)" />

        {/* Center hub */}
        <circle cx="250" cy="250" r="28" fill="#0D0D1F" stroke="rgba(255,85,0,0.6)" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="18" fill="url(#orb-core)" opacity="0.2" />
        <text x="250" y="257"
          textAnchor="middle"
          fill="#FF5500"
          fontSize="18"
          fontWeight="800"
          fontFamily="Syne, sans-serif"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,85,0,0.8))" }}
        >S</text>

        {/* Animated ping on center */}
        <circle cx="250" cy="250" r="28"
          fill="none" stroke="rgba(255,85,0,0.4)" strokeWidth="1"
          style={{ animation: "ping-dot 2.5s ease-out infinite" }}
        />
      </svg>

      {/* Floating metric cards */}
      <div
        className="absolute top-[12%] -right-2 md:-right-10 glass-card-dark rounded-2xl px-4 py-3 min-w-[140px]"
        style={{ animation: "float-card 5s ease-in-out infinite" }}
      >
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Assets Tokenized</div>
        <div className="text-xl font-bold font-mono-brand text-white">₹120Cr+</div>
        <div className="flex items-center gap-1 mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-[11px] text-green-400">+8.4% this month</span>
        </div>
      </div>

      <div
        className="absolute bottom-[18%] -left-2 md:-left-10 glass-card-dark rounded-2xl px-4 py-3 min-w-[140px]"
        style={{ animation: "float-card 6s ease-in-out infinite", animationDelay: "1.5s" }}
      >
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Average IRR</div>
        <div className="text-xl font-bold font-mono-brand" style={{ color: "#FF5500" }}>12.4%</div>
        <div className="text-[11px] text-white/30 mt-1">Real Estate · Invoice · SCF</div>
      </div>

      <div
        className="absolute bottom-[48%] -right-2 md:-right-8 glass-card-dark rounded-xl px-3 py-2"
        style={{ animation: "float-card 4.5s ease-in-out infinite", animationDelay: "0.8s" }}
      >
        <div className="text-[10px] text-white/40 mb-0.5">Settlement</div>
        <div className="text-sm font-bold font-mono-brand text-white">&lt;24h</div>
      </div>
    </div>
  );
};
