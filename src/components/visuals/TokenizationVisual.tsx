export const TokenizationVisual = () => (
  <div className="relative h-full w-full">
    <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
    <svg viewBox="0 0 400 400" className="relative h-full w-full">
      {/* central asset cube breaking into tokens */}
      <g transform="translate(200 200)">
        {/* cube */}
        <g style={{ animation: "ambient-pulse 5s ease-in-out infinite", transformOrigin: "center" }}>
          <polygon points="-40,-40 40,-40 40,40 -40,40" fill="hsl(22 100% 50% / 0.1)" stroke="hsl(22 100% 55%)" strokeWidth="0.8" />
          <polygon points="-40,-40 -20,-60 60,-60 40,-40" fill="hsl(22 100% 50% / 0.06)" stroke="hsl(22 100% 55%)" strokeWidth="0.8" />
          <polygon points="40,-40 60,-60 60,20 40,40" fill="hsl(22 100% 50% / 0.04)" stroke="hsl(22 100% 55%)" strokeWidth="0.8" />
        </g>
        {/* radiating tokens */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = 90 + (i % 3) * 25;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          return (
            <g key={i} style={{ animation: `ambient-pulse ${3 + (i % 4)}s ease-in-out ${i * 0.05}s infinite` }}>
              <line x1="0" y1="0" x2={x * 0.7} y2={y * 0.7} stroke="hsl(22 100% 50% / 0.25)" strokeWidth="0.3" />
              <polygon
                points={`${x},${y - 4} ${x + 4},${y} ${x},${y + 4} ${x - 4},${y}`}
                fill="hsl(22 100% 60%)"
                opacity="0.85"
              />
            </g>
          );
        })}
      </g>
    </svg>
  </div>
);
