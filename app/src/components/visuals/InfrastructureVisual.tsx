export const InfrastructureVisual = () => (
  <div className="relative h-full w-full">
    <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
    <svg viewBox="0 0 400 400" className="relative h-full w-full">
      {/* clean structured grid */}
      <g stroke="hsl(0 0% 100% / 0.12)" strokeWidth="0.4" fill="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={40 + i * 32} y1="40" x2={40 + i * 32} y2="360" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="40" y1={40 + i * 32} x2="360" y2={40 + i * 32} />
        ))}
      </g>
      {/* highlighted modules */}
      {[
        [2, 2, 2, 2],
        [5, 3, 3, 1],
        [2, 5, 4, 2],
        [7, 6, 2, 3],
      ].map(([cx, cy, w, h], i) => (
        <rect
          key={i}
          x={40 + cx * 32}
          y={40 + cy * 32}
          width={w * 32}
          height={h * 32}
          fill="hsl(22 100% 50% / 0.08)"
          stroke="hsl(22 100% 55%)"
          strokeWidth="0.7"
          style={{ animation: `ambient-pulse ${4 + i}s ease-in-out ${i * 0.4}s infinite` }}
        />
      ))}
      {/* corner brackets */}
      <g stroke="hsl(22 100% 55%)" strokeWidth="1" fill="none">
        <polyline points="20,40 20,20 40,20" />
        <polyline points="360,20 380,20 380,40" />
        <polyline points="380,360 380,380 360,380" />
        <polyline points="40,380 20,380 20,360" />
      </g>
    </svg>
  </div>
);
