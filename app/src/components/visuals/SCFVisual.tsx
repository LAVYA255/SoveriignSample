export const SCFVisual = () => {
  const nodes = [
    { x: 200, y: 200, r: 6, hub: true },
    { x: 80, y: 90 },
    { x: 320, y: 80 },
    { x: 60, y: 220 },
    { x: 340, y: 200 },
    { x: 110, y: 330 },
    { x: 290, y: 340 },
    { x: 200, y: 60 },
    { x: 200, y: 350 },
  ];
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        {/* globe ring */}
        <circle cx="200" cy="200" r="170" fill="none" stroke="hsl(0 0% 100% / 0.08)" strokeWidth="0.5" />
        <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="0.5" />
        <ellipse cx="200" cy="200" rx="60" ry="170" fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="0.5" />

        {/* connections */}
        {nodes.slice(1).map((n, i) => (
          <line
            key={i}
            x1="200"
            y1="200"
            x2={n.x}
            y2={n.y}
            stroke="hsl(22 100% 55%)"
            strokeWidth="0.5"
            strokeDasharray="3 4"
            opacity="0.6"
            style={{ animation: `ambient-pulse ${4 + i * 0.5}s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
        {/* outer ring connections */}
        {nodes.slice(1).map((n, i) => {
          const next = nodes.slice(1)[(i + 1) % (nodes.length - 1)];
          return (
            <line
              key={`r${i}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="hsl(0 0% 100% / 0.15)"
              strokeWidth="0.4"
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.hub ? 10 : 4} fill="hsl(0 0% 3%)" stroke="hsl(22 100% 55%)" strokeWidth="1" />
            <circle cx={n.x} cy={n.y} r={n.hub ? 4 : 1.5} fill="hsl(22 100% 60%)" />
            {!n.hub && (
              <circle cx={n.x} cy={n.y} r="10" fill="none" stroke="hsl(22 100% 50% / 0.4)" strokeWidth="0.4" style={{ animation: `ambient-pulse ${3 + i * 0.3}s ease-in-out infinite` }} />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
