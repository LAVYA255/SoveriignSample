import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  depth: number;
}

interface Props {
  density?: number;
  className?: string;
  intensity?: number; // scroll-driven 0..1
}

export const ParticleField = ({ density = 90, className = "", intensity = 0 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      nodes = [];
      const count = Math.floor((w * h) / (16000 / (density / 90)));
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.4 + 0.4,
          depth: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, w, h);

      // ambient radial glow
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6);
      grad.addColorStop(0, "hsla(22, 100%, 50%, 0.07)");
      grad.addColorStop(1, "hsla(22, 100%, 50%, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const inten = intensityRef.current;

      // update
      for (const n of nodes) {
        // ambient flow
        const flow = Math.sin(n.baseX * 0.005 + t) * 0.3 + Math.cos(n.baseY * 0.005 + t * 0.7) * 0.3;
        n.x += n.vx + flow * 0.1 * n.depth;
        n.y += n.vy + Math.cos(t + n.baseX * 0.003) * 0.1 * n.depth;

        // gentle return to base
        n.x += (n.baseX - n.x) * 0.005;
        n.y += (n.baseY - n.y) * 0.005;

        // cursor gravitational pull
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 220;
          if (dist2 < radius * radius) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (1 - dist / radius) * 1.8 * n.depth;
            n.x += (dx / dist) * force;
            n.y += (dy / dist) * force;
          }
        }

        // wrap
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      // connections
      const connectDist = 130 + inten * 40;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connectDist) {
            const alpha = (1 - d / connectDist) * 0.18 * Math.min(a.depth, b.depth);
            // mix of white and orange depending on cursor proximity
            let isOrange = false;
            if (mouse.active) {
              const mx = (a.x + b.x) / 2 - mouse.x;
              const my = (a.y + b.y) / 2 - mouse.y;
              if (mx * mx + my * my < 260 * 260) isOrange = true;
            }
            ctx.strokeStyle = isOrange
              ? `hsla(22, 100%, 55%, ${alpha * 1.6})`
              : `hsla(0, 0%, 100%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        let near = false;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          if (dx * dx + dy * dy < 180 * 180) near = true;
        }
        ctx.fillStyle = near
          ? `hsla(22, 100%, 60%, ${0.9 * n.depth})`
          : `hsla(0, 0%, 100%, ${0.45 * n.depth})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + (near ? 1 : 0), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

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
  }, [density]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
};
