import { useState } from "react";
import {
  Brain,
  ScanText,
  Gauge,
  Send,
  LayoutDashboard,
  BarChart3,
  Sparkles,
  MessageSquareCode,
  ShieldCheck,
  Languages,
  Globe2,
  Network,
  Plane,
  FileCheck2,
  UserPlus,
  Wand2,
  Handshake,
  Star,
  Check,
  Plus,
  Minus,
  Bot,
  MousePointerClick,
  FileText,
  Bell,
  Compass,
  ClipboardList,
  LineChart,
  Quote,
} from "lucide-react";
import techBg from "@/assets/tech-bg.jpg";
import gccBg from "@/assets/gcc-bg.jpg";
import ctaBg from "@/assets/cta-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import {
  CineSection,
  Counter,
  MagneticButton,
  Particles,
  Reveal,
  SectionHeading,
  TiltCard,
} from "./atoms";

/* ============ Trusted ============ */
const logos = [
  "STC",
  "NEOM",
  "ADNOC",
  "ARAMCO",
  "QNB",
  "EMIRATES",
  "SABIC",
  "CAREEM",
  "TALABAT",
  "MASDAR",
];

export function Trusted() {
  return (
    <section className="relative isolate overflow-hidden py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--secondary) 8%, transparent), transparent 70%)",
        }}
      />
      <p className="mb-10 text-center text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
        Backed by the most ambitious enterprises across the GCC
      </p>
      <div className="relative overflow-hidden mask-[linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max gap-16" style={{ animation: "marquee 38s linear infinite" }}>
          {[...logos, ...logos].map((l, i) => (
            <span
              key={`${l}-${i}`}
              className="font-display text-2xl font-semibold tracking-[0.14em] text-muted-foreground/45 transition-all duration-500 hover:-translate-y-1 hover:text-ink hover:[text-shadow:0_0_28px_color-mix(in_oklab,var(--glow)_70%,transparent)]"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Platform features ============ */
const features = [
  { icon: Brain, title: "AI Match Engine", body: "Predictive scoring ranks the strongest candidates against every role signal in milliseconds." },
  { icon: ScanText, title: "Resume Intelligence", body: "Deep parsing extracts skills, seniority and career trajectory from any document format." },
  { icon: Gauge, title: "ATS Optimization", body: "Live keyword and structure guidance tuned to the enterprise parsers you already use." },
  { icon: Send, title: "Smart Applications", body: "AI agents submit tailored applications on behalf of candidates with role-specific context." },
  // { icon: LayoutDashboard, title: "Hiring Command Center", body: "One dashboard for pipelines, team performance and hiring velocity across regions." },
  // { icon: BarChart3, title: "Recruitment Analytics", body: "Funnel, source and cost insight rendered in real time for smarter decisions." },
  // { icon: Sparkles, title: "AI Recommendations", body: "The system suggests the next best action for every open requisition and candidate." },
  // { icon: MessageSquareCode, title: "Interview Assistant", body: "Structured questions, scoring rubrics and live transcript analysis built in." },
  // { icon: ShieldCheck, title: "Secure & Compliant", body: "PCI-grade billing with regional gateways, enterprise invoicing and audit trails." },
  // { icon: Languages, title: "Arabic RTL Support", body: "Fully bidirectional interface and multilingual AI reasoning across English and Arabic." },
  // { icon: Globe2, title: "GCC-Native Tools", body: "Saudization, Emiratization and localisation targets built into every workflow." },
  // { icon: Network, title: "Global Talent Network", body: "Reach vetted professionals across 90+ markets with one platform." },
  // { icon: Plane, title: "Visa & Mobility", body: "Track eligibility, documents and relocation timelines end to end." },
  // { icon: FileCheck2, title: "Compliance Automation", body: "Labour law checks and audit trails on every hire, every time." },
];

export function Platform() {
  return (
    <CineSection id="platform" media={techBg}>
      <Particles count={26} />
      <SectionHeading
        eyebrow="Platform"
        title={<>One intelligent layer for the entire hiring lifecycle</>}
        sub="Fourteen deeply connected modules operating on a shared candidate graph — every action makes the next decision sharper."
      />
      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 70}>
            <TiltCard className="h-full p-7">
              <span
                className="relative grid h-12 w-12 place-items-center rounded-2xl"
                style={{
                  background: "color-mix(in oklab, var(--primary) 14%, transparent)",
                  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--glow) 30%, transparent)",
                }}
              >
                <f.icon className="h-5 w-5 text-primary" />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-2xl blur-md"
                  style={{
                    background: "color-mix(in oklab, var(--glow) 18%, transparent)",
                    animation: "pulseGlow 4s ease-in-out infinite",
                  }}
                />
              </span>
              <h3 className="mt-6 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </CineSection>
  );
}

/* ============ How it works ============ */
const steps = [
  { icon: UserPlus, title: "Onboard", body: "Candidates and employers get started in minutes with guided AI intake." },
  { icon: Wand2, title: "AI Optimizes", body: "The engine rewrites, scores and aligns every profile to market demand." },
  { icon: Brain, title: "Smart Matching", body: "Predictive ranking surfaces the strongest fits per requisition instantly." },
  { icon: Handshake, title: "Hire", body: "Scheduling, scorecards and offers close the loop in one seamless flow." },
];

export function HowItWorks() {
  return (
    <CineSection media={heroBg} overlay={0.86} tone="secondary">
      <SectionHeading
        eyebrow="How it works"
        title="Four steps from signal to signed offer"
        sub="An always-on workflow where each stage feeds the model that powers the next."
      />
      <div className="relative mt-24">
        <svg
          aria-hidden
          className="absolute left-0 top-12 hidden h-24 w-full lg:block"
          viewBox="0 0 1200 100"
          fill="none"
        >
          <path
            d="M60 50 C 300 -20, 500 120, 700 50 S 1000 -10, 1140 50"
            stroke="color-mix(in oklab, var(--glow) 60%, transparent)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            style={{ animation: "dash 12s linear infinite" }}
          />
        </svg>
        <ol className="grid gap-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <li className="glass-strong relative h-full rounded-3xl p-8">
                <span className="font-display text-xs tracking-[0.3em] text-primary">
                  0{i + 1}
                </span>
                <span
                  className="mt-6 grid h-12 w-12 place-items-center rounded-2xl float-slow"
                  style={{ background: "color-mix(in oklab, var(--secondary) 14%, transparent)" }}
                >
                  <s.icon className="h-5 w-5 text-secondary" />
                </span>
                <h3 className="mt-6 text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </CineSection>
  );
}

/* ============ AI Technology ============ */
const modules = [
  "Deep Learning",
  "Natural Language Processing",
  "Resume Parsing",
  "Predictive Matching",
  "Candidate Scoring",
  "Skill Graph",
  "AI Ranking",
  "Behavioral Analysis",
  "Recommendation Engine",
  "Bias Detection",
  "Market Forecasting",
  "Document Verification",
];

export function Technology() {
  return (
    <CineSection id="technology" media={techBg} overlay={0.8} tone="highlight">
      <div className="grid items-center gap-20 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="AI Technology"
            title="A neural core built for hiring decisions"
            sub="Twelve specialised models operate as one reasoning system — continuously learning from every match, interview and outcome."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {modules.map((m, i) => (
              <Reveal key={m} delay={i * 60}>
                <div className="glass rounded-2xl px-4 py-5 text-xs leading-snug text-foreground transition-transform duration-500 hover:-translate-y-1.5">
                  {m}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={140}>
          <div className="relative mx-auto aspect-square w-full max-w-130">
            <div
              aria-hidden
              className="absolute inset-[18%] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)",
                animation: "pulseGlow 5s ease-in-out infinite",
              }}
            />
            <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none" aria-hidden>
              {[70, 110, 150, 185].map((r, i) => (
                <circle
                  key={r}
                  cx="200"
                  cy="200"
                  r={r}
                  stroke="color-mix(in oklab, var(--glow) 32%, transparent)"
                  strokeWidth="1"
                  strokeDasharray={i % 2 ? "4 10" : "2 14"}
                  style={{
                    transformOrigin: "200px 200px",
                    animation: `spin${i % 2} ${18 + i * 6}s linear infinite`,
                  }}
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                const r = i % 2 ? 150 : 110;
                return (
                  <circle
                    key={i}
                    cx={200 + Math.cos(a) * r}
                    cy={200 + Math.sin(a) * r}
                    r="3.2"
                    fill="var(--highlight)"
                    style={{ animation: `pulseGlow ${3 + (i % 5)}s ease-in-out infinite` }}
                  />
                );
              })}
              <circle cx="200" cy="200" r="46" fill="color-mix(in oklab, var(--primary) 22%, transparent)" />
              <circle
                cx="200"
                cy="200"
                r="46"
                stroke="var(--glow)"
                strokeWidth="1.4"
                style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
              />
            </svg>
            <Brain className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-ink" />
            <style>{`@keyframes spin0{to{transform:rotate(360deg)}}@keyframes spin1{to{transform:rotate(-360deg)}}`}</style>
          </div>
        </Reveal>
      </div>
    </CineSection>
  );
}

/* ============ Employer dashboard ============ */
const bars = [42, 68, 55, 84, 61, 92, 74, 88, 66, 95, 71, 83];
const panels = [
  { label: "Open Requisitions", value: 847, suffix: "" },
  { label: "Avg. Match Score", value: 97, suffix: "%" },
  { label: "Interviews This Week", value: 312, suffix: "" },
  { label: "Forecast Accuracy", value: 94, suffix: "%" },
];

export function Employers() {
  return (
    <CineSection id="employers" media={techBg} overlay={0.84}>
      <SectionHeading
        eyebrow="Employer Command Center"
        title="Every hiring signal on one live surface"
        sub="Pipelines, team performance, heatmaps and forecasts rendered as a single intelligent operating view."
      />
      <Reveal delay={120}>
        <div className="glass-strong mt-20 rounded-3xl p-6 md:p-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {panels.map((p) => (
              <div key={p.label} className="glass rounded-2xl p-6">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="mt-3 font-display text-3xl font-semibold text-ink">
                  <Counter to={p.value} suffix={p.suffix} />
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink">Recruitment Forecast</p>
                <span className="text-[11px] uppercase tracking-widest text-primary">Q3 · Live</span>
              </div>
              <div className="mt-8 flex h-48 items-end gap-2">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-100"
                    style={{
                      height: `${h}%`,
                      background: "linear-gradient(180deg, var(--glow), transparent 92%)",
                      opacity: 0.35 + (i % 6) * 0.1,
                      animation: `floaty ${6 + (i % 4)}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <p className="text-sm text-ink">AI Hiring Insights</p>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                {[
                  "Senior backend roles close 41% faster with async screening.",
                  "Dubai pipeline is under-supplied — widen to Riyadh and Cairo.",
                  "5 offers predicted to lapse within 72 hours.",
                  "Emiratisation target 89% complete for Q3.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </CineSection>
  );
}

/* ============ Candidate experience ============ */
const candidateCards = [
  { icon: Bot, title: "AI Career Coach" },
  { icon: MousePointerClick, title: "One-Click Apply" },
  { icon: FileText, title: "Resume Builder" },
  { icon: Compass, title: "Smart Recommendations" },
  { icon: ClipboardList, title: "Interview Prep" },
  { icon: LineChart, title: "Progress Tracking" },
  { icon: Bell, title: "Real-Time Alerts" },
  { icon: Sparkles, title: "Market Insights" },
];

export function Candidates() {
  return (
    <CineSection media={heroBg} overlay={0.82} tone="secondary">
      <SectionHeading
        eyebrow="Candidate Experience"
        title="Hiring that feels designed for the person, not the process"
      />
      <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {candidateCards.map((c, i) => (
          <Reveal key={c.title} delay={(i % 4) * 80}>
            <TiltCard className="h-full p-7" intensity={10}>
              <c.icon className="h-6 w-6 text-secondary" />
              <h3 className="mt-8 text-base font-medium leading-snug">{c.title}</h3>
              <span
                aria-hidden
                className="mt-6 block h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in oklab, var(--glow) 50%, transparent), transparent)",
                }}
              />
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </CineSection>
  );
}

/* ============ GCC ============ */
const gccPills = [
  "Visa Sponsorship",
  "Saudization",
  "Emiratization",
  "Arabic RTL",
  "GCC Compliance",
  "Cross-border Hiring",
  "Global Talent Pool",
  "Payroll Integration",
];

export function GCC() {
  return (
    <CineSection id="gcc" media={gccBg} overlay={0.72} tone="highlight">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <SectionHeading
          align="left"
          eyebrow="GCC Recruitment"
          title="Built for the Gulf, wired to the world"
          sub="Localisation targets, labour compliance and cross-border mobility handled natively across Riyadh, Dubai, Doha and Abu Dhabi."
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {gccPills.map((p, i) => (
            <Reveal key={p} delay={i * 70}>
              <span className="glass-strong inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-foreground transition-transform duration-500 hover:-translate-y-1">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-highlight"
                  style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
                />
                {p}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </CineSection>
  );
}

/* ============ Testimonials ============ */
const quotes = [
  {
    q: "Career-Sprint reduced our time-to-hire by 68%. The AI match scoring is the most accurate we've ever used.",
    n: "Noura Al-Faisal",
    r: "Group CHRO, Riyadh",
  },
  {
    q: "The Arabic-first experience finally made our regional pipeline usable end to end — from sourcing to offer.",
    n: "Yousef Rahman",
    r: "Head of Talent, Dubai",
  },
  {
    q: "It behaves less like software and more like a recruiting team that never sleeps and always learns.",
    n: "Maya Haddad",
    r: "VP People, Doha",
  },
];

export function Testimonials() {
  return (
    <CineSection media={techBg} overlay={0.85}>
      <SectionHeading eyebrow="Testimonials" title="Trusted by the region's hiring leaders" />
      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        {quotes.map((t, i) => (
          <Reveal key={t.n} delay={i * 120}>
            <TiltCard className="h-full p-8 float-slow" intensity={6}>
              <Quote className="h-6 w-6 text-primary/70" />
              <p className="mt-6 text-pretty text-base leading-relaxed text-foreground">{t.q}</p>
              <div className="mt-8 flex items-center gap-4">
                <span
                  className="grid h-11 w-11 place-items-center rounded-full font-display text-sm text-primary-foreground"
                  style={{ background: "linear-gradient(140deg, var(--primary), var(--secondary))" }}
                >
                  {t.n.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm text-ink">{t.n}</span>
                  <span className="block text-xs text-muted-foreground">{t.r}</span>
                </span>
              </div>
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </CineSection>
  );
}

/* ============ Pricing ============ */
const plans = [
  {
    name: "Starter",
    price: "$0",
    note: "For individual candidates",
    perks: ["AI resume builder", "10 smart applications", "Job recommendations", "Basic tracking"],
    featured: false,
  },
  {
    name: "Professional",
    price: "$149",
    note: "Per hiring seat / month",
    perks: [
      "Unlimited AI matching",
      "Full resume intelligence suite",
      "Interview assistant",
      "Recruitment analytics",
      "ATS optimization",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "For large teams and government",
    perks: [
      "Dedicated model tuning",
      "Compliance automation",
      "Visa & mobility tooling",
      "SSO, audit & SLA",
      "Regional data residency",
      "Custom integrations",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <CineSection id="pricing" media={heroBg} overlay={0.86} tone="secondary">
      <SectionHeading
        eyebrow="Pricing"
        title="Scale from first hire to national workforce"
      />
      <div className="mt-20 grid items-center gap-6 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 110}>
            <div
              className={`relative h-full rounded-3xl p-8 transition-transform duration-500 ${p.featured ? "glass-strong lg:scale-[1.07] float-slow" : "glass hover:-translate-y-1.5"
                }`}
              style={
                p.featured
                  ? {
                    boxShadow:
                      "0 0 0 1px color-mix(in oklab, var(--glow) 45%, transparent), 0 60px 140px -50px color-mix(in oklab, var(--primary) 65%, transparent)",
                  }
                  : undefined
              }
            >
              {p.featured && (
                <span
                  className="absolute -top-3 left-8 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary-foreground"
                  style={{ background: "linear-gradient(120deg, var(--primary), var(--secondary))" }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-medium">{p.name}</h3>
              <p className="mt-6 font-display text-5xl font-semibold text-ink">{p.price}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.note}</p>
              <ul className="mt-8 space-y-3">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <MagneticButton
                  href="#cta"
                  variant={p.featured ? "primary" : "ghost"}
                  className="w-full"
                >
                  {p.name === "Enterprise" ? "Talk to sales" : "Get started"}
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </CineSection>
  );
}

/* ============ FAQ ============ */
const faqs = [
  {
    q: "How accurate is AI candidate matching?",
    a: "Career-Sprint scores candidates against role signals, historic outcomes and skill graphs, reaching 97% precision on enterprise requisitions after the first hiring cycle.",
  },
  {
    q: "Does the platform support Arabic and RTL?",
    a: "Yes. The full interface, resume parsing, matching models and AI assistant operate natively in Arabic with complete right-to-left layout support.",
  },
  {
    q: "Can we meet Saudization and Emiratization targets?",
    a: "Localisation quotas are tracked as first-class metrics with forecasting, sourcing recommendations and automated compliance reporting.",
  },
  {
    q: "How is our candidate data protected?",
    a: "Encryption at rest and in transit, regional data residency, granular role-based access and complete audit trails on every action.",
  },
  {
    q: "Do you integrate with our existing ATS?",
    a: "We integrate with major ATS platforms through APIs and webhooks, or operate as the primary system of record.",
  },
  {
    q: "What does onboarding look like?",
    a: "Most teams are fully configured within 48 hours. Our implementation team handles integration, model tuning and training — so you go live fast.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <CineSection media={techBg} overlay={0.88}>
      <Particles count={18} />
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 70}>
              <div
                className={`glass overflow-hidden rounded-3xl transition-all duration-500 ${isOpen ? "glow-ring" : ""
                  }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
                >
                  <span className="text-base text-ink">{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                <div
                  className="grid transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-7 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </CineSection>
  );
}

/* ============ Final CTA ============ */
export function FinalCTA() {
  return (
    <CineSection id="cta" media={ctaBg} overlay={0.7} tone="highlight">
      <Particles count={30} />
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-balance text-4xl font-semibold leading-[1.03] md:text-6xl">
            Ready to Transform Your
            <span className="text-gradient"> Hiring Process</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Join the organisations building their workforce inside an AI operating system — starting today.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <MagneticButton href="#top">Get Started Free</MagneticButton>
            <MagneticButton href="#platform" variant="ghost">
              Watch Demo
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </CineSection>
  );
}

/* ============ Footer ============ */
const footerCols = [
  { title: "Company", links: ["About", "Careers", "Newsroom", "Contact"] },
  { title: "Product", links: ["Platform", "AI Technology", "For Employers", "For Candidates"] },
  { title: "Solutions", links: ["Enterprise", "Government", "Startups", "Agencies"] },
  { title: "Resources", links: ["Documentation", "API", "Guides", "Status"] },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-lines opacity-40" />
      <Particles count={20} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr_1.2fr]">
          <div>
            <span className="font-display text-xl font-semibold text-ink">
              Career<span className="text-primary">Sprint</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI recruitment ecosystem connecting employers with exceptional talent across the
              GCC and global markets — powered by intelligence, not just listings.
            </p>
            <div className="mt-6 flex gap-3">
              {["in", "X", "IG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#top"
                  className="glass grid h-10 w-10 place-items-center rounded-full text-xs text-muted-foreground transition-colors hover:text-ink"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerCols.map((c) => (
              <div key={c.title}>
                <p className="text-xs uppercase tracking-[0.2em] text-ink">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#top"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink">Newsletter</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="glass mt-4 flex items-center gap-2 rounded-full p-1.5"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="rounded-full px-4 py-2 text-xs font-medium text-primary-foreground"
                style={{ background: "linear-gradient(120deg, var(--primary), var(--secondary))" }}
              >
                Join
              </button>
            </form>
            <div className="mt-6 flex gap-2 text-xs text-muted-foreground">
              <button className="glass rounded-full px-3 py-1.5 text-ink">English</button>
              <button className="rounded-full px-3 py-1.5 transition-colors hover:text-ink">
                العربية
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Career-Sprint. All rights reserved.</p>
          <p className="flex items-center gap-2">Riyadh · Dubai · Doha · Abu Dhabi <span className="mx-1 opacity-40">•</span> <a href="/contact" className="hover:text-primary transition-colors">Contact</a></p>
        </div>
      </div>
    </footer>
  );
}
