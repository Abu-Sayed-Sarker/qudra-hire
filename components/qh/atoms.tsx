import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/* ---------------- Scroll reveal ---------------- */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------- Cinematic section shell ---------------- */
export function CineSection({
  id,
  media,
  children,
  className,
  overlay = 0.78,
  tone = "primary",
}: {
  id?: string;
  media: string | StaticImageData;
  children: ReactNode;
  className?: string;
  overlay?: number;
  tone?: "primary" | "secondary" | "highlight";
}) {
  const toneVar =
    tone === "secondary"
      ? "var(--secondary)"
      : tone === "highlight"
        ? "var(--highlight)"
        : "var(--primary)";

  return (
    <section id={id} className={cn("relative isolate overflow-hidden py-28 md:py-40", className)}>
      {/* looping cinematic plate */}
      <div className="pointer-events-none absolute inset-0 -z-30 overflow-hidden">
        <img
          src={typeof media === "string" ? media : media.src}
          alt=""
          aria-hidden
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ animation: "drift 26s ease-in-out infinite" }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: `color-mix(in oklab, var(--background) ${overlay * 100}%, transparent)` }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 aurora opacity-90" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 grid-lines opacity-40" />
      {/* section blend edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-2/3 -translate-x-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${toneVar} 60%, transparent), transparent)`,
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-6">{children}</div>
    </section>
  );
}

/* ---------------- Eyebrow + heading ---------------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      <span
        className="h-1.5 w-1.5 rounded-full bg-primary"
        style={{ animation: "pulseGlow 2.4s ease-in-out infinite" }}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] md:text-6xl">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={160}>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------------- Magnetic button ---------------- */
export function MagneticButton({
  children,
  variant = "primary",
  className,
  href = "#",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; k: number } | null>(null);

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0,0)";
      }}
      onClick={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, k: Date.now() });
      }}
      className={cn(
        "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium transition-[box-shadow,background,color] duration-500 will-change-transform",
        variant === "primary"
          ? "text-primary-foreground glow-ring"
          : "glass text-foreground hover:text-ink",
        className,
      )}
      style={
        variant === "primary"
          ? ({
              background: "linear-gradient(120deg, var(--primary), var(--glow) 55%, var(--secondary))",
              backgroundSize: "180% 100%",
              animation: "sheen 7s ease-in-out infinite",
            } as CSSProperties)
          : undefined
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120px circle at var(--mx,50%) var(--my,50%), oklch(1 0 0 / 22%), transparent 70%)",
        }}
      />
      {ripple && (
        <span
          key={ripple.k}
          aria-hidden
          onAnimationEnd={() => setRipple(null)}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            background: "oklch(1 0 0 / 40%)",
            animation: "ripple .7s cubic-bezier(.16,1,.3,1) forwards",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
      <style>{`@keyframes ripple{to{transform:scale(46);opacity:0}}`}</style>
    </a>
  );
}

/* ---------------- Cursor glow (global) ---------------- */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[640px] w-[640px] rounded-full opacity-60 mix-blend-screen md:block"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent), transparent 62%)",
      }}
    />
  );
}

/* ---------------- Ambient AI particles ---------------- */
export function Particles({ count = 34 }: { count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 61) % 100,
    d: 7 + (i % 9),
    s: 1 + (i % 4) * 0.7,
    delay: (i % 11) * 0.6,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.s,
            height: d.s,
            background: i % 3 === 0 ? "var(--highlight)" : "var(--glow)",
            boxShadow: "0 0 12px currentColor",
            opacity: 0.5,
            animation: `floaty ${d.d}s ease-in-out ${d.delay}s infinite, pulseGlow ${d.d / 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Glass card with 3D tilt ---------------- */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${-py * intensity}deg) rotateY(${px * intensity}deg) translateY(-6px)`;
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "perspective(1000px)";
      }}
      className={cn(
        "group glass relative overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-500 will-change-transform hover:shadow-[0_50px_120px_-40px_oklch(0.76_0.19_148_/_45%)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), oklch(0.9 0.17 155 / 12%), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--glow) 55%, transparent), transparent)",
        }}
      />
      {children}
    </div>
  );
}

/* ---------------- Animated counter ---------------- */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1600, 1);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}
