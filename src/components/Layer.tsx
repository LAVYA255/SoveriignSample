import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  index: string;
  eyebrow: string;
  headline: ReactNode;
  description?: string;
  visual: ReactNode;
  align?: "left" | "right";
}

export const Layer = ({ index, eyebrow, headline, description, visual, align = "left" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(true),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center px-6 py-32 md:px-16 lg:px-24"
    >
      <div
        className={`relative z-10 grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2 ${
          align === "right" ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div
          className="space-y-8"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 1.2s var(--ease-luxury), transform 1.2s var(--ease-luxury)",
          }}
        >
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-primary/60" />
            <span>{index}</span>
            <span className="text-primary/80">{eyebrow}</span>
          </div>
          <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            {headline}
          </h2>
          {description && (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div
          className="relative aspect-square w-full"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "scale(1) translateY(0)" : "scale(0.94) translateY(30px)",
            transition: "opacity 1.4s var(--ease-luxury) 0.15s, transform 1.4s var(--ease-luxury) 0.15s",
          }}
        >
          {visual}
        </div>
      </div>
    </section>
  );
};
