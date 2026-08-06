"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Search,
  Zap,
  Globe,
  Languages,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
  useCarousel,
} from "@/components/ui/carousel";
import { Animate } from "@/components/ui/animate";
import { CursorGlow } from "@/components/qh/atoms";
import { Hero } from "@/components/qh/hero";
import { Candidates, Employers, FAQ, FinalCTA, Footer, HowItWorks, Platform, Pricing, Technology, Testimonials, Trusted } from "@/components/qh/sections";

/* ── Job data ── */
const jobs = [
  { abbr: "ENB", company: "Emirates NBD", title: "Senior Product Designer", location: "Dubai, UAE", type: "Full-time", salary: "AED 28k-35k", match: "96%", ago: "2d ago", tags: ["Figma", "Design system", "Ux research", "Fintech"], visa: true },
  { abbr: "CAR", company: "Careem", title: "Backend Engineer", location: "Dubai, UAE", type: "Full-time", salary: "AED 22k-30k", match: "91%", ago: "1d ago", tags: ["Node.js", "Microservices", "AWS"], visa: true },
  { abbr: "STC", company: "STC Pay", title: "Product Manager", location: "Riyadh, KSA", type: "Full-time", salary: "SAR 30k-40k", match: "88%", ago: "3d ago", tags: ["Fintech", "Agile", "Saudization"], visa: false },
  { abbr: "ADN", company: "ADNOC", title: "Data Analyst", location: "Abu Dhabi, UAE", type: "Contract", salary: "AED 18k-24k", match: "84%", ago: "5d ago", tags: ["Python", "Power BI", "SQL"], visa: false },
  { abbr: "TAL", company: "Talabat", title: "UX Researcher", location: "Dubai, UAE", type: "Full-time", salary: "AED 15k-20k", match: "80%", ago: "4d ago", tags: ["User testing", "Figma", "GCC market"], visa: true },
];

function JobCard({ job, active }: { job: typeof jobs[0]; active: boolean }) {
  return (
    <div className={`group w-full rounded-2xl p-6 border transition-all duration-300 relative
      ${active
        ? "bg-surface-card border-[#4BC957]/30 shadow-lg shadow-[#4BC957]/5"
        : "bg-surface-deep border-surface opacity-60 scale-95 hover:opacity-100 hover:scale-100 hover:bg-surface-card hover:border-[#4BC957]/30 hover:shadow-lg hover:shadow-[#4BC957]/5"
      }`}>
      {active && <div className="absolute inset-0 bg-[#4BC957]/5 rounded-2xl pointer-events-none" />}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl bg-surface-item flex items-center justify-center font-bold text-on-surface border
              ${active ? "h-12 w-12 text-sm border-[#4BC957]/30" : "h-10 w-10 text-xs border-surface group-hover:border-[#4BC957]/30"}`}>
              {job.abbr}
            </div>
            <div>
              <p className="text-xs text-on-surface-muted font-medium">{job.company}</p>
              <h3 className={`font-bold text-on-surface leading-tight ${active ? "text-base" : "text-sm"}`}>{job.title}</h3>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-[#4BC957] border text-[10px] font-bold px-2 py-0.5 rounded-full
              ${active ? "bg-[#4BC957]/20 border-[#4BC957]/30" : "bg-[#4BC957]/10 border-[#4BC957]/20 group-hover:bg-[#4BC957]/20 group-hover:border-[#4BC957]/30"}`}>
              {job.match} match
            </span>
            <span className="text-[10px] text-on-surface-subtle font-medium">{job.ago}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-on-surface-muted mb-4">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
          {job.visa && <span className="text-[#4BC957]">✈ Visa</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {job.tags.map(t => (
            <span key={t} className="bg-surface-item border border-surface text-on-surface-muted text-[10px] font-medium px-2 py-1 rounded">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobCarouselInner() {
  const { api } = useCarousel();
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);
  return (
    <CarouselContent className="-ml-4">
      {jobs.map((job, i) => (
        <CarouselItem key={job.abbr + i} className="pl-4 basis-[85%] sm:basis-[60%] md:basis-[40%] lg:basis-[30%]">
          <JobCard job={job} active={i === current} />
        </CarouselItem>
      ))}
    </CarouselContent>
  );
}

function JobCardsCarousel() {
  const autoplay = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full">
      <Animate className="animate-on-scroll text-center mb-10">
        <h2 className="text-3xl font-bold text-on-surface mb-2">Top matches for you</h2>
        <p className="text-on-surface-muted">AI-ranked roles based on your profile.</p>
      </Animate>
      <Animate className="animate-scale">
        <Carousel
          opts={{ loop: true, align: "center" }}
          plugins={[autoplay.current]}
          setApi={setApi}
          className="relative"
          onMouseEnter={() => api?.plugins().autoplay.stop()}
          onMouseLeave={() => api?.plugins().autoplay.play()}
        >
          <JobCarouselInner />
          <CarouselPrevious className="left-0 h-10 w-10 bg-transparent border border-surface text-on-surface-muted hover:bg-surface-card hover:text-on-surface" />
          <CarouselNext className="right-0 h-10 w-10 bg-transparent border border-[#4BC957]/40 text-[#4BC957] hover:bg-[#4BC957]/10" />
        </Carousel>
      </Animate>
    </section>
  );
}

/* ── Features data ── */
const features = [
  { title: "CV parsing", description: "Extracts skills, experience, and history instantly.", Icon: FileText },
  { title: "Smart matching", description: "Daily AI-ranked recommendations with explainable match scores.", Icon: Zap },
  { title: "Auto-apply mode", description: "Let CareerSprint send tailored applications while you focus on prep.", Icon: Search },
  { title: "Visa & nationalization", description: "Filter for sponsorship, Emiratization, and Saudization out of the box.", Icon: Globe },
  { title: "Bilingual", description: "Full Arabic and English support across the entire UI.", Icon: Languages },
] as const;

const delays = ["", "anim-delay-100", "anim-delay-200", "anim-delay-300", "anim-delay-400"];

export default function HomePage() {
  return (

    <main className="relative qh-theme">
      <CursorGlow />
      <Hero />
      <Trusted />
      <Platform />
      <HowItWorks />
      <Technology />
      <Employers />
      <Candidates />
      {/* <GCC /> */}
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>

    // <div className="min-h-screen flex flex-col bg-surface text-on-surface">


    //   <section className="relative pt-24 pb-16 text-center overflow-hidden">
    //     <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center">
    //       <div className="w-[800px] h-[400px] bg-[#4BC957]/10 rounded-full blur-[150px] mt-10" />
    //     </div>
    //     <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]"
    //       style={{ backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

    //     {/* Floating icons with bob animation */}
    //     <div className="absolute top-20 left-[15%] text-[#4BC957]/40 hidden md:block icon-bob" style={{ "--rot": "-15deg" } as React.CSSProperties}>
    //       <Briefcase className="w-12 h-12" />
    //     </div>
    //     <div className="absolute top-40 right-[15%] text-[#4BC957]/40 hidden md:block icon-bob" style={{ "--rot": "15deg", animationDelay: "0.8s" } as React.CSSProperties}>
    //       <FileText className="w-10 h-10" />
    //     </div>
    //     <div className="absolute bottom-32 left-[20%] text-[#4BC957]/40 hidden md:block icon-bob" style={{ "--rot": "-10deg", animationDelay: "1.4s" } as React.CSSProperties}>
    //       <FileText className="w-8 h-8" />
    //     </div>
    //     <div className="absolute bottom-20 right-[20%] text-[#4BC957]/40 hidden md:block icon-bob" style={{ "--rot": "20deg", animationDelay: "0.4s" } as React.CSSProperties}>
    //       <Briefcase className="w-10 h-10" />
    //     </div>

    //     <div className="relative max-w-4xl mx-auto px-4 z-10">
    //       {/* Hero title — fade up on mount (CSS only) */}
    //       <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight
    //         animate-[fadeInUp_0.7s_ease_forwards]">
    //         Stop searching.<br />
    //         Start <span className="text-[#4BC957] [text-shadow:0_0_32px_#4BC957]">progressing.</span>
    //       </h1>
    //       <p className="mt-6 text-lg text-on-surface-muted leading-relaxed max-w-2xl mx-auto
    //         animate-[fadeInUp_0.7s_0.2s_ease_forwards]">
    //         CareerSprint matches candidates and companies with AI precision, visa sponsorship, Emiratization and Saudization filters included. Bilingual. Mobile-first. Built for momentum.
    //       </p>
    //       <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4
    //         animate-[fadeInUp_0.7s_0.35s_ease_forwards]">
    //         <Link href="/jobs" className="w-full sm:w-auto bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-[0.98]">
    //           Find your next role
    //         </Link>
    //         <Link href="/pricing" className="w-full sm:w-auto bg-transparent border border-[#4BC957]/30 hover:border-[#4BC957]/50 text-on-surface font-bold px-8 py-3.5 rounded-xl transition-all">
    //           Find your next candidate
    //         </Link>
    //       </div>

    //       {/* Hero Stats */}
    //       <div className="mt-16 flex flex-wrap justify-center gap-12 text-center pt-10
    //         animate-[fadeInUp_0.7s_0.5s_ease_forwards]">
    //         {[["12K+", "Active roles"], ["94%", "Match accuracy"], ["3.2d", "Avg. time-to-shortlist"]].map(([val, label]) => (
    //           <div key={label}>
    //             <h3 className="text-3xl font-bold text-[#4BC957] mb-1">{val}</h3>
    //             <p className="text-sm text-on-surface-muted font-medium">{label}</p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>


    //   <section className="border-y border-surface bg-ticker py-6 overflow-hidden">
    //     <div className="flex ticker-track whitespace-nowrap opacity-50 text-[10px] sm:text-xs font-bold tracking-widest uppercase gap-16 w-max text-on-surface-muted">
    //       {["Emirates NBD", "Careem", "STC Pay", "ADNOC", "Talabat", "Mubadala",
    //         "Emirates NBD", "Careem", "STC Pay", "ADNOC", "Talabat", "Mubadala"].map((name, i) => (
    //         <span key={i}>{name}</span>
    //       ))}
    //     </div>
    //   </section>


    //   <section className="py-24 max-w-7xl mx-auto px-4 sm:px-8 w-full text-center">
    //     <Animate className="animate-on-scroll">
    //       <h2 className="text-3xl font-bold text-on-surface mb-3">Built for the way the GCC hires.</h2>
    //       <p className="text-on-surface-muted mb-12">Every feature is designed around outcomes &mdash; not vanity activity.</p>
    //     </Animate>
    //     <div className="mt-8">
    //       <Carousel opts={{ loop: true }} className="relative">
    //         <CarouselContent>
    //           {features.map((f, i) => {
    //             const Icon = f.Icon;
    //             return (
    //               <CarouselItem key={f.title} className="basis-full md:basis-1/4">
    //                 <Animate className="animate-on-scroll" delay={delays[i % 5]}>
    //                   <div className="w-64 bg-surface-card border hover:bg-[#4BC957]/10 transition-colors border-surface rounded-3xl p-6 flex flex-col items-center justify-center text-center scale-95 shrink-0">
    //                     <div className="h-10 w-10 rounded-full bg-accent-tint border border-accent flex items-center justify-center mb-4 text-[#4BC957]">
    //                       <Icon className="h-4 w-4" />
    //                     </div>
    //                     <h4 className="font-bold text-on-surface mb-2">{f.title}</h4>
    //                     <p className="text-xs text-on-surface-muted">{f.description}</p>
    //                   </div>
    //                 </Animate>
    //               </CarouselItem>
    //             );
    //           })}
    //         </CarouselContent>
    //         <CarouselPrevious className="absolute touch-manipulation rounded-full hover:text-[#4BC957] text-on-surface-muted top-1/2 -left-6 -translate-y-1/2 h-10 w-10 bg-transparent border border-surface hover:bg-surface-card transition-colors" variant="outline" size="icon-sm" />
    //         <CarouselNext className="absolute touch-manipulation rounded-full hover:text-[#4BC957] text-on-surface top-1/2 -right-6 -translate-y-1/2 h-10 w-10 bg-transparent border border-[#4BC957]/40 hover:bg-[#4BC957]/10 transition-colors" variant="outline" size="icon-sm" />
    //       </Carousel>
    //     </div>
    //   </section>


    //   <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-24 w-full">
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //       <Animate className="animate-from-left">
    //         <div className="relative bg-surface-card border border-surface rounded-3xl p-8 sm:p-10 overflow-hidden group h-full hover:border-[#4BC957]/30 transition-colors">
    //           <div className="relative z-10 h-full flex flex-col">
    //             <div className="h-12 w-12 rounded-xl bg-accent-tint flex items-center justify-center mb-6 border border-accent text-[#4BC957]">
    //               <Briefcase className="h-6 w-6" />
    //             </div>
    //             <h3 className="text-2xl font-bold text-on-surface mb-3">For Candidates</h3>
    //             <p className="text-on-surface-muted mb-8 text-sm leading-relaxed">Land roles faster with AI-tailored CVs, cover letters, and daily matches.</p>
    //             <ul className="space-y-4 mb-10 flex-1">
    //               {["AI Auto-apply", "ATS tracking", "Application tracking", "Company direct messaging", "Ai resume builder"].map(item => (
    //                 <li key={item} className="flex items-center gap-3 text-sm text-on-surface-muted font-medium">
    //                   <CheckCircle2 className="h-4 w-4 text-[#4BC957]" />{item}
    //                 </li>
    //               ))}
    //             </ul>
    //             <Link href="/candidate" className="inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl transition-all w-max">
    //               Get candidate workspace <ArrowRight className="h-4 w-4" />
    //             </Link>
    //           </div>
    //         </div>
    //       </Animate>

    //       <Animate className="animate-from-right" delay="anim-delay-200">
    //         <div className="relative bg-surface-card border border-surface rounded-3xl p-8 sm:p-10 overflow-hidden group h-full hover:border-[#4BC957]/30 transition-colors">
    //           <div className="relative z-10 h-full flex flex-col">
    //             <div className="h-12 w-12 rounded-xl bg-accent-tint flex items-center justify-center mb-6 border border-accent text-[#4BC957]">
    //               <FileText className="h-6 w-6" />
    //             </div>
    //             <h3 className="text-2xl font-bold text-on-surface mb-3">For Companies</h3>
    //             <p className="text-on-surface-muted mb-8 text-sm leading-relaxed">Instantly shortlisted candidates, ranked by fit. Hire in days, not months.</p>
    //             <ul className="space-y-4 mb-10 flex-1">
    //               {["AI candidate ranking", "Instant shortlists","3 Job posts per subscription",  "Pipeline overview", "AI Candidate Interview"].map(item => (
    //                 <li key={item} className="flex items-center gap-3 text-sm text-on-surface-muted font-medium">
    //                   <CheckCircle2 className="h-4 w-4 text-[#4BC957]" />{item}
    //                 </li>
    //               ))}
    //             </ul>
    //             <Link href="/company" className="inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl transition-all w-max">
    //               Get company workspace <ArrowRight className="h-4 w-4" />
    //             </Link>
    //           </div>
    //         </div>
    //       </Animate>
    //     </div>
    //   </section>


    //   <JobCardsCarousel />


    //   <section className="max-w-6xl mx-auto px-4 sm:px-8 py-24 w-full">
    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    //       <Animate className="animate-from-left">
    //         <h2 className="text-3xl font-bold text-on-surface mb-4">Contact us</h2>
    //         <p className="text-on-surface-muted mb-10 leading-relaxed max-w-sm">
    //           Have a question about hiring, partnerships, or your account? Our GCC team is ready to help.
    //         </p>
    //         <ul className="space-y-4 mb-10">
    //           {[
    //             [Mail, "hello@CareerSprint.com"],
    //             [Phone, "+971 4 555 0199"],
    //             [MapPin, "Business Bay, Dubai, UAE"],
    //             [Clock, "Sun-Thu, 9:00 - 18:00 GST"],
    //           ].map(([Icon, text], i) => {
    //             const I = Icon as React.ElementType;
    //             return (
    //               <li key={i} className="flex items-center gap-3 text-sm text-on-surface-muted">
    //                 <span className="h-8 w-8 rounded-lg bg-accent-tint border border-accent flex items-center justify-center text-[#4BC957]">
    //                   <I className="h-4 w-4" />
    //                 </span>
    //                 {text as string}
    //               </li>
    //             );
    //           })}
    //         </ul>
    //         <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl transition-all">
    //           Go to contact page <ArrowRight className="h-4 w-4" />
    //         </Link>
    //       </Animate>

    //       <Animate className="animate-from-right" delay="anim-delay-200">
    //         <div className="bg-surface-card border border-surface rounded-3xl p-8">
    //           <h3 className="text-lg font-bold text-on-surface mb-1">Quick message</h3>
    //           <p className="text-xs text-on-surface-subtle mb-6">We usually reply within a few hours.</p>
    //           <form className="space-y-4">
    //             <input type="email" placeholder="Your email"
    //               className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors" />
    //             <textarea placeholder="How can we help?" rows={4}
    //               className="w-full bg-surface-deep border border-surface rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-subtle focus:outline-none focus:border-[#4BC957]/50 transition-colors resize-none" />
    //             <button type="button" className="w-full bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-6 py-3 rounded-xl transition-all">
    //               Send message
    //             </button>
    //           </form>
    //         </div>
    //       </Animate>
    //     </div>
    //   </section>


    //   <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-24 w-full">
    //     <Animate className="animate-scale">
    //       <div className="bg-surface-card border border-surface rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-[#4BC957]/5">
    //         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    //           <div className="w-[300px] h-[300px] bg-[#4BC957]/10 rounded-full blur-[100px]" />
    //         </div>
    //         <h2 className="relative text-3xl sm:text-5xl font-extrabold text-on-surface mb-4">Your next move starts here.</h2>
    //         <p className="relative text-on-surface-muted mb-8 max-w-lg mx-auto">
    //           Join thousands of professionals and companies hiring smarter across the region.
    //         </p>
    //         <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
    //           <Link href="/signup" className="w-full sm:w-auto bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-8 py-3 rounded-xl transition-all">
    //             Create free account
    //           </Link>
    //           <Link href="/pricing" className="w-full sm:w-auto bg-transparent border border-surface hover:border-inner text-on-surface font-medium px-8 py-3 rounded-xl transition-all">
    //             See pricing
    //           </Link>
    //         </div>
    //       </div>
    //     </Animate>
    //   </section>
    // </div>
  );
}
