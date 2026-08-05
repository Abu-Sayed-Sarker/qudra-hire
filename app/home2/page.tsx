"use client";

import { CursorGlow } from "@/components/qh/atoms";
import { Hero } from "@/components/qh/hero";
import {
  Trusted,
  Platform,
  HowItWorks,
  Technology,
  Employers,
  Candidates,
  GCC,
  Testimonials,
  Pricing,
  FAQ,
  FinalCTA,
  Footer,
} from "@/components/qh/sections";

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
      <GCC />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
