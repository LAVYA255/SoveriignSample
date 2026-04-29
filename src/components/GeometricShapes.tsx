import { useEffect, useRef } from "react";

// Floating polygonal accents that subtly parallax to cursor
export const GeometricShapes = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const layers = el.querySelectorAll<HTMLElement>("[data-depth]");
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth || "0.2");
        l.style.transform = `translate3d(${-cx * 40 * d}px, ${-cy * 40 * d}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* large hex outline */}
      <div
        data-depth="0.3"
        className="absolute -left-20 top-1/4 h-[420px] w-[420px] animate-drift opacity-[0.08]"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <polygon
            points="100,10 180,55 180,145 100,190 20,145 20,55"
            fill="none"
            stroke="hsl(22 100% 50%)"
            strokeWidth="0.5"
          />
          <polygon
            points="100,40 155,72 155,128 100,160 45,128 45,72"
            fill="none"
            stroke="hsl(0 0% 100%)"
            strokeWidth="0.3"
          />
        </svg>
      </div>

      {/* triangular wireframe right */}
      <div
        data-depth="0.5"
        className="absolute -right-32 bottom-1/4 h-[520px] w-[520px] animate-drift opacity-[0.07]"
        style={{ animationDelay: "-7s" }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g stroke="hsl(0 0% 100%)" strokeWidth="0.4" fill="none">
            <polygon points="100,15 185,170 15,170" />
            <polygon points="100,55 155,150 45,150" />
            <line x1="100" y1="15" x2="100" y2="170" />
            <line x1="15" y1="170" x2="185" y2="170" />
          </g>
          <circle cx="100" cy="100" r="3" fill="hsl(22 100% 50%)" />
        </svg>
      </div>

      {/* small orbital ring top right */}
      <div
        data-depth="0.7"
        className="absolute right-[10%] top-[12%] h-[180px] w-[180px] opacity-30"
        style={{ animation: "drift 18s ease-in-out infinite" }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(22 100% 50% / 0.4)" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(0 0% 100% / 0.2)" strokeWidth="0.3" />
          <circle cx="180" cy="100" r="2.5" fill="hsl(22 100% 60%)" />
        </svg>
      </div>

      {/* bottom left grid plate */}
      <div data-depth="0.4" className="absolute -bottom-20 left-[15%] h-[260px] w-[360px] opacity-[0.12]">
        <svg viewBox="0 0 360 260" className="h-full w-full" preserveAspectRatio="none">
          <g stroke="hsl(0 0% 100%)" strokeWidth="0.3" fill="none">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="260" />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 43} x2="360" y2={i * 43} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};
