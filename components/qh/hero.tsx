import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  Gauge,
  Users,
  TrendingUp,
  BellRing,
  FileSearch,
  Target,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { MagneticButton, Particles, Reveal } from "./atoms";

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Platform", "#platform"],
    ["Technology", "#technology"],
    ["Employers", "#employers"],
    ["GCC", "#gcc"],
    ["Pricing", "#pricing"],
    ["Contact", "#cta"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-700 ${
          solid ? "glass-strong" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
            style={{ background: "linear-gradient(140deg, var(--primary), var(--secondary))" }}
          >
            <BrainCircuit className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Qudra<span className="text-primary">Hire</span>
          </span>
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a
            href="#cta"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-ink sm:block"
          >
            Sign in
          </a>
          <MagneticButton href="#cta" className="px-6 py-2.5 text-[13px]">
            Get Started
          </MagneticButton>
        </div>
      </nav>
    </header>
  );
}

function FloatingCard({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`glass-strong absolute rounded-3xl p-4 ${className ?? ""}`}
      style={{ animation: "floaty 8s ease-in-out infinite", ...style }}
    >
      {children}
    </div>
  );
}

function DashboardCluster() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] sm:aspect-[5/4]">
      {/* neural connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 480" fill="none" aria-hidden>
        <defs>
          <linearGradient id="ln" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--glow)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--highlight)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[
          "M90 120 C 200 60, 300 180, 400 110",
          "M110 330 C 210 300, 260 200, 400 250",
          "M120 200 C 220 250, 250 380, 380 400",
          "M400 110 C 430 210, 360 300, 400 400",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="url(#ln)"
            strokeWidth="1.4"
            strokeDasharray="10 14"
            style={{ animation: `dash ${9 + i * 2}s linear infinite` }}
          />
        ))}
      </svg>

      <FloatingCard className="left-0 top-4 w-[62%]" style={{ animationDelay: "-1s" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-4 w-4 text-primary" /> AI Match Score
          </div>
          <span className="text-xs text-primary">Live</span>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-4xl font-semibold text-ink">96.4%</span>
          <span className="pb-1 text-xs text-secondary">+12.8%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: "96%",
              background: "linear-gradient(90deg, var(--primary), var(--highlight))",
            }}
          />
        </div>
      </FloatingCard>

      <FloatingCard
        className="right-0 top-0 w-[42%]"
        style={{ animationDelay: "-3s", animationDuration: "10s" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSearch className="h-4 w-4 text-secondary" /> Resume Intel
        </div>
        <div className="mt-3 space-y-2">
          {[92, 74, 61].map((w, i) => (
            <div key={i} className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-secondary/80"
                style={{ width: `${w}%`, animation: `pulseGlow ${3 + i}s ease-in-out infinite` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">ATS score 92 / 100</p>
      </FloatingCard>

      <FloatingCard
        className="left-6 bottom-16 w-[54%]"
        style={{ animationDelay: "-5s", animationDuration: "11s" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-4 w-4 text-highlight" /> Candidate Ranking
        </div>
        <ul className="mt-3 space-y-3">
          {[
            ["Layla A.", "Data Scientist", "98"],
            ["Omar K.", "Product Lead", "94"],
            ["Sara M.", "DevOps Eng.", "91"],
          ].map(([n, r, s]) => (
            <li key={n} className="flex items-center gap-3">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-medium text-primary-foreground"
                style={{ background: "linear-gradient(140deg, var(--primary), var(--secondary))" }}
              >
                {n?.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs text-ink">{n}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{r}</span>
              </span>
              <span className="text-xs text-primary">{s}</span>
            </li>
          ))}
        </ul>
      </FloatingCard>

      <FloatingCard
        className="bottom-0 right-2 w-[46%]"
        style={{ animationDelay: "-2s", animationDuration: "9s" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" /> Hiring Funnel
        </div>
        <div className="mt-4 flex h-20 items-end gap-1.5">
          {[38, 55, 44, 72, 60, 88, 76].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${h}%`,
                background: "linear-gradient(180deg, var(--glow), transparent)",
                opacity: 0.35 + i * 0.09,
              }}
            />
          ))}
        </div>
      </FloatingCard>

      <FloatingCard
        className="left-[2%] top-[42%] w-[32%]"
        style={{ animationDelay: "-6s", animationDuration: "7s" }}
      >
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <BellRing className="h-3.5 w-3.5 text-highlight" /> Interview booked
        </div>
        <p className="mt-1 text-[11px] text-ink">Riyadh · 14:30 GST</p>
      </FloatingCard>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden pb-24 pt-36">
      <div className="pointer-events-none absolute inset-0 -z-30">
        <img
          src={typeof heroBg === "string" ? heroBg : heroBg.src}
          alt=""
          aria-hidden
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          style={{ animation: "drift 30s ease-in-out infinite" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in oklab, var(--background) 92%, transparent) 20%, color-mix(in oklab, var(--background) 62%, transparent) 100%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 aurora" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 grid-lines opacity-50" />
      <Particles count={40} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />

      <Nav />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Recruitment Ecosystem
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-8 text-balance text-5xl font-semibold leading-[0.98] md:text-7xl xl:text-[5.2rem]">
              Hire Smarter with
              AI-Powered Talent
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Match the right talent in seconds. Our AI understands skills, culture fit, and potential — so you hire with confidence, not guesswork.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton href="#cta">Start Hiring</MagneticButton>
              <MagneticButton href="#platform" variant="ghost">
                Explore Features
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["3.2M+", "Talent profiles"],
                ["97%", "Match accuracy"],
                ["12 days", "Avg. time to hire"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold text-ink md:text-3xl">{v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200} className="[perspective:1200px]">
          <div style={{ transform: "rotateY(-9deg) rotateX(4deg)" }}>
            <div
              aria-hidden
              className="absolute inset-8 -z-10 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 65%)",
              }}
            />
            <DashboardCluster />
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-24 flex max-w-7xl items-center gap-3 px-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <Gauge className="h-4 w-4 text-primary" /> Scroll to explore
      </div>
    </section>
  );
}
