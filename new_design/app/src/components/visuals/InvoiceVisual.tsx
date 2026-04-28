export const InvoiceVisual = () => (
  <div className="relative h-full w-full">
    <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
    <svg viewBox="0 0 400 400" className="relative h-full w-full">
      {/* flowing streams */}
      <defs>
        <linearGradient id="flow" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(22 100% 55%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={`M 0 ${80 + i * 35} Q 200 ${20 + i * 35} 400 ${100 + i * 30}`}
          fill="none"
          stroke="url(#flow)"
          strokeWidth={0.6 + (i % 3) * 0.3}
          strokeDasharray="200 800"
          style={{
            animation: `flow-line ${6 + i * 0.4}s linear ${i * 0.3}s infinite`,
          }}
        />
      ))}
      {/* invoice rectangles forming */}
      {[
        { x: 60, y: 140, d: 0 },
        { x: 160, y: 100, d: 0.5 },
        { x: 270, y: 160, d: 1 },
        { x: 110, y: 240, d: 1.5 },
        { x: 240, y: 260, d: 2 },
      ].map((b, i) => (
        <g key={i} style={{ animation: `ambient-pulse ${5 + i}s ease-in-out ${b.d}s infinite` }}>
          <rect x={b.x} y={b.y} width="70" height="50" fill="hsl(0 0% 5%)" stroke="hsl(22 100% 50% / 0.7)" strokeWidth="0.6" />
          <line x1={b.x + 8} y1={b.y + 12} x2={b.x + 50} y2={b.y + 12} stroke="hsl(0 0% 100% / 0.4)" strokeWidth="0.5" />
          <line x1={b.x + 8} y1={b.y + 22} x2={b.x + 60} y2={b.y + 22} stroke="hsl(0 0% 100% / 0.25)" strokeWidth="0.5" />
          <line x1={b.x + 8} y1={b.y + 32} x2={b.x + 40} y2={b.y + 32} stroke="hsl(0 0% 100% / 0.25)" strokeWidth="0.5" />
          <circle cx={b.x + 60} cy={b.y + 38} r="3" fill="hsl(22 100% 55%)" />
        </g>
      ))}
    </svg>
  </div>
);
