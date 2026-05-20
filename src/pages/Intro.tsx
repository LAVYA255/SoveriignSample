import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { CustomCursor } from "@/components/CustomCursor";
import { NetworkBackground } from "@/components/NetworkBackground";
import { NetworkOrb } from "@/components/NetworkOrb";

/* ─── Data ────────────────────────────────────── */
const tickerItems = [
  { label: "Real Estate · Prestige Tower", value: "₹2.4Cr", change: "+12.9%", type: "RE" },
  { label: "Invoice Finance · Tata Vendors", value: "₹80L",  change: "+10.4%", type: "INV" },
  { label: "Supply Chain · MSME Network",   value: "₹1.1Cr", change: "+10.5%", type: "SCF" },
  { label: "Real Estate · Phoenix Mall",    value: "₹3.8Cr", change: "+11.2%", type: "RE" },
  { label: "Invoice Finance · AgriTech Pool", value: "₹55L", change: "+9.8%",  type: "INV" },
  { label: "Supply Chain · EV Parts",       value: "₹90L",  change: "+13.1%", type: "SCF" },
];

const products = [
  {
    n: "01", title: "Real Estate",
    desc: "Physical properties that generate value through rental income and long-term price appreciation — structured into programmable ownership.",
    roi: "12.9%", count: "3",
    color: "#FF5500", bg: "rgba(255,85,0,0.06)", border: "rgba(255,85,0,0.18)",
    hoverBorder: "rgba(255,85,0,0.45)", hoverShadow: "0 0 40px rgba(255,85,0,0.14)",
    icon: "ph:buildings-bold",
  },
  {
    n: "02", title: "Invoice Financing",
    desc: "Short-term private credit against unpaid business invoices. Companies receive immediate liquidity — participants earn yield from the invoice discount.",
    roi: "10.4%", count: "3",
    color: "#8B5CF6", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.18)",
    hoverBorder: "rgba(139,92,246,0.45)", hoverShadow: "0 0 40px rgba(139,92,246,0.14)",
    icon: "ph:receipt-bold",
  },
  {
    n: "03", title: "Supply Chain Finance",
    desc: "Working capital at every stage of production and distribution. Suppliers receive continuous cash flow — returns come from structured financing terms.",
    roi: "10.5%", count: "3",
    color: "#22D3EE", bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.18)",
    hoverBorder: "rgba(34,211,238,0.45)", hoverShadow: "0 0 40px rgba(34,211,238,0.14)",
    icon: "ph:share-network-bold",
  },
];

const steps = [
  { n: "01", title: "Create Your Account",     desc: "Access the platform and enter the prototype environment — your gateway to structured real-world asset participation.", color: "#FF5500", icon: "ph:user-circle-plus-bold" },
  { n: "02", title: "Claim Simulated Balance", desc: "Receive in-app capital to explore asset participation without deploying real funds. Understand the system before you commit.", color: "#8B5CF6", icon: "ph:wallet-bold" },
  { n: "03", title: "Explore & Allocate",      desc: "Simulate investments across real estate and private credit, and monitor how positions evolve over time.", color: "#22D3EE", icon: "ph:chart-line-up-bold" },
];

const bigNumbers = [
  { value: "₹120Cr+", label: "Total Value Locked",  color: "#FF5500", icon: "ph:currency-inr-bold" },
  { value: "9",        label: "Active Instruments",  color: "#8B5CF6", icon: "ph:stack-bold" },
  { value: "12.4%",   label: "Average IRR",           color: "#22D3EE", icon: "ph:trend-up-bold" },
  { value: "<24h",    label: "Settlement Time",        color: "#FF5500", icon: "ph:lightning-bold" },
];

const typeColor: Record<string, string> = { RE: "#FF5500", INV: "#8B5CF6", SCF: "#22D3EE" };

const SECTIONS = ["hero", "protocol", "how-it-works", "numbers", "cta"] as const;
const SECTION_ACCENTS = ["#FF5500", "#8B5CF6", "#22D3EE", "#FF5500", "#FF3300"] as const;
const SECTION_NAV     = ["Home", "Assets", "Process", "Numbers", "Join"] as const;
const PEEK_H  = 80; // px of next card peeking from bottom (N+1)
const PEEK_H2 = 40; // additional strip for the card behind (N+2)

/* ── Peek label: visible at the top of a card when it peeks from the bottom ── */
const PeekLabel = ({ label, accent, icon }: { label: string; accent: string; icon: string }) => (
  <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-8"
    style={{ height: PEEK_H, borderBottom: `1px solid ${accent}22`, zIndex: 1 }}>
    <div className="flex h-7 w-7 items-center justify-center rounded-lg"
      style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
      <Icon icon={icon} style={{ color: accent, fontSize: "0.85rem" }} />
    </div>
    <span className="font-mono-brand text-[10px] uppercase tracking-[0.22em]" style={{ color: `${accent}90` }}>
      {label}
    </span>
    <Icon icon="ph:arrow-up-bold" className="ml-auto text-sm" style={{ color: `${accent}50` }} />
  </div>
);

/* ─── Component ───────────────────────────────── */
const Intro = () => {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [email,      setEmail]      = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const sectionIdxRef  = useRef(0);
  const transitioning  = useRef(false);

  /* ── Init: lock scroll + position all cards ── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.cursor = "none";

    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(`panel-${id}`);
      if (!el) return;
      el.style.transition = "none";
      if (i === 0) {
        el.style.transform    = "translateY(0)";
        el.style.opacity      = "1";
        el.style.zIndex       = "10";
        el.style.pointerEvents = "auto";
      } else if (i === 1) {
        el.style.transform    = `translateY(calc(100% - ${PEEK_H}px))`;
        el.style.opacity      = "1";
        el.style.zIndex       = "9";
        el.style.pointerEvents = "none";
      } else if (i === 2) {
        el.style.transform    = `translateY(calc(100% - ${PEEK_H + PEEK_H2}px))`;
        el.style.opacity      = "1";
        el.style.zIndex       = "8";
        el.style.pointerEvents = "none";
      } else {
        el.style.transform    = "translateY(calc(100% + 30px))";
        el.style.opacity      = "0";
        el.style.zIndex       = "5";
        el.style.pointerEvents = "none";
      }
    });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.cursor = "auto";
    };
  }, []);

  /* ── STAGGER ENGINE ────────────────────────── */
  const triggerPanelAnim = useCallback((panelEl: HTMLElement) => {
    const smooth = "cubic-bezier(0.22, 1, 0.36, 1)";
    const els = Array.from(panelEl.querySelectorAll<HTMLElement>(".anim-child"));

    /* snap all to off state */
    els.forEach(el => {
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(32px)";
    });
    void panelEl.offsetHeight; /* single reflow */

    /* stagger in */
    els.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = `opacity 0.55s ${smooth}, transform 0.6s ${smooth}`;
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
        setTimeout(() => { el.style.transform = ""; }, 700);
      }, 90 + i * 75);
    });

    /* count-up for stats panel */
    if (panelEl.id === "panel-numbers") {
      panelEl.querySelectorAll<HTMLElement>(".stat-counter").forEach((el, i) => {
        const raw    = el.dataset.target ?? "";
        const num    = parseFloat(raw.replace(/[^0-9.]/g, ""));
        if (isNaN(num)) return;
        const prefix = raw.match(/^[^0-9]*/)?.[0] ?? "";
        const suffix = raw.match(/[^0-9.]+$/)?.[0] ?? "";
        const start  = performance.now() + 350 + i * 120;
        const tick   = (now: number) => {
          if (now < start) { requestAnimationFrame(tick); return; }
          const t    = Math.min((now - start) / 1400, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          const cur  = num * ease;
          el.textContent = prefix + (Number.isInteger(num) ? Math.round(cur) : cur.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }, []);

  /* ── CARD-PEEL TRANSITION ──────────────────── */
  const goToSection = useCallback((nextIdx: number) => {
    if (transitioning.current) return;
    const currentIdx = sectionIdxRef.current;
    if (nextIdx === currentIdx || nextIdx < 0 || nextIdx >= SECTIONS.length) return;
    transitioning.current = true;

    const dir    = nextIdx > currentIdx ? 1 : -1;
    const spring = "cubic-bezier(0.22, 1.06, 0.36, 1)";
    const decel  = "cubic-bezier(0.22, 1, 0.36, 1)";
    const accel  = "cubic-bezier(0.4, 0, 0.8, 0.6)";
    const peekT  = `translateY(calc(100% - ${PEEK_H}px))`;

    SECTIONS.forEach((id, cardIdx) => {
      const el = document.getElementById(`panel-${id}`);
      if (!el) return;
      const offset = cardIdx - nextIdx;

      if (cardIdx === nextIdx) {
        /* ── ARRIVING card ── */
        el.style.zIndex        = "10";
        el.style.pointerEvents = "auto";
        el.style.transition    = `transform 0.65s ${spring}, opacity 0.45s ${decel}`;
        el.style.transform     = "translateY(0)";
        el.style.opacity       = "1";
        triggerPanelAnim(el);

      } else if (cardIdx === currentIdx) {
        /* ── DEPARTING card ── */
        el.style.zIndex        = "9";
        el.style.pointerEvents = "none";
        if (dir > 0) {
          /* Forward → peel it off the top */
          el.style.transition = `transform 0.52s ${accel}, opacity 0.38s ${accel}`;
          el.style.transform  = "translateY(-100%)";
          el.style.opacity    = "0";
        } else {
          /* Backward → drop it back to peek slot */
          el.style.transition = `transform 0.6s ${decel}, opacity 0.4s ${decel}`;
          el.style.transform  = peekT;
          el.style.opacity    = "1";
        }

      } else if (offset === 1) {
        /* ── Front peek card (N+1) ── */
        el.style.zIndex        = "9";
        el.style.pointerEvents = "none";
        el.style.transition    = `transform 0.6s ${decel}, opacity 0.45s ${decel}`;
        el.style.transform     = peekT;
        el.style.opacity       = "1";

      } else if (offset === 2) {
        /* ── Secondary peek card (N+2) ── */
        el.style.zIndex        = "8";
        el.style.pointerEvents = "none";
        el.style.transition    = `transform 0.6s ${decel}, opacity 0.45s ${decel}`;
        el.style.transform     = `translateY(calc(100% - ${PEEK_H + PEEK_H2}px))`;
        el.style.opacity       = "1";

      } else if (offset < 0) {
        /* ── Cards before nextIdx — park above viewport ── */
        el.style.zIndex        = "7";
        el.style.pointerEvents = "none";
        el.style.transition    = `transform 0.5s ${accel}, opacity 0.35s ease`;
        el.style.transform     = "translateY(-100%)";
        el.style.opacity       = "0";

      } else {
        /* ── Cards far below — park under viewport ── */
        el.style.zIndex        = "5";
        el.style.pointerEvents = "none";
        el.style.transition    = `transform 0.4s ${accel}, opacity 0.3s ease`;
        el.style.transform     = "translateY(calc(100% + 30px))";
        el.style.opacity       = "0";
      }
    });

    sectionIdxRef.current = nextIdx;
    setSectionIdx(nextIdx);
    setTimeout(() => { transitioning.current = false; }, 1200);
  }, [triggerPanelAnim]);

  /* Hero entrance on mount */
  useEffect(() => {
    const el = document.getElementById("panel-hero");
    if (el) triggerPanelAnim(el);
  }, [triggerPanelAnim]);

  /* Wheel */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (transitioning.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      goToSection(sectionIdxRef.current + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goToSection]);

  /* Keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown") goToSection(sectionIdxRef.current + 1);
      if (e.key === "ArrowUp"   || e.key === "ArrowLeft"  || e.key === "PageUp"  ) goToSection(sectionIdxRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToSection]);

  /* Touch */
  useEffect(() => {
    let sy = 0;
    const onStart = (e: TouchEvent) => { sy = e.touches[0].clientY; };
    const onEnd   = (e: TouchEvent) => {
      const dy = sy - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 55) goToSection(sectionIdxRef.current + (dy > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [goToSection]);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  /* Panel base — card aesthetic */
  const panelBase: React.CSSProperties = {
    position: "fixed", inset: 0,
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    borderRadius: "24px 24px 0 0",
    boxShadow: "0 -12px 60px rgba(0,0,0,0.5), 0 -2px 0 rgba(255,255,255,0.04)",
  };

  return (
    /* Root — slightly different dark from panel bg so rounded corners are visible */
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#03030e" }}>
      <CustomCursor />
      <NetworkBackground />

      {/* Ambient tint shifts with section */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 2,
        background: `radial-gradient(ellipse at 50% 50%, ${SECTION_ACCENTS[sectionIdx]}0A 0%, transparent 65%)`,
        transition: "background 1.3s cubic-bezier(0.22,1,0.36,1)",
      }} />

      {/* ── NAV ─────────────────────────────────── */}
      <header className="fixed left-0 right-0 top-0 z-50"
        style={{ background: "rgba(7,7,20,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/Logo.jpg" alt="Sovriigne" className="h-8 w-8 rounded-lg object-cover"
              style={{ boxShadow: "0 0 12px rgba(255,85,0,0.3)" }} />
            <span className="font-syne text-base font-bold tracking-tight text-white" style={{ letterSpacing: "-0.02em" }}>
              SOVRIIGNE
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {([["Assets", 1], ["Process", 2], ["Join", 4]] as [string, number][]).map(([label, idx]) => (
              <button key={label} onClick={() => goToSection(idx)}
                className="nav-link text-sm" style={{ background: "none", border: "none", cursor: "none" }}>
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login"
              className="hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-200 md:inline-flex items-center gap-2"
              style={{ background: "#FF5500", boxShadow: "0 0 20px rgba(255,85,0,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FF6A00"; e.currentTarget.style.boxShadow = "0 0 35px rgba(255,85,0,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#FF5500"; e.currentTarget.style.boxShadow = "0 0 20px rgba(255,85,0,0.3)"; }}>
              Get Early Access <Icon icon="ph:arrow-right-bold" className="text-sm" />
            </Link>
            <button onClick={() => setMenuOpen(v => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden" aria-label="Menu">
              {[0, 1, 2].map(i => (
                <span key={i} className="block h-px w-5 bg-white transition-all duration-300"
                  style={{
                    transform: menuOpen ? i === 0 ? "rotate(45deg) translateY(5px)" : i === 2 ? "rotate(-45deg) translateY(-5px)" : "" : "",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="overflow-hidden transition-all duration-300 md:hidden" style={{ maxHeight: menuOpen ? "260px" : "0" }}>
          <div className="flex flex-col gap-1 px-6 pb-6 pt-2">
            {([["Assets", 1], ["Process", 2], ["Join", 4]] as [string, number][]).map(([label, idx]) => (
              <button key={label} onClick={() => { goToSection(idx); setMenuOpen(false); }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white text-left"
                style={{ background: "none", border: "none", cursor: "none" }}>
                {label}
              </button>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full px-5 py-3 text-center text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: "#FF5500" }}>
              Get Early Access <Icon icon="ph:arrow-right-bold" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── BOTTOM NAV PILLS ─────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 pb-5 pt-4"
        style={{ background: "linear-gradient(to top, rgba(3,3,14,0.98) 55%, transparent)" }}>
        {SECTION_NAV.map((label, i) => {
          const active = sectionIdx === i;
          const accent = SECTION_ACCENTS[i];
          return (
            <button key={i} onClick={() => goToSection(i)}
              className="flex items-center gap-2 transition-all duration-350"
              style={{
                cursor: "none",
                padding: active ? "6px 16px" : "6px 10px",
                borderRadius: "100px",
                background: active ? `${accent}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${active ? accent + "50" : "rgba(255,255,255,0.08)"}`,
                boxShadow: active ? `0 0 16px ${accent}30` : "none",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}>
              <span style={{
                display: "block",
                width: active ? "24px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background: active ? accent : "rgba(255,255,255,0.25)",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }} />
              {active && (
                <span className="font-mono-brand text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: accent, whiteSpace: "nowrap" }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          PANEL 0 — HERO
      ════════════════════════════════════════════ */}
      <section id="panel-hero" style={{ ...panelBase, background: "#070714" }}>
        <PeekLabel label="Asset Classes" accent={SECTION_ACCENTS[1]} icon="ph:buildings-bold" />

        {/* Ticker strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t py-3"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(7,7,20,0.7)", backdropFilter: "blur(12px)" }}>
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="ticker-item">
                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: typeColor[item.type], background: `${typeColor[item.type]}18` }}>
                  {item.type}
                </span>
                <span className="text-white/50">{item.label}</span>
                <span className="font-mono-brand text-sm text-white">{item.value}</span>
                <span className="font-mono-brand flex items-center gap-1 text-sm text-green-400">
                  <Icon icon="ph:trend-up-bold" className="text-xs" />{item.change}
                </span>
                <span className="ticker-dot" />
              </div>
            ))}
          </div>
        </div>

        {/* Hero grid — starts below the peek label strip */}
        <div className="flex flex-1 items-center px-6 pb-16 pt-[82px] md:px-10" style={{ paddingTop: `${PEEK_H + 10}px` }}>
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left */}
            <div className="hero-left">
              <div className="anim-child hero-enter hero-d0 mb-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5"
                style={{ borderColor: "rgba(255,85,0,0.3)", background: "rgba(255,85,0,0.08)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full"
                    style={{ background: "#FF5500", animation: "ping-dot 2s ease-out infinite" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#FF5500" }} />
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "#FF8844" }}>
                  Prototype Environment · Open Testing
                </span>
              </div>

              <h1 className="font-syne mb-4 font-bold leading-[1.0] tracking-tight"
                style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}>
                <span className="anim-child block">The Gateway to</span>
                <span className="anim-child block text-brand-gradient">Tokenized</span>
                <span className="anim-child block text-brand-gradient">Reality.</span>
              </h1>

              <p className="anim-child mb-7 max-w-md text-base leading-relaxed text-white/45 md:text-lg">
                Programmable infrastructure for real-world assets, capital flows, and global trade — structured into a seamless digital experience.
              </p>

              <div className="anim-child mb-8 flex flex-wrap gap-4">
                <Link to="/login"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: "#FF5500", boxShadow: "0 0 30px rgba(255,85,0,0.35)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#FF6A00"; e.currentTarget.style.boxShadow = "0 0 50px rgba(255,85,0,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FF5500"; e.currentTarget.style.boxShadow = "0 0 30px rgba(255,85,0,0.35)"; }}>
                  Get Early Access <Icon icon="ph:arrow-right-bold" />
                </Link>
                <button onClick={() => goToSection(1)}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.12)", background: "none", cursor: "none" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}>
                  Explore Protocol <Icon icon="ph:arrow-down-bold" />
                </button>
              </div>

              <div className="anim-child grid grid-cols-3 gap-6 border-t pt-6"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                {[
                  { value: "₹120Cr+", label: "Assets Tokenized",  icon: "ph:currency-inr-bold" },
                  { value: "9",        label: "Active Instruments", icon: "ph:stack-bold" },
                  { value: "12.4%",   label: "Average IRR",         icon: "ph:trend-up-bold" },
                ].map(({ value, label, icon }) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Icon icon={icon} className="text-base" style={{ color: "#FF5500" }} />
                      <div className="font-syne text-2xl font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {value}
                      </div>
                    </div>
                    <div className="text-xs text-white/35">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Orb */}
            <div className="hero-orb flex items-center justify-center">
              <div className="hero-enter-scale hero-d8 w-full flex items-center justify-center">
                <NetworkOrb />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PANEL 1 — PROTOCOL STACK
      ════════════════════════════════════════════ */}
      <section id="panel-protocol" style={{ ...panelBase, background: "#070714", overflowY: "auto" }}>
        <PeekLabel label="How It Works" accent={SECTION_ACCENTS[2]} icon="ph:steps-bold" />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(255,85,0,0.05) 0%, transparent 60%)" }} />
        <div className="relative px-6 pb-10 md:px-10 w-full flex-1 flex flex-col justify-center"
          style={{ paddingTop: `${PEEK_H + 16}px` }}>
          <div className="mx-auto max-w-7xl">
            <div className="anim-child mb-6 flex items-center gap-2">
              <span className="h-px w-8" style={{ background: "#FF5500" }} />
              <span className="section-eyebrow">Asset Classes</span>
            </div>
            <h2 className="anim-child section-heading mb-4 max-w-3xl">
              A Unified Layer for<br />
              <span className="text-brand-gradient">Real-World Asset Interaction.</span>
            </h2>
            <p className="anim-child mb-12 max-w-xl text-base text-white/40">
              The world is built on real assets — real estate, businesses, and cash flows. SOVRIIGNE transforms these into digital representations that are accessible, interactive, and efficient.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {products.map((p) => (
                <div key={p.title}
                  className="anim-child group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 cursor-default"
                  style={{ background: p.bg, border: `1px solid ${p.border}`, backdropFilter: "blur(20px)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${p.hoverBorder}`; (e.currentTarget as HTMLElement).style.boxShadow = p.hoverShadow; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${p.border}`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div className="font-syne absolute right-5 top-5 text-4xl font-bold opacity-[0.07]" style={{ color: p.color }}>{p.n}</div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${p.color}14`, border: `1px solid ${p.color}30` }}>
                    <Icon icon={p.icon} style={{ color: p.color, fontSize: "1.4rem" }} />
                  </div>
                  <h3 className="font-syne mb-2 text-lg font-bold text-white">{p.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-white/45">{p.desc}</p>
                  <div className="flex items-end justify-between border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <div>
                      <div className="text-xs text-white/30 mb-1">Target IRR</div>
                      <div className="font-syne text-xl font-bold" style={{ color: p.color }}>{p.roi}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/30 mb-1">Active Assets</div>
                      <div className="font-syne text-xl font-bold text-white">{p.count}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PANEL 2 — HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section id="panel-how-it-works" style={{ ...panelBase, background: "#070714", overflowY: "auto" }}>
        <PeekLabel label="By the Numbers" accent={SECTION_ACCENTS[3]} icon="ph:chart-bar-bold" />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 65%)" }} />
        <div className="relative px-6 pb-10 md:px-10 w-full flex-1 flex flex-col justify-center"
          style={{ paddingTop: `${PEEK_H + 16}px` }}>
          <div className="mx-auto max-w-7xl">
            <div className="anim-child mb-4 text-center">
              <div className="section-eyebrow justify-center mb-2">
                <span className="h-px w-8" style={{ background: "#8B5CF6" }} />
                How It Works
                <span className="h-px w-8" style={{ background: "#8B5CF6" }} />
              </div>
              <h2 className="section-heading">
                Structured Participation,{" "}
                <span style={{ color: "#8B5CF6" }}>Simplified.</span>
              </h2>
            </div>

            <div className="relative mt-16 grid gap-10 md:grid-cols-3">
              <div className="absolute left-[17%] right-[17%] top-14 hidden h-px md:block"
                style={{ background: "linear-gradient(90deg, #FF5500, #8B5CF6, #22D3EE)", opacity: 0.2 }} />
              {steps.map((s, i) => (
                <div key={s.n} className="anim-child relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-8 flex h-28 w-28 flex-col items-center justify-center rounded-full"
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}35`, boxShadow: `0 0 30px ${s.color}12` }}>
                    <Icon icon={s.icon} style={{ color: s.color, fontSize: "1.8rem", marginBottom: "4px" }} />
                    <span className="font-syne text-xs font-bold opacity-60" style={{ color: s.color }}>{s.n}</span>
                  </div>
                  <h3 className="font-syne mb-4 text-xl font-bold text-white">{s.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-white/40">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="mt-8 flex items-center gap-1 text-white/20 md:hidden">
                      <Icon icon="ph:arrow-down-bold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PANEL 3 — BY THE NUMBERS
      ════════════════════════════════════════════ */}
      <section id="panel-numbers" style={{ ...panelBase, background: "#070714", overflowY: "auto" }}>
        <PeekLabel label="Get Started" accent={SECTION_ACCENTS[4]} icon="ph:rocket-bold" />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,85,0,0.04) 0%, transparent 60%)" }} />
        <div className="relative px-6 pb-10 md:px-10 w-full flex-1 flex flex-col justify-center"
          style={{ paddingTop: `${PEEK_H + 16}px` }}>
          <div className="mx-auto max-w-5xl">
            <div className="anim-child mb-16 text-center">
              <div className="section-eyebrow justify-center mb-2">
                <span className="h-px w-8" style={{ background: "#FF5500" }} />
                By The Numbers
                <span className="h-px w-8" style={{ background: "#FF5500" }} />
              </div>
              <h2 className="section-heading">
                Infrastructure <span className="text-orange-gradient">at Scale.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
              {bigNumbers.map(({ value, label, color, icon }) => (
                <div key={label} className="anim-child flex flex-col items-center text-center">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
                    <Icon icon={icon} style={{ color, fontSize: "1.5rem" }} />
                  </div>
                  <div
                    className="stat-counter font-syne mb-3 text-5xl font-bold md:text-6xl"
                    data-target={value}
                    style={{ color, fontVariantNumeric: "tabular-nums" }}>
                    {value}
                  </div>
                  <div className="text-sm text-white/40" style={{ letterSpacing: "0.04em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PANEL 4 — CTA + FOOTER
      ════════════════════════════════════════════ */}
      <section id="panel-cta" style={{ ...panelBase, background: "#070714", overflowY: "auto" }}>
        {/* No peek label — last card */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,85,0,0.07) 0%, transparent 55%)" }} />
        <div className="relative px-6 pb-10 md:px-10 w-full flex-1 flex flex-col justify-center"
          style={{ paddingTop: `${PEEK_H + 16}px` }}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="anim-child section-eyebrow mb-4 justify-center">
              <Icon icon="ph:lightning-bold" style={{ color: "#FF5500" }} />
              Get Started
            </div>
            <h2 className="anim-child font-syne mb-6 text-5xl font-bold leading-[1.0] tracking-tight md:text-7xl"
              style={{ letterSpacing: "-0.03em" }}>
              Step Into Tokenized<br /><span className="text-orange-gradient">Infrastructure.</span>
            </h2>
            <p className="anim-child mx-auto mb-12 max-w-md text-base text-white/40">
              This platform is currently a prototype environment designed for open testing and exploration. Join to explore how capital flows across real-world asset classes.
            </p>

            {submitted ? (
              <div className="anim-child inline-flex items-center gap-3 rounded-2xl px-8 py-5"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <Icon icon="ph:check-circle-bold" className="text-green-400 text-xl" />
                <span className="text-green-400 font-medium">You're on the list. We'll be in touch.</span>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="anim-child flex flex-col gap-4 sm:flex-row sm:justify-center">
                <div className="relative flex-1 sm:max-w-xs">
                  <Icon icon="ph:envelope-simple-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@institution.com" required
                    className="w-full rounded-full py-4 pl-10 pr-5 text-sm text-white outline-none placeholder:text-white/30"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(255,85,0,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
                <button type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: "#FF5500", boxShadow: "0 0 30px rgba(255,85,0,0.35)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FF6A00")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#FF5500")}>
                  Request Access <Icon icon="ph:arrow-right-bold" />
                </button>
              </form>
            )}
            <p className="anim-child mt-6 text-xs text-white/20">By joining, you agree to our Terms of Service. Institutional access only.</p>
          </div>

          {/* Mini footer */}
          <div className="anim-child mt-12 border-t pt-10" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <img src="/Logo.jpg" alt="Sovriigne" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="font-syne text-base font-bold text-white">SOVRIIGNE</span>
                </div>
                <p className="text-xs text-white/25 max-w-xs">A structured digital layer for real-world assets — designed for accessibility, transparency, and control.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/30">
                  {["About", "Contact", "Terms of Service", "Privacy Policy", "Risk Disclosure"].map(l => (
                    <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { icon: "ph:linkedin-logo-bold", label: "LinkedIn" },
                    { icon: "ph:instagram-logo-bold", label: "Instagram" },
                    { icon: "ph:twitter-logo-bold", label: "X (Twitter)" },
                    { icon: "ph:discord-logo-bold", label: "Discord" },
                  ].map(({ icon, label }) => (
                    <a key={label} href="#" aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,85,0,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,85,0,0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                      <Icon icon={icon} className="text-sm text-white/50" />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-white/20">© 2026 Sovriigne. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Intro;
