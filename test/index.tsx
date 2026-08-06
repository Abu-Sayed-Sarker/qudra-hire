import { createFileRoute } from "@tanstack/react-router";
import { CursorGlow } from "./atoms";
import { Hero } from "./hero";
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
} from "./sections";

const title = "Career-Sprint — AI Recruitment Ecosystem for the GCC";
const description =
  "Career-Sprint is the AI recruitment platform for intelligent hiring: predictive candidate matching, resume intelligence, ATS optimization and GCC compliance.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
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
