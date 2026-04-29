import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticleField } from "@/components/ParticleField";
import { SceneBackground } from "@/components/SceneBackground";
import { BrandWordmark } from "@/components/BrandWordmark";
import { Layer } from "@/components/Layer";
import { RealEstateVisual } from "@/components/visuals/RealEstateVisual";
import { InvoiceVisual } from "@/components/visuals/InvoiceVisual";
import { SCFVisual } from "@/components/visuals/SCFVisual";
import { TokenizationVisual } from "@/components/visuals/TokenizationVisual";
import { InfrastructureVisual } from "@/components/visuals/InfrastructureVisual";

const Intro = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 700);
    
    // Hide default cursor on intro page
    document.body.style.cursor = 'none';
    
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 1.2));
      setScrollProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      // Restore default cursor
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <CustomCursor />

      {/* CINEMATIC SCROLL-DRIVEN BACKGROUND — Earth → City → Invoices → SCF → Tokens → Infra */}
      <SceneBackground />

      {/* Ambient overlay layers above scene canvas — strict black + white/orange only */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute inset-0 system-grid opacity-20" />
        <div className="absolute inset-0 opacity-50">
          <ParticleField intensity={scrollProgress} density={50} />
        </div>
        <div className="absolute inset-0 noise" />
      </div>

      {/* TOP NAV */}
      <header className="fixed left-0 right-0 top-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="font-display text-sm font-bold tracking-[0.3em] text-white">SOVRIIGNE</div>
          <nav className="hidden gap-10 text-xs uppercase tracking-[0.25em] text-white/70 md:flex">
            <a href="#real-estate" className="transition-colors hover:text-white">Real Estate</a>
            <a href="#invoice" className="transition-colors hover:text-white">Invoice</a>
            <a href="#scf" className="transition-colors hover:text-white">SCF</a>
            <a href="#infrastructure" className="transition-colors hover:text-white">Infrastructure</a>
          </nav>
          <Link to="/login" className="text-xs uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white">
            Early Access →
          </Link>
        </div>
      </header>

      {/* HERO — system reveal */}
      <section data-scene="hero" className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* status row */}
        <div
          className="absolute left-6 top-24 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:left-12"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 1.5s ease 1.6s",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          System Online
        </div>
        <div
          className="absolute right-6 top-24 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:right-12"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 1.5s ease 1.6s",
          }}
        >
          v.01 / Infrastructure Layer
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur-sm"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.9s var(--ease-luxury) 0.2s",
            }}
          >
            <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            Financial Infrastructure Protocol
          </div>

          <BrandWordmark
            className="text-[18vw] leading-[0.85] md:text-[14vw] lg:text-[180px]"
            delay={400}
          />

          <h2
            className="mt-10 max-w-3xl font-display text-2xl font-light leading-tight tracking-tight text-foreground/90 md:text-4xl lg:text-5xl"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(20px)",
              transition: "all 1.2s var(--ease-luxury) 1.8s",
            }}
          >
            The Gateway to <em className="not-italic font-medium text-primary">Tokenized Reality</em>.
          </h2>

          <p
            className="mt-6 max-w-md text-sm text-muted-foreground"
            style={{
              opacity: revealed ? 1 : 0,
              transition: "opacity 1.2s ease 2.2s",
            }}
          >
            Programmable infrastructure for real-world assets, capital flow, and global trade.
          </p>
        </div>

        {/* corner system markers */}
        <div className="pointer-events-none absolute inset-x-6 bottom-10 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:inset-x-12"
          style={{ opacity: revealed ? 1 : 0, transition: "opacity 1.2s ease 2.4s" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-foreground/30" />
            <span>Move cursor — observe field response</span>
          </div>
          <div className="hidden md:block">42°N · Network Active</div>
        </div>
      </section>

      {/* CONTENT LAYERS */}
      <main className="relative z-10">
        <div id="real-estate" data-scene="city">
          <Layer
            index="01 / Layer"
            eyebrow="Real Estate"
            headline={<><span>Own Real Estate as</span><br /><span className="text-primary">Programmable Value.</span></>}
            description="Architectural assets become computable instruments. Fractional ownership, instant settlement, transparent provenance — encoded directly into the asset's structure."
            visual={<RealEstateVisual />}
          />
        </div>

        <div id="invoice" data-scene="invoices">
          <Layer
            index="02 / Layer"
            eyebrow="Invoice Financing"
            headline={<><span>Transform Cash Flow</span><br /><span className="text-primary">into Liquid Assets.</span></>}
            description="Receivables enter the system as composable streams. Underwritten, fractionalized, and made liquid in minutes — not months."
            visual={<InvoiceVisual />}
            align="right"
          />
        </div>

        <div id="scf" data-scene="scf">
          <Layer
            index="03 / Layer"
            eyebrow="Supply Chain Finance"
            headline={<><span>Unlock Global Trade</span><br /><span className="text-primary">Liquidity.</span></>}
            description="A coordination layer for buyers, suppliers, and capital. Settlement rails that mirror the physical movement of goods across the global trade network."
            visual={<SCFVisual />}
          />
        </div>

        <div id="tokenization" data-scene="tokens">
          <Layer
            index="04 / Layer"
            eyebrow="Tokenization Engine"
            headline={<><span>Where Real Assets</span><br /><span className="text-primary">Become Digital Systems.</span></>}
            description="A primitive for asset issuance — composable, compliant, and chain-agnostic. Every instrument inherits a programmable rights model from day zero."
            visual={<TokenizationVisual />}
            align="right"
          />
        </div>

        <div id="infrastructure" data-scene="infra">
          <Layer
            index="05 / Final State"
            eyebrow="Infrastructure"
            headline={<><span>Infrastructure,</span><br /><span className="text-primary">Not Marketplace.</span></>}
            description="Sovriigne is the substrate beneath the next generation of capital products. Quiet, structural, dependable — the system every operator builds upon."
            visual={<InfrastructureVisual />}
          />
        </div>

        {/* FINAL CTA */}
        <section id="cta" className="relative flex min-h-[80vh] items-center justify-center px-6 py-24">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 text-[10px] uppercase tracking-[0.4em] text-primary">Activation</div>
            <h3 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              Step Into <br />
              <span className="brand-wordmark" style={{ animation: "energy-sweep 5s ease-in-out infinite" }}>
                Tokenized Infrastructure.
              </span>
            </h3>
            <p className="mt-8 max-w-md text-sm text-muted-foreground">
              Limited access for institutional partners and infrastructure builders.
            </p>

            <Link
              to="/login"
              className="group relative mt-12 inline-flex items-center gap-4 rounded-full border border-primary/40 bg-primary/5 px-10 py-5 text-sm uppercase tracking-[0.3em] text-foreground transition-all hover:bg-primary hover:text-primary-foreground"
              style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
            >
              <span>Get Early Access</span>
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-border/50 px-6 py-16 md:px-12">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="font-display text-2xl font-bold tracking-[-0.03em]">
                <span className="text-foreground">SOV</span>
                <span style={{ color: "hsl(30 70% 75%)" }}>RII</span>
                <span className="text-primary">GNE</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                The Gateway to Tokenized Reality.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Network Active
              </div>
            </div>

            {[
              { title: "Product", links: ["Tokenization", "Real Estate", "Invoice", "API"] },
              { title: "Infrastructure", links: ["Network", "Architecture", "Compliance", "Security"] },
              { title: "Company", links: ["About", "SCF Network", "Partners", "Legal"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80">{col.title}</div>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="transition-colors hover:text-foreground">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-border/50 pt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row">
            <span>© Sovriigne Systems · {new Date().getFullYear()}</span>
            <span>Financial Infrastructure Protocol · v.01</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Intro;
