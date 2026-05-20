/* Pre-computed window opacities — fixes the Math.random()-in-render bug */
const BUILDINGS = [
  { x: 80,  w: 50, h: 180 },
  { x: 145, w: 70, h: 240 },
  { x: 230, w: 55, h: 200 },
  { x: 300, w: 45, h: 150 },
];

const WINDOW_OPACITIES = BUILDINGS.map(b => {
  const rows = Math.floor(b.h / 18);
  const cols = Math.floor(b.w / 12);
  return Array.from({ length: rows * cols }, () =>
    Math.random() > 0.5 ? 0.6 : 0.15
  );
});

export const RealEstateVisual = () => (
  <div className="relative h-full w-full">
    <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
    <svg viewBox="0 0 400 400" className="relative h-full w-full">
      <defs>
        <linearGradient id="re-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="hsl(22 100% 50%)" stopOpacity="0.0" />
          <stop offset="60%"  stopColor="hsl(22 100% 50%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(22 100% 60%)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Ground grid */}
      <g stroke="hsl(0 0% 100% / 0.12)" strokeWidth="0.4" fill="none">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={40 + i * 35} y1="280" x2={120 + i * 18} y2="370" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1={20} y1={280 + i * 18} x2={380} y2={280 + i * 18} />
        ))}
      </g>
      {/* Buildings */}
      {BUILDINGS.map((b, i) => (
        <g key={i} style={{ animation: `ambient-pulse ${4 + i}s ease-in-out infinite`, transformOrigin: "center bottom" }}>
          <rect x={b.x} y={280 - b.h} width={b.w} height={b.h}
            fill="url(#re-grad)"
            stroke="hsl(22 100% 60% / 0.6)"
            strokeWidth="0.5"
          />
          {Array.from({ length: Math.floor(b.h / 18) }).map((_, r) =>
            Array.from({ length: Math.floor(b.w / 12) }).map((_, c) => (
              <rect
                key={`${r}-${c}`}
                x={b.x + 4 + c * 12}
                y={280 - b.h + 8 + r * 18}
                width={6}
                height={8}
                fill="hsl(22 100% 70%)"
                opacity={WINDOW_OPACITIES[i][r * Math.floor(b.w / 12) + c]}
              />
            ))
          )}
        </g>
      ))}
      {/* Token nodes orbiting */}
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = 200 + Math.cos(a) * 160;
          const y = 100 + Math.sin(a) * 50;
          return <circle key={i} cx={x} cy={y} r="1.8" fill="hsl(22 100% 60%)" opacity="0.7" />;
        })}
      </g>
    </svg>
  </div>
);
