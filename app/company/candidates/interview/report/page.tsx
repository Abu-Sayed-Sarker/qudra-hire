"use client";

import React from "react";
import { ArrowLeft, Download, MessageSquare, Sparkles, Mic, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function InterviewReportPage() {
  const questions = [
    {
      q: "Q1. Walk me through your design process for a fintech product.",
      answer: "I start with regulatory constraints, then map user JTBD across EN/AR, run 5 usability tests, and ship an MVP behind a feature flag...",
      score: 92
    },
    {
      q: "Q2. Tell me about a time you simplified a complex flow.",
      answer: "Reduced onboarding from 11 to 4 steps for a KSA wallet — drop-off fell 38% in the first month.",
      score: 88
    },
    {
      q: "Q3. How do you balance compliance with delight?",
      answer: "I treat compliance as a constraint, not a blocker — wrap mandatory disclosures into the flow's rhythm.",
      score: 86
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-full mx-auto">
      {/* Back */}
      <div>
        <Link
          href="/company/candidates/interview/sent"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Interview report</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Omar Haddad . Full-Stack Engineer</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 border border-border hover:bg-muted text-foreground font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]">
            <Download className="h-4 w-4 text-muted-foreground" />
            Export PDF
          </button>
          <Link href={'/company/inbox?user_id=2'} className="flex justify-center items-center gap-2 bg-[#4BC957] hover:bg-[#00B96E] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#4BC957]/10 active:scale-[0.98]">
            <MessageSquare className="h-4 w-4" />
            Message Candidate
          </Link>
        </div>
      </div>

      {/* AI Overall Score Card */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#4BC957] font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          AI overall score
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-7xl font-extrabold text-foreground tracking-tight">87</span>
          <span className="text-2xl text-muted-foreground font-semibold">/ 100</span>
        </div>

        <p className="text-sm text-muted-foreground font-medium">
          Strong hire signal. Top 8% of candidates interviewed for this role.
        </p>

        <div>
          <span className="inline-flex items-center gap-1.5 border border-[#4BC957]/30 text-[#4BC957] text-sm font-bold px-3 py-1.5 rounded-full bg-[#4BC957]/10">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Recommended: Move to onsite
          </span>
        </div>
      </div>

      {/* Transcript & Per-question Scoring */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
          <Mic className="h-4 w-4 text-muted-foreground shrink-0" />
          Transcript &amp; per-question scoring
        </div>

        <div className="space-y-3">
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="bg-background border border-border rounded-xl p-5 space-y-2 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-bold text-foreground leading-snug">{item.q}</p>
                <span className="text-sm font-bold text-[#4BC957] bg-[#4BC957]/10 border border-[#4BC957]/20 px-2.5 py-1 rounded-lg flex-shrink-0">
                  {item.score}/100
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Mic className="h-3.5 w-3.5 text-[#4BC957] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#4BC957] font-medium leading-relaxed">{item.answer}</p>
              </div>

              {/* Per-question progress bar */}
              <div className="w-full bg-muted h-1 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-[#4BC957] h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
