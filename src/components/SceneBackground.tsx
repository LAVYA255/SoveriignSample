import { useEffect, useRef } from "react";

/**
 * Cinematic scroll-driven background.
 * Single fixed canvas. 6 scenes cross-fade based on per-section scroll progress
 * (computed from elements with [data-scene] so visuals stay in lockstep with content).
 *
 * Strict palette:
 *   - Background: pure black
 *   - Geometric structures: WHITE
 *   - Accents / energy / highlights: luxury orange (#FF6A00)
 */

interface Star { x: number; y: number; z: number; r: number; }
interface Building { x: number; w: number; h: number; windows: Array<{ on: number }>; }
interface Node2 { lat: number; lon: number; pulse: number; }
interface Flow { a: number; b: number; t: number; speed: number; }
interface Doc { x: number; y: number; vy: number; w: number; h: number; rot: number; rotV: number; alpha: number; }
interface Token { x: number; y: number; vx: number; vy: number; r: number; orange: boolean; }

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Strict 2-color system
const ORANGE = "22, 100%, 50%";
const ORANGE_BRIGHT = "22, 100%, 60%";
const WHITE = "0, 0%, 100%";

export const SceneBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // progressRef.current is a float in [0, NUM_SCENES-1]; integer part = scene index, fractional = intra
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, hasMoved: false });

  useEffect(() => {
    const NUM_SCENES = 6;

    const computeProgress = () => {
      // Collect section anchors in document order. Fall back to evenly-spaced scroll if none.
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const vh = window.innerHeight;

      if (sections.length < 2) {
        const max = document.documentElement.scrollHeight - vh;
        const p = max > 0 ? window.scrollY / max : 0;
        progressRef.current = clamp01(p) * (NUM_SCENES - 1);
        return;
      }

      // Each section corresponds to a scene index (in DOM order).
      // Use the section's center crossing the viewport center to drive intra-progress.
      const viewportCenter = window.scrollY + vh / 2;
      const centers = sections.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return top + rect.height / 2;
      });

      // Find the segment we are in
      let idx = 0;
      for (let i = 0; i < centers.length - 1; i++) {
        if (viewportCenter >= centers[i] && viewportCenter < centers[i + 1]) {
          idx = i;
          break;
        }
        if (viewportCenter >= centers[centers.length - 1]) idx = centers.length - 1;
      }

      let intra = 0;
      if (idx < centers.length - 1) {
        const span = centers[idx + 1] - centers[idx];
        intra = span > 0 ? (viewportCenter - centers[idx]) / span : 0;
      }
      intra = clamp01(intra);

      // Map section index → scene index (1:1 since we have NUM_SCENES sections expected)
      const sceneIdx = Math.min(NUM_SCENES - 1, idx);
      progressRef.current = sceneIdx + intra;
    };

    computeProgress();
    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", computeProgress);
    return () => {
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", computeProgress);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
      mouseRef.current.hasMoved = true;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    let buildings: Building[] = [];
    let nodes: Node2[] = [];
    let flows: Flow[] = [];
    let docs: Doc[] = [];
    let tokens: Token[] = [];

    const seed = () => {
      stars = [];
      for (let i = 0; i < 220; i++) {
        stars.push({ x: Math.random(), y: Math.random(), z: Math.random(), r: Math.random() * 1.2 + 0.2 });
      }

      buildings = [];
      const count = 28;
      for (let i = 0; i < count; i++) {
        const bw = 30 + Math.random() * 70;
        const bh = 120 + Math.random() * 360;
        const winRows = Math.floor(bh / 18);
        const winCols = Math.floor(bw / 14);
        const windows = [];
        for (let r = 0; r < winRows * winCols; r++) {
          windows.push({ on: Math.random() > 0.45 ? Math.random() * 0.8 + 0.2 : 0 });
        }
        buildings.push({ x: i / count, w: bw, h: bh, windows });
      }

      nodes = [];
      const N = 22;
      for (let i = 0; i < N; i++) {
        nodes.push({ lat: (Math.random() - 0.5) * 1.4, lon: (Math.random() - 0.5) * 1.8, pulse: Math.random() });
      }
      flows = [];
      for (let i = 0; i < 18; i++) {
        flows.push({
          a: Math.floor(Math.random() * N),
          b: Math.floor(Math.random() * N),
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
        });
      }

      docs = [];
      for (let i = 0; i < 22; i++) {
        docs.push({
          x: Math.random(), y: Math.random(),
          vy: 0.0006 + Math.random() * 0.0014,
          w: 70 + Math.random() * 50,
          h: 90 + Math.random() * 60,
          rot: (Math.random() - 0.5) * 0.4,
          rotV: (Math.random() - 0.5) * 0.0008,
          alpha: 0.3 + Math.random() * 0.5,
        });
      }

      tokens = [];
      for (let i = 0; i < 80; i++) {
        tokens.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0006,
          vy: (Math.random() - 0.5) * 0.0006,
          r: 2 + Math.random() * 3,
          orange: Math.random() > 0.65,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let raf = 0;
    let t = 0;

    // ============ SCENE 0: Hero — starfield + Earth (white wireframe, orange energy) ============
    const drawHero = (alpha: number, intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // starfield (white)
      for (const s of stars) {
        const px = s.x * w + mx * 30 * s.z;
        const py = s.y * h + my * 30 * s.z;
        ctx.fillStyle = `hsla(${WHITE}, ${0.15 + s.z * 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Earth — pure black sphere with WHITE wireframe + faint orange atmosphere
      const baseR = Math.min(w, h) * 0.22;
      const r = baseR * (1 + intra * 2.4);
      const cx = w / 2 + mx * 20;
      const cy = h * 0.55 + my * 15 + intra * h * 0.15;

      // orange atmosphere glow (accent only)
      const atm = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.7);
      atm.addColorStop(0, `hsla(${ORANGE}, 0.22)`);
      atm.addColorStop(1, `hsla(${ORANGE}, 0)`);
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // pure black sphere
      ctx.fillStyle = "hsl(0, 0%, 0%)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // WHITE rim
      ctx.strokeStyle = `hsla(${WHITE}, 0.75)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // WHITE latitude grid
      ctx.strokeStyle = `hsla(${WHITE}, ${0.18 + intra * 0.18})`;
      ctx.lineWidth = 0.6;
      for (let i = 1; i < 8; i++) {
        const ry = (i / 8) * r;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // WHITE longitude grid (subtle rotation for life)
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI;
        const rx = Math.abs(Math.sin(ang + t * 0.1)) * r;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // city lights — ORANGE accent dots
      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * Math.PI * 2 + t * 0.05;
        const rad = r * (0.3 + ((i * 137) % 100) / 140);
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad * 0.6;
        const tw = 0.5 + Math.sin(t * 2 + i) * 0.5;
        ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, ${alpha * (0.4 + tw * 0.6)})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // ============ SCENE 1: City — WHITE outlined buildings, ORANGE accent windows ============
    const drawCity = (alpha: number, intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const base = h * 0.78;

      // distant haze layer — faint white silhouettes
      ctx.save();
      ctx.translate(-mx * 20, 0);
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        if (i % 2 === 0) continue;
        const x = b.x * w * 1.3 - w * 0.1;
        const bh = b.h * 0.55;
        ctx.fillStyle = "hsl(0, 0%, 0%)";
        ctx.fillRect(x, base - bh, b.w * 0.7, bh);
        ctx.strokeStyle = `hsla(${WHITE}, 0.12)`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.5, base - bh + 0.5, b.w * 0.7 - 1, bh - 1);
      }
      ctx.restore();

      // foreground skyline — black bodies, WHITE outlines, ORANGE windows
      ctx.save();
      ctx.translate(-mx * 50, -my * 10);
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        if (i % 2 === 1) continue;
        const x = (b.x * w * 1.2 - w * 0.05);
        const rise = easeInOut(clamp01(intra * 1.4 - i * 0.015));
        const bh = b.h * rise;
        const top = base - bh;
        if (bh < 1) continue;

        // pure black body
        ctx.fillStyle = "hsl(0, 0%, 0%)";
        ctx.fillRect(x, top, b.w, bh);

        // WHITE outline
        ctx.strokeStyle = `hsla(${WHITE}, 0.6)`;
        ctx.lineWidth = 0.7;
        ctx.strokeRect(x + 0.5, top + 0.5, b.w - 1, bh - 1);

        // ORANGE windows (accent)
        const cols = Math.max(1, Math.floor(b.w / 14));
        const rows = Math.max(1, Math.floor(bh / 18));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const win = b.windows[idx % b.windows.length];
            if (!win.on) continue;
            const flicker = 0.5 + Math.sin(t * 1.5 + i + r + c) * 0.5;
            ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, ${win.on * (0.3 + flicker * 0.6)})`;
            ctx.fillRect(x + 4 + c * 14, top + 6 + r * 18, 6, 8);
          }
        }
      }
      ctx.restore();

      // ground perspective lines — WHITE
      ctx.strokeStyle = `hsla(${WHITE}, 0.18)`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(w / 2, base);
        ctx.lineTo((i / 11) * w, h);
        ctx.stroke();
      }

      ctx.restore();
    };

    // ============ SCENE 2: Invoices — WHITE document structures, ORANGE flow accents ============
    const drawInvoices = (alpha: number, _intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // flowing vertical streams — WHITE faint
      ctx.strokeStyle = `hsla(${WHITE}, 0.12)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 16; i++) {
        const x = (i / 15) * w;
        ctx.beginPath();
        for (let y = 0; y < h; y += 8) {
          const wave = Math.sin(y * 0.01 + t * 0.8 + i) * 30;
          ctx.lineTo(x + wave, y);
        }
        ctx.stroke();
      }

      // floating documents — WHITE outlined, ORANGE accents
      for (const d of docs) {
        d.y -= d.vy;
        d.rot += d.rotV;
        if (d.y < -0.2) { d.y = 1.2; d.x = Math.random(); }
        const px = d.x * w + mx * 20;
        const py = d.y * h + my * 10;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(d.rot);
        ctx.globalAlpha = alpha * d.alpha;

        // pure black paper, WHITE outline
        ctx.fillStyle = "hsl(0, 0%, 0%)";
        ctx.strokeStyle = `hsla(${WHITE}, 0.7)`;
        ctx.lineWidth = 0.8;
        ctx.fillRect(-d.w / 2, -d.h / 2, d.w, d.h);
        ctx.strokeRect(-d.w / 2, -d.h / 2, d.w, d.h);

        // ORANGE header bar (accent)
        ctx.fillStyle = `hsla(${ORANGE}, 0.55)`;
        ctx.fillRect(-d.w / 2 + 6, -d.h / 2 + 6, d.w * 0.5, 4);

        // WHITE line items
        ctx.fillStyle = `hsla(${WHITE}, 0.35)`;
        for (let li = 0; li < 6; li++) {
          ctx.fillRect(-d.w / 2 + 6, -d.h / 2 + 18 + li * 8, d.w - 16, 1.5);
        }

        // ORANGE total bar (accent)
        ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, 0.7)`;
        ctx.fillRect(-d.w / 2 + 6, d.h / 2 - 12, d.w * 0.4, 5);

        ctx.restore();
      }
      ctx.globalAlpha = alpha;

      // dissolve particles — ORANGE accent
      for (let i = 0; i < 30; i++) {
        const px = ((Math.sin(i * 13.7 + t * 0.3) + 1) / 2) * w;
        const py = ((Math.cos(i * 7.3 + t * 0.4) + 1) / 2) * h;
        ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, ${0.2 + Math.sin(t + i) * 0.2})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // ============ SCENE 3: SCF — WHITE world map, ORANGE nodes & flows ============
    const drawSCF = (alpha: number, _intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cx = w / 2 + mx * 30;
      const cy = h / 2 + my * 20;
      const rx = Math.min(w, h) * 0.42;
      const ry = Math.min(w, h) * 0.28;

      // world ellipse outline — WHITE
      ctx.strokeStyle = `hsla(${WHITE}, 0.4)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // continents — pure dark fill, WHITE outline
      ctx.fillStyle = "hsl(0, 0%, 0%)";
      ctx.strokeStyle = `hsla(${WHITE}, 0.35)`;
      ctx.lineWidth = 0.6;
      const blobs: Array<[number, number, number, number]> = [
        [-0.5, -0.2, 0.25, 0.18],
        [0.1, -0.3, 0.18, 0.15],
        [0.4, 0.1, 0.22, 0.2],
        [-0.3, 0.3, 0.2, 0.12],
        [0.65, -0.1, 0.1, 0.1],
      ];
      for (const [bx, by, bw, bh] of blobs) {
        ctx.beginPath();
        ctx.ellipse(cx + bx * rx, cy + by * ry, bw * rx, bh * ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // grid latitude lines — WHITE faint
      ctx.strokeStyle = `hsla(${WHITE}, 0.1)`;
      ctx.lineWidth = 0.4;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry * (i / 6), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // nodes — ORANGE accents
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const px = cx + n.lon * rx * 0.9;
        const py = cy + n.lat * ry * 0.9;
        const pulse = (Math.sin(t * 1.5 + i) + 1) / 2;
        ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, ${0.6 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `hsla(${ORANGE}, ${0.35 * (1 - pulse)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.arc(px, py, 6 + pulse * 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // animated arc flows — WHITE arc, ORANGE traveling particle
      for (const f of flows) {
        f.t += f.speed;
        if (f.t > 1) {
          f.t = 0;
          f.a = Math.floor(Math.random() * nodes.length);
          f.b = Math.floor(Math.random() * nodes.length);
        }
        const a = nodes[f.a];
        const b = nodes[f.b];
        if (!a || !b || f.a === f.b) continue;
        const ax = cx + a.lon * rx * 0.9;
        const ay = cy + a.lat * ry * 0.9;
        const bx = cx + b.lon * rx * 0.9;
        const by = cy + b.lat * ry * 0.9;
        const midx = (ax + bx) / 2;
        const midy = (ay + by) / 2 - Math.abs(bx - ax) * 0.3;

        ctx.strokeStyle = `hsla(${WHITE}, 0.18)`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(midx, midy, bx, by);
        ctx.stroke();

        const tt = f.t;
        const px = (1 - tt) * (1 - tt) * ax + 2 * (1 - tt) * tt * midx + tt * tt * bx;
        const py = (1 - tt) * (1 - tt) * ay + 2 * (1 - tt) * tt * midy + tt * tt * by;
        ctx.fillStyle = `hsla(${ORANGE_BRIGHT}, 0.95)`;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${ORANGE}, 0.3)`;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // ============ SCENE 4: Tokenization — WHITE hex lattice, ORANGE core ============
    const drawTokenization = (alpha: number, _intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cx = w / 2 + mx * 25;
      const cy = h / 2 + my * 15;

      // central core glow — ORANGE accent
      const coreR = 60 + Math.sin(t) * 8;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2);
      grad.addColorStop(0, `hsla(${ORANGE_BRIGHT}, 0.5)`);
      grad.addColorStop(1, `hsla(${ORANGE}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2, 0, Math.PI * 2);
      ctx.fill();

      // hexagonal lattice — WHITE
      ctx.lineWidth = 0.5;
      const hex = 40;
      for (let row = -1; row < Math.ceil(h / hex) + 1; row++) {
        for (let col = -1; col < Math.ceil(w / (hex * 1.5)) + 1; col++) {
          const px = col * hex * 1.5 + (row % 2 ? hex * 0.75 : 0);
          const py = row * hex * 0.866;
          const dx = px - cx;
          const dy = py - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          const fade = Math.max(0, 1 - d / (Math.max(w, h) * 0.6));
          ctx.strokeStyle = `hsla(${WHITE}, ${fade * 0.32})`;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            const hx = px + Math.cos(ang) * hex * 0.5;
            const hy = py + Math.sin(ang) * hex * 0.5;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // tokens — mostly WHITE with rare ORANGE accents
      for (const tk of tokens) {
        tk.x += tk.vx;
        tk.y += tk.vy;
        if (tk.x < 0 || tk.x > 1) tk.vx *= -1;
        if (tk.y < 0 || tk.y > 1) tk.vy *= -1;
        const px = tk.x * w;
        const py = tk.y * h;
        ctx.fillStyle = tk.orange
          ? `hsla(${ORANGE_BRIGHT}, 0.85)`
          : `hsla(${WHITE}, 0.7)`;
        ctx.beginPath();
        ctx.arc(px, py, tk.r, 0, Math.PI * 2);
        ctx.fill();
        // faint white tether
        ctx.strokeStyle = `hsla(${WHITE}, 0.04)`;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }

      // rotating ORANGE ring (accent energy)
      ctx.strokeStyle = `hsla(${ORANGE_BRIGHT}, 0.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 30, t * 0.3, t * 0.3 + Math.PI * 1.4);
      ctx.stroke();

      ctx.restore();
    };

    // ============ SCENE 5: Infrastructure — WHITE structured grid, ORANGE highlights ============
    const drawInfra = (alpha: number, _intra: number) => {
      if (alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cell = 60;
      ctx.strokeStyle = `hsla(${WHITE}, 0.1)`;
      ctx.lineWidth = 0.4;
      ctx.save();
      ctx.translate(mx * 10, my * 8);
      for (let x = -cell; x < w + cell; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -cell; y < h + cell; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // highlighted modules — ORANGE accent
      ctx.strokeStyle = `hsla(${ORANGE}, 0.55)`;
      ctx.fillStyle = `hsla(${ORANGE}, 0.05)`;
      const modules: Array<[number, number, number, number]> = [
        [3, 2, 4, 3],
        [9, 4, 3, 2],
        [2, 6, 5, 2],
        [8, 8, 4, 3],
      ];
      for (let i = 0; i < modules.length; i++) {
        const [cxi, cyi, cw, ch] = modules[i];
        const x = cxi * cell;
        const y = cyi * cell;
        const pulse = (Math.sin(t + i) + 1) / 2;
        ctx.globalAlpha = alpha * (0.5 + pulse * 0.5);
        ctx.fillRect(x, y, cw * cell, ch * cell);
        ctx.strokeRect(x + 0.5, y + 0.5, cw * cell - 1, ch * cell - 1);
      }
      ctx.globalAlpha = alpha;
      ctx.restore();

      // institutional corner brackets — WHITE
      ctx.strokeStyle = `hsla(${WHITE}, 0.65)`;
      ctx.lineWidth = 1;
      const m = 30;
      const len = 24;
      const corners: Array<[number, number, number, number]> = [
        [m, m, 1, 1],
        [w - m, m, -1, 1],
        [m, h - m, 1, -1],
        [w - m, h - m, -1, -1],
      ];
      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * len);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * len, y);
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);

      // pure black base
      ctx.fillStyle = "hsl(0, 0%, 0%)";
      ctx.fillRect(0, 0, w, h);

      const p = progressRef.current;
      const sceneIndex = Math.min(5, Math.max(0, Math.floor(p)));
      const intra = clamp01(p - sceneIndex);

      // smoother cross-fade window — start earlier so transitions feel fluid
      const fadeStart = 0.55;
      let wCur = 1;
      let wNext = 0;
      if (intra > fadeStart) {
        const k = (intra - fadeStart) / (1 - fadeStart);
        // ease the cross-fade
        const eased = k * k * (3 - 2 * k);
        wCur = 1 - eased;
        wNext = eased;
      }

      const renderers: Array<(a: number, i: number) => void> = [
        drawHero, drawCity, drawInvoices, drawSCF, drawTokenization, drawInfra,
      ];

      // intra grows scene-internal animation; hero uses raw intra (zoom), others ease-in
      const currentIntra = sceneIndex === 0 ? intra : Math.min(1, intra * 1.4);
      renderers[sceneIndex]?.(wCur, currentIntra);
      if (wNext > 0 && renderers[sceneIndex + 1]) {
        renderers[sceneIndex + 1](wNext, 0);
      }

      // subtle dim overlay for text legibility
      ctx.fillStyle = "hsla(0, 0%, 0%, 0.3)";
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    seed();
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 block h-full w-full"
      aria-hidden="true"
    />
  );
};
