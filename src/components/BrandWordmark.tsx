import { useEffect, useState } from "react";

const LETTERS = ["S", "O", "V", "R", "I", "I", "G", "N", "E"];

// per-letter color stop along white -> orange spectrum
// first 3 white, last 3 full orange, middle gradient
const colorFor = (i: number, total: number) => {
  if (i < 3) return "hsl(0 0% 100%)";
  if (i >= total - 3) return "hsl(22 100% 50%)";
  const t = (i - 3) / (total - 6); // 0..1 across middle
  // interpolate white -> orange via warm path
  const h = 22;
  const s = 100 * t;
  const l = 100 - 50 * t;
  return `hsl(${h} ${s}% ${l}%)`;
};

interface Props {
  className?: string;
  delay?: number;
}

export const BrandWordmark = ({ className = "", delay = 0 }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <h1
      className={`font-display font-bold tracking-[-0.05em] leading-[0.9] select-none ${className}`}
      aria-label="SOVRIIGNE"
    >
      <span className="relative inline-block">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              color: colorFor(i, LETTERS.length),
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0) scale(1)" : "translateY(60px) scale(0.92)",
              filter: mounted ? "blur(0)" : "blur(14px)",
              transition: `opacity 900ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, filter 900ms ${i * 90}ms`,
              textShadow:
                i >= LETTERS.length - 3
                  ? "0 0 60px hsl(22 100% 50% / 0.55), 0 0 120px hsl(22 100% 50% / 0.25)"
                  : i >= 3
                  ? "0 0 40px hsl(22 100% 50% / 0.25)"
                  : "0 0 30px hsl(0 0% 100% / 0.15)",
            }}
          >
            {ch}
          </span>
        ))}
        {/* energy sweep overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, hsl(22 100% 60% / 0.0) 30%, hsl(22 100% 65% / 0.35) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            mixBlendMode: "screen",
            animation: mounted ? "energy-sweep 4.5s ease-in-out 1.2s infinite" : "none",
            WebkitMaskImage:
              "linear-gradient(90deg, #000 0%, #000 100%)",
          }}
        />
      </span>
    </h1>
  );
};
