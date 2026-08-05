"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, Star } from "lucide-react";
import { Animate } from "@/components/ui/animate";

const candidatePlans = [
  {
    id: "candidate-starter",
    tier: "STARTER",
    name: "Free",
    tagline: "Everything you need to start your search.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: "forever",
    cta: "Get started free",
    popular: false,
    ctaHref: "/register",
    features: [
      "Browse limited jobs",
      "Basic AI job matching",
      "Resume upload & profile",
    ],
  },
  {
    id: "candidate-premium",
    tier: "RECOMMENDED",
    name: "Premium",
    tagline: "Your always-on AI Recruiter.",
    monthlyPrice: 79,
    yearlyPrice: 66,
    priceLabel: "/ month",
    cta: "Upgrade to Premium",
    popular: true,
    ctaHref: "/register?plan=premium",
    features: [
      "Everything in Free",
      "Auto Apply AI submits tailored applications daily",
      "AI Resume Tailoring per job",
      "AI Resume Improvement & ATS score",
      "Priority AI matching & shortlisting",
      "AI interview prep & practice",
      "Direct messaging inbox",
      "Priority support",
    ],
  },
];

const companyPlans = [
  {
    id: "company-starter",
    tier: "STARTER",
    name: "Free",
    tagline: "Post and discover talent at no cost.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: "forever",
    cta: "Get started free",
    popular: false,
    ctaHref: "/register?type=company",
    features: [
      "Post up to 2 jobs",
      "Basic candidate search",
      "Company profile listing",
    ],
  },
  {
    id: "company-growth",
    tier: "RECOMMENDED",
    name: "Growth",
    tagline: "Hire smarter with AI-powered matching.",
    monthlyPrice: 199,
    yearlyPrice: 167,
    priceLabel: "/ month",
    cta: "Upgrade to Growth",
    popular: true,
    ctaHref: "/register?type=company&plan=growth",
    features: [
      "Everything in Free",
      "Unlimited job postings",
      "AI candidate shortlisting",
      "Smart applicant ranking",
      "Priority listing in search",
      "Direct messaging candidates",
      "Analytics & insights dashboard",
      "Dedicated account support",
    ],
  },
];

type Plan = (typeof candidatePlans)[number];

function PricingCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price =
    plan.monthlyPrice === 0
      ? null
      : yearly
        ? plan.yearlyPrice
        : plan.monthlyPrice;

  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl transition-all duration-300 ${plan.popular
          ? "bg-green-50 dark:bg-[#0D1117] border-2 border-[#4BC957]/60 shadow-2xl shadow-[#4BC957]/10"
          : "bg-white dark:bg-[#0F172A]/60 border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/14 shadow-sm"
        }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-[#4BC957] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Tier label */}
        <div className="flex items-center gap-2 mb-3">
          {plan.popular ? (
            <Star className="w-4 h-4 text-[#4BC957]" />
          ) : (
            <Zap className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          )}
          <span
            className={`text-xs font-bold tracking-widest uppercase ${plan.popular ? "text-[#4BC957]" : "text-slate-400 dark:text-slate-500"
              }`}
          >
            {plan.tier}
          </span>
        </div>

        {/* Plan name */}
        <h3 className="text-4xl font-extrabold mb-1 tracking-tight text-slate-900 dark:text-white">
          {plan.name}
        </h3>
        <p className={`text-sm mb-5 leading-snug ${plan.popular ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-400"
          }`}>
          {plan.tagline}
        </p>

        {/* Price */}
        <div className="mb-6">
          {price === null ? (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">AED 0</span>
              <span className={`text-sm ${plan.popular ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>forever</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">AED {price}</span>
              <span className={`text-sm ${plan.popular ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>{plan.priceLabel}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={plan.ctaHref}
          id={plan.id}
          className={`w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center mb-6 ${plan.popular
              ? "bg-[#4BC957] hover:bg-[#3DAF49] text-white shadow-lg shadow-[#4BC957]/25"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-white/8 dark:hover:bg-white/12 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10"
            }`}
        >
          {plan.cta}
        </Link>

        {/* Divider */}
        <div className={`border-t mb-5 ${plan.popular ? "border-green-200 dark:border-white/6" : "border-slate-200 dark:border-white/6"}`} />

        {/* Features */}
        <ul className="space-y-3 flex-1">
          {plan.features.map((f) => (
            <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.popular ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
              <span className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full flex items-center justify-center ${plan.popular ? "bg-[#4BC957]/20 text-[#4BC957]" : "bg-slate-100 dark:bg-slate-700/60 text-slate-400"}`}>
                <Check className="h-2.5 w-2.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [tab, setTab] = useState<"candidates" | "companies">("candidates");
  const [yearly, setYearly] = useState(false);
  const plans = tab === "candidates" ? candidatePlans : companyPlans;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-white">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 text-center overflow-hidden">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
        >
          <div className="w-[700px] h-[320px] bg-[#4BC957]/5 dark:bg-[#4BC957]/6 rounded-full blur-[140px] mt-8" />
        </div>
        {/* Grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4">
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight
            animate-[fadeInUp_0.7s_ease_forwards]"
          >
            Simple plans.{" "}
            <span className="text-[#4BC957]">Serious hiring outcomes.</span>
          </h1>
          <p
            className="mt-5 text-[16px] sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto
            animate-[fadeInUp_0.7s_0.2s_ease_forwards] opacity-0"
          >
            Start free. Upgrade to Premium when you want Career-Sprint&apos;s AI to apply, tailor and
            optimize for you.
          </p>

          {/* Billing toggle */}
          <div
            className="mt-10 inline-flex items-center bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/8 rounded-xl p-1 gap-1
            animate-[fadeInUp_0.7s_0.35s_ease_forwards] opacity-0"
          >
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${!yearly
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${yearly
                  ? "bg-[#4BC957] text-white shadow-md shadow-[#4BC957]/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Yearly.
            </button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-28 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <Animate
              key={plan.id}
              className="animate-on-scroll"
              delay={i === 0 ? "anim-delay-100" : "anim-delay-200"}
            >
              <PricingCard plan={plan} yearly={yearly} />
            </Animate>
          ))}
        </div>

        <Animate className="animate-on-scroll" delay="anim-delay-300">
          <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-10">
            All prices in AED (United Arab Emirates Dirham).{" "}
            <Link
              href="/contact"
              className="text-[#4BC957] hover:text-[#3DAF49] transition-colors underline underline-offset-2"
            >
              Contact us
            </Link>{" "}
            for enterprise or volume pricing.
          </p>
        </Animate>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A0F1D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            {
              q: "Can I switch plans?",
              a: "Yes. You can upgrade or downgrade your plan at any time from your account settings.",
            },
            {
              q: "Is there a free trial?",
              a: "The Free plan is yours forever. Upgrade to Premium whenever you're ready — no credit card required to start.",
            },
            {
              q: "What currency?",
              a: "All prices are in AED (UAE Dirham). Payments processed securely.",
            },
          ].map(({ q, a }, i) => (
            <Animate
              key={q}
              className="animate-on-scroll"
              delay={["", "anim-delay-100", "anim-delay-200"][i]}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{q}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">{a}</p>
              </div>
            </Animate>
          ))}
        </div>
      </section>
    </div>
  );
}
