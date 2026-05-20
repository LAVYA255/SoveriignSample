import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
  size: number;
  depth: number;
  orange: boolean;
  pulseOffset: number;
}

export const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0, t = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      particles = [];
      const count = Math.min(120, Math.floor((w * h) / 14000));
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x, y,
          baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          size: Math.random() * 1.6 + 0.5,
          depth: Math.random() * 0.7 + 0.3,
          orange: Math.random() > 0.82,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      /* subtle radial ambient — bottom-right warm glow */
      const glow = ctx.createRadialGradient(w * 0.78, h * 0.72, 0, w * 0.78, h * 0.72, Math.max(w, h) * 0.55);
      glow.addColorStop(0, "rgba(255, 85, 0, 0.055)");
      glow.addColorStop(1, "rgba(255, 85, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      /* top-left cool glow */
      const glow2 = ctx.createRadialGradient(w * 0.15, h * 0.2, 0, w * 0.15, h * 0.2, Math.max(w, h) * 0.4);
      glow2.addColorStop(0, "rgba(139, 92, 246, 0.04)");
      glow2.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, w, h);

      /* update particles */
      for (const p of particles) {
        const flow = Math.sin(p.baseX * 0.004 + t) * 0.25 + Math.cos(p.baseY * 0.004 + t * 0.6) * 0.25;
        p.x += p.vx + flow * 0.08 * p.depth;
        p.y += p.vy + Math.cos(t + p.baseX * 0.002) * 0.08 * p.depth;
        p.x += (p.baseX - p.x) * 0.004;
        p.y += (p.baseY - p.y) * 0.004;

        /* cursor attract */
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 200 * 200) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / 200) * 1.4 * p.depth;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      /* connections */
      const CONNECT = 110;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.14 * Math.min(a.depth, b.depth);
            const isOrange = a.orange || b.orange;
            ctx.strokeStyle = isOrange
              ? `rgba(255, 100, 0, ${alpha * 2.2})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* particles */
      for (const p of particles) {
        const pulse = 0.6 + Math.sin(t * 1.8 + p.pulseOffset) * 0.4;
        const near = (mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2 < 160 * 160;
        if (p.orange) {
          ctx.fillStyle = near
            ? `rgba(255, 90, 0, ${0.95 * pulse})`
            : `rgba(255, 75, 0, ${0.65 * pulse})`;
          /* pulse ring */
          if (pulse > 0.85) {
            ctx.strokeStyle = `rgba(255, 85, 0, ${(pulse - 0.85) * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 5, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          ctx.fillStyle = near
            ? `rgba(139, 92, 246, ${0.9 * pulse * p.depth})`
            : `rgba(255, 255, 255, ${0.35 * pulse * p.depth})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (near ? 0.8 : 0), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    seed();
    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
};
